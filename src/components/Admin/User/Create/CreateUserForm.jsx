import {
  Button,
  Flex,
  Group,
  LoadingOverlay,
  PasswordInput,
  Select,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { getRolesService } from "../../../../services/roleService";
import { addUserService } from "../../../../services/userService";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";
import AvatarDropzone from "../Dropzone/Dropzone";
import { showNotification } from "../../../../utils/notication";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Users", href: "/admin/users" },
  { title: "Create user" },
];

const FORM_VALIDATION = {
  name: {
    required: "Name is required",
  },
  phone: {
    pattern: {
      value: /^\d{10}$/,
      message: "Phone number must contain exactly 10 digits",
    },
  },
  email: {
    required: "Email is required",
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      message: "Invalid email address",
    },
  },
  password: {
    required: "Password is required",
  },
  role: {
    required: "Role is required",
  },
};

const CreateUserForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [roles, setRoles] = useState([]);

  const { handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      image: "",
      roleId: "",
    },
    mode: "onChange",
  });

  const password = watch("password");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await getRolesService();
        if (res.success) {
          const data = res.data.map((role) => ({
            value: role.roleId,
            label: role.name,
          }));

          setRoles(data);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key !== "image" && key !== "confirmPassword") {
          formData.append(key, data[key]);
        }
      });

      if (data.image) {
        formData.append("image", data.image);
      }

      const response = await addUserService(formData);

      if (response.success) {
        showNotification(response.message, "success");
        navigate("/admin/users");
      } else {
        showNotification(response.message, "error");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (file) => {
    setValue("image", file);
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
        Create User
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
                    placeholder="Enter your name"
                  />
                )}
              />

              <Controller
                name="phone"
                control={control}
                rules={FORM_VALIDATION.phone}
                render={({ field, fieldState: { error } }) => (
                  <TextInput
                    {...field}
                    error={error?.message}
                    label="Phone"
                    size="md"
                    type="number"
                    placeholder="Enter your phone number"
                  />
                )}
              />
            </Flex>

            <Controller
              name="image"
              control={control}
              render={() => <AvatarDropzone onUpload={handleImageUpload} />}
            />
          </Group>

          <Group grow mt={20}>
            <Controller
              name="email"
              control={control}
              rules={FORM_VALIDATION.email}
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  {...field}
                  error={error?.message}
                  label="Email"
                  size="md"
                  type="text"
                  placeholder="Enter your email"
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={FORM_VALIDATION.password}
              render={({ field, fieldState: { error } }) => (
                <PasswordInput
                  {...field}
                  error={error?.message}
                  label="Password"
                  size="md"
                  placeholder="Enter your password"
                />
              )}
            />
          </Group>

          <Group grow mt={20}>
            <Controller
              name="roleId"
              control={control}
              rules={FORM_VALIDATION.role}
              render={({ field, fieldState: { error } }) => (
                <Select
                  {...field}
                  error={error?.message}
                  label="Role"
                  placeholder="Select role"
                  data={roles}
                  allowDeselect={false}
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                validate: (value) =>
                  value === password || "Passwords do not match",
              }}
              render={({ field, fieldState: { error } }) => (
                <PasswordInput
                  {...field}
                  label="Confirm password"
                  error={error?.message}
                  placeholder="Repeat your password"
                />
              )}
            />
          </Group>

          <Group mt={32} justify="flex-end">
            <Link to="/admin/users">
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

export default CreateUserForm;
