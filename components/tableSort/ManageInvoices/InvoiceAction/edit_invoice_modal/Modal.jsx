"use client";

import Invoice from "./Invoice";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import { ActionIcon, ScrollArea, Tooltip } from "@mantine/core";

export default function App({ id }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Tooltip label="Edit Invoice ">
        <ActionIcon mx={1} onClick={onOpen} size="xl">
          <EditNoteRoundedIcon />
        </ActionIcon>
      </Tooltip>
      <Modal
        scrollBehavior="outside"
        size="5xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Invoice Details
              </ModalHeader>
              <ModalBody>
                {isOpen && (
                  <ScrollArea>
                    <Invoice id={id} onClose={onClose} />
                  </ScrollArea>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
