"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, RefreshCw, Archive, Activity } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Chip, Tooltip } from "@heroui/react";
import toast from "react-hot-toast";

import DriverDetailsDialog from "./Overview";
import useAdminContext from "@/context/AdminProvider";
import Create from "./Create";
import TrackDriver from "./TrackDriver/TrackDriverModal";
import { updateDoc } from "@/api/firebase/functions/upload";
import deleteDriverLocation from "@/server/deleteDriverLocation";

const roleOptions = [
  { value: "driver", label: "Driver" },
  { value: "archived", label: "Archived" },
];

export default function DriverTable({ filter }) {
  const router = useRouter();
  const { allDrivers } = useAdminContext();
  const [isLoading, setIsLoading] = useState(false);
  const [activeDriversEmail, setActiveDriversEmail] = useState([]);

  const filterVal = filter.toLowerCase();
  const filteredDrivers =
    filter === ""
      ? allDrivers
      : allDrivers.filter(
          (driver) =>
            driver.firstName.toLowerCase().includes(filterVal) ||
            driver.email.toLowerCase().includes(filterVal)
        );

  const handleArchiveUser = async (driver) => {
    setIsLoading(true);
    try {
      await deleteDriverLocation(driver.email);
      await updateDoc("users", driver.email, {
        ...driver,
        role: "archived",
        driverOnly: true,
      });
      await updateDoc("chats", driver.email, { archive: true });
      toast.success("User archived successfully");
    } catch (error) {
      console.error("Error archiving user:", error);
      toast.error("Failed to archive user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (value, driver) => {
    setIsLoading(true);
    try {
      const updatedDriver = {
        ...driver,
        role: value,
        driverOnly: value === "archived",
      };
      await updateDoc("users", driver.email, updatedDriver);
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChange = async (data) => {
    setIsLoading(true);
    try {
      await updateDoc("users", data.email, data);
      toast.success("Changes saved successfully");
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes");
    } finally {
      setIsLoading(false);
    }
  };

  const monitorUserInactivity = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        "https://direct-transport-server.vercel.app/api/online_signal/monitor_drivers_inactivity"
      );
      const { message, activeDriversEmail } = res.data;
      toast.success(message);
      setActiveDriversEmail(activeDriversEmail);
    } catch (error) {
      console.error("Error monitoring user inactivity:", error);
      toast.error("Failed to monitor user inactivity");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    monitorUserInactivity();
  }, []);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">No</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tracking</TableHead>
            <TableHead>
              <Tooltip
                content="DAMS (Driver Activity Management System Beta) shows the driver's permission status"
                placement="top"
                color="primary"
              >
                <div className="flex gap-2 w-full cursor-pointer h-full items-center">
                  Permission
                </div>
              </Tooltip>
            </TableHead>
            {/* <TableHead>
              <Tooltip
                content="DAMS (Driver Activity Management System Beta) provides real-time driver status updates and issues warnings when necessary"
                placement="top"
                color="secondary"
              >
                <div
                  onClick={monitorUserInactivity}
                  className="flex gap-2 w-full cursor-pointer h-full items-center"
                >
                  Active
                  <RefreshCw className=" size-4" />
                </div>
              </Tooltip>
            </TableHead> */}
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDrivers.map((driver, index) => (
            <TableRow key={driver.email}>
              <TableCell>
                <Badge variant="outline">{index + 1}</Badge>
              </TableCell>
              <TableCell className="font-medium">
                <DriverDetailsDialog driverDetails={driver} />
              </TableCell>
              <TableCell>{driver.phone || "N/A"}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="bg-gray-700">
                  {driver.role}
                </Badge>
              </TableCell>
              <TableCell>{driver.email}</TableCell>
              <TableCell>
                <Select
                  value={driver.role}
                  onValueChange={(value) => handleStatusChange(value, driver)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((option) => (
                      <SelectItem
                        className="bg-white"
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Switch
                  className="bg-slate-300"
                  checked={driver.tracking}
                  onCheckedChange={() =>
                    handleSaveChange({
                      ...driver,
                      tracking: !driver.tracking,
                    })
                  }
                />
              </TableCell>
              <TableCell>
                <Chip
                  className="aspect-square h-2 w-2 mx-auto"
                  color={driver.permissions ? "success" : "danger"}
                />
              </TableCell>
              {/* <TableCell>
                <Tooltip
                  content={
                    activeDriversEmail.includes(driver.email)
                      ? `${driver.firstName} is Online`
                      : `${driver.firstName} is Offline`
                  }
                  placement="top"
                >
                  <Chip
                    className="aspect-square h-2 w-2 mx-auto cursor-pointer"
                    color={
                      activeDriversEmail.includes(driver.email)
                        ? "success"
                        : "danger"
                    }
                  />
                </Tooltip>
              </TableCell> */}

              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleArchiveUser(driver)}
                  className="mr-2"
                  disabled={isLoading}
                >
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/admin/Manage/Drivers/${driver.email}`)
                  }
                  className="mr-2"
                >
                  <History className="mr-2 h-4 w-4" /> History
                </Button>
                <Create edit={true} driver={driver} />
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" /> Reset Password
                </Button>
                <TrackDriver email={driver.email} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
