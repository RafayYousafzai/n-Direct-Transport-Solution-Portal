/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import useAdminContext from "@/context/AdminProvider";
import { parse } from "date-fns";
import PdfButton from "./pdf/PdfButton";
import { Loader } from "@mantine/core";
import convertToISOString from "./convertToISOString";

export default function CreatePdf({ datesRange, user }) {
  const [loading, setLoading] = useState(true);
  const [myBookings, setMyBookings] = useState([]);
  const { allBookings } = useAdminContext();
  const pdfId = Math.floor(10000 + Math.random() * 900000);

  async function placeBookingsExistingAccsMonthly() {
    const { start, end } = datesRange;

    const startDate = parse(start, "dd/MM/yyyy", new Date());
    startDate.setHours(0, 0, 0, 0);
    const toDate = parse(end, "dd/MM/yyyy", new Date());
    toDate.setHours(23, 59, 59, 999);

    try {
      return allBookings.filter((booking) => {
        const bookingDate = new Date(convertToISOString(booking.date));

        return (
          booking.userEmail.toLowerCase() === user.email.toLowerCase() &&
          bookingDate >= startDate &&
          bookingDate <= toDate
        );
      });
    } catch (error) {
      console.error("Error:", error);
      console.log("Something Went Wrong");
      return [];
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const bookings = await placeBookingsExistingAccsMonthly(user.email);
        setMyBookings(bookings?.filter((item) => item?.isArchived !== true));
      } catch (error) {
        console.error("Error Creating PDF:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [allBookings, user, datesRange]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ borderRadius: 30, backgroundColor: "#f8f9fa", padding: 50 }}>
      {myBookings.length > 0 && (
        <PdfButton
          user={user}
          bookings={myBookings}
          datesRange={datesRange}
          pdfId={"#" + pdfId}
        />
      )}
    </div>
  );
}
