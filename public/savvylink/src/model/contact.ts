import { UserExtra, OrganizationExtra } from './extras';
export interface Contact {
    _id: number;
    user: UserExtra;
    organization: OrganizationExtra;
    name: string;
    org_id: number;
    user_id: number;
    position: string;
}

export interface ContactListResponse {
    success: string;
    result: {
        count: number;
        filtered: number;
        data: Contact[];
    };
}
