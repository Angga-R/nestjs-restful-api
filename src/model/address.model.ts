interface AddressResponse {
  id: number;
  street?: string | null;
  city?: string | null;
  province?: string | null;
  country: string;
  postal_code: string;
}

interface CreateAddressRequest {
  street?: string;
  city?: string;
  province?: string;
  country: string;
  postal_code: string;
}

interface UpdateAddressRequest {
  street?: string;
  city?: string;
  province?: string;
  country?: string;
  postal_code?: string;
}

export { AddressResponse, CreateAddressRequest, UpdateAddressRequest };
