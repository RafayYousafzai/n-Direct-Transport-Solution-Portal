"use client"

import { useState, useEffect } from "react"
import { collection, query, orderBy, limit, startAfter, getDocs, type Firestore } from "firebase/firestore"

const ITEMS_PER_PAGE = 200

export function useBookings(db: Firestore) {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [lastDoc, setLastDoc] = useState<any>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalBookings, setTotalBookings] = useState(0)

  const fetchBookings = async () => {
    try {
      if (page === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }
      setError(null)

      const bookingsRef = collection(db, "place_bookings")
      let q

      if (page === 1) {
        q = query(bookingsRef, orderBy("createdAt", "desc"), limit(ITEMS_PER_PAGE))
      } else {
        q = query(bookingsRef, orderBy("createdAt", "desc"), startAfter(lastDoc), limit(ITEMS_PER_PAGE))
      }

      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        setHasMore(false)
        return
      }

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
      setLastDoc(lastVisible)

      const bookingsData = querySnapshot.docs.map((docSnap, index) => ({
        id: docSnap.id,
        docId: docSnap.id,
        ...docSnap.data(),
        isNew: index === 0 && page === 1,
      }))

      if (page === 1) {
        setBookings(bookingsData)
      } else {
        setBookings((prev) => [...prev, ...bookingsData])
      }

      setHasMore(querySnapshot.docs.length === ITEMS_PER_PAGE)
    } catch (err) {
      console.error("Error fetching bookings:", err)
      setError("Failed to load bookings. Please try again.")
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const fetchTotalBookings = async () => {
    try {
      const bookingsRef = collection(db, "place_bookings")
      const snapshot = await getDocs(bookingsRef)
      setTotalBookings(snapshot.size)
    } catch (err) {
      console.error("Error counting bookings:", err)
    }
  }

  useEffect(() => {
    fetchTotalBookings()
    fetchBookings()
  }, [page])

  const handleNextPage = () => {
    if (hasMore) {
      setPage((prev) => prev + 1)
    }
  }

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1)
    }
  }

  return {
    bookings,
    loading,
    loadingMore,
    error,
    totalBookings,
    page,
    hasMore,
    handleNextPage,
    handlePrevPage,
  }
}
