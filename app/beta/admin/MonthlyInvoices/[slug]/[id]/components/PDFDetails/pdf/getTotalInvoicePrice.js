import { format } from "date-fns";

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
};

const parseDeliveredDate = (deliveredDate) => {
  try {
    const [datePart, timePart] = deliveredDate.split(" ");
    const [month, day, year] = datePart.split("/").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);
    return new Date(year, month - 1, day, hour, minute, second);
  } catch {
    return null;
  }
};

const calculateTotals = (invoices) => {
  return invoices.reduce(
    (
      acc,
      {
        totalPrice,
        gst,
        totalTollsCost = 0,
        unloading = 0,
        totalPriceWithGST = 0,
      }
    ) => {
      acc.totalPrice += Number(totalPrice);
      acc.totalGst += Number(gst);
      acc.totalTolls += Number(totalTollsCost);
      acc.totalUnloading += Number(unloading);
      acc.totalPriceWithGST += Number(totalPriceWithGST);
      return acc;
    },
    {
      totalPrice: 0,
      totalGst: 0,
      totalTolls: 0,
      totalUnloading: 0,
      totalPriceWithGST: 0,
    }
  );
};

export function getTotalInvoicePrice(invoices) {
  const totals = calculateTotals(invoices);
  return Object.fromEntries(
    Object.entries(totals).map(([key, value]) => [key, value.toFixed(2)])
  );
}

export function calculateInvoiceDetails(invoices, user) {
  const { totalPriceWithGST, totalGst, totalTolls } =
    getTotalInvoicePrice(invoices);
  console.log({ totalPriceWithGST });

  const paymentPercentage = Number(user?.paymentPercentage) || 1;
  const useGst = Boolean(user?.includeGst);
  const totalFinalPayment =
    (useGst
      ? Number(totalPriceWithGST)
      : Number(totalPriceWithGST) - Number(totalGst)) + Number(totalTolls);

  const bookingsByDate = invoices.reduce((acc, booking) => {
    const deliveredDate = parseDeliveredDate(
      booking.progressInformation.delivered
    );
    if (!deliveredDate) return acc;

    const formattedDate = format(deliveredDate, "dd/MM/yyyy");
    acc[formattedDate] = acc[formattedDate] || [];
    acc[formattedDate].push(booking);
    return acc;
  }, {});

  const calcDayPayment = (bookings) => {
    const totals = bookings.reduce(
      (acc, { totalPriceWithGST, gst, totalTollsCost = 0 }) => {
        acc.totalWithGst += Number(totalPriceWithGST);
        acc.totalWithoutGst += Number(totalPriceWithGST) - Number(gst);
        acc.totalTollsCost += Number(totalTollsCost);
        return acc;
      },
      { totalWithGst: 0, totalWithoutGst: 0, totalTollsCost: 0 }
    );

    const { totalWithGst, totalWithoutGst, totalTollsCost } = totals;

    const paymentBase =
      (useGst ? totalWithGst : totalWithoutGst) + totalTollsCost;

    const totalPayment = (paymentBase * paymentPercentage) / 100;

    return totalPayment.toFixed(2);
  };

  const sortedDates = Object.keys(bookingsByDate).sort(
    (a, b) => parseDate(b) - parseDate(a)
  );

  const finalDriverPay = (
    (totalFinalPayment * paymentPercentage) /
    100
  ).toFixed(2);

  return {
    totalPriceWithGST,
    totalGst,
    totalFinalPayment,
    sortedDates,
    bookingsByDate,
    calcDayPayment,
    finalDriverPay,
  };
}
