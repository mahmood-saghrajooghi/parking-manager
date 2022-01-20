import moment from "moment";
import { useCallback, useMemo, useState } from "react";
import { Dashboard } from "../../components/Dashboard";
import { Spiral } from "../../components/Spiral";
import {
  Modal,
  ModalContents,
  ModalDismissButton,
  ModalOpenButton,
} from "../../components/modal";
import {
  useParkingSpots,
  useReserveParkingSpot,
} from "../../utils/ParkingSpots";
import { Reservation } from "../../types/Reservation";
import { Range } from "../../components/Range";
import { ParkingSpot } from "../../components/ParkingSpot";
import { Layout } from "react-grid-layout";
import _ from "lodash";
import { useQueryClient } from "react-query";
import { useAuth } from "../../context/auth-context";

type percent = `${string}%`;
interface TimeNow {
  today: number;
  tomorrow: number;
  diff: number;
}

function dateStrToNum(str: Date | number): number {
  return moment(str).valueOf();
}

function calcTimeNow(): TimeNow {
  const now = new Date();
  const date =
    now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
  const today = moment(date);

  const tomorrow = today.clone().add(1, "day");
  return {
    today: today.valueOf(),
    tomorrow: tomorrow.valueOf(),
    diff: tomorrow.valueOf() - today.valueOf(),
  };
}

function calcWidthPercentWrapper(timeNow: TimeNow) {
  return function (reservation: Reservation): number {
    const diff =
      dateStrToNum(reservation.end) - dateStrToNum(reservation.start);
    const width = (100 * diff) / timeNow.diff;
    return width;
  };
}

function calcLeftPercentWrapper(timeNow: TimeNow) {
  return function (reservation: Reservation): number {
    const diff = dateStrToNum(reservation.start) - dateStrToNum(timeNow.today);
    const left = (100 * diff) / timeNow.diff;
    return left;
  };
}

type cords = {
  width: number;
  left: number;
  id: string;
};

function mergeOverlaps(props: cords[]): cords[] {
  if (props.length <= 1) {
    return props;
  }
  let [first, second, ...other] = props;
  const firstClone = { ...first, right: first.left + first.width };
  const secondClone = { ...second, right: second.left + second.width };

  if (
    (firstClone.left < secondClone.right &&
      firstClone.right > secondClone.left) ||
    (firstClone.right > secondClone.left && firstClone.left < secondClone.right)
  ) {
    const left = _.min([firstClone.left, secondClone.left]);
    const right = _.max([firstClone.right, secondClone.right]);
    if (left && right) {
      const width = right - left;
      const merged = { width, left, id: firstClone.id };
      if (other.length > 0) {
        return [merged, ...mergeOverlaps([merged, ...other])];
      }
      return [merged];
    }
  }

  const [f, ...o] = mergeOverlaps([first, ...other]);
  if (o?.length <= 0) {
    return [f, second];
  }
  const [s, ...oth] = mergeOverlaps([second, ...other]);
  if (oth?.length <= 0) {
    return [first, s];
  }
  return props;
}

function prepReservations(
  reservations: Reservation[],
  widthTransformFn: (res: Reservation) => number,
  leftTransformFn: (res: Reservation) => number
): {
  width: number;
  left: number;
  id: string;
}[] {
  return reservations.map((reservation) => ({
    width: widthTransformFn(reservation),
    left: leftTransformFn(reservation),
    id: reservation.id,
  }));
}

export default function reserve() {
  const queryClient = useQueryClient();
  const { invalidateUser } = useAuth();
  const { isLoading, isSuccess, data: parkingSpots } = useParkingSpots();
  const [currSpot, setCurrSpot] = useState<
    | {
        id: string;
        reservations: { width: number; left: number; id: string }[];
      }
    | undefined
  >();
  const timeNow = useMemo<TimeNow>(calcTimeNow, []);
  const [selectedRes, setSelectedRes] = useState<Layout>();
  const { mutate, error, isError } = useReserveParkingSpot();
  const handleReserve = useCallback(async () => {
    if (!selectedRes || !currSpot) {
      return;
    }

    const today = moment(timeNow.today);
    const from = today.clone().add(selectedRes.x * 30 * 60 * 1000);
    const to = from.clone().add(selectedRes.w * 30 * 60 * 1000);

    mutate(
      {
        id: currSpot.id,
        reservation: { from: from.toDate(), to: to.toDate() },
      },
      {
        onSettled: () => {
          queryClient.invalidateQueries("parkingSpots");
          invalidateUser();
        },
      }
    );
  }, [selectedRes, currSpot]);

  return (
    <Dashboard>
      <Modal>
        <div className="flex flex-col h-full">
          <div className="flex justify-between">
            <h5 className="mb-3 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              رزرو جایگاه
            </h5>
          </div>
          <div className="flex-1">
            <div className="flex flex-col h-full">
              <div className="flex-1 mt-3">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Spiral />
                  </div>
                ) : (
                  <div className="grid gap-3 grid-cols-5 grid-rows-4 h-full">
                    {parkingSpots &&
                      parkingSpots.map((spot, i) => (
                        <ModalOpenButton key={spot.id}>
                          <div
                            onClick={() =>
                              setCurrSpot({
                                id: spot.id,
                                reservations: mergeOverlaps(
                                  prepReservations(
                                    spot.reservations,
                                    calcWidthPercentWrapper(timeNow),
                                    calcLeftPercentWrapper(timeNow)
                                  )
                                ),
                              })
                            }
                          >
                            <ParkingSpot
                              id={spot.id}
                              reservations={prepReservations(
                                spot.reservations,
                                calcWidthPercentWrapper(timeNow),
                                calcLeftPercentWrapper(timeNow)
                              )}
                              i={i}
                            />
                          </div>
                        </ModalOpenButton>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ModalContents
          aria-label="Login form"
          title="Login"
          onClose={() => setCurrSpot(undefined)}
        >
          <div className="pb-5 px-5">
            <div className="mb-6">
              <label
                htmlFor="date"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                تاریخ
              </label>
              <div className="relative">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  id="date"
                  name="date"
                  placeholder="۱۳ خرداد ۱۴۰۰"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="date"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                ساعت
              </label>
              <div>
                <Range
                  invalidAreas={currSpot?.reservations}
                  onChange={setSelectedRes}
                />
              </div>
            </div>
            <ModalDismissButton>
              <button
                onClick={handleReserve}
                className="bg-blue-500 block w-full rounded p-1.5"
              >
                ثبت
              </button>
            </ModalDismissButton>
          </div>
        </ModalContents>
      </Modal>
    </Dashboard>
  );
}
