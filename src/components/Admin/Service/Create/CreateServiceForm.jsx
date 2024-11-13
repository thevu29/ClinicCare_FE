import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Select,
  TextInput,
  Title,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";
import { Controller, useForm } from "react-hook-form";
import { addServiceManager } from "../../../../services/serviceManager";
import { getAllPromotionsService } from "../../../../services/promotionService";
import { showNotification } from "../../../../utils/notication";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Services", href: "/admin/services" },
  { title: "Create service" },
];

const FORM_VALIDATION = {
  name: {
    required: "Name is required",
  },
  description: {
    required: "Description is required",
  },
  price: {
    required: "Price is required",
  },
  promotionId: {
    requiredId: "Promotion is required",
  },
};

const CreateServiceForm = () => {
  const navigate = useNavigate();

  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      promotionId: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await getAllPromotionsService();

        if (res.success) {
          const data = res.data.map((promotion) => ({
            value: promotion.promotionId,
            label: promotion.description,
          }));

          setPromotions(data);
        }
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
    };

    fetchPromotions();
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const res = await addServiceManager(data);

      if (res.success) {
        showNotification(res.message, "success");
        navigate("/admin/services");
      } else {
        showNotification(res.message, "error");
      }
    } catch (error) {
      console.error("Error creating service:", error);
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
        Create Service
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Group justify="space-between" grow>
            <Flex direction="column" gap={20}>
              <Controller
                name="name"
                control={control}
                rules={FORM_VALIDATION.name}
                render={({ field, fieldState: { error } }) => (
                  <TextInput
                    {...field}
                    error={error?.message}
                    label="Name"
                    size="md"
                    placeholder="Enter service name"
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                rules={FORM_VALIDATION.description}
                render={({ field, fieldState: { error } }) => (
                  <TextInput
                    {...field}
                    error={error?.message}
                    label="Description"
                    size="md"
                    placeholder="Enter service description"
                  />
                )}
              />

              <Controller
                name="price"
                control={control}
                rules={FORM_VALIDATION.price}
                render={({ field, fieldState: { error } }) => (
                  <TextInput
                    {...field}
                    error={error?.message}
                    label="Price"
                    size="md"
                    type="number"
                    placeholder="Enter service price"
                  />
                )}
              />

              <Controller
                name="promotionId"
                control={control}
                rules={FORM_VALIDATION.promotionId}
                render={({ field, fieldState: { error } }) => (
                  <Select
                    {...field}
                    error={error?.message}
                    label="Promotion"
                    size="md"
                    placeholder="Select promotion"
                    data={promotions}
                    allowDeselect={false}
                  />
                )}
              />
            </Flex>
          </Group>

          <Group mt={32} justify="flex-end">
            <Link to="/admin/services">
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

export default CreateServiceForm;
