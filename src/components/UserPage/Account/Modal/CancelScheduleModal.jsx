import { Button, Group, Modal, Textarea } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { cancelAppointmentService } from "../../../../services/appointmentService";
import { showNotification } from "../../../../utils/notification";

const CancelScheduleModal = ({
  opened,
  close,
  appointment,
  userId,
  fetchAppointments,
}) => {
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

      const res = await cancelAppointmentService(
        appointment.appointmentId,
        payload
      );

      if (res.success) {
        showNotification("Hủy lịch thành công", "Success");
        close();
        fetchAppointments();
      } else {
        showNotification(res.message, "Error");
      }
    } catch (error) {
      console.log(error);
      showNotification("Có lỗi xảy ra. Vui lòng thử lại!", "Error");
    }
  };

  if (!appointment) return null;

  return (
    <Modal opened={opened} onClose={close} title="Hủy lịch">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="cancelReason"
          control={control}
          rules={{ required: "Vui lòng nhập lí do hủy" }}
          render={({ field, fieldState }) => (
            <Textarea
              {...field}
              label="Lí do"
              placeholder="Nhập lí do hủy lịch"
              error={fieldState?.error?.message}
              rows={5}
            />
          )}
        />

        <Group mt={32} justify="flex-end">
          <Button variant="filled" color="gray" onClick={close}>
            Hủy
          </Button>
          <Button type="submit" variant="filled" color="red">
            Xác nhận
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default CancelScheduleModal;
