// pretend this is firebase, netlify, or auth0's code.
// you shouldn't have to implement something like this in your own app

import { Reservation } from "../types/Reservation";

const localStorageKey = "__auth_provider_token__";

type emailAndPassword = {
  email: string;
  password: string;
};

async function getToken() {
  // if we were a real auth provider, this is where we would make a request
  // to retrieve the user's token. (It's a bit more complicated than that...
  // but you're probably not an auth provider so you don't need to worry about it).
  return window.localStorage.getItem(localStorageKey);
}

function handleUserResponse(data: {
  user: { token: string };
  reservations: Reservation[];
}) {
  window.localStorage.setItem(localStorageKey, data.user.token);
  return data;
}

function login({ email, password }: emailAndPassword) {
  return client("login", { email, password }).then(handleUserResponse);
}

function register(
  formData: emailAndPassword & { firstName: string; lastName: string }
) {
  return client("register", formData).then(handleUserResponse);
}

async function logout() {
  window.localStorage.removeItem(localStorageKey);
}

// an auth provider wouldn't use your client, they'd have their own
// so that's why we're not just re-using the client
const authURL = "auth";

async function client(endpoint: string, data: any) {
  const config = {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  };

  return window
    .fetch(`/${authURL}/${endpoint}`, config)
    .then(async (response) => {
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        return Promise.reject(data);
      }
    });
}

export {
  getToken,
  login,
  register,
  logout,
  localStorageKey,
};
