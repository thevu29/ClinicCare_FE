import { Modal, Text, Flex } from "@mantine/core";
import { formatDateTime } from "../../../../utils/date";

const ScheduleInformationModal = ({ opened, close, schedule }) => {
  if (!schedule) return null;

  return (
    <Modal opened={opened} onClose={close} title="Schedule Information">
      <Flex direction="column" gap={12} mb={24}>
        <Text size="sm">
          Service: <b>{schedule.serviceName}</b>{" "}
        </Text>
        <Text size="sm">
          Doctor: <b>{schedule.doctorName}</b>
        </Text>
        <Text size="sm">
          Date: <b>{formatDateTime(schedule.dateTime)}</b>
        </Text>
        <Text size="sm">
          Status: <b>{schedule.status}</b>
        </Text>
        <Text size="sm">
          Duration: <b>{schedule.duration} minutes</b>
        </Text>
      </Flex>
    </Modal>
  );
};

export default ScheduleInformationModal;
