export interface OfferPost {
    title: string;
    salary: {
        min: number;
        max: number;
    }
    locations: string[];
    company: string;
    technologies: string[];
}
