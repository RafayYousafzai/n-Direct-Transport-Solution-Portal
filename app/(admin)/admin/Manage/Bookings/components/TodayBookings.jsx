import React, { useState, useMemo } from "react";
import ManageInvoices from "@/components/tableSort/ManageInvoices/ManageInvoices";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { ChevronDown } from "lucide-react";

export default function TodayBookings({ invoice }) {
  const [activeFilteredTab, setActiveFilteredTab] = useState("todaysBookings");
  const [selectedDriver, setSelectedDriver] = useState("All Drivers");

  const drivers = useMemo(() => {
    const uniqueDrivers = new Set(
      invoice
        .filter(
          (item) =>
            item.driverName &&
            item.currentStatus !== "delivered" &&
            item.currentStatus !== "returned"
        )
        .map((inv) => inv.driverName)
        .filter(Boolean)
    );
    return ["All Drivers", ...Array.from(uniqueDrivers)];
  }, [invoice]);

  // Function to filter invoices based on the active tab and selected driver
  const filterInvoices = () => {
    let filtered = invoice;

    if (activeFilteredTab === "Active") {
      filtered = filtered.filter((item) => !item.driverName);
    } else if (activeFilteredTab === "Allocated") {
      filtered = filtered.filter(
        (item) =>
          item.driverName &&
          item.currentStatus !== "delivered" &&
          item.currentStatus !== "returned"
      );
    } else if (activeFilteredTab === "Completed") {
      filtered = filtered.filter(
        (item) =>
          item?.currentStatus === "delivered" ||
          item?.currentStatus === "returned"
      );
    }

    if (selectedDriver !== "All Drivers") {
      filtered = filtered.filter((item) => item.driverName === selectedDriver);
    }

    return filtered;
  };

  const filteredInvoices = filterInvoices();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center max-w-[97vw] ml-[1.1vw]">
        <Tabs
          aria-label="Booking tabs"
          color="primary"
          selectedKey={activeFilteredTab}
          onSelectionChange={setActiveFilteredTab}
          className="flex-grow"
          fullWidth
        >
          <Tab key="Active" title="Active" />
          <Tab key="Allocated" title="Allocated" />
          <Tab key="Completed" title="Completed" />
        </Tabs>
        {activeFilteredTab === "Allocated" && (
          <Dropdown className="ml-4">
            <DropdownTrigger>
              <Button
                variant="flat"
                className="capitalize"
                endContent={<ChevronDown className="h-4 w-4" />}
              >
                {selectedDriver}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Select Driver"
              selectionMode="single"
              selectedKeys={new Set([selectedDriver])}
              onSelectionChange={(keys) =>
                setSelectedDriver(Array.from(keys)[0])
              }
            >
              {drivers.map((driver) => (
                <DropdownItem key={driver}>{driver}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        )}
      </div>
      <Card>
        <CardBody>
          <ManageInvoices
            isVisibleReadyDate={true}
            invoice={filteredInvoices}
            title={"Booking"}
          />
        </CardBody>
      </Card>
    </div>
  );
}
