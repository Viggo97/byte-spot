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

const data: OfferPost[] = [
    {
        title: '',
        salary: {
            min: 0,
            max: 0,
            currency: 'PLN',
        },
        location: '',
        company: '',
        workMode: '',
        employmentType: '',
        seniority: '',
        technologies: [],
    },
];

interface City {
    en: string;
    pl: string;
}

const cities: City[] = [
    {
        en: 'Warsaw',
        pl: 'Warszawa',
    },
    {
        en: 'Cracow',
        pl: 'Kraków',
    },
    {
        en: 'Gdansk',
        pl: 'Gdańsk',
    },
    {
        en: 'Wroclaw',
        pl: 'Wrocław',
    },
    {
        en: 'Poznan',
        pl: 'Poznań',
    },
    {
        en: 'Lodz',
        pl: 'Łódź',
    },
    {
        en: 'Rzeszow',
        pl: 'Rzeszów',
    },
    {
        en: 'Lublin',
        pl: 'Lublin',
    },
    {
        en: 'Kielce',
        pl: 'Kielce',
    },
    {
        en: 'Katowice',
        pl: 'Katowice',
    },
    {
        en: 'Bydgoszcz',
        pl: 'Bydgoszcz',
    },
    {
        en: 'Bialystok',
        pl: 'Białystok',
    },
    {
        en: 'Gdynia',
        pl: 'Gdynia',
    },
    {
        en: 'Sopot',
        pl: 'Sopot',
    },
    {
        en: 'Szczecin',
        pl: 'Szczecin',
    },
    {
        en: 'Opole',
        pl: 'Opole',
    },
];
