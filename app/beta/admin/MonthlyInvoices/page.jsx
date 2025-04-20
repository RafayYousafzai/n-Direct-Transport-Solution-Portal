import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <div className="mt-36 flex flex-col align-middle">
      <div className="flex flex-wrap justify-center items-center gap-10 w-full">
        <Link
          href="/MonthlyInvoices/users"
          className="group w-96 h-80 relative rounded-lg overflow-hidden"
        >
          <Image
            src="/images/Country NSW Deliveries.jpg"
            alt="Sydney Metro Deliveries"
            width={300}
            height={300}
            className="object-cover w-full h-full transition-transform group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <p className="text-3xl text-center font-semibold text-white">
              Customer Monthly <br /> Invoices
            </p>
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <Button className="w-28 mb-8" auto color="primary">
              Go to details
            </Button>
          </div>
        </Link>

        <Link
          href="/beta/admin/MonthlyInvoices/driver"
          className="group w-96 h-80 relative rounded-lg overflow-hidden"
        >
          <Image
            src="/images/Sydney Metro Deliveries.jpg"
            alt="Country NSW Deliveries"
            width={300}
            height={300}
            className="object-cover w-full h-full transition-transform group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <p className="text-3xl text-center font-semibold text-white">
              Driver Monthly <br />
              Invoices
            </p>
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <Button className="w-28 mb-8" auto color="primary">
              Go to details
            </Button>
          </div>
        </Link>
      </div>
    </div>
  );
}
