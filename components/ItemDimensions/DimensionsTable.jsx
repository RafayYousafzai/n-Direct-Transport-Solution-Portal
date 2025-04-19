"use client";

import { NumberInput, Table } from "@mantine/core";
import { IconButton } from "@mui/material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import { useEffect, useState } from "react";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import { updateDoc } from "@/api/firebase/functions/upload";
import { Button } from "@heroui/react";

export default function DimensionsTable({
  items,
  handleDelete,
  diseble,
  admin = false,
  invoice,
}) {
  const initForm = {
    weight: "",
    height: "",
    width: "",
  };

  useEffect(() => {
    setAllItems(items);
  }, [items]);

  const [input, setInput] = useState({ state: false, index: 0, saved: true });
  const [allItems, setAllItems] = useState(items);
  const [formData, setFormData] = useState(initForm);

  useEffect(() => {
    handleSave();
  }, [allItems]);

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    margin: "1rem 0",
  };

  const tableHeaderCellStyle = {
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #e0e0e0",
    padding: "5px",
    fontWeight: 600,
  };

  const handleAddNewDimensions = async () => {
    const updatedItems = [...allItems];
    updatedItems[input.index] = {
      ...updatedItems[input.index],
      dimensionsAD: formData,
    };
    setAllItems(updatedItems);

    setFormData(initForm);
    setInput({ state: false, index: 0, saved: true });
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      await updateDoc("place_bookings", invoice.docId, {
        ...invoice,
        items: allItems,
      });
      setInput({ state: false, index: 0, saved: true });
    } catch (error) {
      console.error("Error saving dimensions:", error);
    }
  };

  return (
    <>
      <Table style={tableStyle}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={tableHeaderCellStyle}>Weight</Table.Th>
            <Table.Th style={tableHeaderCellStyle}>Dimensions</Table.Th>
            {((items?.length > 0 && items[0]?.dimensionsAD) || admin) && (
              <Table.Th style={tableHeaderCellStyle}>
                Correct dimensions
                {!input.saved && (
                  <IconButton onClick={handleSave} color="success">
                    <CheckCircleTwoToneIcon />
                  </IconButton>
                )}
              </Table.Th>
            )}
            <Table.Th style={tableHeaderCellStyle}>Type</Table.Th>
            <Table.Th style={tableHeaderCellStyle}>Qty</Table.Th>
            {diseble ? null : (
              <Table.Th style={tableHeaderCellStyle}>Delete</Table.Th>
            )}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {allItems?.map((item, index) => (
            <Table.Tr key={index}>
              <Table.Td>{item.weight}</Table.Td>
              <Table.Td>
                {item.length} x {item.width} x {item.height} cm
              </Table.Td>

              {item?.dimensionsAD ? (
                <Table.Td c={"red"}>
                  {item.dimensionsAD.weight || 0} x{" "}
                  {item.dimensionsAD.width || 0} x{" "}
                  {item.dimensionsAD.height || 0} cm
                </Table.Td>
              ) : (
                admin && (
                  <Table.Td>
                    <IconButton
                      onClick={() =>
                        setInput({
                          ...input,
                          state: !input.state,
                          index: index,
                        })
                      }
                      aria-label="add"
                      style={{ marginRight: "1rem" }}
                    >
                      <AddCircleRoundedIcon />
                    </IconButton>
                  </Table.Td>
                )
              )}

              <Table.Td>{item.type}</Table.Td>
              <Table.Td>{item.qty}</Table.Td>
              {diseble ? null : (
                <Table.Td>
                  <IconButton
                    onClick={() => handleDelete(index)}
                    aria-label="delete"
                    style={{ marginRight: "1rem" }}
                  >
                    <HighlightOffRoundedIcon />
                  </IconButton>
                </Table.Td>
              )}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <h5>Total Items {items?.length}</h5>
      {input.state && (
        <>
          <NumberInput
            placeholder="W"
            value={formData.weight}
            onChange={(value) => handleChange("weight", value)}
            min={1}
          />
          <NumberInput
            placeholder="L"
            value={formData.width}
            onChange={(value) => handleChange("width", value)}
            min={1}
          />
          <NumberInput
            placeholder="H"
            value={formData.height}
            onChange={(value) => handleChange("height", value)}
            min={1}
          />
          <Button
            color="primary"
            variant="flat"
            onClick={handleAddNewDimensions}
          >
            Add new dimensions for item {input.index + 1}
          </Button>
        </>
      )}
    </>
  );
}
