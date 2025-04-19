"use client";

import { useState } from "react";
import { TextField, InputAdornment, Box, MenuItem } from "@mui/material";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Table } from "@mantine/core";
import { goodsDescriptionOption } from "../static";
import DimensionsTable from "./DimensionsTable";
import { Button } from "@heroui/react";

export default function ItemDimensions({
  handleItems,
  defaultItems,
  diseble,
  add,
  admin,
  invoice,
}) {
  const initForm = {
    weight: "",
    height: "",
    width: "",
    length: "",
    type: "",
    qty: "",
  };

  const [items, setItems] = useState(defaultItems || []);
  const [opened, { open, close }] = useDisclosure(false);
  const [formData, setFormData] = useState(initForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name !== "weight" && parseInt(value) > 1000) {
      setFormData({ ...formData, [name]: 1000 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = () => {
    if (
      !formData.weight ||
      !formData.height ||
      !formData.width ||
      !formData.length ||
      !formData.type ||
      !formData.qty
    ) {
      alert("Please fill in all fields");
      return;
    }

    close();

    const newItem = {
      weight: formData.weight,
      height: formData.height,
      width: formData.width,
      length: formData.length,
      type: formData.type,
      qty: formData.qty,
    };

    setItems((prevItems) => [...prevItems, newItem]);
    setFormData(initForm);
    handleItems([...items, newItem]); // It seems redundant to call setItems and handleItems with the same value. Consider removing one of them.
  };

  const handleDelete = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
    handleItems(updatedItems); // It seems redundant to call setItems and handleItems with the same value. Consider removing one of them.
  };

  return (
    <>
      {!add ? (
        <Button
          mt={35}
          fullWidth
          variant="solid"
          color="primary"
          onClick={open}
        >
          Add Item
        </Button>
      ) : null}
      <Modal opened={opened} onClose={close} title="New item" centered>
        <br />
        <Box>
          <TextField
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">kg</InputAdornment>
              ),
            }}
            type="number"
            fullWidth
            style={{ marginBottom: ".5rem" }}
            label="Weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
          />
          <TextField
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">cm</InputAdornment>
              ),
            }}
            type="number"
            fullWidth
            style={{ marginBottom: ".5rem" }}
            label="Length"
            name="length"
            value={formData.length}
            onChange={handleChange}
          />

          <TextField
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">cm</InputAdornment>
              ),
            }}
            type="number"
            fullWidth
            style={{ marginBottom: ".5rem" }}
            label="Width"
            name="width"
            value={formData.width}
            onChange={handleChange}
          />
          <TextField
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">cm</InputAdornment>
              ),
            }}
            type="number"
            fullWidth
            style={{ marginBottom: ".5rem" }}
            label="Height"
            name="height"
            value={formData.height}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            name="type"
            select
            size="small"
            label="Item Type"
            helperText="Please select the type of your item"
            variant="outlined"
            value={formData.type}
            onChange={handleChange}
          >
            {goodsDescriptionOption &&
              goodsDescriptionOption.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.value}
                </MenuItem>
              ))}
          </TextField>
          <br />
          <br />
          <TextField
            type="number"
            fullWidth
            style={{ marginBottom: ".5rem" }}
            label="Quantity"
            name="qty"
            value={formData.qty}
            onChange={handleChange}
          />
        </Box>
        <Button
          fullWidth
          color="primary"
          variant="solid"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Modal>
      <DimensionsTable
        items={items}
        handleDelete={handleDelete}
        diseble={diseble}
        admin={admin}
        invoice={invoice}
      />
    </>
  );
}
