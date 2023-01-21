import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectCurrentOperator,
  setCredentials,
} from "../../app/store-slices/auth-slice";
import "./hub-menu.css";

import { ReactComponent as GastromiaLogo } from "../../assets/gastromia-logo@24px.svg";
import { logout } from "../../app/services/auth-api";
import { setToastState } from "../../app/store-slices/app-slice";
import { Button, Dropdown, Space } from "antd";
import type { MenuProps } from "antd";

import {
  CopyTwoTone,
  ClockCircleTwoTone,
  TagsTwoTone,
  TagTwoTone,
} from "@ant-design/icons";
import {
  fetchLocationStatus,
  updateLocationStatus,
} from "../../app/services/location-api";

const HubMenu: React.FC = () => {
  const [status, setStatus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { menu } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchStatus = async () => {
      const isOpen = await fetchLocationStatus();

      if (isOpen !== null) {
        setStatus(isOpen);
      } else {
        setToastState({
          isOpen: true,
          message: "We could not update the status of the location",
        });
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 120000);

    return () => clearInterval(interval);
  }, []);

  const onMenuClick: MenuProps["onClick"] = (e) => {
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

  const updateStatus = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    const isOpen = await updateLocationStatus(!status);

    if (isOpen !== null) {
      setStatus(isOpen);
    } else {
      dispatch(
        setToastState({
          isOpen: true,
          message: "We could not update the status of the location",
        })
      );
    }

    setIsLoading(false);
  };

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
        >{`Operator`}</Dropdown.Button>
        <Button
          type="primary"
          style={{ marginTop: "10px" }}
          block
          danger={status}
          onClick={updateStatus}
          loading={isLoading}
        >
          {status ? "Close" : "Open"}
        </Button>
      </div>
    </div>
  );
};

export default HubMenu;
