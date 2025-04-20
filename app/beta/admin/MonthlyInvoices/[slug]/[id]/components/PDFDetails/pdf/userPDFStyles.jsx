import { StyleSheet } from "@react-pdf/renderer";
import { Font } from "@react-pdf/renderer";

Font.register({
  family: "Open Sans",
  src: "https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0e.ttf",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0e.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN7rgOUuhs.ttf",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 48,
  },
  leftHeader: {
    flexDirection: "column",
  },
  logo: {
    width: 250,
    height: 110,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    fontFamily: "Open Sans",
    fontWeight: "bold",
  },
  companyDetails: {
    fontSize: 10,
    marginBottom: 2,
  },
  invoiceHeader: {
    marginBottom: 30,
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: "black",
    marginBottom: 20,
    fontFamily: "Open Sans",
    fontWeight: "bold",
  },
  invoiceDetails: {
    flexDirection: "row",
  },
  invoiceRow: {
    flexDirection: "column",
    gap: 4,
  },
  label: {
    fontSize: 12,
    width: 110,
    fontWeight: "bold",
    fontFamily: "Open Sans",
    fontWeight: "bold",
  },
  value: {
    fontSize: 10,
    width: 180,
    fontWeight: "bold",
  },
  headerText: {
    fontSize: 12,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    margin: "10px 0",
  },
  tableRow: {
    flexDirection: "row",
    maxHeight: 50,
  },
  tableColHeader: {
    width: "12%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    backgroundColor: "#f3f3f3",
    padding: 5,
  },
  tableCol: {
    width: "12%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    padding: 5,
    wordWrap: "break-word", // For older browsers
    overflowWrap: "break-word", // Modern browsers
    wordBreak: "break-all", // Break long words
    overflow: "hidden",
    whiteSpace: "normal",
  },

  tableCellHeader: {
    fontSize: 10,
    fontWeight: "bold",
    wordWrap: "break-word", // For older browsers
    overflowWrap: "break-word", // Modern browsers
    wordBreak: "break-all", // Break long words
    overflow: "hidden",
    whiteSpace: "normal",
  },

  tableCell: {
    fontSize: 8,
    wordWrap: "break-word", // For older browsers
    overflowWrap: "break-word", // Modern browsers
    wordBreak: "break-all", // Break long words
    overflow: "hidden",
    whiteSpace: "normal",
  },
  image: {
    width: 200,
    height: 100,
  },

  heading: {
    fontSize: 15,
    fontWeight: "extrabold",
    margin: "10px 0",
  },

  para: {
    fontSize: 10,
    fontWeight: "hairline",
  },
  boldText: {
    fontSize: 12,
    fontWeight: "extrabold",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
    width: "300px",
  },
  rowItem1: {
    fontSize: 12,
    fontWeight: "extrabold",
    width: "50%",
  },
  rowItem2: {
    fontSize: 12,
    width: "50%",
  },
});

export default styles;
