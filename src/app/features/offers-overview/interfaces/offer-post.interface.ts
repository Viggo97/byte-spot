export interface OfferPost {
    title: string;
    salary?: {
        min: number;
        max: number;
        currency: string;
    }
    location: string;
    company: string;
    workMode: string;
    employmentType: string;
    seniority: string;
    technologies: string[];
}
