export interface Item {
  _id: string;
  name: string;
  description: string;
  details: string;
  ingredients: string;
  available: boolean;
  quick_add: boolean;
  price: number;
  discount: boolean;
  discount_price: number;
  discount_label: string;
  attribute_groups: ItemAttributeGroup[];
  tags: string[];
  category: string;
  media_url: string;
  preview_url: string;
  item_version: string;
}

export interface ItemAttributeGroup {
  _id: string;
  with_media: boolean;
  rules: ItemAttributeGroupRules;
  name: string;
  description: string;
  attributes: ItemAttribute[];
}

export interface InputItemAttributeGroup {
  with_media: boolean;
  rules: ItemAttributeGroupRules;
  name: string;
  description: string;
  attributes: string[];
}

export interface ItemAttributeGroupRules {
  group_min: number;
  group_max: number;
  attribute_max: number;
}

export interface ItemAttribute {
  _id: string;
  name: string;
  unique_tag: string;
  price: number;
  available: boolean;
  media_url: string;
}

export const isItem = (item: any): item is Item => {
  const unsafeCast = item as Item;

  return (
    unsafeCast._id !== undefined &&
    unsafeCast.name !== undefined &&
    unsafeCast.description !== undefined &&
    unsafeCast.details !== undefined &&
    unsafeCast.ingredients !== undefined &&
    unsafeCast.available !== undefined &&
    unsafeCast.quick_add !== undefined &&
    unsafeCast.price !== undefined &&
    unsafeCast.discount !== undefined &&
    unsafeCast.discount_price !== undefined &&
    unsafeCast.discount_label !== undefined &&
    unsafeCast.attribute_groups !== undefined &&
    unsafeCast.tags !== undefined &&
    unsafeCast.category !== undefined &&
    unsafeCast.media_url !== undefined &&
    unsafeCast.preview_url !== undefined &&
    unsafeCast.item_version !== undefined
  );
};

export const areItems = (items: any[]): items is Item[] => {
  const are = items.reduce((acc, curr) => {
    if (isItem(curr)) {
      return acc * 1;
    } else {
      return acc * 0;
    }
  }, 1);

  return are === 1;
};

export const isAttribute = (attribute: any): attribute is ItemAttribute => {
  const unsafeCast = attribute as ItemAttribute;

  return (
    unsafeCast._id !== undefined &&
    unsafeCast.name !== undefined &&
    unsafeCast.unique_tag !== undefined &&
    unsafeCast.price !== undefined &&
    unsafeCast.available !== undefined &&
    unsafeCast.media_url !== undefined
  );
};

export const areAttributes = (
  attributes: any[]
): attributes is ItemAttribute[] => {
  const att = attributes.reduce((acc, curr) => {
    if (isAttribute(curr)) {
      return acc * 1;
    } else {
      return acc * 0;
    }
  }, 1);

  return att === 1;
};

export const initItem = (): Item => {
  const item: Item = {
    _id: "",
    name: "",
    description: "",
    details: "",
    ingredients: "",
    available: true,
    quick_add: false,
    price: 1000,
    discount: false,
    discount_price: 1000,
    discount_label: "-20%",
    attribute_groups: [],
    tags: [],
    category: "",
    media_url: "",
    preview_url: "",
    item_version: "",
  };

  return item;
};

export const initAttribute = (): ItemAttribute => {
  return {
    _id: "",
    name: "Name",
    price: 200,
    media_url: "",
    unique_tag: "tag",
    available: true,
  };
};

export const initIIAG = (): InputItemAttributeGroup => {
  const group: InputItemAttributeGroup = {
    with_media: true,
    name: "",
    description: "",
    rules: {
      group_min: 0,
      group_max: 1,
      attribute_max: 1,
    },
    attributes: [],
  };

  return group;
};
