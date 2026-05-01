import { randomUUID } from "node:crypto";
import { mockBooks, mockHighlights } from "@/lib/mock/data";
import { extractTextWithOcr } from "@/lib/ocr/client";
import { hasSupabaseConfig } from "@/lib/server/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type {
  BookRecord,
  BookWithHighlights,
  CreateBookInput,
  CreateHighlightInput,
  HighlightRecord,
  SearchParams,
  UpdateHighlightInput,
} from "@/lib/types";
import { createBookSchema, updateHighlightSchema } from "@/lib/validations";
import { fileToDataUrl, slugify } from "@/lib/utils";

const highlightMemoryStore = [...mockHighlights];
const bookMemoryStore = [...mockBooks];

export async function listBooks(userId: string): Promise<BookRecord[]> {
  if (!hasSupabaseConfig) {
    return bookMemoryStore
      .filter((book) => book.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase!
    .from("books")
    .select("id,user_id,title,author,publisher,isbn,cover_url,total_pages,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const counts = await getHighlightCounts(userId);

  return data.map((book) => ({
    id: book.id,
    userId: book.user_id,
    title: book.title,
    author: book.author ?? "",
    publisher: book.publisher ?? "",
    isbn: book.isbn ?? "",
    coverUrl: book.cover_url,
    totalPages: book.total_pages,
    createdAt: book.created_at,
    highlightCount: counts[book.id] ?? 0,
  }));
}

export async function createBook(
  userId: string,
  input: CreateBookInput,
): Promise<BookRecord> {
  const payload = createBookSchema.parse(input);

  if (!hasSupabaseConfig) {
    const book: BookRecord = {
      id: `book-${slugify(payload.title)}-${randomUUID().slice(0, 8)}`,
      userId,
      title: payload.title,
      author: payload.author ?? "",
      publisher: payload.publisher ?? "",
      isbn: payload.isbn ?? "",
      coverUrl: null,
      totalPages: payload.totalPages ?? null,
      createdAt: new Date().toISOString(),
      highlightCount: 0,
    };

    bookMemoryStore.unshift(book);
    return book;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase!
    .from("books")
    .insert({
      user_id: userId,
      title: payload.title,
      author: payload.author,
      publisher: payload.publisher,
      isbn: payload.isbn,
      total_pages: payload.totalPages ?? null,
    })
    .select("id,user_id,title,author,publisher,isbn,cover_url,total_pages,created_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    author: data.author ?? "",
    publisher: data.publisher ?? "",
    isbn: data.isbn ?? "",
    coverUrl: data.cover_url,
    totalPages: data.total_pages,
    createdAt: data.created_at,
    highlightCount: 0,
  };
}

export async function getBookById(
  userId: string,
  bookId: string,
): Promise<BookWithHighlights | null> {
  const books = await listBooks(userId);
  const book = books.find((item) => item.id === bookId);

  if (!book) {
    return null;
  }

  const highlights = (await listHighlights(userId)).filter(
    (item) => item.bookId === bookId,
  );

  return {
    ...book,
    highlights,
  };
}

export async function listHighlights(userId: string): Promise<HighlightRecord[]> {
  if (!hasSupabaseConfig) {
    return highlightMemoryStore
      .filter((highlight) => highlight.userId === userId)
      .sort((a, b) => b.capturedAt.localeCompare(a.capturedAt));
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase!
    .from("book_highlights")
    .select(
      "id,user_id,book_id,page_number,raw_ocr_text,edited_text,user_note,image_path,ocr_status,ocr_language,ocr_blocks,captured_at,created_at,books!inner(title)",
    )
    .eq("user_id", userId)
    .order("captured_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return Promise.all(
    data.map(async (highlight) => {
      const bookRelation = highlight.books as { title?: string } | { title?: string }[];
      const bookTitle = Array.isArray(bookRelation)
        ? (bookRelation[0]?.title ?? "")
        : (bookRelation?.title ?? "");

      return {
        id: highlight.id,
        userId: highlight.user_id,
        bookId: highlight.book_id,
        bookTitle,
        pageNumber: highlight.page_number,
        rawOcrText: highlight.raw_ocr_text ?? "",
        editedText: highlight.edited_text ?? "",
        userNote: highlight.user_note ?? "",
        imagePath: highlight.image_path,
        imageUrl: await getSignedImageUrl(highlight.image_path),
        ocrStatus: highlight.ocr_status,
        ocrLanguage: highlight.ocr_language ?? "pt,en",
        ocrBlocks: Array.isArray(highlight.ocr_blocks) ? highlight.ocr_blocks : [],
        capturedAt: highlight.captured_at,
        createdAt: highlight.created_at,
      };
    }),
  );
}

export async function listRecentHighlights(userId: string) {
  return (await listHighlights(userId)).slice(0, 6);
}

export async function getHighlightById(userId: string, id: string) {
  return (await listHighlights(userId)).find((item) => item.id === id) ?? null;
}

export async function createHighlight(
  userId: string,
  input: CreateHighlightInput,
): Promise<HighlightRecord> {
  const book = await getBookById(userId, input.bookId);

  if (!book) {
    throw new Error("Livro nao encontrado para esta captura.");
  }

  if (input.pageNumber <= 0) {
    throw new Error("Informe uma pagina valida.");
  }

  if (input.image.size > 10 * 1024 * 1024) {
    throw new Error("A imagem excede o limite de 10 MB.");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(input.image.type)) {
    throw new Error("Formato de imagem nao suportado.");
  }

  const id = randomUUID();

  if (!hasSupabaseConfig) {
    const imageUrl = await fileToDataUrl(input.image);
    const ocr = await extractTextWithOcr(input.image, input.ocrLanguage);
    const highlight: HighlightRecord = {
      id,
      userId,
      bookId: input.bookId,
      bookTitle: book.title,
      pageNumber: input.pageNumber,
      rawOcrText: ocr.text,
      editedText: ocr.text,
      userNote: input.userNote ?? "",
      imageUrl,
      imagePath: null,
      ocrStatus: "ready",
      ocrLanguage: ocr.language,
      ocrBlocks: ocr.blocks,
      capturedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    highlightMemoryStore.unshift(highlight);

    const bookIndex = bookMemoryStore.findIndex((item) => item.id === book.id);
    if (bookIndex >= 0) {
      bookMemoryStore[bookIndex] = {
        ...bookMemoryStore[bookIndex],
        highlightCount: bookMemoryStore[bookIndex].highlightCount + 1,
      };
    }

    return highlight;
  }

  const supabase = createSupabaseAdminClient();
  const imagePath = await uploadHighlightImage(supabase!, userId, id, input.image);

  const { error: createError } = await supabase!
    .from("book_highlights")
    .insert({
      id,
      user_id: userId,
      book_id: input.bookId,
      page_number: input.pageNumber,
      raw_ocr_text: "",
      edited_text: "",
      user_note: input.userNote ?? "",
      image_path: imagePath,
      ocr_status: "processing",
      ocr_language: input.ocrLanguage,
      captured_at: new Date().toISOString(),
    });

  if (createError) {
    throw new Error(createError.message);
  }

  try {
    const ocr = await extractTextWithOcr(input.image, input.ocrLanguage);
    const { error: updateError } = await supabase!
      .from("book_highlights")
      .update({
        raw_ocr_text: ocr.text,
        edited_text: ocr.text,
        ocr_status: "ready",
        ocr_blocks: ocr.blocks,
      })
      .eq("id", id)
      .eq("user_id", userId);

    if (updateError) {
      throw new Error(updateError.message);
    }
  } catch {
    await supabase!
      .from("book_highlights")
      .update({ ocr_status: "failed" })
      .eq("id", id)
      .eq("user_id", userId);
  }

  const highlight = await getHighlightById(userId, id);

  if (!highlight) {
    throw new Error("Destaque criado, mas nao foi possivel carrega-lo.");
  }

  return highlight;
}

export async function updateHighlight(
  userId: string,
  id: string,
  input: UpdateHighlightInput,
) {
  const payload = updateHighlightSchema.parse(input);

  if (!hasSupabaseConfig) {
    const index = highlightMemoryStore.findIndex(
      (highlight) => highlight.id === id && highlight.userId === userId,
    );

    if (index < 0) {
      throw new Error("Destaque nao encontrado.");
    }

    highlightMemoryStore[index] = {
      ...highlightMemoryStore[index],
      editedText: payload.editedText,
      userNote: payload.userNote ?? "",
      pageNumber: payload.pageNumber,
    };

    return highlightMemoryStore[index];
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase!
    .from("book_highlights")
    .update({
      edited_text: payload.editedText,
      user_note: payload.userNote ?? "",
      page_number: payload.pageNumber,
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  const updated = await getHighlightById(userId, id);

  if (!updated) {
    throw new Error("Destaque nao encontrado apos atualizacao.");
  }

  return updated;
}

export async function searchHighlights(userId: string, params: SearchParams) {
  const highlights = await listHighlights(userId);
  const query = params.query?.trim().toLowerCase();

  return highlights.filter((highlight) => {
    const matchesBook = params.bookId ? highlight.bookId === params.bookId : true;
    const matchesQuery = query
      ? `${highlight.editedText} ${highlight.rawOcrText} ${highlight.userNote}`
          .toLowerCase()
          .includes(query)
      : true;

    return matchesBook && matchesQuery;
  });
}

async function getHighlightCounts(userId: string) {
  if (!hasSupabaseConfig) {
    return Object.fromEntries(
      bookMemoryStore
        .filter((book) => book.userId === userId)
        .map((book) => [
          book.id,
          highlightMemoryStore.filter((highlight) => highlight.bookId === book.id).length,
        ]),
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase!
    .from("book_highlights")
    .select("book_id")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return data.reduce<Record<string, number>>((accumulator, item) => {
    accumulator[item.book_id] = (accumulator[item.book_id] ?? 0) + 1;
    return accumulator;
  }, {});
}

async function uploadHighlightImage(
  supabase: NonNullable<ReturnType<typeof createSupabaseAdminClient>>,
  userId: string,
  highlightId: string,
  image: File,
) {
  const path = `${userId}/highlights/${highlightId}-${slugify(image.name || "page")}`;
  const { error } = await supabase.storage
    .from("highlight-images")
    .upload(path, image, {
      cacheControl: "3600",
      contentType: image.type,
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return path;
}

async function getSignedImageUrl(path: string | null) {
  if (!path || !hasSupabaseConfig) {
    return null;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase!.storage
    .from("highlight-images")
    .createSignedUrl(path, 60 * 60);

  if (error) {
    return null;
  }

  return data.signedUrl;
}
