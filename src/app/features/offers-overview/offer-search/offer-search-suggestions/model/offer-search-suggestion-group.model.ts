import { OfferSearchSuggestionCategory } from './offer-search-suggestion-category.enum';

export interface OfferSearchSuggestionsGroup {
    category: OfferSearchSuggestionCategory,
    suggestions: string[]
}
