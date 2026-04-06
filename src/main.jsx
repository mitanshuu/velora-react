import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "primereact/resources/themes/lara-light-blue/theme.css"; // theme
import "primereact/resources/primereact.min.css"; // core css
import "primeicons/primeicons.css"; // icons
import { PrimeReactProvider } from "primereact/api";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <PrimeReactProvider>
    <BrowserRouter>
      <ToastContainer position="top-right" />
      <App />
    </BrowserRouter>
  </PrimeReactProvider>,
);
