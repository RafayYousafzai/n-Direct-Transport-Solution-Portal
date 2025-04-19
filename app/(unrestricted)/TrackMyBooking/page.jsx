"use client";

import { useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/api/firebase/functions/fetch";
import { useSearchParams } from "next/navigation";
import {
  TextField,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { Button } from "@heroui/react";
import { CalendarMonth, CheckCircle, FireTruck } from "@mui/icons-material";
import { IconClock } from "@tabler/icons-react";

export default function BookingTracker() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [reference, setReference] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const urlReference = searchParams.get("reference");
    if (urlReference) {
      setReference(urlReference);
      handleSubmit(null, urlReference);
    }
  }, [searchParams]);

  const handleSubmit = async (e, urlRef = null) => {
    if (e) e.preventDefault();
    const ref = urlRef || reference;
    if (!ref) {
      alert("Please enter a reference");
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, "place_bookings", ref);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBookingData(docSnap.data());
        setShow(true);
      } else {
        alert("Booking Not Found");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Card
        sx={{ maxWidth: 500, width: "100%", boxShadow: 3, borderRadius: 2 }}
      >
        <CardContent>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            color="primary"
            sx={{ mb: 2 }}
          >
            Track Bookings
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Enter your job number to track your booking
          </Typography>

          {show ? (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  color: "#1976d2",
                }}
              >
                <CalendarMonth sx={{ width: 24, height: 24, mr: 1 }} />
                <Typography variant="body1">
                  <strong>Booked:</strong> {bookingData?.date}{" "}
                  {bookingData?.time}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  color: "#4caf50",
                }}
              >
                <FireTruck sx={{ width: 24, height: 24, mr: 1 }} />
                <Typography variant="body1">
                  <strong>Picked Up:</strong>{" "}
                  {bookingData?.progressInformation?.pickedup}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  color: "#9c27b0",
                }}
              >
                <CheckCircle sx={{ width: 24, height: 24, mr: 1 }} />
                <Typography variant="body1">
                  <strong>Status:</strong> {bookingData?.currentStatus}
                </Typography>
              </Box>
              <Button
                color="primary"
                sx={{ mt: 2, width: "100%" }}
                onClick={() => {
                  setShow(false);
                  setReference("");
                }}
              >
                Track Another Booking
              </Button>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Job Number"
                variant="outlined"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                disabled={loading}
                sx={{ mb: 2 }}
              />
              <Button
                color="primary"
                sx={{ width: "100%" }}
                type="submit"
                disabled={loading}
                endIcon={
                  loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <IconClock />
                  )
                }
              >
                {loading ? "Loading..." : "Track Booking"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
// https://yoursite.com/TrackMyBooking?reference=123456
