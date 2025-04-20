import { Table } from "@mantine/core";
import dynamic from "next/dynamic";
import Link from "next/link";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

export default function UserTable({ users, bookings, isRoleDriver }) {
  const getBadgeColor = (bookingCount) => {
    if (bookingCount > 20) return "green";
    if (bookingCount > 0) return "blue";
    return "gray";
  };

  const rows = users.map((user, key) => {
    return (
      <tr key={key} className="hover:bg-gray-100 border-b">
        <td className="py-4 px-6 text-center">{key + 1}</td>
        <td className="py-4 px-6 text-left">{user.firstName}</td>
        <td className="py-4 px-6 text-center">
          <Link
            href={`/beta/admin/MonthlyInvoices/${
              isRoleDriver ? "drivers" : "users"
            }/${user.email}`}
            className="text-blue-600 hover:underline"
          >
            Go
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-4 px-6 text-left">No</th>
            <th className="py-4 px-6 text-left">Company</th>
            <th className="py-4 px-6 text-left">Action</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}
