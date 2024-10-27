import { Button, Input, Modal, Stack, Text, useToast } from "native-base";
import React, { useState } from "react";
import { useAssignUserToRoomMutation } from "../Redux/api/users.api.slice";
import Colors from "../constants/Colors";
import ToastAlert from "./ToastAlert";

type Props = {
  isOpen: boolean;
  roomId: string;
  onCancel?: () => void;
  onConfirm?: () => void;
};

const InviteMemberModal = (props: Props) => {
  const { isOpen, onCancel, onConfirm, roomId } = props;
  const toast = useToast();
  const [email, setEmail] = useState<string>("");
  const [assignUser, { isLoading: isAssingUserLoading }] =
    useAssignUserToRoomMutation();

  const handleInviteMemberConfirm = async () => {
    try {
      console.log(
        `Inviting user with email ${email} to room with id ${roomId}`
      );
      await assignUser({ email, roomId }).unwrap();
      console.log(
        `Successfully invited user with email ${email} to room with id ${roomId}`
      );
      toast.show({
        placement: "bottom",
        render: () => (
          <ToastAlert
            title="Successfully Added User"
            description="Member can now be assigned to tasks"
          />
        ),
      });
    } catch (error) {
      toast.show({
        placement: "bottom",
        render: () => (
          <ToastAlert
            title="Something went wrong"
            description="An error occurred, please try again later"
            type="error"
          />
        ),
      });
      console.error(error);
    }
    onConfirm?.();
    onCancel?.();
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <Modal.Content>
        <Modal.CloseButton onPress={onCancel} />
        <Modal.Header borderBottomWidth={0}>Invite new member</Modal.Header>
        <Modal.Body>
          <Stack space={3}>
            <Text>
              Please enter the email of the user you want to add to this room.
            </Text>
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={{ height: 40, fontSize: 13 }}
            />
          </Stack>
        </Modal.Body>
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
            onPress={handleInviteMemberConfirm}
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

export default InviteMemberModal;
