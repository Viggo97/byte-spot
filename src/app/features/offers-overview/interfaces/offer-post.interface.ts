export interface OfferPost {
    title: string;
    salary?: {
        min: number;
        max: number;
        currency: string;
    }
    locations: string[];
    company: string;
    technologies: string[];
    newOffer: boolean;
}
