import { updateDoc } from "@/api/firebase/functions/upload";
import { Button } from "@heroui/react";
import { Trash } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";

export default function Table({ entries, booking, id }) {
  const handleRemoveRow = async (index) => {
    let updatedArray = entries;
    updatedArray.splice(index, 1);
    await updateDoc("place_bookings", id, {
      ...booking,
      statusEntries: updatedArray,
    });
    toast.success("Notes updated successfully");
  };

  if (!entries) return;
  return (
    <div className="  mx-auto p-4">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reason
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>{" "}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Remove
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {entries.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item?.reason}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item?.date}
              </td>{" "}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <Button onClick={() => handleRemoveRow(index)} isIconOnly>
                  <Trash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
