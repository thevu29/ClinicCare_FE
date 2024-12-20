import { Card, Text, Button, Group, Avatar, Flex } from "@mantine/core";
import { Link } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="cursor">
      <Group justify="center">
        <Avatar variant="white" radius="50%" size="xl" src={doctor?.image} />
      </Group>

      <Group justify="center" mt="md" mb="xs">
        <Flex direction="column" align="center">
          <Text fw={500}>BS {doctor.name}</Text>
          <Text size="sm" c="dimmed">
            {doctor.specialty}
          </Text>
        </Flex>
      </Group>

      <Link to={`/doctors/${doctor.doctorProfileId}/schedules`}>
        <Button color="blue" fullWidth mt="md" radius="md">
          Đặt lịch khám
        </Button>
      </Link>
    </Card>
  );
};

export default DoctorCard;
