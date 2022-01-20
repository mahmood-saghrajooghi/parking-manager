import { Formik, FormikHelpers } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../context/auth-context";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const handleSubmit = useCallback(async (values) => {
    const res = await login(values)
  }, []);
  return (
    <Layout>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
      >
        {({ values, handleSubmit, handleChange, handleBlur }) => (
          <div className="h-screen w-screen flex items-center justify-center">
            <div className="p-4 w-96 bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="flex justify-between items-center">
                  <h3 className="text-md font-bold text-gray-900 dark:text-white">
                    ورود به سیستم پارک بان
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    رمز عبور
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                </div>
                <div className="flex items-start">
                  <Link href="/forgot-password">
                    <a className="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500">
                      فراموشی رمز عبور
                    </a>
                  </Link>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  ورود به حساب کاربری
                </button>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  حساب کاربری ندارید؟{" "}
                  <Link href="/register">
                    <a className="text-blue-700 hover:underline dark:text-blue-500">
                      ثبت نام کیند
                    </a>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        )}
      </Formik>
    </Layout>
  );
}
