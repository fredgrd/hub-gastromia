import React, { useEffect, useState } from "react";
import "./items-page.css";

import ItemCard from "../item-card/item-card";
import { PlusOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchItems, selectItems } from "../../app/store-slices/items-slice";
import { Button, Divider } from "antd";
import { useNavigate } from "react-router-dom";

const ItemsPage: React.FC = () => {
  const [itemsCategory, setItemsCategory] = useState<string[]>([]);
  const items = useAppSelector(selectItems);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchItems());
  }, []);

  useEffect(() => {
    if (items.length) {
      setItemsCategory([...new Set(items.map((item) => item.category))]);
    }
  }, [items]);

  return (
    <div className="itemspage">
      <div className="itemspage-header">
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => navigate("/items/new")}
        >
          Item
        </Button>
      </div>

      <div className="itemspage-products">
        {itemsCategory.map((category, catIdx) => (
          <div className="itemspage-item-category" key={catIdx}>
            <Divider
              orientation="left"
              style={{ fontSize: "26px" }}
              orientationMargin="0"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Divider>

            <div className="itemspage-item-category-items">
              {items
                .filter((e) => e.category === category)
                .map((item, idx) => (
                  <ItemCard item={item} key={idx} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsPage;
