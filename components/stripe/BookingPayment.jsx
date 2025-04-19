"use client";

import { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import getSuburbByLatLng from "@/api/getSuburbByLatLng";
import { Divider } from "@heroui/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { postInvoice } from "@/api/firebase/functions/upload";
import sendBookingEmail from "@/api/sendBookingEmail";

export default function BookingPayment({ formData }) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const total = formData.totalPriceWithGST.toFixed(2) || 0.0;

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setClientSecret(data.clientSecret);
      });
  }, [total]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name },
        },
      }
    );

    if (error) {
      toast.error(error.message);
      setIsProcessing(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      toast.success("Payment successful!");

      try {
        const pickupSuburb = await getSuburbByLatLng(
          formData.address?.Origin?.label
        );
        const deliverySuburb = await getSuburbByLatLng(
          formData.address?.Destination?.label
        );

        const invoice = {
          ...formData,
          pickupSuburb,
          deliverySuburb,
          email,
          payment: "paid",
          stripeSessionId: paymentIntent.id,
        };

        const res = await postInvoice(invoice, "place_bookings");
        await sendBookingEmail(invoice, res, invoice.contact);
        await sendBookingEmail(invoice, res, name, email);

        router.push(`/CreateJob`);
        toast.success("Booking created successfully with ID: " + res);
      } catch (error) {
        toast.error("Error adding booking: " + error.message);
      }
    }

    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      <div className="flex-1 p-8 lg:p-12">
        <div className="flex flex-wrap w-full gap-10 justify-around">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 w-full max-w-md rounded-xl"
          >
            <div>
              <h1 className="text-4xl font-bold mb-4">Lets Make Payment</h1>
              <p className="text-gray-600 mb-8">
                To complete your booking, please enter your card details.
              </p>
            </div>

            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-gray-100 text-purple-600 placeholder-purple-400"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@mail.com"
                className="w-full bg-gray-100 text-purple-600 placeholder-purple-400"
                required
              />
            </div>
            <div>
              <Label htmlFor="card-element">Credit or debit card</Label>
              <div className="border p-3 rounded">
                <CardElement id="card-element" />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isProcessing || !stripe}
              className="w-full"
            >
              {isProcessing
                ? "Processing..."
                : `Pay $${formData.totalPriceWithGST}`}
            </Button>
          </form>

          {/* Order Summary Section */}
          <div className="rounded-xl w-full max-w-md bg-gradient-to-br from-gray-100 to-purple-100 p-8 lg:p-12">
            <h2 className="text-xl text-gray-600 mb-2">Order Summary</h2>
            <p className="text-5xl font-bold mb-8">${total}</p>

            <div className="space-y-4">
              {formData.items?.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <p className="font-semibold">{item.type}</p>
                  </div>
                  <p className="font-semibold text-xs text-gray-600">
                    {`${item.height}x${item.width}x${item.length}`} (x{item.qty}
                    )
                  </p>
                </div>
              ))}
              <Divider />

              <div className="flex justify-between">
                <p>Total Items</p>
                <p>{formData.items.length}</p>
              </div>

              <div className="flex justify-between">
                <p>GST</p>
                <p>${formData.gst.toFixed(2)}</p>
              </div>

              <div className="flex justify-between">
                <p>Distance</p>
                <p>{formData.distance.toFixed(2)} km</p>
              </div>

              <div className="flex justify-between">
                <p>Shipment Cost</p>
                <p>${formData.serviceCharges.toFixed(2)}</p>
              </div>

              <Divider />

              <div className="flex justify-between font-semibold text-lg">
                <p>Total</p>
                <p>${formData.totalPriceWithGST.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
