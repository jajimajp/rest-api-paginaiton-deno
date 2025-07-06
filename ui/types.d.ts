export type Book = { id: string; title: string };

export type PaginatedBooksResponse = {
  books: Book[];
  next_page_token?: string;
  has_more: boolean;
  total_count: number;
  page_size: number;
};
