import { useState } from "react";
import { paymentForUserService } from "../../../services/paymentService";
import { Container, Title, TextInput, Button, Box } from "@mantine/core";

export default function PaymentPage() {
  const [amount, setAmount] = useState(100000);

  const handlePayment = async () => {
    try {
      const res = await paymentForUserService(amount);

      // console.log(res.data);

      if (res && res.data) {
        window.location.href = res.data;
      }
    } catch (error) {
      console.error("Error creating payment", error);
    }
  };

  return (
    <Container
      size="sm"
      style={{
        marginTop: "2rem",
        padding: "2rem",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
      }}
    >
      <Title order={2} align="center" mb="md">
        VNPay Payment
      </Title>
      <Box mb="md">
        <TextInput
          label="Số tiền (VNĐ)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Nhập số tiền"
          required
          size="md"
          mb="sm"
        />
        <Button
          fullWidth
          onClick={handlePayment}
          color="blue"
          radius="md"
          size="md"
          mt="md"
        >
          Thanh toán với VNPay
        </Button>
      </Box>
    </Container>
  );
}
