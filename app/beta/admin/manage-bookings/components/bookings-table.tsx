import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { BookingActions } from "./booking-actions"
import { getStatusColor, toCapitalize, parseDeliveredDate } from "../utils/booking-helpers"
import formatToSydneyTime from "@/lib/utils/formatToSydneyTime"

interface BookingsTableProps {
  bookings: any[]
  loading: boolean
  loadingMore: boolean
  isArchived?: boolean
  hideAction?: boolean
}

export function BookingsTable({
  bookings,
  loading,
  loadingMore,
  isArchived = false,
  hideAction = false,
}: BookingsTableProps) {
  const columns = [
    {
      field: "isOpened",
      headerName: "",
      width: "w-16",
      renderCell: (booking: any) =>
        booking.isNew ? (
          <Badge variant="default" className="rounded-full">
            New
          </Badge>
        ) : null,
    },
    { field: "returnType", headerName: "Job Code", width: "w-24" },
    { field: "docId", headerName: "Job Number", width: "w-32" },
    {
      field: "date",
      headerName: "Ready Date & Time",
      width: "w-48",
      valueGetter: (booking: any) => booking.date + " " + booking.time,
    },
    {
      field: "createdAt",
      headerName: "Booking Created",
      width: "w-40",
      valueGetter: (booking: any) => formatToSydneyTime(booking?.createdAtStandardized),
    },
    hideAction && {
      field: "delivered",
      headerName: "Delivered",
      width: "w-40",
      valueGetter: (booking: any) =>
        booking?.progressInformation?.delivered && parseDeliveredDate(booking?.progressInformation?.delivered),
    },
    { field: "userName", headerName: "Customer", width: "w-32" },
    {
      field: "pickupSuburb",
      headerName: "Pickup Suburb",
      width: "w-32",
      valueGetter: (booking: any) => {
        const originSuburbs = booking?.distanceData?.suburbs?.filter((s: any) => s.type === "origin")
        return booking?.pickupSuburb || originSuburbs?.[0]?.suburb || "Not Available"
      },
    },
    {
      field: "deliverySuburb",
      headerName: "Delivery Suburb",
      width: "w-32",
      valueGetter: (booking: any) => {
        const deliverySuburbs = booking?.distanceData?.suburbs?.filter((s: any) => s.type === "destination")
        return booking?.deliverySuburb || deliverySuburbs?.[0]?.suburb || "Not Available"
      },
    },
    {
      field: "totalPriceWithGST",
      headerName: "Invoice",
      width: "w-24",
      valueGetter: (booking: any) =>
        "$" + (Number(booking?.totalPriceWithGST) + Number(booking?.totalTollsCost || 0)).toFixed(2),
    },
    {
      field: "currentStatus",
      headerName: "Status",
      width: "w-28",
      renderCell: (booking: any) => (
        <Badge
          variant="outline"
          className="font-medium"
          style={{
            backgroundColor: getStatusColor(booking?.currentStatus),
            color: "#fff",
            borderColor: getStatusColor(booking?.currentStatus),
          }}
        >
          {toCapitalize(booking?.currentStatus) || "Pending"}
        </Badge>
      ),
    },
    !hideAction && {
      field: "driverName",
      headerName: "Driver Name",
      width: "w-32",
      valueGetter: (booking: any) => toCapitalize(booking?.driverName) || "N/A",
    },
    !hideAction && {
      field: "actions",
      headerName: "Actions",
      width: "w-auto",
      renderCell: (booking: any) => <BookingActions booking={booking} isArchived={isArchived} />,
    },
  ].filter(Boolean)

  if (loading) {
    return <TableSkeleton columns={columns} />
  }

  if (bookings.length === 0 && !loading) {
    return <div className="p-8 text-center text-muted-foreground">No bookings found</div>
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column: any) => (
              <TableHead key={column.field} className={`${column.width} text-xs font-medium`}>
                {column.headerName}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id} className="hover:bg-muted/50">
              {columns.map((column: any) => (
                <TableCell key={`${booking.id}-${column.field}`} className="py-3 text-sm">
                  {column.renderCell
                    ? column.renderCell(booking)
                    : column.valueGetter
                      ? column.valueGetter(booking)
                      : booking[column.field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {loadingMore && <LoadingRows columns={columns} />}
        </TableBody>
      </Table>
    </div>
  )
}

function TableSkeleton({ columns }: { columns: any[] }) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex space-x-4 mb-6">
        {columns.map((col, idx) => (
          <Skeleton key={idx} className={`h-6 ${col.width}`} />
        ))}
      </div>
      {[...Array(5)].map((_, idx) => (
        <div key={idx} className="flex space-x-4">
          {columns.map((col, colIdx) => (
            <Skeleton key={colIdx} className={`h-10 ${col.width}`} />
          ))}
        </div>
      ))}
    </div>
  )
}

function LoadingRows({ columns }: { columns: any[] }) {
  return (
    <>
      {[...Array(3)].map((_, idx) => (
        <TableRow key={`loading-${idx}`}>
          {columns.map((col, colIdx) => (
            <TableCell key={`loading-cell-${colIdx}`}>
              <Skeleton className="h-6 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}
