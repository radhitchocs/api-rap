export interface CustomerInterface {
  name: string;
  email: string;
  phone: string;
  address: string;
  loyalty_points?: number;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
