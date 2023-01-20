import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectCurrentOperator,
  setCredentials,
} from "../../app/store-slices/auth-slice";
import "./hub-menu.css";

import { ReactComponent as GastromiaLogo } from "../../assets/gastromia-logo@24px.svg";
import OrderGrey from "../../assets/order-grey@512px.png";
import OrderGreen from "../../assets/order-green@512px.png";
import TimeGrey from "../../assets/time-grey@512px.png";
import TimeGreen from "../../assets/time-green@512px.png";
import ProductGrey from "../../assets/product-grey@512px.png";
import ProductGreen from "../../assets/product-green@512px.png";
import Operator from "../../assets/operator@24px.png";
import LogoutRed from "../../assets/logout-red@24px.png";
import useClickOutside from "../../utils/useClickOutside";
import { logout } from "../../app/services/auth-api";
import { setToastState } from "../../app/store-slices/app-slice";
import { Button, Dropdown, Space } from "antd";
import type { MenuProps } from "antd";

import {
  CopyTwoTone,
  ClockCircleTwoTone,
  TagsTwoTone,
  TagTwoTone,
  UserOutlined,
} from "@ant-design/icons";

const HubMenu: React.FC = () => {
  const [isLogourDrawerOpen, setIsLogoutDrawerOpen] = useState<boolean>(false);
  const operator = useAppSelector(selectCurrentOperator);
  const { menu } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const logoutDrawer = useRef<HTMLDivElement>(null);

  useClickOutside(logoutDrawer, () => setIsLogoutDrawerOpen(false));

  const onMenuClick: MenuProps["onClick"] = (e) => {
    console.log("click", e.key);

    if (e.key === "1") {
      logoutOnClick();
    }
  };

  const items = [
    {
      key: "1",
      label: "Log out",
    },
  ];

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
      <div className="hubmenu-logo">
        <GastromiaLogo style={{ marginLeft: "16px" }} />
      </div>

      <Space direction="vertical">
        <Button
          icon={
            menu === "orders" ? (
              <ClockCircleTwoTone twoToneColor="#eb2f96" />
            ) : (
              <ClockCircleTwoTone twoToneColor="#b0b0b0" />
            )
          }
          type="text"
          size="large"
          style={{
            marginTop: "32px",
            fontWeight: "500",
            color: menu === "orders" ? "#343537" : "#909090",
          }}
          onClick={() => navigate("/hub/orders")}
        >
          Live orders
        </Button>
        <Button
          icon={
            menu === "history" ? (
              <CopyTwoTone twoToneColor="#eb2f96" />
            ) : (
              <CopyTwoTone twoToneColor="#b0b0b0" />
            )
          }
          type="text"
          size="large"
          style={{
            marginTop: "10px",
            fontWeight: "500",
            color: menu === "history" ? "#343537" : "#909090",
          }}
          onClick={() => navigate("/hub/history")}
        >
          History
        </Button>
        <Button
          icon={
            menu === "items" ? (
              <TagTwoTone twoToneColor="#eb2f96" />
            ) : (
              <TagTwoTone twoToneColor="#b0b0b0" />
            )
          }
          type="text"
          size="large"
          style={{
            marginTop: "10px",
            fontWeight: "500",
            color: menu === "items" ? "#343537" : "#909090",
          }}
          onClick={() => navigate("/hub/items")}
        >
          Items
        </Button>
        <Button
          icon={
            menu === "attributes" ? (
              <TagsTwoTone twoToneColor="#eb2f96" />
            ) : (
              <TagsTwoTone twoToneColor="#b0b0b0" />
            )
          }
          type="text"
          size="large"
          style={{
            marginTop: "10px",
            fontWeight: "500",
            color: menu === "attributes" ? "#343537" : "#909090",
          }}
          onClick={() => navigate("/hub/attributes")}
        >
          Attributes
        </Button>
      </Space>

      <div className="hubmenu-operatordrawer">
        <Dropdown.Button
          menu={{ items, onClick: onMenuClick }}
        >{`${operator?.name} ${operator?.surname}`}</Dropdown.Button>
      </div>
    </div>
  );
};

export default HubMenu;
