"use client";
import { BookingsTable } from "./components/bookings-table";
import { Tabs, Tab, Select } from "@heroui/react";
import React, { useState } from "react";

export default function BookingsPage() {
  // const { bookings, error, totalBookings } = useBookings();

  const [selected, setSelected] = useState("active");
  const [selectedDriver, setSelectedDriver] = useState("");

  return (
    <div className="flex-1">
      {/* <BookingsHeader totalBookings={totalBookings} /> */}

      <div className="flex w-full flex-col p-4 gap-4">
        <Tabs
          fullWidth
          aria-label="Booking tabs"
          selectedKey={selected}
          onSelectionChange={setSelected}
          className="w-full"
        >
          <Tab key="active" title="Active">
            <div className="flex flex-col gap-4">
              <div className="flex justify-end">
                <Select
                  label="Select Driver"
                  placeholder="Filter by driver"
                  className="w-64"
                  selectedKeys={selectedDriver ? [selectedDriver] : []}
                  onSelectionChange={(keys) =>
                    setSelectedDriver(Array.from(keys))
                  }
                >
                  {/* {drivers.map((driver) => (
                    <SelectItem key={driver} value={driver}>
                      {driver}
                    </SelectItem>
                  ))} */}
                </Select>
              </div>
            </div>
          </Tab>
          <Tab key="allocated" title="Allocated"></Tab>
          <Tab key="completed" title="Completed">
            <BookingsTable />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
