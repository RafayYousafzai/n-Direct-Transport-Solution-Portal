"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { Map, MapIcon } from "lucide-react";
import TrackDriverContent from "./TrackDriverContent";

export default function TrackDriver({ booking, customBtn }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Modal size="full" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Driver Live Location
              </ModalHeader>
              <ModalBody>
                {isOpen && <TrackDriverContent email={booking?.driverEmail} />}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {!customBtn ? (
        <Button onPress={onOpen} className="mr-1" variant="light" size="sm">
          <MapIcon />
        </Button>
      ) : (
        <Button onPress={onOpen} variant="outline" size="sm">
          <Map className="mr-2 h-4 w-4" />
          Track
        </Button>
      )}
    </>
  );
}
