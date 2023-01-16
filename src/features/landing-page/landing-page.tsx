import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../app/services/auth-api";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectCurrentOperator,
  setCredentials,
} from "../../app/store-slices/auth-slice";
import { setToastState } from "../../app/store-slices/app-slice";
import "./landing-page.css";

import SimpleInput from "../input/simple-input";
import PrimaryButton from "../button/primary-button";

import BackgroundImage from "../../assets/landing-background.png";
import { ReactComponent as GastromiaLogo } from "../../assets/gastromia-logo@40px.svg";

const LandingPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const operator = useAppSelector(selectCurrentOperator);

  useEffect(() => {
    if (operator) {
      navigate("/hub/orders");
    }
  }, [operator]);

  const emailOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Validate
    setEmail(event.target.value);
  };

  const passOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Validate
    setPassword(event.target.value);
  };

  const loginOnClick = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    const operator = await login(email, password);

    if (operator) {
      dispatch(setCredentials({ operator: operator }));
      navigate("/hub/orders");
    } else {
      dispatch(
        setToastState({
          isOpen: true,
          message:
            "We could not find an accout with the email and password you provided",
        })
      );
    }

    setIsLoading(false);
  };

  return (
    <div className="landingpage">
      <img className="landingpage-background" src={BackgroundImage} />
      <div className="landingpage-loginmenu-positioner">
        <div className="landingpage-loginmenu">
          <GastromiaLogo />
          <span className="landingpage-loginmenu-header">
            Welcome to Hub Manager
          </span>
          <span className="landingpage-loginmenu-header-info">
            Check on orders, chart their progress and manage your location’s
            offering with ease.
          </span>
          <SimpleInput
            value={email}
            onChange={emailOnChange}
            options={{ labelTitle: "Email", style: { marginTop: "16px" } }}
          />
          <SimpleInput
            value={password}
            onChange={passOnChange}
            options={{
              labelTitle: "Password",
              style: { marginTop: "16px" },
              inputType: "password",
            }}
          />

          <div className="landingpage-submitbtn-positioner">
            <PrimaryButton
              onClick={loginOnClick}
              options={{
                title: "Login",
                isEnabled: true,
                isLoading: isLoading,
                isVisible: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
