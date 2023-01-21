import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchAttributes,
  selectAttributes,
} from "../../app/store-slices/attributes-slice";
import "./attributes-page.css";

import { Button, Divider } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AttributeCard from "../attribute-card/attribute-card";
import { initAttribute } from "../../models/item";

const AttributesPage: React.FC = () => {
  const [attributeTags, setAttributeTags] = useState<string[]>([]);
  const [newAttribute, setNewAttribute] = useState<boolean>(false);
  const attributes = useAppSelector(selectAttributes);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAttributes());
  }, []);

  useEffect(() => {
    if (attributes.length) {
      setAttributeTags([
        ...new Set(attributes.map((attribute) => attribute.unique_tag)),
      ]);
    }
  }, [attributes]);

  return (
    <React.Fragment>
      <div className="attributespage">
        <div className="attributespage-header">
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setNewAttribute(true)}
          >
            Attribute
          </Button>
        </div>

        {newAttribute && (
          <div style={{ marginTop: "24px" }}>
            <AttributeCard
              attribute={initAttribute()}
              isNew={true}
              onEditingDone={() => setNewAttribute(false)}
            />
          </div>
        )}

        <div className="attributespage-products">
          {attributeTags.map((tag, tagIdx) => (
            <div className="attributespage-attribute-tag" key={tagIdx}>
              <Divider
                orientation="left"
                style={{ fontSize: "26px" }}
                orientationMargin="0"
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </Divider>

              <div className="attributespage-attribute-tag-attributes">
                {attributes
                  .filter((e) => e.unique_tag === tag)
                  .map((attribute, idx) => (
                    <AttributeCard
                      attribute={attribute}
                      key={idx}
                      isNew={false}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default AttributesPage;
