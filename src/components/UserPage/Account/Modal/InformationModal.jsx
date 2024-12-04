import { Group, Modal, Text } from "@mantine/core";
import { formatDate } from "../../../../utils/date";
import { useEffect, useState } from "react";
import { getUserByIdService } from "../../../../services/userService";

const CancelInformationModal = ({ opened, close, appointment }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserByIdService(appointment?.cancelBy);

        if (res.success) {
          setUser(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (appointment && appointment.cancelBy) {
      fetchUser();
    }
  }, [appointment]);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Thông tin hủy lịch">
        <Group>
          <Text fw={700}>Hủy bởi:</Text>
          <Text>{user?.name}</Text>
        </Group>
        <Group my="md">
          <Text fw={700}>Lý do hủy:</Text>
          <Text>{appointment?.cancelReason}</Text>
        </Group>
        <Group>
          <Text fw={700}>Thời gian hủy:</Text>
          <Text>{formatDate(appointment?.cancelAt)}</Text>
        </Group>
      </Modal>
    </>
  );
};

export default CancelInformationModal;
