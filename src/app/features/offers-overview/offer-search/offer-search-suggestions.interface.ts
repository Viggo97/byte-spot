import { OfferSearchSuggestionCategory } from './offer-search-suggestion-category.enum';

export interface OfferSearchSuggestions {
    category: OfferSearchSuggestionCategory;
    results: string[];
}
