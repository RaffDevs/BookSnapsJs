export type HighlightOcrStatus = "processing" | "ready" | "failed";

export type OcrBlock = {
  text: string;
  confidence: number;
  box: number[][];
};

export type BookRecord = {
  id: string;
  userId: string;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  coverUrl: string | null;
  totalPages: number | null;
  createdAt: string;
  highlightCount: number;
};

export type HighlightRecord = {
  id: string;
  userId: string;
  bookId: string;
  bookTitle: string;
  pageNumber: number;
  rawOcrText: string;
  editedText: string;
  userNote: string;
  imageUrl: string | null;
  imagePath: string | null;
  ocrStatus: HighlightOcrStatus;
  ocrLanguage: string;
  ocrBlocks: OcrBlock[];
  capturedAt: string;
  createdAt: string;
};

export type BookWithHighlights = BookRecord & {
  highlights: HighlightRecord[];
};

export type SearchParams = {
  query?: string;
  bookId?: string;
};

export type CreateBookInput = {
  title: string;
  author?: string;
  publisher?: string;
  isbn?: string;
  totalPages?: number;
};

export type CreateHighlightInput = {
  bookId: string;
  pageNumber: number;
  userNote?: string;
  image: File;
  ocrLanguage: string;
};

export type UpdateHighlightInput = {
  editedText: string;
  userNote?: string;
  pageNumber: number;
};

export type OcrResult = {
  text: string;
  blocks: OcrBlock[];
  language: string;
};
