import { Avatar } from "primereact/avatar";
import { ROUTE_NAME, ROUTE_PATH } from "../Routes/routes";
import { useLocation, useNavigate } from "react-router-dom";
import { showSuccessToast } from "../utils/toastService";
import { commonLabel } from "../utils/label";

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate(ROUTE_PATH.LOGIN);
    showSuccessToast(commonLabel.logoutMsg);
  };

  const pageName =
    ROUTE_NAME[
      Object.keys(ROUTE_PATH).find(
        (key) => ROUTE_PATH[key] === location.pathname,
      )
    ] || "Dashboard";

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white border-b border-gray-200 z-40 px-6 flex items-center justify-between shadow-sm">
      {/* Left side: Menu toggle & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md"
        >
          <i className="pi pi-bars text-lg"></i>
        </button>
        <h1 className="text-lg font-bold text-gray-800">{pageName}</h1>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 cursor-pointer">
          <Avatar
            image="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
            shape="circle"
            className="w-8 h-8"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-700 leading-none">
              User
            </p>
            <p className="text-[10px] text-gray-500 uppercase mt-1">
              Administrator
            </p>
          </div>
        </div>
        <button
          className="p-2 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
          onClick={handleLogout}
        >
          <i className="pi pi-sign-out text-lg"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
