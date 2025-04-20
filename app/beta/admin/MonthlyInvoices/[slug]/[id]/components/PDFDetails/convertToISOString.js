export default function convertToISOString(
  dateString,
  hours = 11,
  minutes = 25,
  seconds = 4
) {

  if (!dateString || typeof dateString !== "string") {
    console.error("Invalid date string:", dateString);
    return null;
  }

  const [day, month, year] = dateString.split("/");

  // Check if the date components are valid numbers
  if (!day || !month || !year || isNaN(day) || isNaN(month) || isNaN(year)) {
    console.error("Invalid date components:", { day, month, year });
    return null;
  }

  const date = new Date(
    Date.UTC(year, month - 1, day, hours, minutes, seconds)
  );

  if (isNaN(date)) {
    console.error("Invalid Date:", date);
    return null;
  }

  return date.toISOString();
}
