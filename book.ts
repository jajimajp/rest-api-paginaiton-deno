export type Book = { id: string; title: string }
export type BookRepository = {
  listBooks: () => Book[]
  showBook: (id: string) => Book | undefined
}