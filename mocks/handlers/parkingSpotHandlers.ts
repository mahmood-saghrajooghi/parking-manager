import { rest } from "msw";
import { Reservation } from "../../types/Reservation";

import { db, persist } from "../models/db";
import { getUser } from "./userHandlers";

export const parkingSpotHandlers = [
  rest.get("/parking-spots", async (req, res, ctx) => {
    const parkingSpots = await db.parkingSpot.getAll();
    return res(ctx.json({ ok: true, parkingSpots }));
  }),
  rest.post("/reserve-spot", async (req, res, ctx) => {
    const data = req?.body as {
      id: string;
      reservation: { from: string; to: string };
    };
    const user = await getUser(req);
    const parkingSpot = await db.parkingSpot.findFirst({
      where: { id: { equals: data.id } },
    });
    if (!user) {
      throw Error("You are not autherized!");
    }
    if (!parkingSpot) {
      throw Error("Parking spot not found!");
    }
    const reservation = await db.reservation.create({
      start: new Date(data.reservation.from),
      end: new Date(data.reservation.to),
      userId: user.id,
      parkingSpotId: data.id,
    });
    await db.parkingSpot.update({
      where: { id: { equals: data.id } },
      data: { reservations: (curr) => [...curr, reservation] },
    });
    db.user.update({
      where: { id: { equals: user.id } },
      data: {
        reservations: [...(user.reservations ?? []), reservation],
      },
    });
    persist("all");
    return res(ctx.json({ ok: false }));
  }),
];
