export interface CartItemAttributeSnapshot {
  group_id: string;
  attribute_id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface CartItemSnapshot {
  _id?: string | undefined;
  item_id: string;
  name: string;
  preview_url: string;
  attributes_snapshot: CartItemAttributeSnapshot[];
  quantity: number;
  price: number;
}
