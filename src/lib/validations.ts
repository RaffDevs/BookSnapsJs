import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().trim().min(2, "Informe o titulo do livro."),
  author: z.string().trim().optional().default(""),
  publisher: z.string().trim().optional().default(""),
  isbn: z.string().trim().optional().default(""),
  totalPages: z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return undefined;
      }

      if (typeof value === "number" && Number.isNaN(value)) {
        return undefined;
      }

      return value;
    },
    z
      .number({ message: "Informe um numero valido de paginas." })
      .int()
      .positive()
      .optional(),
  ),
});

export const updateHighlightSchema = z.object({
  editedText: z.string().trim().min(1, "O texto do destaque nao pode ficar vazio."),
  userNote: z.string().trim().optional().default(""),
  pageNumber: z.number().int().positive("Informe um numero de pagina valido."),
});
