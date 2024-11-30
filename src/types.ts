export interface UserInterface {
    id: number;
    [key: string]: string | number;
}

export interface Userschema {
    name: string;
    display_name: string;
    type: string;
    required: boolean;
}