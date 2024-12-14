import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Flex, Group, TextInput } from "@mantine/core";
import { getAllRoles } from "../../../../services/roleService";
import {
    getUserByIdService,
    updateUserService,
} from "../../../../services/userService";
import { showNotification } from "../../../../utils/notification";
import { useAuth } from "../../../../context/Auth/authContext";
import ImageDropzone from "../../../Dropzone/Dropzone";

const FORM_VALIDATION = {
  name: {
    required: "Họ và tên không được để trống",
  },
  phone: {
    pattern: {
      value: /^\d{10}$/,
      message: "Số điện thoại phải chứa đúng 10 chữ số",
    },
  },
};

const AccountInformation = () => {
  const { token } = useAuth();

  const [user, setUser] = useState(null);

  const { handleSubmit, control, setValue, reset } = useForm({
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      image: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesRes = await getAllRoles();

        if (rolesRes.success) {
          const rolesData = rolesRes.data
            .map((role) => ({
              value: role.roleId,
              label: role.name,
            }))
            .filter((role) => role.label !== "User");

          const userRes = await getUserByIdService(token?.userId);

          if (userRes.success) {
            const user = userRes.data;
            setUser(user);

            const userRole =
              rolesData.find((role) => role.label === user.role)?.value || "";

            reset({
              email: user.email,
              name: user.name,
              phone: user.phone,
              image: user.image,
              roleId: userRole,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key !== "image") {
          if (data[key]) formData.append(key, data[key]);
        }
      });

      if (data.image && typeof data.image !== "string") {
        formData.append("image", data.image);
      }

      const response = await updateUserService(token?.userId, formData);

      response.success
        ? showNotification(response.message, "Success")
        : showNotification(response.message, "Error");
    } catch (error) {
      console.log(error);
      showNotification("An error occured", "Error");
    }
  };

  const handleImageUpload = (file) => {
    setValue("image", file);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-2 p-4 md:px-0">
        <h1 className="text-xl font-bold">Thông tin cá nhân</h1>
      </div>

      <div className="bg-white p-8 rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Group justify="space-between" grow>
            <Flex direction="column" gap={20}>
              <Controller
                name="email"
                control={control}
                render={() => (
                  <TextInput
                    disabled
                    label="Email"
                    size="md"
                    placeholder="Email của bạn"
                  />
                )}
              />

              <Controller
                name="name"
                control={control}
                rules={FORM_VALIDATION.name}
                render={({ field, fieldState: { error } }) => (
                  <TextInput
                    {...field}
                    error={error?.message}
                    label="Họ và tên"
                    size="md"
                    placeholder="Nhập họ và tên"
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
                    label="Số điện thoại"
                    size="md"
                    type="number"
                    placeholder="Nhập số điện thoại"
                  />
                )}
              />
            </Flex>

            <Controller
              name="image"
              control={control}
              render={() => (
                <ImageDropzone object={user} onUpload={handleImageUpload} />
              )}
            />
          </Group>

          <Group mt={32} justify="flex-end">
            <Button type="submit" variant="filled">
              Lưu
            </Button>
          </Group>
        </form>
      </div>
    </>
  );
};

export default AccountInformation;
