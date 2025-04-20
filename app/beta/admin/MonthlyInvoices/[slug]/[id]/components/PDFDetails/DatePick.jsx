"use client";

import { RangeCalendar, Button } from "@heroui/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import { useState } from "react";
import toast from "react-hot-toast";

function formatDate(dateObject) {
  const day = dateObject.day < 10 ? "0" + dateObject.day : dateObject.day;
  const month =
    dateObject.month < 10 ? "0" + dateObject.month : dateObject.month;
  const year = dateObject.year;
  return `${day}/${month}/${year}`;
}

export default function DatePick({ handleDatesRange }) {
  let [value, setValue] = useState({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ weeks: 1 }),
  });

  const applyDateRange = () => {
    // Ensure both start and end dates are valid
    if (!value.start || !value.end) {
      toast.error("Please select a complete date range.");
      return;
    }

    const start = formatDate(value.start);
    const end = formatDate(value.end);
    const datesRange = { start, end };
    handleDatesRange(datesRange);
  };

  return (
    <div className="bg-slate-50 rounded-lg flex flex-col items-center py-4">
      <RangeCalendar
        aria-label="Date Range Selector"
        value={value}
        onChange={setValue}
        showMonthAndYearPickers
        showShadow={false}
      />
      <Button onClick={applyDateRange} className="mt-4">
        Apply Date Range
      </Button>
    </div>
  );
}
