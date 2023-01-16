import React, { useState } from "react";
import {
  CartItemAttributeSnapshot,
  CartItemSnapshot,
} from "../../models/cart-snapshot";
import "./order-details-item.css";

const OrderDetailsItemAttribute: React.FC<{
  attribute: CartItemAttributeSnapshot;
}> = ({ attribute }) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  return (
    <div
      className="orderdetailsitem-item-attribute"
      style={{
        backgroundColor: isSelected ? "#343537" : "#f6f7f8",
        color: isSelected ? "white" : "#343537",
      }}
      onClick={() => setIsSelected((selected) => !selected)}
    >
      <span className="orderdetailsitem-item-attribute-name">
        {attribute.name}{" "}
        <span style={{ fontWeight: 600 }}>x{attribute.quantity}</span>
      </span>
    </div>
  );
};

const OrderDetailsItem: React.FC<{ item: CartItemSnapshot }> = ({ item }) => {
  return (
    <div className="orderdetailsitem">
      <div className="orderdetailsitem-count-content">
        <span className="orderdetailsitem-count">{item.quantity}</span>
      </div>

      <div className="orderdetailsitem-item-content">
        <div className="orderdetailsitem-item-info">
          <img className="orderdetailsitem-item-img" src={item.preview_url} />
          <span className="orderdetailsitem-item-name">{item.name}</span>
        </div>

        <div className="orderdetailsitem-item-attributes">
          {item.attributes_snapshot.map((attribute, idx) => (
            <OrderDetailsItemAttribute attribute={attribute} key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsItem;
