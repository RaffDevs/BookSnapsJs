import type { BookRecord, HighlightRecord } from "@/lib/types";

export const DEMO_USER_ID = "demo-user";

export const mockBooks: BookRecord[] = [
  {
    id: "book-atomic-habits",
    userId: DEMO_USER_ID,
    title: "Habitos Atomicos",
    author: "James Clear",
    publisher: "Alta Life",
    isbn: "9788550807560",
    coverUrl: null,
    totalPages: 320,
    createdAt: new Date("2026-04-10T10:00:00.000Z").toISOString(),
    highlightCount: 2,
  },
  {
    id: "book-medo-liberdade",
    userId: DEMO_USER_ID,
    title: "O Medo a Liberdade",
    author: "Erich Fromm",
    publisher: "Zahar",
    isbn: "",
    coverUrl: null,
    totalPages: 296,
    createdAt: new Date("2026-04-11T12:00:00.000Z").toISOString(),
    highlightCount: 1,
  },
];

export const mockHighlights: HighlightRecord[] = [
  {
    id: "highlight-1",
    userId: DEMO_USER_ID,
    bookId: "book-atomic-habits",
    bookTitle: "Habitos Atomicos",
    pageNumber: 42,
    rawOcrText:
      "Voce nao sobe ao nivel de suas metas. Voce cai ao nivel de seus sistemas.",
    editedText:
      "Voce nao sobe ao nivel de suas metas. Voce cai ao nivel de seus sistemas.",
    userNote:
      "Quero lembrar disso quando estiver tentando resolver disciplina so na forca de vontade.",
    imageUrl:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
    imagePath: null,
    ocrStatus: "ready",
    ocrLanguage: "pt,en",
    ocrBlocks: [],
    capturedAt: new Date("2026-04-18T19:30:00.000Z").toISOString(),
    createdAt: new Date("2026-04-18T19:30:00.000Z").toISOString(),
  },
  {
    id: "highlight-2",
    userId: DEMO_USER_ID,
    bookId: "book-atomic-habits",
    bookTitle: "Habitos Atomicos",
    pageNumber: 88,
    rawOcrText:
      "Todo habito e um voto na pessoa que voce quer se tornar.",
    editedText:
      "Todo habito e um voto na pessoa que voce quer se tornar.",
    userNote: "",
    imageUrl:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
    imagePath: null,
    ocrStatus: "ready",
    ocrLanguage: "pt,en",
    ocrBlocks: [],
    capturedAt: new Date("2026-04-21T18:10:00.000Z").toISOString(),
    createdAt: new Date("2026-04-21T18:10:00.000Z").toISOString(),
  },
  {
    id: "highlight-3",
    userId: DEMO_USER_ID,
    bookId: "book-medo-liberdade",
    bookTitle: "O Medo a Liberdade",
    pageNumber: 115,
    rawOcrText:
      "A liberdade positiva consiste na atividade espontanea da personalidade integrada.",
    editedText:
      "A liberdade positiva consiste na atividade espontanea da personalidade integrada.",
    userNote: "Ligar esta ideia a tensao entre autonomia e pertencimento.",
    imageUrl:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80",
    imagePath: null,
    ocrStatus: "ready",
    ocrLanguage: "pt,en",
    ocrBlocks: [],
    capturedAt: new Date("2026-04-24T16:45:00.000Z").toISOString(),
    createdAt: new Date("2026-04-24T16:45:00.000Z").toISOString(),
  },
];
