"use client";

import React, { useEffect, useState } from "react";
import { Center, Container, Progress, TextInput } from "@mantine/core";
import UserTable from "../components/Table";
import { getPreviousMonthDates } from "@/api/DateAndTime";
import useAdminContext from "@/context/AdminProvider";

export default function Page(params) {
  const role = decodeURIComponent(params.params.slug);
  const isRoleDriver = role === "driver" ? true : false;

  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered allUsers
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0); // Add progress state
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const { allUsers, allBookings } = useAdminContext();

  console.log(params, role, filteredUsers);
  async function placeBookingsExistingAccsMonthly(email) {
    const { startDate, endDate } = getPreviousMonthDates();

    const fromDate = new Date(startDate);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(endDate);
    toDate.setHours(23, 59, 59, 999);

    try {
      return allBookings.filter((booking) => {
        // Convert bookingDate from timestamp to Date object
        const bookingDate = new Date(booking.createdAt.seconds * 1000);
        return (
          booking.userEmail === email &&
          bookingDate >= fromDate &&
          bookingDate <= toDate
        );
      });
    } catch (error) {
      console.error("Error:", error);
      notify("Something Went Wrong");
      return null;
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setFilteredUsers(allUsers);
        for (const [index, user] of allUsers.entries()) {
          const booking = await placeBookingsExistingAccsMonthly(user.email);
          allBookings[user.email] = booking;
          setProgress(((index + 1) / allUsers.length) * 100);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    }
    fetchData();
  }, [allUsers, allBookings]);

  // Function to handle search input change
  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    // Filter allUsers based on search term
    const filteredUsers = allUsers.filter(
      (user) =>
        (user.firstName && user.firstName.toLowerCase().includes(searchTerm)) ||
        (user.lastName && user.lastName.toLowerCase().includes(searchTerm)) ||
        (user.email && user.email.toLowerCase().includes(searchTerm))
    );
    setFilteredUsers(filteredUsers);
  };

  if (loading) {
    return (
      <Center style={{ height: "100vh", flexDirection: "column" }}>
        <Progress
          value={progress}
          transitionDuration={1000}
          style={{ width: "80%", marginTop: 16 }}
        />
      </Center>
    );
  }

  return (
    <Container size={"md"}>
      <Center>
        <h1>Monthly Invoices</h1>
      </Center>
      <div
        style={{ borderRadius: 30, backgroundColor: "#f8f9fa", padding: 50 }}
      >
        {/* Search input */}
        <TextInput
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginBottom: 16 }}
        />
        <UserTable
          bookings={allBookings}
          users={filteredUsers.filter((user) =>
            isRoleDriver ? user.role === "driver" : user.role !== "driver"
          )}
          isRoleDriver={isRoleDriver}
        />
      </div>
    </Container>
  );
}
