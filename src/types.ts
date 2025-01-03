export interface UserInterface {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
}

export type Userschema<T> = {
  field_name: keyof T | "actions"; 
  display_name: string;
  type: string;
  required: boolean;
  buttonAction?: (
    data: T,
    handleEdit: (data: T) => void,
    handleDelete: (id: number) => void
  ) => React.ReactNode;
};

export interface ListComponentProps<T extends { id: number }> {
  data: T[];
  fields: Array<{
    field_name: keyof T | "actions";
    display_name: string;
    type: string;
    required: boolean;
    buttonAction?: (
      data: T,
      handleEdit: (data: T) => void,
      handleDelete: (id: number) => void
    ) => React.ReactNode;
  }>;
  handleSort: (column: keyof T) => void;
  sortColumn: keyof T;
  sortOrder: "asc" | "desc";
  handleEdit: (data: T) => void;
  handleDelete: (id: number) => void;
}
