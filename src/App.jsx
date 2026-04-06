import usePageTitle from "./utils/hooks/usePageTitle";
import RoutesConfig from "./Routes/routes.jsx";

const App = () => {
  usePageTitle();
  return <RoutesConfig />;
};

export default App;
