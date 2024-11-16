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

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <Container size="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      <Center>
        <Box w={120} h={120}>
          <Image
            src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
            alt="Success"
          />
        </Box>
      </Center>
      <Title order={2} mt="md" color="teal">
        Payment Successful!
      </Title>
      <Text size="md" mt="sm" c="dimmed">
        Thank you for your payment. Your transaction was completed successfully.
      </Text>
      <Button
        mt="lg"
        variant="outline"
        color="teal"
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
