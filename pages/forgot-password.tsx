import Head from "next/head";
import Link from "next/link";
import { Layout } from "../components/Layout";

export default function forgotPassword() {
  return (
    <Layout>
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="p-4 w-96 bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700">
          <form className="space-y-6" action="#">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900 dark:text-white">
                فراموشی رمز عبور
              </h3>

              <Link href="/">
                <a className="text-md text-blue-500 hover:underline">👈</a>
              </Link>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                ایمیل
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="name@company.com"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              ارسال کد بازیابی
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
