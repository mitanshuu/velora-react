import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "../Routes/routes";
import { commonLabel } from "../utils/label";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12 lg:px-8">
      <div className="text-center">
        <p className="text-9xl font-extrabold text-[#3B82F6] animate-pulse drop-shadow-lg">
          404
        </p>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {commonLabel.pageNotFound}
        </h1>

        <p className="mt-6 text-base leading-7 text-gray-600 max-w-md mx-auto">
          {commonLabel.pageNotFoundMsg}
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button
            onClick={() => navigate(ROUTE_PATH.DASHBOARD)}
            className="rounded-xl bg-[#3B82F6] px-8 py-4 text-sm font-semibold text-white shadow-xl hover:bg-blue-700 hover:scale-105 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {commonLabel.backToDashboard}
          </button>
        </div>

        <div className="mt-12 text-sm text-gray-400">
          {commonLabel.pageNotFoundMsg2}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
