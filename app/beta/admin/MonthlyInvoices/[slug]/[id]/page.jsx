import React from "react";
import PDFDetails from "./components/PDFDetails/PDFDetails";

export default function page(params) {
  const email = decodeURIComponent(params.params.id);
  const role = decodeURIComponent(params.params.slug);
  const isRoleDriver = role === "drivers" ? true : false;

  return (
    <div>
      <PDFDetails email={email} isRoleDriver={isRoleDriver} />
    </div>
  );
}
