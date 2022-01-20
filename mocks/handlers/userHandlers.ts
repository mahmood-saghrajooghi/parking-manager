import { rest } from "msw";
import { UserDB, UserFormFields } from "../../types/User";
import { persist, load } from "../models/db";
import { db } from "../models/db";

const persisUsers = () => persist("user");

const USER_TYPES = {
  ADMIN: "ADMIN",
  USER: "USER",
};

function validateUserForm(params: { email?: string; password?: string }) {
  const { email, password } = params;
  if (!email) {
    const error = new Error("A email is required") as Error & {
      status: number;
    };
    error.status = 400;
    throw error;
  }
  if (!password) {
    const error = new Error("A password is required") as Error & {
      status: number;
    };
    error.status = 400;
    throw error;
  }
}

async function authenticate(params: { email?: string; password?: string }) {
  const { email, password } = params;
  validateUserForm({ email, password });
  if (!email || !password) {
    return;
  }
  const user = await db.user.findFirst({ where: { email: { equals: email } } });
  if (user && user.passwordHash === hashPasswordStr(password)) {
    return { ...sanitizeUser(user), token: btoa(user.id) };
  }
  const error = new Error("Invalid email or password") as Error & {
    status: number;
  };
  error.status = 400;
  throw error;
}

async function create(params: UserFormFields) {
  validateUserForm({ email: params.email, password: params.password });
  if (!params.email || !params.password) {
    return;
  }
  const passwordHash = hashPasswordStr(params.password);
  if (await db.user.findFirst({ where: { email: { equals: params.email } } })) {
    const error = new Error(
      `Cannot create a new user with the email "${params.email}"`
    ) as Error & {
      status: number;
    };
    error.status = 400;
    throw error;
  }
  const user = await db.user.create({
    firstName: params.firstName,
    lastName: params.lastName,
    email: params.email,
    passwordHash,
    type: params.type ?? USER_TYPES.USER,
  });
  persisUsers();
  return read(user.id);
}

async function read(id: string) {
  validateUser(id);
  const user = await db.user.findFirst({ where: { id: { equals: id } } });
  return sanitizeUser(user as { passwordHash: string });
}

function sanitizeUser<T extends { passwordHash: string }>(user: T) {
  const { passwordHash, ...rest } = user;
  return rest;
}

async function updateUser(id: string, updates: Partial<UserDB>) {
  validateUser(id);
  db.user.update({
    where: { id: { equals: id } },
    data: updates,
  });
  persisUsers();
  return read(id);
}

// this would be called `delete` except that's a reserved word in JS :-(
async function remove(id: string) {
  validateUser(id);
  db.user.delete({ where: { id: { equals: id } } });
  persisUsers();
}

function validateUser(id: string) {
  load();
  if (!db.user.findFirst({ where: { id: { equals: id } } })) {
    const error = new Error(`No user with the id "${id}"`) as Error & {
      status: number;
    };
    error.status = 404;
    throw error;
  }
}

export function hashPasswordStr(str: string) {
  var hash = 5381,
    i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return String(hash >>> 0);
}

async function resetUsers() {
  db.user.deleteMany({
    where: {
      id: { notEquals: undefined },
    },
  });
  persisUsers();
}

const getToken = (req: any) =>
  req.headers.get("Authorization")?.replace("Bearer ", "");

export async function getUser(req: any) {
  const token = getToken(req);
  if (!token) {
    const error = new Error("A token must be provided") as Error & {
      status: number;
    };
    error.status = 401;
    throw error;
  }
  let userId;
  try {
    userId = atob(token);
  } catch (e) {
    const error = new Error("Invalid token. Please login again.") as Error & {
      status: number;
    };
    error.status = 401;
    throw error;
  }
  const user = await db.user.findFirst({ where: { id: { equals: userId } } });
  if (!user) {
    const error = new Error("User Not Found!") as Error & {
      status: number;
    };
    error.status = 401;
    throw error;
  }
  return sanitizeUser(user);
}

export const userHandlers = [
  rest.get("/all-users", async (req, res, ctx) => {
    const users = await db.user.getAll();
    return res(ctx.json({ ok: true, users }));
  }),
  rest.post("/add-user", async (req, res, ctx) => {
    const { email, password, firstName, lastName, type } =
      req.body as UserFormFields;
    if (!password) {
      return;
    }
    const user = await db.user.create({
      email,
      passwordHash: hashPasswordStr(password),
      firstName,
      lastName,
      type,
    });
    persisUsers()
    return res(ctx.json({ ok: true, user }));
  }),
  rest.post("/delete-user", async (req, res, ctx) => {
    const { id } = req.body as { id: string };
    await db.user.delete({ where: { id: { equals: id } } });
    persisUsers();
    return res(ctx.json({ ok: true }));
  }),
  rest.post("/auth/register", async (req, res, ctx) => {
    const userData = req.body as UserFormFields;
    await create(userData);
    let user;
    try {
      user = await authenticate(userData);
    } catch (e) {
      const error = e as Error & { message: string };
      return res(
        ctx.status(400),
        ctx.json({ status: 400, message: error.message })
      );
    }
    return res(ctx.json({ ok: true, user }));
  }),
  rest.post(`auth/login`, async (req, res, ctx) => {
    const { email, password } = req.body as { email: string; password: string };
    const user = await authenticate({ email, password });
    persisUsers();
    return res(ctx.json({ ok: true, user }));
  }),
  rest.get("/bootstrap", async (req, res, ctx) => {
    const user = await getUser(req);
    const token = getToken(req);
    return res(ctx.json({ ok: true, user: { ...user, token } }));
  }),
  rest.post("/auth/get-user", async (req, res, ctx) => {
    const user = await getUser(req);
    return res(ctx.json({ ok: true, user }));
  }),
  rest.post("/auth/edit-profile", async (req, res, ctx) => {
    const updates = req.body as {
      email: string;
      firstName: string;
      lastName: string;
      password: string;
    };

    let user = await getUser(req);
    if (!user) {
      return res(
        ctx.status(401),
        ctx.json({ status: 400, message: "Not Authorized!" })
      );
    }
    const userData: {
      email: string;
      firstName: string;
      lastName: string;
      passwordHash?: string;
    } = {
      email: updates.email,
      firstName: updates.firstName,
      lastName: updates.lastName,
    };
    if (!!updates.password) {
      userData.passwordHash = hashPasswordStr(updates.password);
    }

    const updatedUser = await db.user.update({
      where: { id: { equals: user.id } },
      data: userData,
    });
    persisUsers();
    return res(ctx.json({ user: sanitizeUser(updatedUser!) }));
  }),
];
