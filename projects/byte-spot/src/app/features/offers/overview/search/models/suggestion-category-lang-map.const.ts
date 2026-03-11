import { SuggestionCategory } from './suggestion-category.enum';

export const suggestionCategoryLangMap = new Map([
    [SuggestionCategory.Location, 'offer.locations'],
    [SuggestionCategory.Technology, 'offer.technologies'],
    [SuggestionCategory.Company, 'offer.companies'],
    [SuggestionCategory.Title, 'offer.position_name'],
]);
