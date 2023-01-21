import axios, { AxiosError } from "axios";
import { isOperator, Operator } from "../../models/operator";

const baseUrl = "https://api.gastromia.com";

export const login = async (
  email: string,
  password: string
): Promise<Operator | null> => {
  try {
    const response = await axios.post(
      baseUrl + "/operator/login",
      {
        email: email,
        password: password,
      },
      { withCredentials: true }
    );
    const operator: Operator | any = response.data;

    if (operator && isOperator(operator)) {
      return operator;
    } else {
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(`Login error: ${axiosError.message}`);
    return null;
  }
};

export const logout = async (): Promise<boolean> => {
  try {
    const response = await axios.get("/operator/logout", {
      withCredentials: true,
    });

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(`Logout error: ${axiosError.message}`);
    return false;
  }
};

export const fetchOperator = async (): Promise<Operator | null> => {
  try {
    const response = await axios.get("/operator/fetch", {
      withCredentials: true,
    });
    const operator: Operator | any = response.data;

    if (operator && isOperator(operator)) {
      return operator;
    } else {
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(`Login error: ${axiosError.message}`);
    return null;
  }
};
