import { Button, Group, Modal, Textarea } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { showNotification } from "../../../../utils/notification";
import { cancelAppointmentService } from "../../../../services/appointmentService";

const CancelScheduleModal = ({ opened, close, appointment, userId, fetchAppointments }) => {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      cancelReason: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        cancelBy: userId,
      };

      const res = await cancelAppointmentService(appointment.appointmentId, payload);

      if (res.success) {
        showNotification(res.message, "Success");
        close();
        fetchAppointments();
      } else {
        showNotification(res.message, "Error");
      }
    } catch (error) {
      console.log(error);
      showNotification("An error occurred", "Error");
    }
  };

  if (!appointment) return null;

  return (
    <Modal opened={opened} onClose={close} title="Cancel Schedule">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="cancelReason"
          control={control}
          rules={{ required: "Cancel reason by is required" }}
          render={({ field, fieldState }) => (
            <Textarea
              {...field}
              placeholder="Cancel reason"
              label="Cancel reason"
              error={fieldState?.error?.message}
              rows={5}
            />
          )}
        />

        <Group mt={32} justify="flex-end">
          <Button variant="filled" color="gray" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" variant="filled" color="red">
            Cancel
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default CancelScheduleModal;
