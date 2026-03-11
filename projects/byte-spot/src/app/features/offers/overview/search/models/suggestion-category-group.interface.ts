import { Suggestion } from './suggestion.interface';
import { SuggestionCategory } from './suggestion-category.enum';

export interface SuggestionCategoryGroup {
    category: SuggestionCategory;
    options: Suggestion[];
}
