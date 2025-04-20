import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFF",
    padding: 10,
  },
  header: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  companyInfo: {
    fontSize: 12,
    fontWeight: "bold",
  },
  invoiceType: {
    fontSize: 10,
    marginTop: 4,
  },
  headerDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  driverInfo: {
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingLeft: 10,
  },
  invoiceInfo: {
    flexDirection: "column",
    alignItems: "flex-end",
    paddingRight: 10,
  },
  para: {
    fontSize: 10,
  },
  image: {
    width: 200,
    height: 100,
  },
  table: {
    display: "table",
    width: "auto",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#bfbfbf",
    margin: "10px 0",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    padding: 5,
  },
  tableCol: {
    padding: 5,
    overflow: "hidden",
    whiteSpace: "normal",
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: "bold",
    overflow: "hidden",
    whiteSpace: "normal",
  },
  tableCell: {
    fontSize: 8,
    overflow: "hidden",
    whiteSpace: "normal",
  },
  grandTotalSection: {
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  grandTotalLabel: {
    fontSize: 10,
    color: "#555",
    marginBottom: 4,
  },
  grandTotalAmount: {
    fontSize: 12,
    fontWeight: "500",
    color: "#d9534f",
  },
});

export default styles;
