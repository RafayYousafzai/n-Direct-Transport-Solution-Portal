/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { CalendarDate } from "@internationalized/date";
import { Calendar, TimeInput } from "@heroui/react";
import {
  Time,
  getLocalTimeZone,
  today,
  isWeekend as weekend,
} from "@internationalized/date";
import { parse } from "date-fns";

export default function DateTime({
  handle_date,
  handle_time,
  service,
  handleInvalid,
  admin,
  date,
  time,
}) {
  // State for the time value and validation status

  const [timeValue, setTimeValue] = useState(new Time(0, 0));
  const [maxTime, setMaxTime] = useState(new Time(24, 0));
  const [minTime, setMinTime] = useState(new Time(0, 0));
  const [dateValue, setDateValue] = useState(today(getLocalTimeZone()));
  const [isInvalid, setIsInvalid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const today = new Date();
    if (date || time) {
      const parsedTime = parse(time, "hh:mm a", new Date());
      const parsedDate = parse(date, "dd/MM/yyyy", new Date());

      try {
        setTimeValue(new Time(parsedTime.getHours(), parsedTime.getMinutes()));
        setDateValue(
          new CalendarDate(
            parsedDate.getFullYear(),
            parsedDate.getMonth(),
            parsedDate.getDay()
          )
        );
      } catch (error) {
        console.log(error);
      }
    } else
      try {
        handleTimeChange(new Time(today.getHours(), today.getMinutes()));
      } catch (error) {
        console.log(error);
      }
  }, []);

  const fourPm = new Time(16);
  const fivePm = new Time(17);
  const fiveAm = new Time(5);
  const sevenAm = new Time(7);
  const sixPm = new Time(18);
  const threePm = new Time(15);
  const midnight = new Time(24);
  const zeroTime = new Time(0, 0);

  // Handle time change
  const handleTimeChange = (value) => {
    setTimeValue(value);
    handle_time("time", value);
  };

  // Handle date change
  const handleDateChange = (value) => {
    setDateValue(value);
    handle_date("date", value);
  };

  useEffect(() => {
    const currentDate = today(getLocalTimeZone());
    const isCurrentOrFutureDate = dateValue?.compare(currentDate) >= 0;
    const isWeekendValid = weekend(dateValue, "en-au");

    // Adjusting the Direct service validation to ensure 7 AM to 5 PM range
    const isAfterHoursInvalid =
      timeValue.compare(fivePm) < 0 && timeValue.compare(sevenAm) > 0;
    const isDirectInvalid =
      timeValue.compare(sevenAm) < 0 || timeValue.compare(sixPm) >= 0;

    let timeInvalid = false;
    let error = "";

    if (!admin && isCurrentOrFutureDate) {
      if (service === "Standard") {
        setMaxTime(threePm);
        setMinTime(zeroTime);
        timeInvalid = timeValue.compare(threePm) > 0;
        if (timeInvalid) {
          error = `Please select "Express" or "Direct" Service`;
        }
      } else if (service === "Express") {
        setMaxTime(fourPm);
        setMinTime(zeroTime);
        timeInvalid = timeValue.compare(fourPm) > 0;
        if (timeInvalid) {
          error = `Please select "Direct" Service`;
        }
      } else if (service === "Direct") {
        setMaxTime(fivePm);
        setMinTime(sevenAm);
        if (isDirectInvalid) {
          timeInvalid = true;
          error = `Please select a time within the 7 AM to 5 PM window`;
        }
      } else if (service === "After Hours") {
        setMaxTime(fivePm);
        setMinTime(sevenAm);
        if (isAfterHoursInvalid) {
          timeInvalid = true;
          error = `Please select a time within the 5 PM to 7 AM window`;
        }
      } else if (service === "Weekend Deliveries") {
        setMaxTime(fivePm);
        setMinTime(zeroTime);
        if (!isWeekendValid) {
          timeInvalid = true;
          error = `Service is only available on Saturday and Sunday`;
        }
      }
    } else {
      setMaxTime(midnight);
      setMinTime(zeroTime);
    }

    if (timeInvalid) {
      setIsInvalid(true);
      handleInvalid(true);
      setErrorMessage(error);
    } else {
      setIsInvalid(false);
      handleInvalid(false);
      setErrorMessage("");
    }
  }, [service, dateValue, timeValue]);

  return (
    <>
      <div className="w-full bg-slate-50 py-4 rounded-md flex justify-center align-middle">
        <Calendar
          valueFormat="dd/MM/yyyy"
          label="Ready Date"
          onChange={handleDateChange}
          value={dateValue}
          minValue={admin ? undefined : today(getLocalTimeZone())}
          showMonthAndYearPickers={true}
        />
      </div>
      <br />
      <TimeInput
        label="Ready Time"
        value={timeValue}
        onChange={handleTimeChange}
        isInvalid={isInvalid}
        errorMessage={errorMessage}
        maxValue={maxTime}
        minValue={minTime}
      />
    </>
  );
}