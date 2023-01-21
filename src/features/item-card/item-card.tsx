import React, { useState } from "react";
import { Item } from "../../models/item";
import formatPrice from "../../utils/formatPrice";
import "./item-card.css";

import { useNavigate } from "react-router-dom";

import { Typography, Checkbox, Button } from "antd";
import { updateItem } from "../../app/services/items-api";
import { useAppDispatch } from "../../app/hooks";
import {
  fetchItems,
  updateLocalItem,
} from "../../app/store-slices/items-slice";
import { setToastState } from "../../app/store-slices/app-slice";

const { Text } = Typography;

const ItemCard: React.FC<{
  item: Item;
}> = ({ item }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onStatusChange = async (status: boolean) => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    const updatedItem = await updateItem(item._id, { available: status });

    if (updatedItem) {
      dispatch(
        updateLocalItem({ itemID: item._id, update: { available: status } })
      );
    } else {
      dispatch(
        setToastState({
          isOpen: true,
          message: "Could not update the item's status",
        })
      );
    }

    setIsLoading(false);
  };

  return (
    <div className="itemcard-content">
      <div
        className={!item.available ? "itemcard-content-notavailable" : ""}
        onClick={() => navigate(`/items/${item._id}`)}
      >
        <div
          className={`itemcard-image-content ${
            !item.available ? "itemcard-image-content-notavailable" : ""
          }`}
        >
          <img className="itemcard-image" src={item.media_url} />
          {item.discount ? (
            <div className="itemcard-image-discounttag">
              <span>{item.discount_label}</span>
            </div>
          ) : null}
        </div>
        <div className="itemcard-price-content">
          <div
            className={`itemcard-pricetag ${
              item.discount ? "pricetag-discount" : ""
            }`}
          >
            <span>€</span>
            <span className="itemcard-pricetag-whole">
              {item.discount
                ? formatPrice(item.discount_price).whole
                : formatPrice(item.price).whole}
            </span>
            <span className="itemcard-pricetag-fractional">
              {item.discount
                ? formatPrice(item.discount_price).fractional
                : formatPrice(item.price).fractional}
            </span>
          </div>
          {item.discount ? (
            <div className="itemcard-pricetag-originalprice-content">
              <span className="itemcard-pricetag-originalprice">
                €{(item.price / 1000).toFixed(2)}
              </span>
            </div>
          ) : null}
        </div>
        <span className="itemcard-name">{item.name}</span>
      </div>
      <>
        <Button
          onClick={() => onStatusChange(!item.available)}
          danger={item.available}
          loading={isLoading}
          type="dashed"
          block
          style={{ marginTop: "10px" }}
        >
          {!item.available ? "Enable" : "Disable"}
        </Button>
      </>
    </div>
  );
};

export default ItemCard;
