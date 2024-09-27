import { OfferSearchSuggestionCategory } from '../enums/offer-search-suggestion-category.enum';

export interface OfferSearchSuggestion {
    type: OfferSearchSuggestionCategory;
    value: string;
}
