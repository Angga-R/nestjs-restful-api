export interface ContactResponse {
  id: number;
  first_name: string;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface CreateContactRequest {
  first_name: string;
  last_name?: string;
  email?: string;
  phone?: string;
}
