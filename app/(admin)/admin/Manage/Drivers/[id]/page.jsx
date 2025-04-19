"use client";

import {
  fetchDocById,
  getDriverBookings,
} from "@/api/firebase/functions/fetch";
import { useEffect, useState } from "react";
import { Container } from "@mantine/core";
import { User } from "@heroui/react";
import ManageInvoices from "@/components/tableSort/ManageInvoices/ManageInvoices";

const img =
  "https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default function Page({ params: { id } }) {
  const [user, setUser] = useState({});
  const [bookings, setBookings] = useState([]);
  const decodedEmail = decodeURIComponent(id);

  useEffect(() => {
    const fetch = async () => {
      try {
        const user = await fetchDocById(decodedEmail, "users");
        setUser(user);
        const bookingsRes = await getDriverBookings(decodedEmail);
        setBookings(bookingsRes);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [id, decodedEmail]);

  return (
    <div>
      <User
        name={user.firstName}
        description={user.email}
        avatarProps={{
          src: img,
        }}
        className="mr-auto ml-10 my-6"
      />
      {bookings.length > 0 && (
        <ManageInvoices
          invoice={bookings}
          title={"Assigned Bookings"}
          hideAction={true}
        />
      )}
    </div>
  );
}
