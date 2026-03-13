export interface Offer {
    id: string;
    title: string;
    company: string;
    salaryMin?: number;
    salaryMax?: number;
    salaryFixed?: number;
    locations: string[];
    technologies: string[];
}
