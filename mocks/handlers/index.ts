import { reservationHandlers } from "./reservationHandlers";
import { parkingSpotHandlers } from "./parkingSpotHandlers";
import { userHandlers } from "./userHandlers";

export const handlers = [
  ...parkingSpotHandlers,
  ...reservationHandlers,
  ...userHandlers,
];
