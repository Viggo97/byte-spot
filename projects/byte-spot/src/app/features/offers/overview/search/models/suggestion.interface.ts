import { SuggestionCategory } from './suggestion-category.enum';

export interface Suggestion {
    id: string;
    value: string;
    category: SuggestionCategory;
}
