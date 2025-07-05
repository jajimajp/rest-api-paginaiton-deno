export type Book = { id: string }
export type BookRepository = {
  listBooks: () => Book[]
  showBook: (id: string) => Book | undefined
}