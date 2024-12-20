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
import { Link, useNavigate, useParams } from "react-router-dom";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";
import { Controller, useForm } from "react-hook-form";
import {
  updateServiceManager,
  getServiceByIdManager,
} from "../../../../services/serviceManager";
import { getAllPromotionsService } from "../../../../services/promotionService";
import { showNotification } from "../../../../utils/notification";
import { toUpper } from "lodash";
import ImageDropzone from "../../../Dropzone/Dropzone";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Services", href: "/admin/services" },
  { title: "Create service" },
];

const statuses = [
  { label: "Available", value: "available" },
  { label: "Unavailable", value: "unavailable" },
];

const FORM_VALIDATION = {
  name: {
    required: "Name is required",
  },
  price: {
    required: "Price is required",
  },
  promotionId: {
    requiredId: "Promotion is required",
  },
};

const UpdateServiceForm = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control, reset, setValue } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      imageFile: "",
      status: "",
      promotionId: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllPromotionsService();

        if (res.success) {
          const promotionsData = res.data.map((promotion) => ({
            value: promotion.promotionId,
            label: promotion.description,
          }));

          setPromotions(promotionsData);

          const serviceRes = await getServiceByIdManager(id);
          if (serviceRes.success) {
            const service = serviceRes.data;
            setService(service);

            const promotionSelected =
              promotionsData.find(
                (promotion) => promotion.value === service.promotionId
              )?.value || "";

            const statusSelected =
              statuses.find(
                (status) => toUpper(status.label) === service.status
              )?.value || "";

            reset({
              name: service.name,
              description: service.description,
              price: service.price,
              imageFile: service.image,
              status: statusSelected,
              promotionId: promotionSelected,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key !== "imageFile") {
          formData.append(key, data[key]);
        }
      });

      if (data.imageFile && typeof data.imageFile !== "string") {
        formData.append("imageFile", data.imageFile);
      }

      const res = await updateServiceManager(id, formData);

      if (res.success) {
        showNotification(res.message, "Success");
        navigate("/admin/services");
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

  const handleImageUpload = (file) => {
    setValue("imageFile", file);
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
        Update Service
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
            </Flex>

            <Controller
              name="imageFile"
              control={control}
              render={() => (
                <ImageDropzone object={service} onUpload={handleImageUpload} />
              )}
            />
          </Group>

          <Group grow mt={20}>
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
                  allowDeselect={false}
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
                />
              )}
            />
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

export default UpdateServiceForm;
