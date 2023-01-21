import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import {
  fetchAttributes,
  updateLocalAttribute,
} from "../../app/store-slices/attributes-slice";
import { setToastState } from "../../app/store-slices/app-slice";
import {
  createAttribute,
  deleteAttribute,
  updateAttribute,
} from "../../app/services/items-api";
import { ItemAttribute } from "../../models/item";
import "./attribute-card.css";

import { Button, Typography } from "antd";
import { CloseOutlined, DeleteFilled } from "@ant-design/icons";
import ImageInput, { ImageInputData } from "../image-input/image-input";
import { uploadImageToS3 } from "../../app/services/storage-api";

const { Paragraph } = Typography;

const AttributeCard: React.FC<{
  attribute: ItemAttribute;
  isNew: boolean;
  onEditingDone?: () => void;
}> = ({ attribute, isNew, onEditingDone }) => {
  const [isEditing, setIsEditing] = useState<boolean>(isNew);
  const [price, setPrice] = useState<string>(
    `€${(attribute.price / 1000).toFixed(2)}`
  );
  const [name, setName] = useState<string>(attribute.name);
  const [tag, setTag] = useState<string>(attribute.unique_tag);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [smallImage, setSmallImage] = useState<ImageInputData | undefined>();
  const [imagesUpdated, setImageUpdated] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isNew) {
      setSmallImage({ type: "image/jpg", base64: attribute.media_url });
    }
  }, [attribute]);

  const onStatusChange = async (status: boolean) => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    const updatedAttribute = await updateAttribute(attribute._id, {
      available: status,
    });

    if (updatedAttribute) {
      dispatch(
        updateLocalAttribute({
          attributeID: attribute._id,
          update: { available: status },
        })
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

  const onSave = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    let smallUrl: string | null = null;
    if (imagesUpdated && smallImage) {
      smallUrl = await uploadImageToS3(smallImage.base64, smallImage.type);
    }

    const updatedVersion = {
      name: name,
      price: Number(price.replace("€", "")) * 1000,
      available: attribute.available,
      unique_tag: tag,
      media_url: imagesUpdated ? smallUrl : attribute.media_url,
    };

    if (!isNew) {
      const updatedAttribute = await updateAttribute(
        attribute._id,
        updatedVersion
      );

      if (updatedAttribute) {
        dispatch(
          updateLocalAttribute({
            attributeID: attribute._id,
            update: { ...updateAttribute },
          })
        );
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
            message: "Could not update the item's status",
          })
        );
      }
    } else {
      const response = await createAttribute(updatedVersion);

      if (response.status === 200) {
        dispatch(fetchAttributes());
        dispatch(
          setToastState({
            isOpen: true,
            message: "The item was created successfully",
          })
        );

        if (onEditingDone) {
          onEditingDone();
        }
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
    setIsEditing(false);
  };

  const onDelete = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    const deleteConfirmation = window.confirm(
      "Are you sure you want to delete the item?"
    );

    if (deleteConfirmation) {
      const response = await deleteAttribute(attribute._id);

      if (response.status === 200) {
        dispatch(fetchAttributes());
        dispatch(
          setToastState({
            isOpen: true,
            message: "The item was deleted successfully",
          })
        );
      } else {
        dispatch(
          setToastState({
            isOpen: true,
            message: response.message || "We could not delete the attribute",
          })
        );
      }
    }

    setIsLoading(false);
    setIsEditing(false);
  };

  return (
    <div className="attributecard-content">
      <div
        className={
          !attribute.available ? "attributecard-content-notavailable" : ""
        }
      >
        <div
          className={`attributecard-image-content ${
            !attribute.available
              ? "attributecard-image-content-notavailable"
              : ""
          }`}
          onClick={(event) => {
            if (!isEditing) {
              event.preventDefault();
            }
          }}
        >
          <ImageInput
            data={smallImage}
            onSet={(data) => {
              setSmallImage(data);
              setImageUpdated(true);
            }}
            options={{ info: "200x200 JPG" }}
          />
        </div>
        <Paragraph
          editable={isEditing ? { onChange: setPrice } : false}
          style={{
            margin: "10px 2px 0px 2px",
            fontSize: "15px",
            fontWeight: "600",
          }}
        >
          {price}
        </Paragraph>
        <Paragraph
          editable={isEditing ? { onChange: setName } : false}
          style={{
            margin: "4px 2px 0px 2px",
            fontSize: "15px",
            fontWeight: "400",
          }}
        >
          {name}
        </Paragraph>
        <Paragraph
          editable={isEditing ? { onChange: setTag } : false}
          style={{
            margin: "4px 2px 0px 2px",
            fontSize: "12x",
            fontWeight: "400",
            color: "#b0b0b0",
          }}
        >
          {tag}
        </Paragraph>
      </div>
      <>
        <Button.Group size="small" style={{ width: "100%", marginTop: "10px" }}>
          {!isEditing ? (
            <React.Fragment>
              <Button
                onClick={() => setIsEditing(true)}
                type="default"
                style={{ width: "30%" }}
              >
                Edit
              </Button>
              <Button
                onClick={() => onStatusChange(!attribute.available)}
                danger={attribute.available}
                loading={isLoading}
                type="dashed"
                style={{ width: "70%" }}
              >
                {!attribute.available ? "Enable" : "Disable"}
              </Button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Button
                onClick={() => {
                  setIsEditing(false);

                  if (onEditingDone) {
                    onEditingDone();
                  }
                }}
                type="default"
                style={{ width: "20%" }}
                icon={
                  <CloseOutlined
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                    }}
                  />
                }
              />
              {!isNew && (
                <Button
                  onClick={onDelete}
                  loading={isLoading}
                  type="default"
                  style={{ width: "25%" }}
                  icon={
                    <DeleteFilled
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                      }}
                    />
                  }
                />
              )}
              <Button
                onClick={onSave}
                loading={isLoading}
                type="default"
                style={{ width: isNew ? "80%" : "55%" }}
              >
                {isNew ? "Create" : "Save"}
              </Button>
            </React.Fragment>
          )}
        </Button.Group>
      </>
    </div>
  );
};

export default AttributeCard;
