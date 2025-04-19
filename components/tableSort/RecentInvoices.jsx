"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PdfButton } from "@/components/Index";
import TrackDriver from "./ManageInvoices/InvoiceAction/TrackDriver/TrackDriverModal";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Pagination } from "@heroui/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parse } from "date-fns";

export default function RecentInvoices({ place_booking }) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const rowsPerPage = 10;

  const parseDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string") return new Date(0);
    return parse(dateStr, "dd/MM/yyyy", new Date());
  };

  const sortedBookings = useMemo(() => {
    return place_booking
      .filter((booking) => booking?.date && booking?.returnType)
      .sort((a, b) => {
        if (sortBy === "date") {
          const dateA = parseDate(a.date).getTime();
          const dateB = parseDate(b.date).getTime();
          return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        } else if (sortBy === "invoice") {
          const invoiceA =
            Number(a?.totalPriceWithGST || 0) + Number(a?.totalTollsCost || 0);
          const invoiceB =
            Number(b?.totalPriceWithGST || 0) + Number(b?.totalTollsCost || 0);
          return sortOrder === "desc"
            ? invoiceB - invoiceA
            : invoiceA - invoiceB;
        }
        return 0;
      });
  }, [place_booking, sortBy, sortOrder]);

  // Pagination Logic
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedBookings.slice(start, start + rowsPerPage);
  }, [page, sortedBookings]);

  // Handle navigation
  const handleNavigate = (id) => router.push(`/RecentInvoices/${id}`);

  const userDoc = JSON.parse(localStorage.getItem("userDoc")) || {};

  // Render each row
  const renderTableRow = (row) => (
    <TableRow key={row.docId}>
      <TableCell className="font-medium">{row.returnType}</TableCell>
      <TableCell>{row.docId}</TableCell>
      <TableCell>{row.date}</TableCell>
      <TableCell>
        $$
        {(
          Number(row?.totalPriceWithGST || 0) + Number(row?.totalTollsCost || 0)
        ).toFixed(2)}
      </TableCell>
      <TableCell>
        <Badge variant="outline">
          <p className="uppercase text-gray-800">
            {row?.currentStatus || "Pending"}
          </p>
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNavigate(row.docId)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          {userDoc && userDoc?.tracking && (
            <TrackDriver customBtn={true} booking={row} />
          )}
        </div>
      </TableCell>
      <TableCell>
        <PdfButton invoice={row} />
      </TableCell>
    </TableRow>
  );

  return (
    <Card className="w-full max-w-6xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
        <CardDescription>View and manage your recent invoices</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4 space-x-4">
          {/* Sort By Dropdown */}
          <Select value={sortBy} onValueChange={setSortBy} className="bg-white">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="invoice">Invoice Amount</SelectItem>
            </SelectContent>
          </Select>
          {/* Sort Order Dropdown */}
          <Select
            value={sortOrder}
            onValueChange={setSortOrder}
            className="bg-white"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Type</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>View</TableHead>
              <TableHead>Download Invoice</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row) => renderTableRow(row))}
          </TableBody>
        </Table>
        {/* Pagination */}
        <div className="flex w-full justify-center mt-4">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={Math.ceil(sortedBookings.length / rowsPerPage)}
            onChange={setPage}
          />
        </div>
      </CardContent>
    </Card>
  );
}
