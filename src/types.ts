export interface UserInterface {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
}

export interface Userschema {
  field_name: keyof UserInterface;
  display_name: string;
  type: string;
  required: boolean;
}
