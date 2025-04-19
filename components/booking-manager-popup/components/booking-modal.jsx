"use client";
import Image from "next/image";
import { Package, User, ImageIcon, FileSignature } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@heroui/react";
import { deleteDocument } from "@/api/firebase/functions/upload";

export default function BookingModal({ booking, onClose }) {
  const data = booking?.booking;

  const handleMarkRead = async () => {
    await deleteDocument("deriver_bookings_status", booking.bookingId);
    onClose();
  };
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Booking {booking.bookingId}
            </DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[72vh] pr-4">
          <div className="space-y-6">
            {/* Booking Information */}
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-2 font-medium">Booking Information</h3>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Booking ID
                  </span>
                  <Badge variant="outline">{booking.bookingId}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Last Updated
                  </span>
                  <span className="text-sm">{booking.serverTimestamp}</span>
                </div>
              </div>
            </div>

            {/* Receiver Information */}
            {data?.receiverName && (
              <div className="rounded-lg border bg-card p-4">
                <h3 className="mb-2 font-medium">Receiver Information</h3>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{data.receiverName}</span>
                </div>
              </div>
            )}

            {/* Pickup Images */}
            {data?.pickupImages?.length > 0 && (
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-medium">
                  <ImageIcon className="h-4 w-4" /> Pickup Images
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {data.pickupImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square overflow-hidden rounded-lg border"
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Pickup Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Images */}
            {data?.images?.length > 0 && (
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-medium">
                  <ImageIcon className="h-4 w-4" /> Delivery Images
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {data.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square overflow-hidden rounded-lg border"
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Delivery Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pickup Signature */}
            {data?.signUrl && (
              <div className="mt-6 space-y-4">
                <h3 className="flex items-center gap-2 font-medium">
                  <FileSignature className="h-4 w-4" /> Signature
                </h3>
                <div className="relative h-60 w-60 overflow-hidden rounded-lg border bg-white">
                  <Image
                    src={data.signUrl || "/placeholder.svg"}
                    alt="Signature"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <Button color="primary" size="lg" className="mb-2" onPress={handleMarkRead}>Mark Read</Button>
      </DialogContent>
    </Dialog>
  );
}
