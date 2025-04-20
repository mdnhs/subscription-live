export interface User {
  id: number;
  fullName: string;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  birthDate?: string;
  phoneNumber?: string;
  gender?: "male" | "female" | "other";
  religion?: "islam" | "hinduism" | "christianity" | "buddhism" | "other";
  isAdmin?: boolean;
  via:string
}


export type FieldConfig<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder: string;
  type?: string;
  options?: { value: string; label: string }[];
  colSpan?: number;
};

export type FieldConfig<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder: string;
  type?: string;
  options?: { value: string; label: string }[];
  colSpan?: number;
};
