import {
  Button,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  Title,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { showNotification } from "../../../../utils/notification";
import {
  getScheduleByIdService,
  updateScheduleService,
} from "../../../../services/scheduleService";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";
import moment from "moment-timezone";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Schedules", href: "/admin/schedules" },
  { title: "Update schedule", href: "/admin/schedules/update" },
];

const FORM_VALIDATION = {
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

const UpdateScheduleForm = () => {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      dateTime: "",
      duration: "",
      status: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getScheduleByIdService(id);
        if (res.success) {
          const schedule = res.data;

          const dateTime = moment(schedule.dateTime).toDate();

          reset({
            dateTime: dateTime,
            duration: schedule.duration,
            status: schedule.status,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const scheduleData = {
        ...data,
        dateTime: moment(data.dateTime).format("YYYY-MM-DD HH:mm"),
      };

      const res = await updateScheduleService(id, scheduleData);

      res.success
        ? showNotification(res.message, "Success")
        : showNotification(res.message, "Error");
    } catch (error) {
      console.log("Error updating schedule:", error);
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
        Update schedule
      </Title>
      <div className="bg-white p-8 rounded-lg mt-7">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Group grow gap={24}>
            <Controller
              name="dateTime"
              control={control}
              rules={FORM_VALIDATION.date}
              render={({ field, fieldState: { error } }) => (
                <DateTimePicker
                  valueFormat="DD/MM/YYYY HH:mm"
                  {...field}
                  error={error?.message}
                  label="Date"
                  size="md"
                  placeholder="Enter date time"
                  value={field.value}
                  onChange={field.onChange}
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

          <Group grow mt={24}>
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

export default UpdateScheduleForm;
