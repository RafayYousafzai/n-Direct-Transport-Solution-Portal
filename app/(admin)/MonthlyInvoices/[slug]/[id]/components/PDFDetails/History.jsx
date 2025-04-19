"use client";
import { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  ButtonGroup,
  Chip,
} from "@heroui/react";
import emailjs from "emailjs-com";
import toast from "react-hot-toast";
import formatToSydneyTime from "@/lib/utils/formatToSydneyTime";
import useAdminContext from "@/context/AdminProvider";
import { getInvoice } from "@/server/Paypal/api";
import { FolderOpen, Mail, TrashIcon } from "lucide-react";
import { IconBrandPaypal } from "@tabler/icons-react";
import { fetchMyPdfsOfDoc } from "@/api/firebase/functions/fetch";
import { deleteDocument, updateDoc } from "@/api/firebase/functions/upload";
import sendInvoice from "@/server/Paypal/sendInvoice";

export default function History({ email }) {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statuses, setStatuses] = useState({}); // Store status for each PDF
  const { allUsers } = useAdminContext();

  useEffect(() => {
    fetchPdfs();
  }, []);

  // Fetch PDFs
  const fetchPdfs = async () => {
    try {
      const pdfs = await fetchMyPdfsOfDoc(email);
      const sortedPdfs = pdfs
        .filter(
          (pdf) => pdf.createdAt && typeof pdf.createdAt.toDate === "function"
        )
        .sort(
          (a, b) =>
            b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()
        );
      setPdfs(sortedPdfs);
    } catch (err) {
      console.error("Error fetching PDFs:", err);
      setError("Failed to fetch PDFs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch invoice statuses for all PDFs with PayPal IDs
  useEffect(() => {
    const fetchStatuses = async () => {
      const statusMap = {};
      for (const pdf of pdfs) {
        if (pdf.paypal_id) {
          const status = await handleGetInvoiceStatus(pdf);
          statusMap[pdf.id] = status;
        }
      }
      setStatuses(statusMap);
    };

    if (pdfs.length > 0) {
      fetchStatuses();
    }
  }, [pdfs]);

  // Delete a PDF
  const handleDeletePdf = async (docId) => {
    const toastId = toast.loading("Deleting PDF...");
    try {
      await deleteDocument("generatedPdfs", docId);
      setPdfs((prev) => prev.filter((pdf) => pdf.id !== docId));
      toast.success("PDF deleted successfully!", { id: toastId });
    } catch (err) {
      console.error("Error deleting PDF:", err);
      toast.error("Failed to delete PDF. Please try again.", { id: toastId });
    }
  };

  // Send an email
  const handleSendEmail = async (toEmail, url) => {
    const cleanEmail = toEmail.trim();
    const toastId = toast.loading("Sending email...");

    try {
      await emailjs.send(
        "service_i9cmmnr",
        "template_n4vn10i",
        {
          toEmail: cleanEmail,
          url: url,
          download: url,
        },
        "vYni03aqa3sHW_yf9"
      );
      toast.success(`Email sent to: ${cleanEmail}`, { id: toastId });
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send the email. Please try again.", {
        id: toastId,
      });
    }
  };

  const handlePayPalInvoice = useCallback(
    async (pdf) => {
      const { finalDriverPay, pdfId, firstName, docId, datesRange } = pdf;
      const toastId = toast.loading("Creating PayPal invoice...");
      const user = allUsers.find((user) => user?.email === pdf?.email);
      const sendingEmail = user?.billingEmail || user?.email;
      const cleanEmail = sendingEmail.trim();

      if (!finalDriverPay || !pdfId || !firstName || !user?.payPalEmail) {
        toast.error(
          "Invalid invoice data. Please retry creating a new invoice.",
          { id: toastId }
        );
        return;
      }

      try {
        const response = await sendInvoice(
          finalDriverPay,
          pdfId,
          firstName,
          user.payPalEmail,
          datesRange
        );

        if (!response.success) {
          const errorMessage =
            response.error?.details?.[0]?.issue === "DUPLICATE_INVOICE_NUMBER"
              ? "This invoice is already created."
              : response.error?.details?.[0]?.issue || "An error occurred.";
          toast.error(response.error.details[0].description, { id: toastId });
          return;
        }

        await updateDoc("generatedPdfs", docId, {
          paypal_id: response.invoiceId,
          paypal_link: response.data.href,
        });

        await emailjs.send(
          "service_i9cmmnr",
          "template_txk0pyh",
          {
            driver_email: cleanEmail,
            driver_name: firstName,
            paypal_link: response.data.href,
            firstName,
            finalDriverPay,
          },
          "vYni03aqa3sHW_yf9"
        );

        fetchPdfs();
        toast.success("PayPal invoice created and sent successfully!", {
          id: toastId,
        });
      } catch (error) {
        console.error("Error handling PayPal invoice:", error);
        toast.error("Failed to process PayPal invoice. Please try again.", {
          id: toastId,
        });
      }
    },
    [allUsers]
  );

  // Get invoice status
  const handleGetInvoiceStatus = async (pdf) => {
    const { paypal_id } = pdf;

    if (!paypal_id) {
      return "No Status";
    }

    try {
      const details = await getInvoice(paypal_id);
      let statusMessage = details.status;

      if (details.status === "SENT") {
        const dueDate = new Date(details.detail.payment_term.due_date);
        const today = new Date();

        if (details.due_amount.value > 0) {
          if (today > dueDate) {
            statusMessage = "UNPAID";
          } else {
            statusMessage = "DUE";
          }
        } else {
          statusMessage = "PAID";
        }
      }

      return statusMessage;
    } catch (error) {
      console.error("Error fetching invoice status:", error);
      toast.error("Failed to fetch invoice status. Please try again.");
      return "Error";
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <Table aria-label="PDF History Table">
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Created At</TableColumn>
        <TableColumn>Date Range</TableColumn>
        <TableColumn>More Information</TableColumn>
        <TableColumn>Action</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"No rows to display."}>
        {pdfs.map((pdf) => {
          const user = allUsers.find((user) => user?.email === pdf?.email);
          const sendingEmail = user?.billingEmail || user?.email;
          const status = statuses[pdf.id] || "Loading...";

          return (
            <TableRow key={pdf.id}>
              <TableCell>{pdf?.firstName || pdf?.userName}</TableCell>
              <TableCell>{formatToSydneyTime(pdf.createdAt)}</TableCell>
              <TableCell>{`${pdf?.datesRange?.start} - ${pdf?.datesRange?.end}`}</TableCell>
              <TableCell>
                <Chip size="sm">{pdf?.pdfId}</Chip>
                {pdf?.paypal_id && (
                  <div>
                    <Chip className="my-1" size="sm">
                      {pdf?.paypal_id}
                    </Chip>
                    <Chip size="sm" color="primary">
                      {status}
                    </Chip>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <ButtonGroup size="sm">
                  <Button startContent={<FolderOpen className="size-3" />}>
                    <a
                      href={pdf?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      View
                    </a>
                  </Button>
                  <Button
                    startContent={<TrashIcon className="size-3" />}
                    onClick={() => handleDeletePdf(pdf?.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    startContent={<Mail className="size-3" />}
                    onClick={() => handleSendEmail(sendingEmail, pdf?.url)}
                  >
                    Email
                  </Button>
                  <Button
                    startContent={<IconBrandPaypal className="size-3" />}
                    onClick={() => handlePayPalInvoice(pdf)}
                    color="primary"
                  >
                    PayPal
                  </Button>
                </ButtonGroup>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
