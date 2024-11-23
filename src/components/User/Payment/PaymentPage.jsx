import { addPaymentService } from "../../../services/paymentService";
import {
  Container,
  Title,
  TextInput,
  Button,
  Flex,
  Group,
  Select,
} from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const FORM_VALIDATION = {
  patientId: {
    required: "Patient Id is required",
  },
  serviceId: {
    required: "Service Id is required",
  },
  method: {
    required: "Payment method is required",
  },
};

export default function PaymentPage() {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      patientId: "",
      serviceId: "",
      method: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const res = await addPaymentService(data);

      // Redirect to vnpay
      if (res && res.data && res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      }
    } catch (error) {
      console.error("Error creating payment", error);
    }
  };

  const paymentMethods = [
    { value: "BANKING", label: "Banking" },
    { value: "CASH", label: "Cash" },
  ];

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

      <div className="bg-white p-8 rounded-lg mt-7">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Group justify="space-between" grow>
            <Flex direction="column" gap={20}>
              <Controller
                name="patientId"
                control={control}
                rules={FORM_VALIDATION.patientId}
                render={({ field, fieldState: { error } }) => (
                  <TextInput
                    {...field}
                    error={error?.message}
                    label="PatientId"
                    size="md"
                    placeholder="Enter patientId"
                  />
                )}
              />

              <Controller
                name="serviceId"
                control={control}
                rules={FORM_VALIDATION.serviceId}
                render={({ field, fieldState: { error } }) => (
                  <TextInput
                    {...field}
                    error={error?.message}
                    label="ServiceId"
                    size="md"
                    placeholder="Enter serviceId"
                  />
                )}
              />

              <Controller
                name="method"
                control={control}
                rules={FORM_VALIDATION.method}
                render={({ field, fieldState: { error } }) => (
                  <Select
                    {...field}
                    label="Payment Method"
                    error={error?.message}
                    data={paymentMethods}
                    placeholder="Choose a payment method"
                    size="md"
                  />
                )}
              />
            </Flex>
          </Group>

          <Group mt={32} justify="flex-end">
            <Link to="/">
              <Button variant="filled" color="gray">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="filled">
              Save
            </Button>
          </Group>
        </form>
      </div>
    </Container>
  );
}
