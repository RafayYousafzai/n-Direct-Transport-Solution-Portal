import StatusDropdown from "@/components/tableSort/ManageInvoices/InvoiceAction/StatusDropdown";
import FixPriceModal from "@/components/tableSort/ManageInvoices/InvoiceAction/edit_invoice_modal/FixPriceModal";
import Assigned from "@/components/tableSort/ManageInvoices/InvoiceAction/Assigned";
import Notes from "@/components/tableSort/ManageInvoices/InvoiceAction/notes/Notes";
import EditInvoice from "@/components/tableSort/ManageInvoices/InvoiceAction/edit_invoice_modal/Modal";
import InvoicePOD from "@/components/tableSort/ManageInvoices/InvoiceAction/pod_invoice_modal/Modal";
import TrackDriver from "@/components/tableSort/ManageInvoices/InvoiceAction/TrackDriver/TrackDriverModal";
import DeleteInvoice from "@/components/tableSort/ManageInvoices/InvoiceAction/DeleteInvoice";

interface BookingActionsProps {
  booking: any;
  isArchived?: boolean;
}

export function BookingActions({
  booking,
  isArchived = false,
}: BookingActionsProps) {
  return (
    <div className="flex align-middle justify-center items-center gap-1">
      <div className="inline-block">
        <StatusDropdown booking={booking} />
      </div>

      <div className="inline-block">
        <FixPriceModal booking={booking} />
      </div>
      <div className="inline-block">
        <Assigned booking={booking} />
      </div>

      <div className="inline-block">
        <Notes booking={booking} />
      </div>

      <div className="inline-block">
        <EditInvoice id={booking.docId} />
      </div>

      <div className="inline-block">
        <InvoicePOD id={booking.docId} />
      </div>

      <div className="inline-block">
        <TrackDriver booking={booking} customBtn={undefined} />
      </div>

      <div className="inline-block">
        <DeleteInvoice
          isArchived={isArchived}
          id={booking.docId}
          booking={booking}
        />
      </div>
    </div>
  );
}
