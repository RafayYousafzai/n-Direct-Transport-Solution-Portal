import { ClipboardList } from "lucide-react"
import { Chip } from "@heroui/react"

interface BookingsHeaderProps {
  totalBookings: number
}

export function BookingsHeader({ totalBookings }: BookingsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div className="flex items-center gap-2 mb-4 md:mb-0">
        <div className="bg-primary/10 p-2 rounded-lg">
          <ClipboardList className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Place Bookings</h1>
        <Chip size="sm" color="primary" className="ml-2">
          {totalBookings} total
        </Chip>
      </div>

      {/* You could add search, filters, or other controls here */}
    </div>
  )
}
