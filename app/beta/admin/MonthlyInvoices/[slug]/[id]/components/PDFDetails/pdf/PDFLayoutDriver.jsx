"use client";

import { Page, Text, View, Document, Image } from "@react-pdf/renderer";
import { calculateInvoiceDetails } from "./getTotalInvoicePrice";
import { format } from "date-fns";
import styles from "./pdf.styles";

export default function MyDocument({ datesRange, invoices, user, pdfId }) {
  const { start, end } = datesRange;

  console.log(invoices.length);

  const { sortedDates, bookingsByDate, calcDayPayment, finalDriverPay } =
    calculateInvoiceDetails(invoices, user);

  return (
    <Document>
      <Page size="A3" style={styles.page}>
        {/* Header Section */}
        <View
          style={[
            styles.header,
            {
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
            },
          ]}
        >
          <View>
            <Image style={styles.image} alt="logo" src="/pdf_header2.jpg" />
          </View>

          <View
            style={[
              styles.headerDetails,
              { justifyContent: "center", flexDirection: "column", gap: 3 },
            ]}
          >
            <Text style={styles.companyInfo}>
              Direct Transport Solutions Pty Ltd
            </Text>
            <Text style={styles.companyInfo}>ABN 87 658 348 808</Text>
            <Text style={styles.companyInfo}>RECIPIENT GENERATED INVOICE</Text>
          </View>

          <View style={{ marginRight: 30 }}>
            <View style={[styles.headerDetails, { marginVertical: 2.5 }]}>
              <Text style={[styles.para, { fontWeight: "700" }]}>
                Invoice Number
              </Text>
              <Text style={styles.para}> {pdfId}</Text>
            </View>
            <View style={[styles.headerDetails, { marginVertical: 0 }]}>
              <Text style={[styles.para, { fontWeight: "700" }]}>
                Invoice Date:
              </Text>
              <Text style={styles.para}>
                {format(new Date(), "dd/MM/yyyy")}
              </Text>
            </View>
            <View style={[styles.headerDetails, { marginVertical: 0 }]}>
              <Text style={[styles.para, { fontWeight: "700" }]}>
                Invoice Period:{" "}
              </Text>
              <Text style={styles.para}>
                {start} - {end}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.headerDetails, { marginHorizontal: 15 }]}>
          <View style={styles.driverInfo}>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={[styles.para, { fontWeight: "700", width: 48 }]}>
                Driver:
              </Text>
              <Text style={styles.para}>{user?.firstName || ""}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={[styles.para, { fontWeight: "700", width: 48 }]}>
                Address:
              </Text>
              <Text style={styles.para}>
                {user.companyAddress === ""
                  ? "You don't have address"
                  : user.companyAddress}
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={[styles.para, { fontWeight: "700", width: 48 }]}>
                ABN:
              </Text>
              <Text style={styles.para}> 87 658 348 808</Text>
            </View>
          </View>
        </View>

        {/* Table Section */}
        <View style={[styles.table, { marginHorizontal: 25 }]}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: "33%" }]}>
              <Text style={styles.tableCellHeader}>DATE</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "33%" }]}>
              <Text style={styles.tableCellHeader}>JOBS</Text>
            </View>
            <View
              style={[
                styles.tableColHeader,
                { width: "33%", textAlign: "right" },
              ]}
            >
              <Text style={styles.tableCellHeader}>AMOUNT CASH HELD</Text>
            </View>
          </View>

          {sortedDates.map((date) => (
            <View style={styles.tableRow} key={date}>
              <View style={[styles.tableCol, { width: "33%" }]}>
                <Text style={styles.tableCell}>{date}</Text>
              </View>
              <View style={[styles.tableCol, { width: "33%" }]}>
                <Text style={styles.tableCell}>
                  {bookingsByDate[date].length}
                </Text>
              </View>
              <View
                style={[styles.tableCol, { width: "33%", textAlign: "right" }]}
              >
                <Text style={[styles.tableCell, { textAlign: "right" }]}>
                  ${calcDayPayment(bookingsByDate[date])}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Total Amount Section */}
        <View
          style={{
            padding: 10,
            backgroundColor: "#f8f9fa",
            borderRadius: 8,
            marginTop: 10,
            marginHorizontal: 23,
          }}
        >
          <View>
            <Text style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>
              Grand Total
            </Text>

            <Text style={{ fontSize: 12, fontWeight: "500", color: "#d9534f" }}>
              ${finalDriverPay}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
