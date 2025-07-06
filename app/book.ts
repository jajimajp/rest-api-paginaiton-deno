export type Book = { id: string; title: string };

export type PaginationParams = {
  limit?: number;
  pageToken?: string;
};

export type PaginatedBooksResponse = {
  books: Book[];
  nextPageToken?: string;
  hasMore: boolean;
  totalCount: number;
  pageSize: number;
};

export type BookRepository = {
  listBooks: (params?: PaginationParams) => PaginatedBooksResponse;
  showBook: (id: string) => Book | undefined;
  createBook: (title: string) => Book;
  updateBook: (id: string, title: string) => Book | undefined;
  deleteBook: (id: string) => boolean;
};
