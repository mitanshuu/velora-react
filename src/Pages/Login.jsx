import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BaseInput from "../Components/Base/Input";
import BaseButton from "../Components/Base/Button";
import { ROUTE_PATH } from "../Routes/routes";
import { login } from "../Api/auth.js";
import { loginValidationSchema } from "../utils/validationSchema.js";
import { useFormik } from "formik";
import { showSuccessToast } from "../utils/toastService";
import { errorHandler, getPlaceholder } from "../utils/common.js";
import { commonLabel } from "../utils/label.js";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: loginValidationSchema,

    onSubmit: async (values) => {
      setLoading(true);

      try {
        const result = await login(values);

        if (result?.success) {
          showSuccessToast(result.message);
          navigate(ROUTE_PATH.DASHBOARD);
        } else {
          errorHandler(result?.message);
        }
      } catch (error) {
        errorHandler(error);
      }

      setLoading(false);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {commonLabel.signIn}
          </h1>
          <p className="text-gray-600">
            {commonLabel.pleaseSignInToYourAccount}
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <BaseInput
            label={commonLabel.email}
            placeholder={getPlaceholder(commonLabel.email)}
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="email"
            error={formik.touched.email && !!formik.errors.email}
            errormessage={formik.touched.email && formik.errors.email}
            required
          />

          <div className="space-y-1">
            <BaseInput
              label={commonLabel.password}
              placeholder={getPlaceholder(commonLabel.password)}
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && !!formik.errors.password}
              errormessage={formik.touched.password && formik.errors.password}
              required
            />
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
              >
                {commonLabel.forgotPassword}
              </button>
            </div>
          </div>

          <BaseButton
            label={commonLabel.signIn}
            loading={loading}
            type="submit"
          />
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {commonLabel.dontHaveAccount}
          <button
            type="button"
            className="text-blue-600 font-semibold hover:underline ml-1"
          >
            {commonLabel.registerHere}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
