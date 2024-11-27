import { Button, Group, LoadingOverlay, Title, Select, NumberInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { showNotification } from "../../../../utils/notification";
import { addScheduleService } from "../../../../services/scheduleService";
import moment from "moment-timezone";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";
import { getALlServicesManager } from "../../../../services/serviceManager";
import { getAllDoctorsService } from "../../../../services/doctorService";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Schedules", href: "/admin/schedules" },
  { title: "Create schedule" },
];

const FORM_VALIDATION = {
  serviceId: {
    required: "Movie is required",
  },
  doctorProfileId: {
    required: "Doctor is required",
  },
  dateTime: {
    required: "Date is required",
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

const CreateScheduleForm = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      serviceId: "",
      doctorProfileId: "",
      dateTime: "",
      duration: "",
      status: "AVAILABLE",
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
    setIsLoading(true);
    try {
      const scheduleData = {
        ...data,
        dateTime: moment(data.dateTime).format("YYYY-MM-DD HH:mm"),
      };

      console.log(scheduleData);

      const res = await addScheduleService(scheduleData);

      if (res.success) {
        showNotification(res.message, "Success");
        navigate("/admin/schedules");
      } else {
        showNotification(res.message, "Error");
      }
    } catch (error) {
      console.log(error);
      showNotification("An error occured", "Error");
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
        Create Schedule
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
              name="dateTime"
              control={control}
              rules={FORM_VALIDATION.dateTime}
              render={({ field, fieldState: { error } }) => (
                <DateTimePicker
                  {...field}
                  valueFormat="DD/MM/YYYY HH:mm"
                  error={error?.message}
                  label="Date"
                  size="md"
                  placeholder="Enter date time"
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
                mt={24}
                placeholder="Enter duration"
              />
            )}
          />

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

export default CreateScheduleForm;
