export type Book = { id: string; title: string }
export type BookRepository = {
  listBooks: () => Book[]
  showBook: (id: string) => Book | undefined
  createBook: (title: string) => Book
  deleteBook: (id: string) => boolean
}