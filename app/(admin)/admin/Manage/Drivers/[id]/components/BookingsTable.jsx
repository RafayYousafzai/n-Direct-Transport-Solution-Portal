import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@heroui/react";

const colors = [
  "default",
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
];

export default function BookingsTable({ bookings }) {
  const [selectedColor, setSelectedColor] = React.useState("default");

  console.log(bookings);

  return (
    <div className="flex flex-col justify-center align-middle items-center gap-3">
      <Table
        color={selectedColor}
        className="w-min"
        aria-label="Example static collection table"
      >
        <TableHeader>
          <TableColumn>Username</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Invoice</TableColumn>
          <TableColumn>Origin</TableColumn>
          <TableColumn>Destination</TableColumn>
        </TableHeader>
        <TableBody>
          {bookings.map(
            ({
              currentStatus,
              totalPriceWithGST,
              userEmail,
              userName,
              address,
            }) => {
              return (
                <TableRow key={userEmail}>
                  <TableCell>{userName}</TableCell>
                  <TableCell>{userEmail}</TableCell>
                  <TableCell>
                    <Chip color="warning" className="capitalize">
                      {currentStatus}
                    </Chip>
                  </TableCell>
                  <TableCell>{totalPriceWithGST}</TableCell>
                  <TableCell width={200}>
                    {address?.Destination?.label}
                  </TableCell>
                  <TableCell width={200}>- {address?.Origin?.label}</TableCell>
                </TableRow>
              );
            }
          )}
        </TableBody>
      </Table>
    </div>
  );
}
