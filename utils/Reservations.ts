import { useMutation, UseMutationResult, useQuery } from "react-query";
import { useClient } from "../context/auth-context";

const defaultMutationOptions = {
  onError: (err: any, variables: any, recover: any) =>
    typeof recover === "function" ? recover() : null,
  onSettled: () => {},
};

export function useDeleteReservation(
  options?: any
): UseMutationResult<any, unknown, any, unknown> {
  const client = useClient();
  return useMutation(
    (data: { id: string }) =>
      client("delete-reservation", {
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
