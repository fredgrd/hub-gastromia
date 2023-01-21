import axios, { AxiosError } from "axios";
import {
  areAttributes,
  areItems,
  isAttribute,
  isItem,
  Item,
  ItemAttribute,
} from "../../models/item";

const baseUrl = "https://api.gastromia.com";

export const fetchItem = async (itemID: string): Promise<Item | null> => {
  try {
    const response = await axios.get(baseUrl + `/items/item?i=${itemID}`);
    const item: Item | any = response.data;

    if (item && isItem(item)) {
      return item;
    } else {
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(`FetchItem error: ${axiosError.message}`);
    return null;
  }
};

export const fetchAllItems = async (): Promise<Item[]> => {
  try {
    const response = await axios.get(baseUrl + "/items", {
      withCredentials: true,
    });
    const items: Item[] | any = response.data.items;

    if (items && areItems(items)) {
      return items;
    } else {
      return [];
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(`FetchAllItems error: ${axiosError.message}`);
    return [];
  }
};

export const updateItem = async (
  itemID: string,
  update: {}
): Promise<Item | null> => {
  try {
    const response = await axios.patch(
      baseUrl + "/items/item/update",
      { item_id: itemID, update: update },
      { withCredentials: true }
    );
    const item: Item | any = response.data.item;

    if (item && isItem(item)) {
      return item;
    } else {
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(`UpdateItem error: ${axiosError.message}`);
    return null;
  }
};

export const createItem = async (newItem: {}): Promise<{
  status: number;
  message?: any;
}> => {
  try {
    const response = await axios.post(
      baseUrl + "/items/item/create",
      { item: newItem },
      { withCredentials: true }
    );

    return {
      status: response.status,
      message: response.statusText,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(`CreateItem error: ${axiosError.message}`);

    return {
      status: 500,
      message: axiosError.response?.data,
    };
  }
};

export const deleteItem = async (
  itemID: string
): Promise<{
  status: number;
  message?: any;
}> => {
  try {
    const response = await axios.patch(
      baseUrl + "/items/item/delete",
      { item_id: itemID },
      { withCredentials: true }
    );

    return {
      status: response.status,
      message: response.statusText,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(`DeleteItem error: ${axiosError.message}`);

    return {
      status: 500,
      message: axiosError.response?.data,
    };
  }
};

export const fetchAllAttributes = async (): Promise<ItemAttribute[]> => {
  try {
    const response = await axios.get(baseUrl + "/items/attribute/all", {
      withCredentials: true,
    });
    const attributes: ItemAttribute[] | any = response.data.attributes;

    if (attributes && areAttributes(attributes)) {
      return attributes;
    } else {
      return [];
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(`FetchAllAttributes error: ${axiosError.message}`);
    return [];
  }
};

export const updateAttribute = async (
  attributeID: string,
  update: {}
): Promise<ItemAttribute | null> => {
  try {
    const response = await axios.patch(
      baseUrl + "/items/attribute/update",
      { attribute_id: attributeID, update: update },
      { withCredentials: true }
    );
    const attribute: ItemAttribute | any = response.data.attribute;

    if (attribute && isAttribute(attribute)) {
      return attribute;
    } else {
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(`UpdateAttribute error: ${axiosError.message}`);
    return null;
  }
};

export const createAttribute = async (newAttribute: {}): Promise<{
  status: number;
  message?: any;
}> => {
  try {
    const response = await axios.post(
      baseUrl + "/items/attribute/create",
      { attribute: newAttribute },
      { withCredentials: true }
    );

    return {
      status: response.status,
      message: response.statusText,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(`CreateAttribute error: ${axiosError.message}`);

    return {
      status: 500,
      message: axiosError.response?.data,
    };
  }
};

export const deleteAttribute = async (
  attributeID: string
): Promise<{
  status: number;
  message?: any;
}> => {
  try {
    const response = await axios.patch(
      baseUrl + "/items/attribute/delete",
      { attribute_id: attributeID },
      { withCredentials: true }
    );

    return {
      status: response.status,
      message: response.statusText,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(`CreateAttribute error: ${axiosError.message}`);

    return {
      status: 500,
      message: axiosError.response?.data,
    };
  }
};

export const searchAttributes = async (
  query: string
): Promise<ItemAttribute[]> => {
  try {
    const response = await axios.get(
      baseUrl + `/items/attribute/search?k=${query}`,
      {
        withCredentials: true,
      }
    );
    const attributes: ItemAttribute[] | any = response.data.attributes;

    if (attributes && areAttributes(attributes)) {
      return attributes;
    } else {
      return [];
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(`SearchAttributes error: ${axiosError.message}`);
    return [];
  }
};
