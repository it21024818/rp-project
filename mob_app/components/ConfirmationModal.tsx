import { Button, Modal, Text } from "native-base";
import React from "react";
import Colors from "../constants/Colors";

type Props = {
  isOpen: boolean;
  title?: string;
  onCancel: () => void;
  onConfirm: () => void;
  children?: React.ReactNode;
};

const ConfirmationModal = (props: Props) => {
  const {
    isOpen,
    title = "Are you sure?",
    children,
    onCancel,
    onConfirm,
  } = props;
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <Modal.Content>
        <Modal.CloseButton onPress={onCancel} />
        <Modal.Header borderBottomWidth={0}>{title}</Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer
          borderTopWidth={0}
          justifyContent={"space-between"}
          style={{ gap: 12 }}
        >
          <Button
            variant={"subtle"}
            style={{
              borderRadius: 4,
              backgroundColor: Colors.lightPrimary,
              flexGrow: 1,
            }}
            onPress={onCancel}
          >
            <Text style={{ color: Colors.primary, fontWeight: "600" }}>
              CANCEL
            </Text>
          </Button>
          <Button
            variant={"subtle"}
            style={{
              borderRadius: 4,
              backgroundColor: Colors.primary,
              flexGrow: 1,
            }}
            onPress={onConfirm}
          >
            <Text style={{ color: Colors.colorWhite, fontWeight: "600" }}>
              CONFIRM
            </Text>
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default ConfirmationModal;
