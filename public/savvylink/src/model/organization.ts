import { UserExtra, ContributorExtra } from './extras';
export interface Organization {
    _id: number;
    user: UserExtra;
    contributors: ContributorExtra[];
    name: string;
    type: string;
    address_1: string;
    address_2: string;
    city: string;
    province: string;
    country: string;
    user_id: number;
}

export interface OrganizationListResponse {
    success: string;
    result: {
        count: number;
        filtered: number;
        data: Organization[];
    };
}

export interface OrganizationResponse {
    success: string;
    result: Organization[];
}
