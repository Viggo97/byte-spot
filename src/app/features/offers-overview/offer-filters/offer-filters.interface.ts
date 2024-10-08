export interface OfferFilters {
    salary: {
        min: number;
        max: number;
    }
    technologies: string[];
    workMode: string[];
    employmentType: string[];
    locations: string[];
    seniority: string[];
}
