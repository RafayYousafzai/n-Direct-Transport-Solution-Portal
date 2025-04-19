/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { pdf } from "@react-pdf/renderer";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "@/api/firebase/config";
import { Button, Spinner } from "@heroui/react";
import { postDoc } from "@/api/firebase/functions/upload";
import LayoutSelector from "./PdfLayout";
import toast from "react-hot-toast";
import PDFLayout1 from "./PDFLayout1";
import PDFLayout2 from "./PDFLayout2";
import PDFLayoutDriver from "./PDFLayoutDriver";
import { calculateInvoiceDetails } from "./getTotalInvoicePrice";

const storage = getStorage(app);

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <Spinner />,
  }
);

export default function PdfButton({
  user,
  bookings,
  datesRange,
  driverLayout,
  pdfId,
}) {
  const [uploading, setUploading] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState("Layout2");
  const [pay, setPay] = useState(null);

  const bookingCount = bookings.length;
  const pdfFileName = `monthly_bookings_${user.firstName}_${pdfId}.pdf`;

  console.log({
    bookings,
  });

  const PDFDocument = useMemo(() => {
    if (driverLayout) {
      const { finalDriverPay } = calculateInvoiceDetails(bookings, user);
      setPay(finalDriverPay);
      return (
        <PDFLayoutDriver
          datesRange={datesRange}
          invoices={bookings}
          user={user}
          pdfId={pdfId}
        />
      );
    }
    return (
      <PDFLayout2
        datesRange={datesRange}
        invoices={bookings}
        user={user}
        pdfId={pdfId}
      />
    );
    // return selectedLayout === "Layout2" ? (
    //   <PDFLayout2
    //     datesRange={datesRange}
    //     invoices={bookings}
    //     user={user}
    //     pdfId={pdfId}
    //   />
    // ) : (
    //   <PDFLayout1
    //     datesRange={datesRange}
    //     invoices={bookings}
    //     user={user}
    //     pdfId={pdfId}
    //   />
    // );
  }, [driverLayout, selectedLayout, bookings, user, pdfId]);

  const handleUpload = async () => {
    setUploading(true);
    try {
      const blob = await pdf(PDFDocument).toBlob();
      const storageRef = ref(storage, `pdfs/${pdfFileName}`);

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      await postDoc(
        {
          firstName: user.firstName,
          email: user.email,
          billingEmail: user?.billingEmail || null,
          url: downloadURL,
          createdAt: new Date(),
          datesRange,
          pdfId: pdfId || "",
          finalDriverPay: pay,
        },
        "generatedPdfs"
      );

      toast.success("PDF uploaded successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error uploading PDF:", error);
      toast.error("Failed to upload PDF");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* {!driverLayout && (
        <LayoutSelector
          selectedLayout={selectedLayout}
          setSelectedLayout={setSelectedLayout}
        />
      )} */}

      {bookingCount > 0 && (
        <div className="flex justify-center space-x-4">
          <PDFDownloadLink
            document={PDFDocument}
            fileName={pdfFileName}
            className="inline-flex items-center px-4 py-2 text-white bg-red-600 border border-transparent rounded-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {({ loading }) =>
              loading ? <Spinner color="white" /> : <span>Download PDF</span>
            }
          </PDFDownloadLink>

          <Button
            onClick={handleUpload}
            disabled={uploading}
            color="primary"
            className="rounded-full"
          >
            {uploading ? <Spinner color="white" /> : "Save PDF"}
          </Button>
        </div>
      )}
    </>
  );
}
