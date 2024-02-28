export interface Offer {
    id: string;
    title: string;
    companyId: string;
    companyName: string;
    location: string;
    minSalary: number;
    maxSalary: number;
    technologyLabels: string[];
}
