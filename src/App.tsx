import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./features/landing-page/landing-page";
import Hub from "./features/hub/hub";

import Toast from "./features/toast/toast";
import { useAppDispatch } from "./app/hooks";
import { fetchRemoteOperator } from "./app/store-slices/auth-slice";
import OrdersPage from "./features/orders-page/orders-page";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchRemoteOperator());
  }, []);

  return (
    <React.StrictMode>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/hub/:menu" element={<Hub />} />
        </Routes>
        <Toast />
      </div>
    </React.StrictMode>
  );
}

export default App;
