import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectCurrentOperator,
  setCredentials,
} from "../../app/store-slices/auth-slice";
import "./hub-menu.css";

import { ReactComponent as GastromiaLogo } from "../../assets/gastromia-logo@24px.svg";
import OrderGrey from "../../assets/order-grey@24px.png";
import OrderGreen from "../../assets/order-green@24px.png";
import ProductGrey from "../../assets/product-grey@24px.png";
import ProductGreen from "../../assets/product-green@24px.png";
import Operator from "../../assets/operator@24px.png";
import LogoutRed from "../../assets/logout-red@24px.png";
import useClickOutside from "../../utils/useClickOutside";
import { logout } from "../../app/services/auth-api";
import { setToastState } from "../../app/store-slices/app-slice";

const HubMenu: React.FC = () => {
  const [isLogourDrawerOpen, setIsLogoutDrawerOpen] = useState<boolean>(false);
  const operator = useAppSelector(selectCurrentOperator);
  const { menu } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const logoutDrawer = useRef<HTMLDivElement>(null);

  useClickOutside(logoutDrawer, () => setIsLogoutDrawerOpen(false));

  const logoutOnClick = async () => {
    const logoutConfirmation = window.confirm("Do you wish to logout?");

    if (!logoutConfirmation) {
      return;
    }

    const isLogout = await logout();

    if (isLogout) {
      dispatch(setCredentials({ operator: null }));
      navigate("/");
    } else {
      dispatch(
        setToastState({
          isOpen: true,
          message: "We could not log you out of the account",
        })
      );
    }
  };

  console.log(menu);
  return (
    <div className="hubmenu">
      <GastromiaLogo />

      <button
        className="hubmenu-menubtn"
        style={{ marginTop: "32px" }}
        onClick={() => navigate("/hub/orders")}
      >
        <img
          className="hubmenu-menubtn-icon"
          src={menu === "orders" ? OrderGreen : OrderGrey}
        />
        <span
          className="hubmenu-menubtn-title"
          style={{ color: menu === "orders" ? "" : "#b0b0b0" }}
        >
          Orders
        </span>
      </button>

      <button
        className="hubmenu-menubtn"
        onClick={() => navigate("/hub/products")}
      >
        <img
          className="hubmenu-menubtn-icon"
          src={menu === "products" ? ProductGreen : ProductGrey}
        />
        <span
          className="hubmenu-menubtn-title"
          style={{ color: menu === "products" ? "" : "#b0b0b0" }}
        >
          Products
        </span>
      </button>

      <div className="hubmenu-operatordrawer">
        <div
          className="hubmenu-operatordrawer-info"
          onClick={() => setIsLogoutDrawerOpen(true)}
        >
          <img className="hubmenu-operator-icon" src={Operator} />
          <span className="hubmenu-operator-name">{`${operator?.name} ${operator?.surname}`}</span>
        </div>

        {isLogourDrawerOpen && (
          <div
            className="hubmenu-operatordrawer-logoutdrawer"
            ref={logoutDrawer}
          >
            <button
              className="hubmenu-operatordrawer-logoutdrawer-logoutbtn"
              onClick={logoutOnClick}
            >
              <img
                className="hubmenu-operatordrawer-logoutdrawer-logoutbtn-icon"
                src={LogoutRed}
              />
              <span className="hubmenu-operatordrawer-logoutdrawer-logoutbtn-title">
                Logout
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HubMenu;
