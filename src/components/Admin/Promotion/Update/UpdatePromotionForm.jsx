import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Select,
  TextInput,
  Title,
} from "@mantine/core";
import {
  getPromotionByIdService,
  updatePromotionService,
} from "../../../../services/promotionService";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";
import { showNotification } from "../../../../utils/notication";
import { Link, useParams } from "react-router-dom";
import { toUpper } from "lodash";

const statuses = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "expired", label: "Expired" },
  { value: "end", label: "End" },
];

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Promotions", href: "/admin/promotions" },
  { title: "Update Promotion", href: "/admin/promotions/update" },
];

const FORM_VALIDATION = {
  description: {
    required: "Description is required",
  },
  discount: {
    required: "Discount is required",
  },
  status: {
    required: "Status is required",
  },
  expireAt: {
    required: "expireAt is required",
  },
};

const UpdatePromotionForm = () => {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      description: "",
      discount: "",
      status: "",
      expireAt: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch promotion by id
        const promotionRes = await getPromotionByIdService(id);
        if (promotionRes.success) {
          const promotion = promotionRes.data;

          // set status for select
          const statusSelected = statuses.find(
            (status) =>  toUpper(status.value) === promotion.status
          )?.value || "";


          // set form values
          reset({
            description: promotion.description,
            discount: promotion.discount,
            status: statusSelected,
            expireAt: promotion.expireAt,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const response = await updatePromotionService(id, data);

      response.success
        ? showNotification(response.message, "Success")
        : showNotification(response.message, "Error");
    } catch (error) {
      console.error("Error updating promotion:", error);
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
        Update Promotion
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Group justify="space-between" grow>
            <Flex direction="column" gap={20}>
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
                    placeholder="Enter promotion description"
                  />
                )}
              />

              <Controller
                name="discount"
                control={control}
                rules={FORM_VALIDATION.discount}
                render={({ field, fieldState: { error } }) => (
                  <TextInput
                    {...field}
                    error={error?.message}
                    label="Discount"
                    size="md"
                    type="number"
                    placeholder="Enter promotion discount"
                  />
                )}
              />
            </Flex>
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
              name="expireAt"
              control={control}
              rules={FORM_VALIDATION.expireAt}
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  {...field}
                  error={error?.message}
                  label="Expire at"
                  size="md"
                  type="date"
                  placeholder="Enter promotion expire at"
                />
              )}
            />
          </Group>

          <Group mt={32} justify="flex-end">
            <Link to="/admin/promotions">
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

export default UpdatePromotionForm;
