import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";
import React from "react";

function NotesModal({ isOpen, onClose, notes }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Notes</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={6}>
            {notes.split(/\b(\d{1,2}\/\d{1,2}\/\d{4})\b/g).map((text, index) =>
              /\d{1,2}\/\d{1,2}\/\d{4}/.test(text) ? (
                <React.Fragment key={index}>
                  <br />
                  <br />
                  {text}
                </React.Fragment>
              ) : (
                text
              )
            )}
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default NotesModal;
