import axios, { AxiosError } from "axios";

const baseUrl = "https://api.gastromia.app";

export const fetchLocationStatus = async (): Promise<boolean | null> => {
  try {
    const response = await axios.get(baseUrl + "/location/status");
    const isOpen: boolean | any = response.data.is_open;

    if (typeof isOpen === "boolean") {
      return isOpen;
    } else {
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(`FetchLocationStatus error: ${axiosError.message}`);
    return null;
  }
};

export const updateLocationStatus = async (
  status: boolean
): Promise<boolean | null> => {
  try {
    const response = await axios.patch(
      baseUrl + "/location/status/update",
      { status: status },
      { withCredentials: true }
    );
    const isOpen: boolean | any = response.data.is_open;

    if (typeof isOpen === "boolean") {
      return isOpen;
    } else {
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(`FetchLocationStatus error: ${axiosError.message}`);
    return null;
  }
};
