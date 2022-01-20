import { Formik } from "formik";
import { useCallback } from "react";
import { Dashboard } from "../../components/Dashboard";
import { useAuth } from "../../context/auth-context";

interface FormFields {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export default function profile() {
  const { userData } = useAuth();
  const { token, reservations, ...user } = userData.user;
  const { editProfile } = useAuth();
  const handleSubmit = useCallback((values: FormFields) => {
    editProfile(values);
  }, []);
  return (
    <Dashboard>
      <div className="flex justify-between mb-3">
        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          پروفایل
        </h5>
      </div>

      <Formik initialValues={{ ...user, password: "" }} onSubmit={handleSubmit}>
        {({ values, handleSubmit, handleChange, handleBlur }) => (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                ایمیل
              </label>
              <input
                type="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="ایمیل"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="firstName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                نام
              </label>
              <input
                type="taxt"
                id="firstName"
                name="firstName"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="نام"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.firstName}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="lasttName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                نام خانوادگی
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="نام خانوادگی"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.lastName}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                رمز عبور
              </label>
              <input
                type="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
            </div>
            <button
              type="submit"
              className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              ثبت اطلاعات
            </button>
          </form>
        )}
      </Formik>
    </Dashboard>
  );
}
