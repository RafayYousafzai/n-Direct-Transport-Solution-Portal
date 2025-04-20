"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@heroui/react";

interface BookingsPaginationProps {
  page: number;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  totalBookings: number;
  itemsPerPage: number;
  bookingsCount: number;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export function BookingsPagination({
  page,
  hasMore,
  loading,
  loadingMore,
  totalBookings,
  itemsPerPage,
  bookingsCount,
  onNextPage,
  onPrevPage,
}: BookingsPaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
      <div className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> to{" "}
        <span className="font-medium">
          {(page - 1) * itemsPerPage + bookingsCount}
        </span>{" "}
        of <span className="font-medium">{totalBookings}</span> bookings
      </div>

      <div className="flex space-x-2">
        <Button
          size="sm"
          onClick={onPrevPage}
          disabled={page === 1 || loading || loadingMore}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button
          isLoading={loading || loadingMore}
          size="sm"
          onClick={onNextPage}
          disabled={!hasMore || loading || loadingMore}
          className="flex items-center"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
