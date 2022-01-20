import moment from "moment";
import Link from "next/link";
import { useCallback } from "react";
import { Dashboard } from "../../components/Dashboard";
import { useDeleteReservation } from "../../utils/Reservations";
import { useAuth } from "../../context/auth-context";

export default function dahsboard() {
  const { userData, invalidateUser } = useAuth();
  const { mutate } = useDeleteReservation();
  const deleteReservation = useCallback((id) => {
    mutate(
      { id },
      {
        onSettled: invalidateUser,
      }
    );
  }, []);
  return (
    <Dashboard>
      <div className="flex justify-between">
        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          رزرو ها
        </h5>
        <Link href="/dashboard/reserve">
          <a className="flex pr-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <svg
              className="w-5 h-5 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            رزرو جدید
          </a>
        </Link>
      </div>
      <div>
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow-md sm:rounded-lg">
                <table className="min-w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="py-3 px-6 text-xs font-medium tracking-wider text-right text-gray-700 uppercase dark:text-gray-400"
                      >
                        کد جایگاه
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-6 text-xs font-medium tracking-wider text-right text-gray-700 uppercase dark:text-gray-400"
                      >
                        تاریخ
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-6 text-xs font-medium tracking-wider text-right text-gray-700 uppercase dark:text-gray-400"
                      >
                        ساعت
                      </th>
                      <th scope="col" className="relative py-3 px-6">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData?.user.reservations?.map((r) => {
                      const from = moment(r.start);
                      const to = moment(r.end);
                      return (
                        <tr
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                          key={r.id}
                        >
                          <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            ۱
                          </td>
                          <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            <div dir="ltr" className="font-sans">
                              {from.format("ll")}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                            {from.hours().toLocaleString("fa")}:
                            {from.minutes() < 10 ? "۰" : ""}
                            {from.minutes().toLocaleString("fa")} الی{" "}
                            {to.hours().toLocaleString("fa")}:
                            {to.minutes() < 10 ? "۰" : ""}
                            {to.minutes().toLocaleString("fa")}
                          </td>
                          <td className="py-4 px-6 text-sm font-medium text-center whitespace-nowrap">
                            <button
                              className="text-center text-blue-600 hover:text-blue-300 dark:text-blue-500 dark:hover:underline"
                              onClick={() => deleteReservation(r.id)}
                            >
                              حذف
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}
