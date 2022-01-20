import Head from "next/head";
import Link from "next/link";
import { Layout } from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="h-screen w-screen flex flex-col items-center justify-center">
        <img className="w-24 mb-1" src="/icons/vehicle.png" alt="car image" />
        <p className="text-gray-700 text-lg font-bold mb-5 dark:text-white">پارک بان</p>

        <div className="flex">
          <Link href="login">
            <a className="text-white w-24 ml-3 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              ورود
            </a>
          </Link>
          <Link href="register">
            <a className="text-white w-24 bg-gray-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              ثبت نام
            </a>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
