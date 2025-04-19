"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Image } from "@heroui/react";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { updateDoc } from "@/api/firebase/functions/upload";
import { CalendarIcon, PlusCircle, Save, Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function DriverDetailsDialog({ driverDetails }) {
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    console.log("Saved entries:", statusEntries);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link">{driverDetails.firstName}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Driver Details: {driverDetails.firstName}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Personal Information</h3>
            <p>Date of Birth: {driverDetails.dateOfBirth}</p>
            <p>Email: {driverDetails.email}</p>
            <p>Phone: {driverDetails.phone}</p>
            <p>ABN: {driverDetails.abn}</p>
          </div>
          <div>
            <h3 className="font-semibold">Employment Information</h3>
            <p>Start Date: {driverDetails.startDate}</p>
            <p>Role: {driverDetails.role}</p>
            <p>Payment Percentage: {driverDetails.paymentPercentage}%</p>
            <p>Company Address: {driverDetails.companyAddress}</p>
          </div>
          <div>
            <h3 className="font-semibold">Vehicle Information</h3>
            <p>{driverDetails?.vehicleDetails}</p>
          </div>
          <div>
            <h3 className="font-semibold">License Information</h3>
            <Image
              height={300}
              width={300}
              src={driverDetails.driverLicense}
              alt="Driver License"
              className="mt-2 max-w-full h-auto"
            />
          </div>
        </div>
        <DriverNote driverDetails={driverDetails} />
        {/* <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
function DriverNote({
  driverDetails = { email: "driver@example.com", statusEntries: [] },
}) {
  const [statusEntries, setStatusEntries] = useState(
    driverDetails?.statusEntries || []
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (driverDetails?.statusEntries) {
      setStatusEntries(driverDetails.statusEntries);
    }
  }, [driverDetails]);

  const handleReasonChange = (index, reason) => {
    const newEntries = [...statusEntries];
    newEntries[index].reason = reason;
    setStatusEntries(newEntries);
  };

  const handleDateChange = (index, date) => {
    const newEntries = [...statusEntries];
    newEntries[index].date = date;
    setStatusEntries(newEntries);
  };

  const handleAddEntry = () => {
    const entries = [...statusEntries, { date: new Date(), reason: "" }];
    setStatusEntries(entries);
  };

  const handleDeleteEntry = (index) => {
    const newEntries = statusEntries.filter((_, i) => i !== index);
    setStatusEntries(newEntries);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formattedEntries = statusEntries.map((entry) => ({
        ...entry,
        date: entry.date ? format(new Date(entry.date), "yyyy-MM-dd") : "",
      }));

      await updateDoc("users", driverDetails.email, {
        ...driverDetails,
        statusEntries: formattedEntries,
      });
      toast.success("Notes updated successfully");
    } catch (error) {
      console.error("Failed to save notes:", error);
      toast.error("Failed to update notes");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Driver Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Manage notes for the drivers
        </p>
        {statusEntries?.map((entry, index) => (
          <div key={index} className="p-2">
            <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
              <div className="space-y-2">
                <Label htmlFor={`date-${index}`}>Date</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id={`date-${index}`}
                    type="date"
                    className="pl-10"
                    value={format(new Date(entry.date), "yyyy-MM-dd")}
                    onChange={(e) =>
                      handleDateChange(index, new Date(e.target.value))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`reason-${index}`}>Reason</Label>
                <Select
                  value={entry.reason}
                  onValueChange={(value) => handleReasonChange(index, value)}
                >
                  <SelectTrigger id={`reason-${index}`}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="started-late">Late</SelectItem>
                    <SelectItem value="day-off">Day Off</SelectItem>
                    <SelectItem value="sick-day">Sick Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDeleteEntry(index)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete entry</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleAddEntry}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Note
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>Saving...</>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Notes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
