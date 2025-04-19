"use client";

import { RangeCalendar } from "@heroui/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const start = formatDate(value.start);
    const end = formatDate(value.end);

    const datesRange = { start: start, end: end };

    handleDatesRange(datesRange);
  }, [value]);

  return (
    <div className="bg-slate-50 rounded-lg flex justify-center py-4">
      <RangeCalendar
        aria-label="Date (Controlled)"
        value={value}
        onChange={setValue}
        showShadow={false}
      />
    </div>
  );
}
