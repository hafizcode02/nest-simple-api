export class AddressRequest {
  street: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  detail?: string;
}

export class AddressResponse {
  id: number;
  street: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  detail: string;
}

export class AddressUpdateRequest {
  street?: string;
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
  detail?: string;
}
