"use client";

import POD from "./POD";
import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import { ActionIcon, Tooltip } from "@mantine/core";
import useAdminContext from "@/context/AdminProvider";

export default function InvoicePOD({ id }) {
  const { allBookings } = useAdminContext();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const booking = allBookings.find((booking) => booking.docId === id);

  return (
    <>
      <Tooltip label="New POD">
        <ActionIcon mx={1} onClick={onOpen} size="xl">
          <QrCodeScannerRoundedIcon />
        </ActionIcon>
      </Tooltip>

      <Modal
        scrollBehavior="outside"
        size="2xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">POD</ModalHeader>
              <ModalBody>
                {isOpen && <POD booking={booking} close={onClose} />}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
