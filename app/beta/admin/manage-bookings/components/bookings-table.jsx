"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Select,
  SelectItem,
  Badge,
  Skeleton,
  Tooltip,
} from "@heroui/react";

import {
  getStatusColor,
  toCapitalize,
  parseDeliveredDate,
} from "../utils/booking-helpers";
import formatToSydneyTime from "@/lib/utils/formatToSydneyTime";
import useFirebasePaginatedCollection from "../hooks/use-bookings";
import Notes from "@/components/tableSort/ManageInvoices/InvoiceAction/notes/Notes";
import Assigned from "@/components/tableSort/ManageInvoices/InvoiceAction/Assigned";
import DeleteInvoice from "@/components/tableSort/ManageInvoices/InvoiceAction/DeleteInvoice";
import StatusDropdown from "@/components/tableSort/ManageInvoices/InvoiceAction/StatusDropdown";
import InvoicePOD from "@/components/tableSort/ManageInvoices/InvoiceAction/pod_invoice_modal/Modal";
import EditInvoice from "@/components/tableSort/ManageInvoices/InvoiceAction/edit_invoice_modal/Modal";
import TrackDriver from "@/components/tableSort/ManageInvoices/InvoiceAction/TrackDriver/TrackDriverModal";
import FixPriceModal from "@/components/tableSort/ManageInvoices/InvoiceAction/edit_invoice_modal/FixPriceModal";

export function BookingsTable({ isArchived = false, hideAction = false }) {
  const {
    data: bookings,
    loading,
    error,
    hasNextPage,
    hasPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
  } = useFirebasePaginatedCollection("place_bookings");

  if (loading) {
    return (
      <div className="w-full space-y-4">
        <div className="flex gap-4">
          {columns.map((col, index) => (
            <Skeleton
              key={index}
              className="h-8 rounded-lg"
              style={{ width: col.width }}
            />
          ))}
        </div>
        {[...Array(50)].map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4">
            {columns.map((col, colIndex) => (
              <Skeleton
                key={`${rowIndex}-${colIndex}`}
                className="h-12 rounded-lg w-full"
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Place Bookings</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden min-h-screen">
        <Table
          isCompact={true}
          fullWidth={true}
          aria-label="Bookings table"
          shadow="none"
        >
          <TableHeader>
            {columns.map((column) => (
              <TableColumn
                key={column.key}
                className="text-xs font-medium"
                style={{ width: column.width }}
              >
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody isLoading={loading} className="">
            {bookings.map((booking) => {
              const formattedDate =
                booking.date && booking.time
                  ? `${booking.date} ${booking.time}`
                  : "N/A";

              const createdAt = booking.createdAtStandardized
                ? formatToSydneyTime(booking.createdAtStandardized)
                : "N/A";

              const deliveredDate = booking.progressInformation?.delivered
                ? parseDeliveredDate(booking.progressInformation.delivered)
                : "N/A";

              const pickupSuburb =
                booking.pickupSuburb ||
                booking.distanceData?.suburbs?.find((s) => s?.type === "origin")
                  ?.suburb ||
                "Not Available";

              const deliverySuburb =
                booking.deliverySuburb ||
                booking.distanceData?.suburbs?.find(
                  (s) => s?.type === "destination"
                )?.suburb ||
                "Not Available";

              const totalPrice = (
                Number(booking.totalPriceWithGST || 0) +
                Number(booking.totalTollsCost || 0)
              ).toFixed(2);

              const status = toCapitalize(booking.currentStatus) || "Pending";
              const driverName = toCapitalize(booking.driverName) || "N/A";

              return (
                <TableRow key={booking.id}>
                  <TableCell>
                    {booking.isNew && (
                      <Badge color="primary" variant="flat" size="sm">
                        New
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm"> {booking.returnType || "N/A"}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm"> {booking.docId || "N/A"}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm"> {formattedDate}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm"> {createdAt}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm"> {deliveredDate}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm"> {booking.userName || "N/A"}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm"> {pickupSuburb}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm"> {deliverySuburb}</p>
                  </TableCell>
                  <TableCell>${totalPrice}</TableCell>
                  <TableCell>
                    <p className="text-sm">
                      <Badge
                        color={getStatusColor(booking.currentStatus)}
                        variant="flat"
                      >
                        {status}
                      </Badge>
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{driverName}</p>
                  </TableCell>
                  <TableCell>
                    <ActionButtons booking={booking} isArchived={isArchived} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="flex justify-center px-4">
          {loading ? (
            <Button isIconOnly> </Button>
          ) : (
            <>
              <Button
                onClick={fetchPreviousPage}
                disabled={!hasPreviousPage || loading}
              >
                Previous
              </Button>
              <Button
                onClick={fetchNextPage}
                disabled={!hasNextPage || loading}
              >
                Next
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const ActionButtons = ({ booking, isArchived }) => (
  <div className="flex gap-2">
    <StatusDropdown booking={booking} />
    <FixPriceModal booking={booking} />
    <Assigned booking={booking} />
    <Notes booking={booking} />
    <EditInvoice id={booking.docId || ""} />
    <InvoicePOD id={booking.docId || ""} />
    <TrackDriver booking={booking} />
    <DeleteInvoice
      isArchived={isArchived}
      id={booking.docId}
      booking={booking}
    />
  </div>
);

const columns = [
  { key: "isOpened", label: "", width: 40 },
  { key: "returnType", label: "JOB CODE", width: 60 },
  { key: "docId", label: "JOB NUMBER", width: 100 },
  { key: "date", label: "READY DATE & TIME", width: 170 },
  { key: "createdAt", label: "BOOKING CREATED", width: 170 },
  { key: "delivered", label: "DELIVERED", width: 170 },
  { key: "userName", label: "CUSTOMER", width: 100 },
  { key: "pickupSuburb", label: "PICKUP SUBURB", width: 100 },
  { key: "deliverySuburb", label: "DELIVERY SUBURB", width: 100 },
  { key: "totalPriceWithGST", label: "INVOICE", width: 100 },
  { key: "currentStatus", label: "STATUS", width: 100 },
  { key: "driverName", label: "DRIVER NAME", width: 90 },
  { key: "actions", label: "ACTIONS", width: 500 },
].filter(Boolean);
