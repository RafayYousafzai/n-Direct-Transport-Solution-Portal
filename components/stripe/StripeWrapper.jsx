"use client";

import BookingPayment from "./BookingPayment";
import { Elements } from "@stripe/react-stripe-js";
import stripePromise from "@/lib/stripe";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

export default function StripeWrapper({ formData }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <Elements stripe={stripePromise}>
      <Modal size="full" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Booking
              </ModalHeader>
              <ModalBody>
                <BookingPayment formData={formData} />
              </ModalBody>
              <ModalFooter>
                <Button
                  fullWidth
                  color="primary"
                  variant="solid"
                  onPress={onClose}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Button fullWidth color="primary" variant="solid" onPress={onOpen}>
        Create Booking
      </Button>{" "}
    </Elements>
  );
}
