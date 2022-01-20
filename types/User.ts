import { Reservation } from "./Reservation";

export interface UserDB {
  id: string;
  type: string;
  token: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  reservations: Reservation[];
}

export interface UserFormFields {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  type?: 'ADMIN' | 'USER'
}