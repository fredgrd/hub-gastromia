import React, { useEffect, useState } from "react";
import { searchAttributes } from "../../app/services/items-api";
import { ItemAttribute, ItemAttributeGroup } from "../../models/item";
import "./item-attribute-group.css";

import {
  Typography,
  Input,
  InputNumber,
  Divider,
  Checkbox,
  Button,
  Empty,
} from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

const { Text, Paragraph } = Typography;
const { Search } = Input;

const AttributeResult: React.FC<{
  attribute: ItemAttribute;
  onClick: () => void;
  options?: {
    buttonTitle?: string;
    icon?: React.ReactNode;
  };
}> = ({ attribute, onClick, options }) => {
  return (
    <div className="itemattributegroup-attributerow">
      <img
        className="itemattributegroup-attributerow-img"
        src={attribute.media_url}
      />
      <div className="itemattributegroup-attributerow-details">
        <span className="itemattributegroup-attributerow-name">
          {attribute.name}
          <span className="itemattributegroup-attributerow-tag">
            ({attribute.unique_tag})
          </span>
        </span>

        <Paragraph
          copyable
          style={{ margin: "0px", marginLeft: "16px" }}
          italic
        >
          {attribute._id}
        </Paragraph>
      </div>

      <span className="itemattributegroup-attributerow-price">
        €{(attribute.price / 1000).toFixed(2)}
      </span>

      <Button
        type="dashed"
        icon={options?.icon || <PlusOutlined />}
        onClick={onClick}
      >
        {options?.buttonTitle || "Add"}
      </Button>
    </div>
  );
};

const AttributeGroup: React.FC<{
  tabKey: number;
  group: ItemAttributeGroup;
  updateGroup: (index: number, group: ItemAttributeGroup) => void;
  deleteGroup: (index: number) => void;
}> = ({ tabKey, group, updateGroup, deleteGroup }) => {
  const [attributes, setAttributes] = useState<ItemAttribute[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<ItemAttribute[]>(
    []
  );
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    setSelectedAttributes(group.attributes);
  }, [tabKey]);

  const onSearch = async (query: string) => {
    setQuery(query);
    if (!query.length) {
      return;
    }

    setIsSearching(true);
    const result = await searchAttributes(query);

    setIsSearching(false);
    setAttributes(result);
  };

  const addOnClick = (attribute: ItemAttribute) => {
    const selectedIdx = selectedAttributes.findIndex(
      (e) => e._id === attribute._id
    );

    if (selectedIdx === -1) {
      const updatedSelected = [...selectedAttributes, attribute];
      setSelectedAttributes([...updatedSelected]);
      updateGroup(tabKey, { ...group, attributes: updatedSelected });
    }
  };

  const removeOnClick = (attribute: ItemAttribute) => {
    const selectedIdx = selectedAttributes.findIndex(
      (e) => e._id === attribute._id
    );

    if (selectedIdx !== -1) {
      const updatedSelected = [...selectedAttributes];
      updatedSelected.splice(selectedIdx, 1);
      setSelectedAttributes([...updatedSelected]);
      updateGroup(tabKey, { ...group, attributes: updatedSelected });
    }
  };

  const onChange = (update: {}) => {
    const updatedGroup = { ...group, ...update };
    updateGroup(tabKey, updatedGroup);
  };

  const onDelete = () => {
    const deleteConfirmation = window.confirm(
      "Are you sure you want to delete this group?"
    );

    if (deleteConfirmation) {
      deleteGroup(tabKey);
    }
  };

  return (
    <div className="itemattributegroup">
      <div className="itemattributegroup-content">
        <div className="itemattributegroup-details">
          <div className="itemattributegroup-details-data">
            <div>
              <Text>Group name</Text>
              <Input
                placeholder="Add a name (Required)"
                style={{ marginTop: "4px" }}
                value={group.name}
                onChange={(event) => onChange({ name: event.target.value })}
              />
            </div>

            <div>
              <Text>Description</Text>
              <TextArea
                style={{
                  height: 60,
                  resize: "none",
                  marginTop: "4px",
                }}
                placeholder="Add a description (Required)"
                value={group.description}
                onChange={(event) =>
                  onChange({ description: event.target.value })
                }
              />
            </div>
          </div>

          <div className="itemattributegroup-details-data">
            <div>
              <Text>Rules</Text>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <InputNumber
                  style={{
                    marginTop: "4px",
                  }}
                  addonBefore="Group Min"
                  min={0}
                  max={10000}
                  placeholder="Add a minimum (Required)"
                  value={group.rules.group_min}
                  onChange={(value) =>
                    onChange({ rules: { ...group.rules, group_min: value } })
                  }
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <InputNumber
                  style={{
                    marginTop: "19px",
                  }}
                  addonBefore="Group Max"
                  min={1}
                  max={10000}
                  placeholder="Add a Maximum (Required)"
                  value={group.rules.group_max}
                  onChange={(value) =>
                    onChange({ rules: { ...group.rules, group_max: value } })
                  }
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <InputNumber
                  style={{
                    marginTop: "19px",
                  }}
                  addonBefore="Att. Max"
                  min={1}
                  max={10000}
                  placeholder="Add a Maximum (Required)"
                  value={group.rules.attribute_max}
                  onChange={(value) =>
                    onChange({
                      rules: { ...group.rules, attribute_max: value },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="itemattributegroup-withmedia">
          <div>
            <Checkbox
              checked={group.with_media}
              onClick={() => onChange({ with_media: true })}
            >
              Show media
            </Checkbox>
            <Checkbox
              checked={!group.with_media}
              onClick={() => onChange({ with_media: false })}
            >
              Hide media
            </Checkbox>
          </div>
          <Button danger onClick={onDelete}>
            Delete
          </Button>
        </div>

        <div className="itemattributegroup-selectedattributes">
          <Divider orientation="left">Selected attributes</Divider>
          <div className="itemattributegroup-selectedattributes-content">
            {selectedAttributes.map((attribute, idx) => (
              <AttributeResult
                attribute={attribute}
                key={idx}
                onClick={() => removeOnClick(attribute)}
                options={{ buttonTitle: "Remove", icon: <MinusOutlined /> }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="itemattributegroup-search">
        <div className="itemattributegroup-search-bar">
          <Text>Selectable attributes</Text>
          <Search
            style={{ width: "100%", marginTop: "4px" }}
            loading={isSearching}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search for any attribute"
          />
        </div>

        <div className="itemattributegroup-search-results">
          {!attributes.length && query.length > 1 && !isSearching ? (
            <Empty />
          ) : null}
          {attributes.map((attribute, idx) => (
            <AttributeResult
              attribute={attribute}
              key={idx}
              onClick={() => addOnClick(attribute)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttributeGroup;
