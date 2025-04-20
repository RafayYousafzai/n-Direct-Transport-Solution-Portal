"use client";

import { Page, Text, View, Document, Image } from "@react-pdf/renderer";
import styles from "./userPDFStyles";
import { format } from "date-fns";
import { getTotalInvoicePrice } from "./getTotalInvoicePrice";

const currentDate = new Date();
const futureDate = new Date();
futureDate.setDate(currentDate.getDate() + 14);

export default function MyDocument({ datesRange, invoices, user, pdfId }) {
  const { start, end } = datesRange;
  const {
    totalPrice,
    totalPriceWithGST,
    totalGst,
    totalTolls,
    totalUnloading,
  } = getTotalInvoicePrice(invoices);

  console.log({ totalPrice, totalGst, totalTolls, totalUnloading });

  const restrictLength = (str, maxLength) =>
    str.length > maxLength ? str.slice(0, maxLength) + "..." : str;

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const sortedBookings = invoices.sort(
    (a, b) => parseDate(b.date) - parseDate(a.date)
  );

  function addSpaces(input) {
    let result = "";
    let count = 0;

    for (let char of input) {
      result += char;
      count++;

      if (count === 10) {
        result += " ";
        count = 0;
      }
    }

    return result.trim();
  }

  return (
    <Document>
      <Page size="A3" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.leftHeader}>
            <Text style={styles.companyName}>
              Direct Transport Solutions Pty Ltd
            </Text>
            <Text style={styles.companyDetails}>
              bookings@directtransport.com.au
            </Text>
            <Text style={styles.companyDetails}>
              www.directtransport.com.au
            </Text>
            <Text style={styles.companyDetails}>1353 The Horsley Dr</Text>
            <Text style={styles.companyDetails}>Wetherill park NSW 2164</Text>
            <Text style={styles.companyDetails}>Tel: 02 9188 0894</Text>
            <Text style={styles.companyDetails}>ABN 87 658 348 808</Text>
          </View>
          <Image alt="logo" style={styles.logo} src="/pdf_header2.jpg" />
        </View>

        <View style={styles.invoiceHeader}>
          <View style={styles.invoiceDetails}>
            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
                display: "flex",
                width: "50%",
              }}
            >
              <Text style={styles.invoiceTitle}>Tax invoice</Text>
            </View>
            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
                display: "flex",
                width: "50%",
              }}
            >
              <View style={[styles.invoiceRow, { marginRight: 40 }]}>
                <Text style={styles.label}>Invoice number</Text>
                <Text style={styles.value}>{pdfId}</Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.label}>Issue date</Text>
                <Text style={styles.value}>
                  {format(new Date(), "dd/MM/yyyy")}
                </Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.label}>Due date</Text>
                <Text style={styles.value}>
                  {format(futureDate, "dd/MM/yyyy")}
                </Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.label}>Invoice period</Text>
                <Text style={styles.value}>
                  {start} - {end}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              display: "flex",
            }}
          >
            <View style={{ width: "50%" }}>
              <Text style={styles.label}>Bill To:</Text>
              <Text style={styles.value}>{user?.firstName || ""}</Text>
              <Text style={styles.value}>{user.email}</Text>
              <Text style={styles.value}>{user.companyAddress}</Text>
              <Text style={styles.value}>Australia</Text>
            </View>
            <View style={{ width: "50%" }}>
              {/* <Text style={styles.label}>From</Text>
              <Text style={styles.value}>1353 The Horsley Dr</Text>
              <Text style={styles.value}>Wetherill Park NSW 2164</Text>
              <Text style={styles.value}>bookings@directtransport.com.au</Text>
              <Text style={styles.value}>ABN 87 658 348 808</Text>
              <Text style={styles.value}>(02) 9030 0333</Text> */}
            </View>
          </View>
        </View>

        {/* Header */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>DATE</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>JOB NO</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Pickup Company </Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Drop Company </Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Ref </Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Job Code</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Serv/Charges</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Serv.</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>COST</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Wait/Unload Pickup</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Wait/Unload Drop-off</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>TOLLS</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>GST</Text>
            </View>{" "}
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Total</Text>
            </View>
          </View>

          {sortedBookings &&
            sortedBookings.reverse().map((booking, ind) => {
              const originLabel = restrictLength(
                booking.address?.Origin?.label || "N/A",
                30
              );
              const destinationLabel = restrictLength(
                booking.address?.Destination?.label || "N/A",
                30
              );

              return (
                <>
                  <View style={styles.tableRow}>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{booking.date} </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{booking.docId} </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {booking.pickupCompanyName}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {booking.dropCompanyName}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellHeader}>Ref </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {addSpaces(booking?.internalReference || "")}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{booking.returnType}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        ${booking?.serviceCharges || 0}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{booking.service}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        ${booking.totalPrice}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        ${(booking?.WaitingTimeAtPickup || 0).toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        ${(booking?.WaitingTimeAtDrop || 0).toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        ${booking?.totalTollsCost}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        ${(booking?.gst).toFixed(2) || 0}
                      </Text>
                    </View>{" "}
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        $
                        {(
                          Number(booking?.totalPriceWithGST) +
                          Number(booking?.totalTollsCost)
                        ).toFixed(2) || 0}
                      </Text>
                    </View>
                  </View>
                </>
              );
            })}
          <View style={{ width: "100%", marginBottom: 20, marginTop: 20 }}>
            <Text
              style={{
                marginLeft: "auto",
                fontWeight: "extrabold",
                fontSize: 12,
                marginRight: 20,
              }}
            >
              Total Price incl GST: ${" "}
              {(Number(totalPriceWithGST) + Number(totalTolls)).toFixed(2)}
            </Text>
          </View>
        </View>
        {/* Footer */}
        <View>
          <Text style={styles.heading}>Terms strictly apply</Text>
          <Text style={styles.para}>
            All shipments by Direct Transport Solutions Pty Ltd and its agents
            are subject to our standard terms and conditions. Insurance
            liability has not been arranged or included unless specifically
            requested beforehand, along with the appropriate premium.
          </Text>
          <Text style={styles.heading}>Direct Transport Solutions Pty Ltd</Text>
          <Text style={styles.para}>
            ABN 87 658 348 808| 1353 The Horsley Dr Wetherill Park NSW 2164 |
            Phone: (02) 9030 0333| Email: bookings@directtransport.com.au
          </Text>
        </View>
      </Page>
    </Document>
  );
}
