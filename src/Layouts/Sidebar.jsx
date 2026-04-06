import { PanelMenu } from "primereact/panelmenu";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTE_NAME, ROUTE_PATH } from "../Routes/routes";

const Sidebar = ({ isOpen, setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuCommand = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      setOpen(false);
    }
  };

  const items = [
    {
      label: ROUTE_NAME.DASHBOARD,
      icon: "pi pi-th-large",
      path: ROUTE_PATH.DASHBOARD,
      command: () => menuCommand(ROUTE_PATH.DASHBOARD),
    },
    {
      label: ROUTE_NAME.CATEGORY,
      icon: "pi pi-tags",
      path: ROUTE_PATH.CATEGORY,
      command: () => menuCommand(ROUTE_PATH.CATEGORY),
    },
    {
      label: ROUTE_NAME.PRODUCTS,
      icon: "pi pi-box",
      path: ROUTE_PATH.PRODUCTS,
      command: () => menuCommand(ROUTE_PATH.PRODUCTS),
    },
    {
      label: ROUTE_NAME.REPORT,
      icon: "pi pi-chart-line",
      path: ROUTE_PATH.REPORT,
      command: () => menuCommand(ROUTE_PATH.REPORT),
    },
  ];

  return (
    <aside
      className={`h-screen w-64 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 shadow-sm
      ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      {/* Sidebar Header / Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <i className="pi pi-bolt text-white text-lg"></i>
          </div>
          <span className="text-xl font-bold text-gray-800">Bolt Mode</span>
        </div>

        {/* Close button for mobile */}
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden ml-auto p-1.5 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
        >
          <i className="pi pi-times text-lg"></i>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 space-y-1">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={item.command}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <i className={`${item.icon} text-lg`}></i>
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;

