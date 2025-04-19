/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Text,
  Group,
  Title,
  Badge,
  Divider,
  TextInput,
  Stack,
} from "@mantine/core";
import "tailwindcss/tailwind.css";
import ItemDimensions from "@/components/ItemDimensions";
import { formatDate, formatTime } from "@/api/DateAndTime/format";
import DateTime from "@/components/fields/DateTime";
import { Button, Chip, Image } from "@heroui/react";
import { updateDoc } from "@/api/firebase/functions/upload";
import PdfButton from "@/components/PdfButton";
import { PaidTwoTone } from "@mui/icons-material";
import { sendCustomNotification } from "@/server/sendCustomNotification";
import useAdminContext from "@/context/AdminProvider";
import JourneyDetails from "@/components/common/JourneyDetails";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-select";

export default function InvoicesDetails({ invoice, admin, onClose }) {
  const { allDrivers, loading } = useAdminContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    contact: invoice?.contact || "",
    userEmail: invoice?.userEmail || "",
    userName: invoice?.userName || "",
    service: invoice?.service || "",
    date: invoice?.date || "",
    time: invoice?.time || "",
    address: invoice?.address || "",
    deliveryIns: invoice?.deliveryIns || "",
    pickupReference1: invoice?.pickupReference1 || "",
    internalReference: invoice?.internalReference || "",
    pickupCompanyName: invoice?.pickupCompanyName || "",
    dropCompanyName: invoice?.dropCompanyName || "",
    pickupPhone: invoice?.pickupPhone || "",
    deliveryPhone: invoice?.deliveryPhone || "",
    payment: invoice?.payment || "",
  });

  useEffect(() => {
    if (invoice.isNew === true) {
      updateDoc("place_bookings", invoice.docId, { ...invoice, isNew: false });
    }
  }, [updateDoc]);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };
  const handleChangeAddressLabel = (field) => (event) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [field]: {
          ...formData.address[field],
          label: event.target.value,
        },
      },
    });
  };

  const handleDateChange = (name, val) =>
    setFormData({ ...formData, [name]: val });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const newChangedFields = Object.keys(formData).filter(
        (key) => invoice[key] !== formData[key] && !key.includes("payment")
      );

      const updatedChangedFields = newChangedFields;

      const driverDetails = allDrivers.find(
        (d) => d.email === invoice.driverEmail
      );

      if (driverDetails)
        sendCustomNotification(
          driverDetails.expoPushToken,
          `${invoice.id} Booking Update`,
          "Your bookings details have been updated."
        );

      const update = {
        ...invoice,
        ...formData,
        changedFields: updatedChangedFields,
      };

      console.log({ updatedChangedFields });

      await updateDoc("place_bookings", invoice.docId, update);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      onClose;
    }
  };

  const renderSuburbs = () => {
    const suburbs = invoice?.distanceData?.suburbs;

    if (!suburbs || !suburbs.length) return null;

    const originSuburbs = suburbs.filter((s) => s.type === "origin");
    const deliverySuburbs = suburbs.filter((s) => s.type === "destination");

    const renderList = (items, offset = 0) =>
      items.map((suburbData, index) => {
        const letter = String.fromCharCode(65 + index + offset); // A, B, C...
        return (
          <div key={letter} className="flex items-start   py-1">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-700">
              {letter}
            </div>
            <div>
              <span className="font-medium">{suburbData.suburb}</span>{" "}
            </div>
          </div>
        );
      });

    return (
      <div className="overflow-hidden ">
        {originSuburbs.length > 0 && (
          <div className="p-4">
            <Text className="font-semibold"> Pickup Suburbs</Text>
            <div>{renderList(originSuburbs)}</div>
          </div>
        )}

        {originSuburbs.length > 0 && deliverySuburbs.length > 0 && (
          <Separator />
        )}

        {deliverySuburbs.length > 0 && (
          <div className="p-4">
            <Text className="font-semibold"> Delivery Suburbs</Text>
            <div>{renderList(deliverySuburbs, originSuburbs.length)}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen flex justify-center items-center">
        <Card shadow="lg" padding="lg" className="w-full max-w-4xl">
          <Stack spacing="md">
            {formData?.payment === "paid" && (
              <Group grow wrap="nowrap" align="flex-end">
                <Text className="font-semibold">Payment</Text>
                <Text>
                  <PaidTwoTone className="text-green-500 mb-1" /> Paid via card
                </Text>
              </Group>
            )}
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Job No.</Text>
              <Text>{invoice.docId}</Text>
            </Group>
            {/* <JourneyDetails invoice={invoice} /> */}
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Service:</Text>
              <Group grow wrap="nowrap" align="flex-end">
                <Badge color="teal" variant="light" size="lg">
                  {formData.service}
                </Badge>
                <Chip size="sm" color="danger">
                  <PdfButton size="xs" invoice={invoice} />
                </Chip>
              </Group>
            </Group>
            {renderSuburbs()}
            <Divider my="sm" />
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Pickup Company Name :</Text>
              <TextInput
                value={formData?.pickupCompanyName}
                onChange={handleChange("pickupCompanyName")}
                className="w-64"
              />
            </Group>
            {formData?.address?.useMultipleAddresses ? (
              formData?.address?.MultipleOrigin?.map((item, index) => (
                <Group key={index} grow wrap="nowrap" align="flex-end">
                  <Text className="font-semibold">
                    Pickup Address {String.fromCharCode(65 + index)}:
                  </Text>
                  <TextInput value={item?.label} className="w-64" />
                </Group>
              ))
            ) : (
              <Group grow wrap="nowrap" align="flex-end">
                <Text className="font-semibold">Pickup Address:</Text>
                <TextInput
                  value={formData.address.Origin.label}
                  onChange={handleChangeAddressLabel("Origin")}
                  className="w-64"
                />
              </Group>
            )}
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Pickup Reference:</Text>
              <TextInput
                value={formData.pickupReference1}
                onChange={handleChange("pickupReference1")}
                className="w-64"
              />
            </Group>{" "}
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Pickup Phone:</Text>
              <TextInput
                value={formData.pickupPhone}
                onChange={handleChange("pickupPhone")}
                className="w-64"
              />
            </Group>
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Delivery Company Name:</Text>
              <TextInput
                value={formData?.dropCompanyName}
                onChange={handleChange("dropCompanyName")}
                className="w-64"
              />
            </Group>
            {formData?.address?.useMultipleAddresses ? (
              formData?.address?.MultipleDestination?.map((item, index) => (
                <Group key={index} grow wrap="nowrap" align="flex-end">
                  <Text className="font-semibold">
                    Delivery Address {String.fromCharCode(65 + index)}:
                  </Text>
                  <TextInput value={item?.label} className="w-64" />
                </Group>
              ))
            ) : (
              <Group grow wrap="nowrap" align="flex-end">
                <Text className="font-semibold">Delivery Address:</Text>
                <TextInput
                  value={formData?.address?.Destination?.label}
                  onChange={handleChangeAddressLabel("Destination")}
                  className="w-64"
                />
              </Group>
            )}
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Delivery Instruction:</Text>
              <TextInput
                value={formData.deliveryIns}
                onChange={handleChange("deliveryIns")}
                className="w-64"
              />
            </Group>
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Delivery Phone:</Text>
              <TextInput
                value={formData.deliveryPhone}
                onChange={handleChange("deliveryPhone")}
                className="w-64"
              />
            </Group>
            <Divider my="sm" />
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">User Name:</Text>
              <Text>{formData.userName}</Text>
            </Group>
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Email:</Text>
              <Text>{invoice.userEmail}</Text>
            </Group>
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Contact:</Text>
              <TextInput
                value={formData.contact}
                onChange={handleChange("contact")}
                className="w-64"
              />
            </Group>
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Internal Reference:</Text>
              <TextInput
                value={formData.internalReference}
                onChange={handleChange("internalReference")}
                className="w-64"
              />
            </Group>
            <Divider my="sm" />
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Job Type:</Text>
              <Text>{invoice.returnType}</Text>
            </Group>
            {invoice?.serviceCharges !== 0 && invoice?.serviceCharges ? (
              <Group grow wrap="nowrap" align="flex-end">
                <Text className="font-semibold">Service Charges:</Text>
                <Text>${Number(invoice?.serviceCharges)?.toFixed(2)}</Text>
              </Group>
            ) : null}
            {invoice?.WaitingTimeAtPickup ? (
              <Group grow wrap="nowrap" align="flex-end">
                <Text className="font-semibold">Waiting time at pickup:</Text>
                <span className="flex justify-between">
                  <Text>
                    ${Number(invoice?.WaitingTimeAtPickup)?.toFixed(2)}
                  </Text>
                  <Text> {invoice?.WaitingTimeAtPickupDescription}</Text>
                </span>
              </Group>
            ) : null}
            {invoice?.WaitingTimeAtDrop ? (
              <Group grow wrap="nowrap" align="flex-end">
                <Text className="font-semibold">Waiting time at drop off:</Text>
                <span className="flex justify-between">
                  <Text>${Number(invoice?.WaitingTimeAtDrop)?.toFixed(2)}</Text>
                  <Text> {invoice?.WaitingTimeAtDropDescription} </Text>
                </span>
              </Group>
            ) : null}
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Tolls:</Text>
              <Text>${Number(invoice.totalTollsCost)?.toFixed(2)}</Text>
            </Group>
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Price:</Text>
              <Text>${Number(invoice.totalPrice)?.toFixed(2)}</Text>
            </Group>
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Gst:</Text>
              <Text>${Number(invoice.gst)?.toFixed(2)}</Text>
            </Group>
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Total Price with GST:</Text>
              <Text>
                $
                {(
                  Number(invoice.totalPriceWithGST) +
                  Number(invoice?.totalTollsCost || 0)
                )?.toFixed(2)}
              </Text>
            </Group>
            <Divider my="sm" />
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold hidden sm:block">Date:</Text>
              <div className="flex flex-col min-w-96">
                <Chip color="success">
                  <p className="text-xs text-gray-700 font-semibold">
                    Ready Date: {formData?.date}
                  </p>
                </Chip>
                <span className="text-gray-600 text-xs font-bold mt-6 mb-2 ml-2">
                  Select New Ready Date Here
                </span>
                <DateTime
                  service={formData.service}
                  handle_date={(name, val) =>
                    handleDateChange(name, formatDate(val))
                  }
                  handle_time={(name, val) =>
                    handleDateChange(name, formatTime(val))
                  }
                  handleInvalid={(e) => console.log(e)}
                  admin={true}
                  date={invoice?.date}
                  time={invoice?.time}
                />
              </div>
            </Group>
            <Divider my="sm" />
            <Group>
              <ItemDimensions
                defaultItems={invoice?.items}
                diseble={true}
                add={true}
                admin={admin}
                invoice={invoice}
              />
            </Group>
            <Divider my="sm" />
            {invoice?.signUrl && (
              <Image
                src={invoice?.signUrl}
                alt="POD"
                className="w-60 h-auto my-4 rounded-lg"
              />
            )}
          </Stack>
        </Card>
      </div>
      <Button
        fullWidth
        variant="solid"
        color={isLoading ? "success" : "primary"}
        onPress={handleSubmit}
        isLoading={isLoading}
      >
        Save
      </Button>
      <Divider my="sm" />
    </>
  );
}
