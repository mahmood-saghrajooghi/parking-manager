import { rest } from "msw";
import { db } from "../models/db";

export const reservationHandlers = [
  rest.get("/reservations", async (req, res, ctx) => {
    const reservations = await db.reservation.getAll();
    return res(ctx.json({ ok: true, reservations }));
  }),
  rest.post("/delete-reservation", async (req, res, ctx) => {
    const { id } = req.body as { id: string };
    if (!id) {
      return res(
        ctx.status(400),
        ctx.json({ status: 400, message: "Reservation id is not provided!" })
      );
    }
    const reservations = await db.reservation.delete({
      where: { id: { equals: id } },
    });
    return res(ctx.json({ ok: true, reservations }));
  }),
];
