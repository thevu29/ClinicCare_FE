import { addPaymentService } from "../../../../services/paymentService";
import {
  Title,
  Button,
  Flex,
  Group,
  Select,
  LoadingOverlay,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { getAllPatientsService } from "../../../../services/userService";
import { getALlServicesManager } from "../../../../services/serviceManager";
import { showNotification } from "../../../../utils/notification";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Payments", href: "/admin/payments" },
  { title: "Create payment" },
];

const paymentMethods = [
  { value: "BANKING", label: "Banking" },
  { value: "CASH", label: "Cash" },
];

const FORM_VALIDATION = {
  patientId: {
    required: "Patient is required",
  },
  serviceId: {
    required: "Service is required",
  },
  method: {
    required: "Payment method is required",
  },
};

const CreatePaymentForm = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [services, setServices] = useState([]);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      patientId: "",
      serviceId: "",
      method: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await getAllPatientsService();

        if (res.success) {
          const data = res.data.map((patient) => ({
            value: patient.userId,
            label: patient.phone
              ? `${patient.name} - ${patient.phone}`
              : patient.name,
          }));

          setPatients(data);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const res = await getALlServicesManager();

        if (res.success) {
          const data = res.data.map((service) => ({
            value: service.serviceId,
            label: `${service.name}-${
              (+service.price * (100 - service.promotionDiscount)) / 100
            } (${service.price}-discount ${service.promotionDiscount}%)`,
          }));

          setServices(data);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchPatient();
    fetchServices();
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const res = await addPaymentService(data);

      if (res && res.success) {
        showNotification(res.message, "Success");

        if (res.data && res.data.paymentUrl) {
          window.location.href = res.data.paymentUrl;
        } else {
          navigate("/admin/payments");
        }
      } else {
        showNotification(res.message, "Error");
      }
    } catch (error) {
      console.error("Error creating payment", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <BreadcumbsComponent items={breadcumbData} />
      <Title order={1} mt={32}>
        Create Payment
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
                  <Select
                    {...field}
                    searchable
                    error={error?.message}
                    label="Patient"
                    placeholder="Select patient"
                    data={patients}
                    allowDeselect={false}
                  />
                )}
              />

              <Controller
                name="serviceId"
                control={control}
                rules={FORM_VALIDATION.serviceId}
                render={({ field, fieldState: { error } }) => (
                  <Select
                    {...field}
                    searchable
                    error={error?.message}
                    label="Service"
                    placeholder="Select service"
                    data={services}
                    allowDeselect={false}
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
                    label="Method"
                    error={error?.message}
                    data={paymentMethods}
                    placeholder="Select a payment method"
                    allowDeselect={false}
                  />
                )}
              />
            </Flex>
          </Group>

          <Group mt={32} justify="flex-end">
            <Link to="/admin/payments">
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
    </>
  );
};

export default CreatePaymentForm;
