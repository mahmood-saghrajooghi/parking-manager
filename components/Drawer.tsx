import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useAuth } from "../context/auth-context";

export const Drawer: React.FC = ({ children }) => {
  const { pathname } = useRouter();
  const { logout, userData } = useAuth();
  return (
    <ul className="w-48 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
      <li className="py-2 px-4 w-full border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-end">
          <img className="w-10 ml-3" src="/icons/vehicle.png" alt="car image" />
          <span className="font-bold">پارک بان</span>
        </div>
      </li>
      <li className="py-2 px-4 w-full border-b border-gray-200 dark:border-gray-600 hover:text-emerald-400 hover:underline">
        <Link href="/dashboard">
          <a
            className={`block ${
              pathname === "/dashboard" ? "text-emerald-400" : ""
            }`}
          >
            داشبورد
          </a>
        </Link>
      </li>

      {userData.user.type === "ADMIN" ? (
        <li className="py-2 px-4 w-full border-b border-gray-200 dark:border-gray-600 hover:text-emerald-400 hover:underline">
          <Link href="/dashboard/users">
            <a
              className={`block ${
                pathname === "/dashboard/users" ? "text-emerald-400" : ""
              }`}
            >
              کاربران
            </a>
          </Link>
        </li>
      ) : null}

      <li className="py-2 px-4 w-full rounded-t-lg border-b border-gray-200 dark:border-gray-600 hover:text-emerald-400 hover:underline">
        <Link href="/dashboard/profile">
          <a
            className={`block ${
              pathname === "/dashboard/profile" ? "text-emerald-400" : ""
            }`}
          >
            پروفایل کاربری
          </a>
        </Link>
      </li>
      <li className="py-2 px-4 w-full rounded-t-lg hover:text-emerald-400 hover:underline">
        <Link href="/dashboard/profile">
          <button onClick={() => logout()} className="block">
            خروج
          </button>
        </Link>
      </li>
    </ul>
  );
};
