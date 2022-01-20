import { Formik } from "formik";
import { useCallback } from "react";
import { useQueryClient } from "react-query";
import { ModalDismissButton } from "../components/modal";
import { useAddUser } from "../utils/Users";

export const AddUserForm: React.FC = () => {
  const queryClient = useQueryClient();
  const { mutate } = useAddUser();
  const handleSubmit = useCallback((values) => {
    mutate(values, {
      onSuccess: () => queryClient.invalidateQueries("allUsers"),
    });
  }, []);
  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        type: 'USER',
      }}
      onSubmit={handleSubmit}
    >
      {({ values, handleSubmit, handleChange, handleBlur }) => (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-between items-center">
            <h3 className="text-md font-bold text-gray-900 dark:text-white">
              ثبت کاربر جدید
            </h3>
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
              htmlFor="fritsName"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              نام
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="نام"
              required
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.firstName}
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              نام خانوادگی
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="نام خانوادگی"
              required
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.lastName}
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
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              نوع کاربر
            </label>
            <select
              name="type"
              id="type"
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              required
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.type}
            >
              <option value="USER">کاربر</option>
              <option value="ADMIN">ادمین</option>
            </select>
          </div>

          <ModalDismissButton>
            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              ثبت اطلاعات
            </button>
          </ModalDismissButton>
        </form>
      )}
    </Formik>
  );
};
