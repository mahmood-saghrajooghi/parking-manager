import { factory, primaryKey, oneOf, manyOf } from "@mswjs/data";
import { datatype, date } from "faker";
import { Reservation } from "../../types/Reservation";
import { hashPasswordStr } from "../handlers/userHandlers";
import parkingSpots from "./parking-spots.json";

const DB_LOCAL_STORAGE_KEYS = {
  user: "__parker_users__",
  reservation: "__parker_reservations__",
  parkingSpot: "__parker_parkingSpots__",
};

export const db = factory({
  user: {
    id: primaryKey(datatype.uuid),
    type: String,
    firstName: String,
    lastName: String,
    email: String,
    passwordHash: String,
    reservations: manyOf("reservation"),
  },
  reservation: {
    id: primaryKey(datatype.uuid),
    userId: String,
    parkingSpotId: String,
    start: date.soon,
    end: date.soon,
  },
  parkingSpot: {
    id: primaryKey(datatype.uuid),
    reservations: manyOf("reservation"),
  },
});

export async function load() {
  const data = {
    user: [],
    reservation: [],
    parkingSpot: [],
  };
  for (const k in DB_LOCAL_STORAGE_KEYS) {
    const key = k as keyof typeof DB_LOCAL_STORAGE_KEYS;
    data[key] = loadModelData(key);
  }
  await data.reservation.forEach(async (r: Reservation) => {
    db.reservation.create(r);
  });
  const reservations = await db.reservation.getAll();
  for (const usr of data.user) {
    const user = usr as any;
    user.reservations = reservations.filter((r) => r.userId === user.id);
    const u = await db.user.create(user);
  }
  if (
    !data.user.find((u: any) => u.email === "mahmoodsagharjooghi@gmail.com")
  ) {
    db.user.create({
      email: "admin@admin.com",
      passwordHash: hashPasswordStr("admin"),
      type: "ADMIN",
    });
  }

  for (const pks of parkingSpots) {
    const pksReservatons = reservations.filter(
      (r) => r.parkingSpotId === pks.id
    );
    await db.parkingSpot.create({ id: pks.id, reservations: pksReservatons });
  }
}

export async function persist(
  modelName: "user" | "reservation" | "parkingSpot" | "all"
) {
  if (modelName === "all") {
    for (const key in DB_LOCAL_STORAGE_KEYS) {
      persist(key as keyof typeof DB_LOCAL_STORAGE_KEYS);
    }
    return;
  }
  window.localStorage.setItem(
    DB_LOCAL_STORAGE_KEYS[modelName],
    JSON.stringify(await db[modelName].getAll())
  );
}

export function loadModelData(
  modelName: "user" | "reservation" | "parkingSpot"
) {
  const data = window.localStorage.getItem(DB_LOCAL_STORAGE_KEYS[modelName]);
  if (data) {
    return JSON.parse(data);
  }
  return [];
}

try {
  load();
} catch (error) {
  persist("all");
  // ignore json parse error
}
