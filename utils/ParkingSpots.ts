import { useMutation, UseMutationResult, useQuery } from "react-query";
import { useClient } from "../context/auth-context";
import { ParkingSpot } from "../types/ParkingSpot";

const parkingSpotQueryConfig = {
  staleTime: 1000 * 60 * 60,
  cacheTime: 1000 * 60 * 60,
};

interface useParkingSpotsReturnType {
  data: ParkingSpot[] | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  error: any;
}

const defaultMutationOptions = {
  onError: (err: any, variables: any, recover: any) =>
    typeof recover === "function" ? recover() : null,
  onSettled: () => {},
};

export function useParkingSpots(): useParkingSpotsReturnType {
  const client = useClient();
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["parkingSpots"],
    queryFn: () => client("parking-spots").then((data) => data.parkingSpots),
    ...parkingSpotQueryConfig,
  });
  return {
    data,
    isLoading,
    isSuccess,
    error,
  };
}

export function useReserveParkingSpot(
  options?: any
): UseMutationResult<any, unknown, any, unknown> {
  const client = useClient();
  return useMutation(
    (updates: any) =>
      client("reserve-spot", {
        method: "POST",
        data: updates,
      }),
    {
      onMutate: () => {},
      ...defaultMutationOptions,
      ...options,
    }
  );
}
