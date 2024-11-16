import { Button, Group, Modal, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import { getAllPromotionsService } from "../../../../services/promotionService";
import { showNotification } from "../../../../utils/notification";
import { applyPromotionService } from "../../../../services/serviceManager";
import { Controller, useForm } from "react-hook-form";

const ApplyPromotionModal = ({
  opened,
  close,
  serviceId,
  fetchServices,
  setIsLoading,
}) => {
  const [promotions, setPromotions] = useState([]);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      promotionId: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchPromotions = async () => {
      const res = await getAllPromotionsService();

      if (res.success) {
        const promotions = res.data.map((promotion) => ({
          label: `${promotion.description} - ${promotion.discount}%`,
          value: promotion.promotionId,
        }));
        setPromotions(promotions);
      }
    };
    fetchPromotions();
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const res = await applyPromotionService(serviceId, data);

      if (res.success) {
        showNotification("Promotion applied successfully", "Success");
        close();
        fetchServices();
      } else {
        showNotification(res.message, "Error");
      }
    } catch (error) {
      console.error(error);
      showNotification("An error occured", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Apply promotion">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="promotionId"
            control={control}
            rules={{ required: "Promotion is required" }}
            render={({ field, fieldState: { error } }) => (
              <Select
                {...field}
                error={error?.message}
                placeholder="Select promotion"
                searchable
                data={promotions}
              />
            )}
          />

          <Group justify="end" mt="md">
            <Button color="gray" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" color="blue">
              Apply
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default ApplyPromotionModal;
