/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import useAdminContext from "@/context/AdminProvider";
import PdfButton from "./pdf/PdfButton";
import { Loader } from "@mantine/core";
import { Timestamp } from "firebase/firestore";

const generatePdfId = () => Math.floor(100000 + Math.random() * 900000);

const parseDate = (dateString) => {
  const [day, month, year] = dateString.split("/");
  return new Date(year, month - 1, day);
};

function addOneDay(date) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 1);
  return newDate;
}

const parseDeliveredDate = (deliveredDate) => {
  try {
    const [datePart, timePart] = deliveredDate.split(" ");
    const [month, day, year] = datePart.split("/");
    const [hour, minute, second] = timePart.split(":");
    return new Date(year, month - 1, day, hour, minute, second);
  } catch (error) {
    return null;
  }
};

const filterBookingsByDateRange = (bookings, startDate, endDate, filterFn) => {
  return bookings?.filter((item) => {
    if (item?.isArchived) return false;
    return filterFn(item, startDate, endDate);
  });
};

export default function CreatePdfForDrivers({ datesRange, user }) {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const { allBookings } = useAdminContext();
  const pdfId = generatePdfId();

  const filterUserBookings = useCallback(
    (startDate, endDate) => {
      const startTimestamp = Timestamp.fromDate(startDate);
      const endTimestamp = Timestamp.fromDate(endDate);

      return filterBookingsByDateRange(
        allBookings,
        startTimestamp,
        endTimestamp,
        (item) => {
          if (!item?.dateTimestamp) return false;
          const createdAtTimestamp = item.dateTimestamp;
          return (
            createdAtTimestamp.seconds >= startTimestamp.seconds &&
            createdAtTimestamp.seconds <= endTimestamp.seconds &&
            user.email === item.userEmail
          );
        }
      );
    },
    [allBookings, user.email]
  );

  const filterDriverDeliveredBookings = useCallback(
    (startDate, endDate) => {
      return filterBookingsByDateRange(
        allBookings,
        startDate,
        endDate,
        (item) => {
          if (!item?.progressInformation?.delivered) {
            console.log(
              "No deliver date."
              // item?.progressInformation
            );

            return false;
          }

          const deliveredDateObj = parseDeliveredDate(
            item.progressInformation.delivered
          );
          if (!deliveredDateObj) {
            console.warn(
              "Invalid delivered date format:",
              item.progressInformation.delivered
            );
            return false;
          }

          return (
            deliveredDateObj >= startDate &&
            deliveredDateObj <= endDate &&
            item.driverEmail === user.email
          );
        }
      );
    },
    [allBookings, user.email]
  );

  const fetchBookings = useCallback(async () => {
    if (!allBookings || !datesRange || !user) {
      setLoading(false);
      return;
    }

    try {
      const startDate = parseDate(datesRange.start);
      const endDate = addOneDay(parseDate(datesRange.end));

      console.log({startDate,endDate});
      

      const filteredBookings =
        user.role === "driver"
          ? filterDriverDeliveredBookings(startDate, endDate)
          : filterUserBookings(startDate, endDate);

      setBookings(filteredBookings || []);
    } catch (error) {
      console.error("Error filtering bookings:", error);
    } finally {
      setLoading(false);
    }
  }, [
    allBookings,
    datesRange,
    user,
    filterUserBookings,
    filterDriverDeliveredBookings,
  ]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ borderRadius: 30, backgroundColor: "#f8f9fa", padding: 50 }}>
      {bookings.length > 0 && (
        <PdfButton
          user={user}
          bookings={bookings}
          datesRange={datesRange}
          driverLayout={user.role === "driver"}
          pdfId={`#${pdfId}`}
        />
      )}
    </div>
  );
}
