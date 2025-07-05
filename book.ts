export type Book = { id: string; title: string }
export type BookRepository = {
  listBooks: () => Book[]
  showBook: (id: string) => Book | undefined
  createBook: (title: string) => Book
  updateBook: (id: string, title: string) => Book | undefined
  deleteBook: (id: string) => boolean
}