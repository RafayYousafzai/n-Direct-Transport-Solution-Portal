import { useEffect, useRef, useState } from "react";
import { fetchDocById } from "@/api/firebase/functions/fetch";
import InvoicesDetails from "./InvoicesDetails";
import { Center, Loader } from "@mantine/core";
import { Button } from "@heroui/react";
import FixPrice from "./FixPrice";

export default function Invoice({ id, onClose }) {
  const [booking, setBooking] = useState(null);
  const [showPrice, setShowPrice] = useState(false);
  const fixPriceRef = useRef(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      const data = await fetchDocById(id, "place_bookings");
      setBooking(data);
    };
    fetchInvoice();
  }, [id]);

  useEffect(() => {
    if (showPrice && fixPriceRef.current) {
      setTimeout(() => {
        fixPriceRef.current.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  }, [showPrice]);

  const toggleShowPrice = () => setShowPrice((prev) => !prev);

  return (
    <>
      <div ref={fixPriceRef}></div>
      {booking ? (
        <>
          <InvoicesDetails invoice={booking} admin={true} onClose={onClose} />
          <CustomModal isOpen={showPrice} onClose={toggleShowPrice}>
            <FixPrice
              booking={booking}
              setBooking={setBooking}
              toggleShowPrice={toggleShowPrice}
              onClose={onClose}
            />
          </CustomModal>
          <Center>
            <Button fullWidth color="primary" onClick={toggleShowPrice}>
              Edit Price
            </Button>
          </Center>
        </>
      ) : (
        <Center>
          <Loader color="blue" />
        </Center>
      )}
    </>
  );
}

function CustomModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center    h-full bg-slate-600 shadow-black rounded-lg backdrop-blur-md bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/2 ">
        <div className="p-4">
          <button
            className="text-gray-600 hover:text-gray-900 float-right"
            onClick={onClose}
          >
            &times;
          </button>
          <div className="clear-both"></div>
          {children}
        </div>
      </div>
    </div>
  );
}
