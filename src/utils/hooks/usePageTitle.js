import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ROUTE_NAME, ROUTE_PATH } from "../../Routes/routes";

const usePageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let pageName = "Bolt Mode";
    const routeKeys = Object.keys(ROUTE_PATH);
    const matchedKey = routeKeys.find((key) => ROUTE_PATH[key] === path);

    if (matchedKey && ROUTE_NAME[matchedKey]) {
      pageName = `Bolt Mode | ${ROUTE_NAME[matchedKey]}`;
    } else if (path === "/") {
      pageName = `Bolt Mode | ${ROUTE_NAME.DASHBOARD}`;
    }

    document.title = pageName;
  }, [location]);
};

export default usePageTitle;
