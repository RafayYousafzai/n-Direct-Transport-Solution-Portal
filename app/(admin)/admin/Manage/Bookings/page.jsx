"use client";
import ManageInvoices from "@/components/tableSort/ManageInvoices/ManageInvoices";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { useMemo } from "react";
import { startOfDay, isFuture, parse } from "date-fns";
import { isToday } from "date-fns";
import useAdminContext from "@/context/AdminProvider";
import { Button } from "@mantine/core";
import TodayBookings from "./components/TodayBookings";

export default function App() {
  const { allBookings, fetchNextBookingsPage, archivedBookings } =
    useAdminContext();

  const parseDate = (dateString) => {
    try {
      const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
      return startOfDay(parsedDate);
    } catch (error) {
      console.error("Error parsing date:", error, "Date string:", dateString);
      return null;
    }
  };

  const futureBookings = useMemo(() => {
    const today = startOfDay(new Date());
    return allBookings.filter((booking) => {
      if (!booking.date) return false;
      const bookingDate = parseDate(booking.date);
      return bookingDate && isFuture(bookingDate) && bookingDate > today;
    });
  }, [allBookings]);

  const todaysBookings = useMemo(
    () =>
      allBookings.filter((booking) => {
        if (!booking.date) return false;
        const bookingDate = parseDate(booking.date);
        return bookingDate && isToday(bookingDate);
      }),
    [allBookings]
  );

  const futureBookingsAfterFourJuly = useMemo(() => {
    const julyFourthTimestamp =
      new Date("2024-07-04T00:00:00Z").getTime() / 1000;
    return futureBookings.filter(
      (booking) => booking.createdAt.seconds >= julyFourthTimestamp
    );
  }, [futureBookings]);

  const newBookingsCount = (bookings) => {
    const newItems = bookings.filter((booking) => booking.isNew === true);
    return newItems.length > 0 ? `New ${newItems.length}` : "";
  };

  const isNew = (newItems) =>
    newItems.length > 0 ? `(New ${newItems.length})` : "";

  // console.log("todaysBookings", todaysBookings.length);
  
  
  return (
    <div className="flex w-full overflow-hidden flex-col justify-center">
      <Tabs
        color="primary"
        draggable
        fullWidth
        className="max-w-[97vw] ml-[1.3vw]"
        aria-label="Options"
      >
        <Tab title={`Today ${newBookingsCount(todaysBookings)}`}>
          <TodayBookings invoice={todaysBookings} />
        </Tab>
        <Tab
          title={`Future Bookings ${newBookingsCount(
            futureBookingsAfterFourJuly
          )}`}
        >
          <Card>
            <CardBody>
              <ManageInvoices
                invoice={futureBookingsAfterFourJuly}
                title={"Booking"}
              />
            </CardBody>
          </Card>
        </Tab>
        <Tab title={`All bookings ${newBookingsCount(allBookings)}`}>
          <Card>
            <CardBody>
              <ManageInvoices invoice={allBookings} title={"Booking"} />
            </CardBody>
          </Card>
        </Tab>
        <Tab title={`Archived ${archivedBookings.length}`}>
          <Card>
            <CardBody>
              <ManageInvoices
                isArchived={true}
                invoice={archivedBookings}
                title={"Archived Bookings"}
              />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
      <Button className="max-w-lg mx-auto" onClick={fetchNextBookingsPage}>
        Load Bookings
      </Button>
    </div>
  );
}
