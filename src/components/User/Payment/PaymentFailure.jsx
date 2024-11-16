import {
  Container,
  Title,
  Text,
  Button,
  Center,
  Image,
  Box,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <Container size="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      <Center>
        <Box w={120} h={120}>
          <Image
            src="https://cdn-icons-png.flaticon.com/512/753/753345.png"
            alt="Failure"
          />
        </Box>
      </Center>
      <Title order={2} mt="md" color="red">
        Payment Failed!
      </Title>
      <Text size="md" mt="sm" c="dimmed">
        Unfortunately, your payment could not be processed. Please try again
        later.
      </Text>
      <Button
        mt="lg"
        mr="lg"
        color="red"
        size="md"
        onClick={() => {
          navigate("/payment");
        }}
      >
        Try again
      </Button>
      <Button
        mt="lg"
        variant="outline"
        color="red"
        size="md"
        onClick={() => {
          navigate("/");
        }}
      >
        Go to Homepage
      </Button>
    </Container>
  );
}
