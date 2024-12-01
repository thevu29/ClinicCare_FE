import { Button, Flex, Group, PasswordInput, TextInput } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/Auth/authContext";
import { showNotification } from "../../../utils/notification";
import { loginService, registerService } from "../../../services/authService";
import AvatarDropzone from "../../Admin/User/Dropzone/Dropzone";

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
  password: {
    required: "Password is required",
  },
  confirmPassword: {
    required: "Confirm password is required",
  },
};

const RegisterForm = ({ email, setIsLoading }) => {
  const navigate = useNavigate();
  const { saveToken } = useAuth();

  const { handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      password: "",
      confirmPassword: "",
      image: "",
    },
    mode: "onChange",
  });

  const password = watch("password");

  const handleImageUpload = (file) => {
    setValue("image", file);
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("email", email);

      Object.keys(data).forEach((key) => {
        if (key !== "image" && key !== "confirmPassword") {
          formData.append(key, data[key]);
        }
      });

      if (data.image) {
        formData.append("image", data.image);
      }

      const res = await registerService(formData);

      if (res.success) {
        const loginRes = await loginService(email, data.password);

        if (loginRes.success) {
          showNotification("Đăng ký tài khoản thành công!", "Success");
          saveToken(loginRes.data);
          navigate("/");
        }
      } else {
        showNotification(res.message, "Error");
      }
    } catch (error) {
      console.log(error);
      showNotification("Có lỗi xảy ra. Vui lòng thử lại!", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative max-w-[700px] my-[48px] mx-auto py-12 px-14 bg-white rounded-[4px] shadow-[0_3px_10px_0_rgba(0,0,0,0.14)]">
      <h1 className="text-[20px] font-bold text-center mb-6">Tạo tài khoản</h1>

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
                  withAsterisk
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
            name="password"
            control={control}
            rules={FORM_VALIDATION.password}
            render={({ field, fieldState: { error } }) => (
              <PasswordInput
                {...field}
                withAsterisk
                error={error?.message}
                label="Password"
                size="md"
                placeholder="Enter your password"
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              ...FORM_VALIDATION.confirmPassword,
              validate: (value) =>
                value === password || "Passwords do not match",
            }}
            render={({ field, fieldState: { error } }) => (
              <PasswordInput
                {...field}
                withAsterisk
                label="Confirm password"
                size="md"
                error={error?.message}
                placeholder="Repeat your password"
              />
            )}
          />
        </Group>

        <Button type="submit" variant="filled" fullWidth mt={32}>
          Đăng ký
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
