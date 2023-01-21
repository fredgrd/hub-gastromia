import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { uploadImageToS3 } from "../../app/services/storage-api";
import AuthProtect from "../auth-protect/auth-protect";

import {
  updateItem,
  fetchItem,
  createItem,
  deleteItem,
} from "../../app/services/items-api";
import { initItem, Item, ItemAttributeGroup } from "../../models/item";
import "./item-details.css";

import {
  Button,
  Input,
  InputNumber,
  Space,
  Typography,
  Tabs,
  Checkbox,
  Popconfirm,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import ImageInput, { ImageInputData } from "../image-input/image-input";
import AttributeGroup from "./item-attribute-group";
import { setToastState } from "../../app/store-slices/app-slice";

const { Title, Text, Paragraph } = Typography;

interface TabType {
  key: string;
  label: string;
}

const ItemDetails: React.FC = () => {
  const [item, setItem] = useState<Item>(initItem());
  const [tabs, setTabs] = useState<TabType[]>([]);
  const [tabKey, setTabKey] = useState<number>(0);
  const [bigImage, setBigImage] = useState<ImageInputData | undefined>();
  const [smallImage, setSmallImage] = useState<ImageInputData | undefined>();
  const [imagesUpdated, setImageUpdated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    if (id !== "new") {
      fetch();
    }
  }, [id]);

  const fetch = async () => {
    const fetchedItem = await fetchItem(id || "");

    if (fetchedItem) {
      setItem(fetchedItem);

      //   // Set images data
      setBigImage({
        type: "image/jpg",
        base64: fetchedItem.media_url,
      });
      setSmallImage({ type: "image/jpg", base64: fetchedItem.preview_url });

      //   // Set the attribute groups tabs
      const tabs: TabType[] = fetchedItem.attribute_groups.map(
        (group, idx) => ({
          key: String(idx),
          label: group.name,
        })
      );
      setTabs(tabs);
    }
  };

  const onChange = (value: {}) => {
    const updatedItem = { ...item, ...value };

    setItem(updatedItem);
  };

  const addAttributeGroup = () => {
    const attributeGroup: ItemAttributeGroup = {
      _id: "",
      name: "New group",
      description: "",
      with_media: false,
      rules: {
        group_min: 0,
        group_max: 1,
        attribute_max: 1,
      },
      attributes: [],
    };
    const updatedItem = { ...item };
    updatedItem.attribute_groups.push(attributeGroup);
    setItem(updatedItem);
    const tabs: TabType[] = updatedItem.attribute_groups.map((group, idx) => ({
      key: String(idx),
      label: group.name,
    }));
    setTabs(tabs);
  };

  const updateGroup = (index: number, group: ItemAttributeGroup) => {
    if (item.attribute_groups.length < index + 1) {
      return;
    }
    const updatedItem = { ...item };
    updatedItem.attribute_groups[index] = group;
    const tabs: TabType[] = updatedItem.attribute_groups.map((group, idx) => ({
      key: String(idx),
      label: group.name,
    }));
    setTabs(tabs);
    setItem(updatedItem);
  };

  const deleteGroup = (index: number) => {
    if (item.attribute_groups.length < index + 1) {
      return;
    }
    const updatedItem = { ...item };
    updatedItem.attribute_groups.splice(index, 1);
    const tabs: TabType[] = updatedItem.attribute_groups.map((group, idx) => ({
      key: String(idx),
      label: group.name,
    }));
    setTabs(tabs);
    setTabKey(tabKey - 1 >= 0 ? tabKey - 1 : 0);
    setItem(updatedItem);
  };

  const onSave = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    // Check if images should be uploaded
    if (!bigImage || !smallImage) {
      dispatch(
        setToastState({
          isOpen: true,
          message: "You must add both item images!",
        })
      );
      setIsLoading(false);
      return;
    }

    let bigUrl: string | null = null;
    let smallUrl: string | null = null;
    if (imagesUpdated) {
      bigUrl = await uploadImageToS3(bigImage.base64, bigImage.type);
      smallUrl = await uploadImageToS3(smallImage.base64, smallImage.type);
    }

    // Make a deep copy of the item to use if save is successfull
    const deepItem: Item = JSON.parse(JSON.stringify(item));

    const attributedGroups = deepItem.attribute_groups.map((attGroup) => {
      const attributes = attGroup.attributes.map((e) => e._id);
      return {
        name: attGroup.name,
        description: attGroup.description,
        with_media: attGroup.with_media,
        rules: attGroup.rules,
        attributes: attributes,
      };
    });

    const updatedVersion = {
      name: deepItem.name,
      description: deepItem.description,
      details: deepItem.details,
      ingredients: deepItem.ingredients,
      available: deepItem.available,
      quick_add: deepItem.quick_add,
      price: deepItem.price,
      discount: deepItem.discount,
      discount_price: deepItem.discount_price,
      discount_label: deepItem.discount_label,
      attribute_groups: attributedGroups,
      tags: deepItem.tags,
      category: deepItem.category,
      media_url: bigUrl ? bigUrl : deepItem.media_url,
      preview_url: smallUrl ? smallUrl : deepItem.media_url,
    };

    if (id !== "new") {
      const updatedItem = await updateItem(item._id, updatedVersion);

      if (updatedItem) {
        dispatch(
          setToastState({
            isOpen: true,
            message: "The item was updated successfully",
          })
        );
      } else {
        dispatch(
          setToastState({
            isOpen: true,
            message: "We could not update the item",
          })
        );
      }
    }

    if (id === "new") {
      const response = await createItem(updatedVersion);

      if (response.status === 200) {
        dispatch(
          setToastState({
            isOpen: true,
            message: "The item was created successfully",
          })
        );

        navigate("/hub/items");
      } else {
        dispatch(
          setToastState({
            isOpen: true,
            message: response.message || "We could not create the item",
          })
        );
      }
    }

    setIsLoading(false);
  };

  const onDelete = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    const response = await deleteItem(item._id);

    if (response.status === 200) {
      dispatch(
        setToastState({
          isOpen: true,
          message: "The item was deleted successfully",
        })
      );

      navigate("/hub/items");
    } else {
      dispatch(
        setToastState({
          isOpen: true,
          message: response.message || "We could not delete the item",
        })
      );
    }

    setIsLoading(false);
  };

  return (
    <AuthProtect>
      <div className="itemdetails">
        <div className="itemdetails-header">
          <Popconfirm
            title="Are you sure you want to close this page?"
            onConfirm={() => navigate(-1)}
            placement="bottomLeft"
          >
            <Button>Back</Button>
          </Popconfirm>
          <div style={{ display: "flex", gap: "24px" }}>
            {id && id !== "new" ? (
              <Popconfirm
                title="Are you sure you want to delete this item?"
                onConfirm={onDelete}
                placement="bottomRight"
              >
                <Button danger>Delete</Button>
              </Popconfirm>
            ) : null}
            <Button type="primary" onClick={onSave} loading={isLoading}>
              {id === "new" ? "Create" : "Save"}
            </Button>
          </div>
        </div>

        <div className="itemdetails-content">
          <div className="itemdetails-productinfo">
            <div>
              <Title level={5}>Product details</Title>
            </div>

            <div className="itemdetails-productinfo-inputs">
              <div className="itemdetails-productinfo-imageinput">
                <div className="itemdetails-productinfo-imageinput-bigimage">
                  <ImageInput
                    data={bigImage}
                    onSet={(data) => {
                      setBigImage(data);
                      setImageUpdated(true);
                    }}
                    options={{ info: "1080x1080 JPG" }}
                  />
                </div>

                <div className="itemdetails-productinfo-imageinput-smallimage">
                  <ImageInput
                    data={smallImage}
                    onSet={(data) => {
                      setSmallImage(data);
                      setImageUpdated(true);
                    }}
                    options={{ info: "200x200 JPG" }}
                  />
                </div>
              </div>

              <div className="itemdetails-productinfo-datainputs">
                <div className="itemdetails-productinfo-datainputs-basics">
                  <div>
                    <Text>Name</Text>
                    <Input
                      placeholder="Add a name (Required)"
                      style={{ marginTop: "4px" }}
                      value={item.name}
                      onChange={(event) =>
                        onChange({ name: event.target.value })
                      }
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
                      value={item.description}
                      onChange={(event) =>
                        onChange({ description: event.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Text>Ingredients</Text>
                    <TextArea
                      style={{
                        height: 60,
                        resize: "none",
                        marginTop: "4px",
                      }}
                      placeholder="List the ingredients, ex: Riso, gamberi, avocado"
                      value={item.ingredients}
                      onChange={(event) =>
                        onChange({ ingredients: event.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Text>Details</Text>
                    <TextArea
                      style={{
                        height: 96,
                        resize: "none",
                        marginTop: "4px",
                      }}
                      placeholder="Add some details"
                      value={item.details}
                      onChange={(event) =>
                        onChange({ details: event.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="itemdetails-productinfo-datainputs-basics">
                  <div>
                    <Text>Category</Text>
                    <Input
                      placeholder="Add the category (Required)"
                      style={{ marginTop: "4px" }}
                      value={item.category}
                      onChange={(event) =>
                        onChange({ category: event.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Text>Tags</Text>
                    <TextArea
                      style={{
                        height: 60,
                        resize: "none",
                        marginTop: "4px",
                      }}
                      placeholder="List the tags, ex: drinks, fresh (comma separated w/ space) (Required)"
                      value={item.tags.join(", ")}
                      onChange={(event) =>
                        onChange({ tags: event.target.value.split(", ") })
                      }
                    />
                  </div>

                  <div>
                    <Text>Price & Discount</Text>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <InputNumber
                        style={{
                          marginTop: "4px",
                        }}
                        addonBefore="Price"
                        min={1}
                        max={10000}
                        placeholder="Add a price (Required)"
                        value={item.price / 1000}
                        onChange={(value) =>
                          onChange({ price: (value || 1) * 1000 })
                        }
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "6px",
                    }}
                  >
                    <div>
                      <Checkbox
                        checked={item.discount}
                        onClick={() => onChange({ discount: !item.discount })}
                      >
                        Discounted
                      </Checkbox>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <InputNumber
                      style={{}}
                      addonBefore="Discount"
                      min={1}
                      max={10000}
                      placeholder="Add a discounted price (Required)"
                      value={item.discount_price / 1000}
                      onChange={(value) =>
                        onChange({ discount_price: (value || 1) * 1000 })
                      }
                    />
                  </div>

                  <div>
                    <Text>Discount label</Text>
                    <Input
                      placeholder="-20% (Required)"
                      style={{ marginTop: "4px" }}
                      value={item.discount_label}
                      onChange={(event) =>
                        onChange({ discount_label: event.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="itemdetails-productinfo-datainputs-basics">
                  <div>
                    <Text>Mechanics</Text>
                    <Paragraph copyable style={{ marginTop: "8px" }} italic>
                      {item._id.length ? item._id : "New item"}
                    </Paragraph>
                    <Space direction="vertical" style={{ marginTop: "4px" }}>
                      <Text>Item is available</Text>
                      <Checkbox
                        checked={item.available}
                        onClick={() => onChange({ available: true })}
                      >
                        Yes
                      </Checkbox>

                      <Checkbox
                        checked={!item.available}
                        onClick={() => onChange({ available: false })}
                      >
                        No
                      </Checkbox>

                      <Text>Show quick add button</Text>

                      <Checkbox
                        checked={item.quick_add}
                        onClick={() => onChange({ quick_add: true })}
                      >
                        Yes
                      </Checkbox>

                      <Checkbox
                        checked={!item.quick_add}
                        onClick={() => onChange({ quick_add: false })}
                      >
                        No
                      </Checkbox>
                    </Space>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="itemdetails-attributegroups">
            <div>
              <Title level={5}>Attribute groups</Title>
            </div>
            <div className="itemdetails-attributegroups-tabs">
              <Tabs
                activeKey={String(tabKey)}
                tabBarExtraContent={
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={addAttributeGroup}
                  >
                    Group
                  </Button>
                }
                items={tabs}
                onChange={(key) => setTabKey(Number(key))}
              />
            </div>

            {item.attribute_groups.length &&
            item.attribute_groups.length >= tabKey + 1 ? (
              <AttributeGroup
                tabKey={tabKey}
                group={item.attribute_groups[tabKey]}
                updateGroup={updateGroup}
                deleteGroup={deleteGroup}
              />
            ) : null}
          </div>
        </div>
      </div>
    </AuthProtect>
  );
};

export default ItemDetails;
