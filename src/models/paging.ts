export default interface Page<T> {
  media: T[]
  pageInfo: {
    total: number
    currentPage: number
    lastPage: number
    hasNextPage: boolean
    perPage: number
  }
}
