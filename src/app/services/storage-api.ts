import axios, { AxiosError } from "axios";

const baseUrl = "https://api.gastromia.app";

export const uploadImageToS3 = async (
  base64: string,
  type: string
): Promise<string | null> => {
  try {
    const response = await axios.post(
      baseUrl + "/storage/image/upload",
      { base64: base64, type: type },
      { withCredentials: true }
    );
    const imageUrl = response.data.image_url;
    return imageUrl;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(
      `UploadImageToS3 error: ${axiosError.name} ${axiosError.message}`
    );
    return null;
  }
};
