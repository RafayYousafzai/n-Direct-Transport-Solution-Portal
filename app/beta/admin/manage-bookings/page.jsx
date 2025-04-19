"use client";
import { app } from "@/api/firebase/config";
import { getFirestore } from "firebase/firestore";
import { BookingsTable } from "./components/bookings-table";
import { BookingsPagination } from "./components/bookings-pagination";
import { BookingsHeader } from "./components/bookings-header";
import { useBookings } from "./hooks/use-bookings";

const db = getFirestore(app);

export default function BookingsPage({
  isArchived = false,
  hideAction = false,
}) {
  const {
    bookings,
    loading,
    loadingMore,
    error,
    totalBookings,
    page,
    hasMore,
    handleNextPage,
    handlePrevPage,
  } = useBookings(db);

  return (
    <div className="container mx-auto px-4 py-6">
      <BookingsHeader totalBookings={totalBookings} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="bg-white  rounded-lg border shadow-sm overflow-hidden">
        <BookingsTable
          bookings={bookings}
          loading={loading}
          loadingMore={loadingMore}
          isArchived={isArchived}
          hideAction={hideAction}
        />
      </div>

      <BookingsPagination
        page={page}
        hasMore={hasMore}
        loading={loading}
        loadingMore={loadingMore}
        totalBookings={totalBookings}
        itemsPerPage={10}
        bookingsCount={bookings.length}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
      />
    </div>
  );
}
