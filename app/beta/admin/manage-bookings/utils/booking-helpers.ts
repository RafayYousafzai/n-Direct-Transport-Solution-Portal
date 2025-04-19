export const toCapitalize = (str: string | undefined) => {
    if (!str) return ""
    return str?.charAt(0)?.toUpperCase() + str?.slice(1)?.toLowerCase()
  }
  
  export const parseDeliveredDate = (date: string) => {
    const deliveredDate = date
    try {
      const [datePart, timePart] = deliveredDate.split(" ")
      const [month, day, year] = datePart.split("/")
      return `${day}/${month}/${year}`
    } catch (error) {
      return " "
    }
  }
  
  export const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "#38bdf8" // Light blue
      case "allocated":
        return "#f43f5e" // Red
      case "pickedup":
        return "#10b981" // Green
      case "cancelled":
        return "#f97316" // Orange
      default:
        return "#6366f1" // Indigo
    }
  }
  