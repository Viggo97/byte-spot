import { SuggestionCategories } from '@app/features/offers-overview/model/suggestion-categories.enum';

export interface SuggestionsGroup {
    category: SuggestionCategories,
    suggestions: string[]
}
