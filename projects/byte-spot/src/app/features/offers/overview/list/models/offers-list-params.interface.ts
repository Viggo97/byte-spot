import { FilterParams } from '@app/features/offers/overview/filters/models/filter-params.interface';

export interface OffersListParams extends FilterParams {
    pageSize: number;
    pageNumber: number;
    sortBy?: string;
    searchPhrase?: string;
}
