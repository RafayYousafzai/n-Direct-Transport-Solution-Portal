"use client";
import ItemDimensions from "@/components/ItemDimensions/index";
import React, { useEffect, useState } from "react";
import { Container, Text, Center } from "@mantine/core";
import { PhotoView } from "react-photo-view";
import { Image } from "@heroui/react";
import JourneyDetails from "@/components/common/JourneyDetails";

const renderSection = (title, details) => (
  <Container size="lg">
    <br />
    <br />
    <Text tt="uppercase" size="xl" fw={900} c="rgba(59, 58, 58, 1)">
      {title || "something went wrong"}
    </Text>
    {details && details.length > 0 ? (
      details
        .filter(({ label, value }) => label && value)
        .map(({ label, value }, index) => (
          <div key={index} className="flex justify-between align-middle ">
            <h4
              style={{
                textTransform: "capitalize",
                fontSize: "lg",
                fontWeight: 700,
                color: "grey",
              }}
            >
              {label}
            </h4>
            <h4
              style={{
                textTransform: "capitalize",
                fontSize: "lg",
                fontWeight: 500,
                maxWidth: "20rem",
              }}
            >
              {value}
            </h4>
          </div>
        ))
    ) : (
      <div>No details available</div>
    )}
  </Container>
);

const InvoiceDetails = ({ invoice, admin }) => {
  const {
    distanceData,
    totalPrice,
    userName,
    time,
    service,
    userEmail,
    date,
    contact,
    docId,
    address,
    serviceCharges,
  } = invoice;

  const [pickupAddress, setPickupAddress] = useState("Empty");
  const [dropAddress, setDropAddress] = useState("Empty");

  useEffect(() => {
    if (address && address.Origin && address.Destination) {
      setPickupAddress(address.Origin.label);
      setDropAddress(address.Destination.label);
    }
  }, [address]);

  const basicInfo = [
    { label: "User Name", value: userName },
    { label: "Time", value: time },
    { label: "Service", value: service },
    {
      label: "Total Price",
      value: invoice?.totalPriceWithGST || 0 + invoice?.totalTollsCost || 0,
    },
    { label: "Date", value: date },
    { label: "Contact", value: contact },
    {
      label: "Internal Reference",
      value: invoice?.internalReference,
    },
    { label: "Job No.", value: docId },
    // { label: "Booking assigned to driver", value: userEmail },
  ];

  const addressInfo = [
    {
      label: "Pickup Company Name",
      value: invoice?.pickupCompanyName,
    },
    { label: "Pickup Address", value: pickupAddress },
    {
      label: "Drop Company Name",
      value: invoice?.dropCompanyName,
    },
    { label: "Drop Address", value: dropAddress },
    { label: "Reference", value: invoice?.pickupReference1 },
    { label: "Delivery Instruction", value: invoice?.deliveryIns },
  ];
  const pricesInfo = [
    ...(invoice?.WaitingTimeAtPickup
      ? [
          {
            label: "Wait Time At Pickup",
            value: `$${Number(invoice?.WaitingTimeAtPickup).toFixed(2)}`,
          },
        ]
      : []),
    ...(invoice?.WaitingTimeAtPickupDescription
      ? [
          {
            label: "Description",
            value: `  ${invoice?.WaitingTimeAtPickupDescription || ""}`,
          },
        ]
      : []),
    ...(invoice?.WaitingTimeAtDrop
      ? [
          {
            label: "Wait Time At Drop off",
            value: `$${Number(invoice?.WaitingTimeAtDrop).toFixed(2)}`,
          },
        ]
      : []),
    ...(invoice?.WaitingTimeAtDropDescription
      ? [
          {
            label: "Description",
            value: `  ${invoice?.WaitingTimeAtDropDescription || ""}`,
          },
        ]
      : []),
    ...(invoice?.serviceCharges
      ? [
          {
            label: "Service Charge",
            value: `$${invoice?.serviceCharges}`,
          },
        ]
      : []),
    {
      label: "Tolls",
      value: `$${invoice?.totalTollsCost || 0}`,
    },
    {
      label: "Price",
      value: `$${invoice?.totalPrice}`,
    },
    {
      label: "GST",
      value: `$${invoice?.gst}`,
    },

    ...(invoice?.driverName
      ? [
          {
            label: "Booking assigned to driver",
            value: invoice?.driverName,
          },
        ]
      : []),
    {
      label: "Price Including GST",
      value: `$${(
        Number(invoice?.totalPriceWithGST) +
        Number(invoice?.totalTollsCost || 0)
      ).toFixed(2)}`,
    },
  ];

  const driverUploadedImages = [
    ...(Array.isArray(invoice?.images) ? invoice.images : []),
    ...(Array.isArray(invoice?.pickupImages) ? invoice.pickupImages : []),
  ].filter((img) => typeof img === "string");
  console.log(invoice);
  

  return (
    <section>
      <Center style={{ fontSize: "2rem", fontWeight: "bolder" }}>
        BOOKING DETAILS
      </Center>
      {renderSection("Basic Information", basicInfo)}
      {!invoice?.address?.useMultipleAddresses &&
        renderSection("Address Information", addressInfo)}
      {renderSection("Prices Information", pricesInfo)}

      <Container size={"xl"}>
        <div className="mx-14">
          <JourneyDetails invoice={invoice} minimal={true} />
        </div>
      </Container>

      <Container size={"lg"}>
        <ItemDimensions
          defaultItems={invoice?.items}
          diseble={true}
          add={true}
          admin={admin}
          invoice={invoice}
        />
        {/* {invoice?.images && ( */}
        <>
          <h2>POD</h2> <h2>Receiver Name: {invoice?.receiverName || ""}</h2>
        </>
        {/* )} */}

        <div className="flex flex-wrap gap-4">
          {invoice?.images &&
            driverUploadedImages.length > 0 &&
            driverUploadedImages.map((item, index) => (
              <PhotoView key={index} src={item}>
                <Image
                  src={item}
                  alt=""
                  className="w-60 h-auto my-4 rounded-lg "
                />
              </PhotoView>
            ))}

          {invoice?.signUrl && (
            <Image
              src={invoice?.signUrl}
              alt="POD"
              className="w-60 h-auto my-4 rounded-lg"
            />
          )}
        </div>
      </Container>
    </section>
  );
};

export default InvoiceDetails;
