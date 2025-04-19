"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DriverTable from "./components/Table";
import Create from "./components/Create";
import { Divider } from "@heroui/react";
import Link from "next/link";
import TrackDriverModal from "./components/AllDriversMap/TrackDriverModal"

export default function Page() {
  const [filter, setFilter] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSearchChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div className="mx-[3%]  py-10">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search drivers"
            value={filter}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
        <div>
          <TrackDriverModal />
          <Link className="mr-4" href={"/admin/Manage/Archived"}>
            <Button variant={"outline"}>Archived</Button>
          </Link>
          <Create
            edit={!!selectedUser}
            driver={selectedUser}
            onClose={() => setIsDialogOpen(false)}
          />
        </div>
      </div>
      <Divider className="my-6" />
      <DriverTable filter={filter} />
    </div>
  );
}
