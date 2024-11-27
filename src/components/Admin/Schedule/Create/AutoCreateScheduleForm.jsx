import {
  Button,
  Flex,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { showNotification } from "../../../../utils/notification";
import { autoAddScheduleService } from "../../../../services/scheduleService";
import { getALlServicesManager } from "../../../../services/serviceManager";
import { getAllDoctorsService } from "../../../../services/doctorService";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";
import MultiDatePicker from "../../../DateTime/MultiDatePicker";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Schedules", href: "/admin/schedules" },
  { title: "Auto create" },
];

const FORM_VALIDATION = {
  serviceId: {
    required: "Movie is required",
  },
  doctorProfileId: {
    required: "Doctor is required",
  },
  dates: {
    required: "Dates is required",
  },
  amount: {
    required: "Amount is required",
    min: { value: 1, message: "Amount must be greater than 0" },
  },
  duration: {
    required: "Duration is required",
    min: { value: 1, message: "Duration must be at least 1" },
  },
  status: {
    required: "Status is required",
  },
};

const statuses = [
  { value: "AVAILABLE", label: "Available" },
  { value: "UNAVAILABLE", label: "Unavailable" },
  { value: "BOOKED", label: "Booked" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "COMPLETED", label: "Completed" },
];

const AutoCreateScheduleForm = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      movieId: "",
      roomId: "",
      dates: "",
      amount: "",
      status: "Available",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getALlServicesManager();

        if (res.success) {
          const data = res.data.map((item) => ({
            value: item.serviceId,
            label: item.name,
          }));

          setServices(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchDoctors = async () => {
      try {
        const res = await getAllDoctorsService();

        if (res.success) {
          const data = res.data.map((item) => ({
            value: item.doctorProfileId,
            label: item.name,
          }));

          setDoctors(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchServices();
    fetchDoctors();
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const res = await autoAddScheduleService(data);

      if (res.success) {
        showNotification(res.message, "Success");
        navigate("/admin/schedules");
      } else {
        showNotification(res.message, "Error");
      }
    } catch (error) {
      console.log(error);
      showNotification("An error occurred", "Error");
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
        Auto create schedule
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Group grow gap={60}>
            <Controller
              name="serviceId"
              control={control}
              rules={FORM_VALIDATION.serviceId}
              render={({ field, fieldState: { error } }) => (
                <Select
                  {...field}
                  error={error?.message}
                  label="Service"
                  size="md"
                  placeholder="Select service"
                  data={services}
                  allowDeselect={false}
                  searchable
                />
              )}
            />

            <Controller
              name="doctorProfileId"
              control={control}
              rules={FORM_VALIDATION.doctorProfileId}
              render={({ field, fieldState: { error } }) => (
                <Select
                  {...field}
                  error={error?.message}
                  label="Doctor"
                  size="md"
                  placeholder="Select doctor"
                  data={doctors}
                  allowDeselect={false}
                  searchable
                />
              )}
            />
          </Group>
          <Group grow gap={60} mt={24}>
            <Controller
              name="amount"
              control={control}
              rules={FORM_VALIDATION.amount}
              render={({ field, fieldState: { error } }) => (
                <NumberInput
                  {...field}
                  error={error?.message}
                  label="Amount"
                  size="md"
                  placeholder="Enter schedule amount"
                />
              )}
            />

            <Controller
              name="status"
              control={control}
              rules={FORM_VALIDATION.status}
              render={({ field, fieldState: { error } }) => (
                <Select
                  {...field}
                  error={error?.message}
                  label="Status"
                  size="md"
                  placeholder="Select status"
                  data={statuses}
                />
              )}
            />
          </Group>

          <Group grow gap={60} mt={24}>
            <Flex direction="column">
              <label htmlFor="dates">Dates:</label>
              <MultiDatePicker
                FORM_VALIDATION={FORM_VALIDATION}
                control={control}
              />
            </Flex>

            <Controller
            name="duration"
            control={control}
            rules={FORM_VALIDATION.duration}
            render={({ field, fieldState: { error } }) => (
              <NumberInput
                {...field}
                error={error?.message}
                label="Duration (minutes)"
                size="md"
                placeholder="Enter duration"
              />
            )}
          />
          </Group>

          <Group mt={32} justify="flex-end">
            <Link to="/admin/schedules">
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

export default AutoCreateScheduleForm;
