"use client";

import { statuses } from "@/components/static";
import { Button, Combobox, useCombobox } from "@mantine/core";
import { useState } from "react";
import { format } from "date-fns";
import { updateDoc } from "@/api/firebase/functions/upload";
import {
  locationSharing,
  stopLocationSharing,
} from "@/api/firebase/functions/realtime";

export default function StatusDropdown({ booking }) {
  const [invoice, setInvoice] = useState(booking);
  const [loading, setLoading] = useState(false);
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const updateStatus = async (newStatusIndex, value) => {
    if (!invoice || newStatusIndex >= statuses.length) {
      return;
    }
    setLoading(true);

    const currentStatus = value;
    const currentDateTime = format(new Date(), "MM/dd/yyyy HH:mm:ss");

    const updatedData = {
      ...invoice,
      progressInformation: {
        ...invoice.progressInformation,
        [currentStatus]: currentDateTime,
      },
      currentStatus: currentStatus,
      isNew: false,
    };

    let sharing = false;
    if (
      currentStatus === "delivered" ||
      currentStatus === "returned" ||
      currentStatus === "cancelled" ||
      currentStatus === "Arrived At Drop" ||
      currentStatus === "Arrived At Pickup"
    ) {
      await stopLocationSharing(invoice.driverEmail, invoice.docId);
    }

    setInvoice(updatedData);

    await updateDoc("place_bookings", invoice.docId, updatedData);
    setLoading(false);
  };

  const options = statuses.map((status, index) => (
    <Combobox.Option
      value={status.val}
      key={index}
      onClick={() => updateStatus(index, status.val)}
      style={{ textTransform: "uppercase", fontSize: "10px" }}
      >
      {status.status}
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        setLoading(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <Button
          size="compact-sm"
          w={90}
          h={50}
          loading={loading}
          style={{ textTransform: "uppercase", fontSize: "12px" }}
          variant="light"
          c={"indigo"}
          onClick={() => combobox.toggleDropdown()}
        >
          {invoice?.currentStatus || "Status"}
        </Button>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
