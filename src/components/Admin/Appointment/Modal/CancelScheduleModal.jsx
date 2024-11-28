import { Button, Group, Modal, Textarea } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";

const CancelScheduleModal = ({ opened, close, appointment }) => {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      cancelReason: "",
    },
    mode: "onChange",
  });

  if (!appointment) return null;

  return (
    <Modal opened={opened} onClose={close} title="Cancel Schedule">
      <form>
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
