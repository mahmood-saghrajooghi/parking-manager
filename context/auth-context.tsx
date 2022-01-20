import * as React from "react";
import { QueryCache } from "react-query";
import * as auth from "../utils/auth-provider";
import { client } from "../utils/api-client";
import { useAsync } from "../utils/hooks";
import { FullPageSpinner, FullPageErrorFallback } from "../components/lib";
import { UserDB, UserFormFields } from "../types/User";
import { Reservation } from "../types/Reservation";

const queryCache = new QueryCache({
  onError: (error) => {
    console.log(error);
  },
  onSuccess: (data) => {
    console.log(data);
  },
});

async function bootstrapAppData() {
  let userData = null;
  const token = await auth.getToken();
  if (token) {
    const { ok, ...data } = await client("bootstrap", { token });
    if (ok) {
      userData = data;
    }
  }
  return userData;
}

async function invalidateUserData() {
  let userData = null;
  const token = await auth.getToken();
  if (token) {
    const { ok, ...data } = await client("bootstrap", { token });
    if (ok) {
      userData = data;
    }
  }
  return userData;
}

async function editProfileData(updates: UserFormFields) {
  let userData = null;
  const token = await auth.getToken();
  if (token) {
    const { ok, ...data } = await client("auth/edit-profile", {
      data: updates,
      token,
      method: "POST",
    });
    if (ok) {
      userData = data;
    }
  }
  return userData;
}

type User = Omit<UserDB, 'passwordHash'>;
interface AuthContextType {
  userData: {
    user: User;
  };
  invalidateUser: () => any;
  login: (data: { email: string; password: string }) => any;
  register: (user: UserDB) => any;
  logout: () => any;
  editProfile: (prosp: UserFormFields) => any;
}

const AuthContext = React.createContext<AuthContextType>({} as AuthContextType);
AuthContext.displayName = "AuthContext";

function AuthProvider(props: any) {
  const {
    data: userData,
    status,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync();

  React.useEffect(() => {
    const appDataPromise = bootstrapAppData();
    run(appDataPromise);
  }, [run]);

  const invalidateUser = React.useCallback(async () => {
    invalidateUserData().then((user) => setData(user));
  }, [setData]);
  const login = React.useCallback(
    (form) => auth.login(form).then((user) => setData(user)),
    [setData]
  );
  const register = React.useCallback(
    (form) => auth.register(form).then((user) => setData(user)),
    [setData]
  );
  const editProfile = React.useCallback(
    (form) => editProfileData(form),
    [setData]
  );
  const logout = React.useCallback(() => {
    auth.logout();
    queryCache.clear();
    setData(null);
  }, [setData]);

  const value = React.useMemo<AuthContextType>(
    () => ({
      userData: userData,
      login,
      logout,
      register,
      editProfile,
      invalidateUser,
    }),
    [login, logout, register, userData, editProfile, invalidateUser]
  );

  if (isLoading || isIdle) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  if (isSuccess) {
    return <AuthContext.Provider value={value} {...props} />;
  }

  throw new Error(`Unhandled status: ${status}`);
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}

function useClient() {
  const { userData } = useAuth();
  const token = userData?.user.token;
  return React.useCallback(
    (endpoint, config: any = {}) => client(endpoint, { ...config, token }),
    [token]
  );
}

export { AuthProvider, useAuth, useClient };
