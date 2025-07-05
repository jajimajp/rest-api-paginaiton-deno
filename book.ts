export type Book = { id: string }
export type BookRepository = {
  listBooks: () => Book[]
}