export interface PagedResults<T> {
    items: T[],
    pageNumber: number,
    pageSize: number,
    totalCount: number
}
