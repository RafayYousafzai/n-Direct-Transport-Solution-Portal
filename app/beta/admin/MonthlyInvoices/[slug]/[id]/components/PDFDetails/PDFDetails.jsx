"use client";

import useAdminContext from "@/context/AdminProvider";
import { Container } from "@mantine/core";
import { User } from "@heroui/react";
import React, { useState } from "react";
import DatePick from "./DatePick";
import History from "./History";
import CreatePdf from "./CreatePdf";
import CreatePdfForDrivers from "./CreatePdfForDrivers";

export default function PDFDetails({ email, isRoleDriver }) {
  const [datesRange, setDatesRange] = useState({
    start: null,
    end: null,
  });
  const { allUsers } = useAdminContext();

  const user = allUsers.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (!user) {
    console.log("User not found");
    return null;
  }

  return (
    <Container size={"md"} className="flex flex-col content-center mt-32 gap-6">
      <User
        name={user.firstName}
        description={user.email}
        avatarProps={{
          src: "",
        }}
        className="mr-auto"
      />
      <DatePick handleDatesRange={(dates) => setDatesRange(dates)} />

      {isRoleDriver ? (
        <CreatePdfForDrivers datesRange={datesRange} user={user} />
      ) : (
        <CreatePdf datesRange={datesRange} user={user} />
      )}

      <History email={email} datesRange={datesRange} />
    </Container>
  );
}
