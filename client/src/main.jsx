import React from "react";
import "./index.scss";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import routes from "./routes";
import { store } from "./store";
import { Provider } from "react-redux";

import { AuthContextProvider } from "./context/AuthContext";
import RoutesWrapper from "./RoutesWrapper";
import axios from "axios";
import { Toaster } from "react-hot-toast";

axios.defaults.baseURL = "http://localhost:5000/api/v1";
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <Provider store={store}>
        <Toaster
          position="top-center"
          reverseOrder={true}
          toastOptions={{ duration: 3000 }}
        />
        <BrowserRouter>
          <RoutesWrapper routes={routes} />
        </BrowserRouter>
      </Provider>
    </AuthContextProvider>
  </React.StrictMode>
);
