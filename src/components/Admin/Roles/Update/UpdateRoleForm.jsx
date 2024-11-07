import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Flex,
  Group,
  LoadingOverlay,
  TextInput,
  Title,
} from "@mantine/core";
import {
  getRoleService,
  updateRoleService,
} from "../../../../services/roleService";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";
import { showNotification } from "../../../../utils/notication";
import { Link, useParams } from "react-router-dom";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Roles", href: "/admin/roles" },
  { title: "Update role", href: "/admin/role/update" },
];

const FORM_VALIDATION = {
  name: {
    required: "Name is required",
  },
};

export default function UpdateRoleForm() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState({});

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesRes = await getRoleService(id);
        if (rolesRes && rolesRes.success) {
          const currentRole = {
            name: rolesRes.data.name,
            description: rolesRes.data.description || "",
          };

          setCurrentRole(currentRole);
          reset(currentRole);
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

      const formData = {};

      // If the role name changed
      if (data.name !== currentRole.name) {
        formData.name = data.name;
      }

      // If the role description changed
      if (data.description !== currentRole.description) {
        formData.description = data.description;
      }

      // If formData has value then update
      if (Object.keys(formData).length > 0) {
        const response = await updateRoleService(id, formData);

        response && response.success
          ? showNotification(response.message, "Success")
          : showNotification(response.message, "Error");
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
    setIsLoading(false);
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
        Update Role
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
                    placeholder="Enter role's name"
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
                    placeholder="Enter role's description"
                  />
                )}
              />
            </Flex>
          </Group>

          <Group mt={32} justify="flex-end">
            <Link to="/admin/roles">
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
}
