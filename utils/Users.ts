import { useMutation, UseMutationResult, useQuery } from "react-query";
import { useClient } from "../context/auth-context";
import { UserDB, UserFormFields } from "../types/User";

const defaultMutationOptions = {
  onError: (err: any, variables: any, recover: any) =>
    typeof recover === "function" ? recover() : null,
  onSettled: () => {},
};

const usersQueryConfig = {
  staleTime: 1000 * 60 * 60,
  cacheTime: 1000 * 60 * 60,
};


interface useUsersReturnType {
  data: UserDB[] | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  error: any;
}

export function useUsers(): useUsersReturnType {
  const client = useClient();
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => client("all-users").then((data) => data.users),
    ...usersQueryConfig,
  });
  return {
    data,
    isLoading,
    isSuccess,
    error,
  };
}

export function useDeleteUser(
  options?: any
): UseMutationResult<any, unknown, any, unknown> {
  const client = useClient();
  return useMutation(
    (data: { id: string }) =>
      client("delete-user", {
        method: "POST",
        data,
      }),
    {
      onMutate: () => {},
      ...defaultMutationOptions,
      ...options,
    }
  );
}

export function useAddUser(
  options?: any
): UseMutationResult<any, unknown, any, unknown> {
  const client = useClient();
  return useMutation(
    (data: UserFormFields) =>
      client("add-user", {
        method: "POST",
        data,
      }),
    {
      onMutate: () => {},
      ...defaultMutationOptions,
      ...options,
    }
  );
}
