import { Reservation } from "./Reservation";

export interface ParkingSpot {
  id: string;
  reservations: Reservation[]
}