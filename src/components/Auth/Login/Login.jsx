import {
  Button,
  Divider,
  Group,
  Input,
  Paper,
  PasswordInput,
  Text,
  Title,
} from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { showNotification } from "../../../utils/notification";
import { loginService } from "../../../services/authService";
import { useAuth } from "../../../context/Auth/authContext";
import classes from "./Login.module.scss";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";

const breadcumbData = [
  { title: "Trang chủ", href: "/" },
  { title: "Đăng nhập" },
];

const Login = () => {
  const navigate = useNavigate();
  const { token, saveToken } = useAuth();

  const { handleSubmit, control } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await loginService(data.email, data.password);
      if (res.success) {
        saveToken(res.data);

        if (
          res.data.role.toLowerCase() === "admin" ||
          res.data.role.toLowerCase() === "doctor"
        ) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        showNotification(res.message, "Error");
      }
    } catch (error) {
      console.error(error);
      showNotification("An error occurred", "Error");
    }
  };

  const handleGoogleLoginClick = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  if (token) {
    return token.role.toLowerCase() === "admin" ||
      token.role.toLowerCase() === "doctor" ? (
      <Navigate to="/admin" />
    ) : (
      <Navigate to="/" />
    );
  }

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <BreadcumbsComponent items={breadcumbData} />
        <Title order={2} className={classes.title} ta="center" my={50}>
          Chào mừng trở lại!
        </Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Email không hợp lệ",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <Input.Wrapper label="Email" error={error?.message}>
                <Input
                  {...(error ? { error: true } : {})}
                  {...field}
                  className="mt-1"
                  size="md"
                  placeholder="Nhập email"
                />
              </Input.Wrapper>
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{
              required: "Mật khẩu không được để trống",
            }}
            render={({ field, fieldState: { error } }) => (
              <Input.Wrapper
                label="Mật khẩu"
                className="mt-4"
                error={error?.message}
              >
                <PasswordInput
                  {...(error ? { error: true } : {})}
                  {...field}
                  className="mt-1"
                  size="md"
                  placeholder="Nhập mật khẩu"
                />
              </Input.Wrapper>
            )}
          />

          <Button fullWidth mt="xl" size="md" type="submit">
            Đăng nhập
          </Button>
        </form>

        <Divider label="Hoặc đăng nhập bằng" labelPosition="center" my="lg" />

        <Button
          fullWidth
          leftSection={<GoogleIcon />}
          variant="default"
          radius="xl"
          size="lg"
          onClick={handleGoogleLoginClick}
        >
          Google
        </Button>

        <Group justify="center" mt="xl" gap={2}>
          <Text size="sm">Chưa có tài khoản?</Text>
          <Text
            size="sm"
            c="indigo"
            className="cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Đăng ký
          </Text>
        </Group>
      </Paper>
    </div>
  );
};

export default Login;

const GoogleIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid"
      viewBox="0 0 256 262"
      style={{ width: "1.1rem", height: "1.1rem" }}
      {...props}
    >
      <path
        fill="#4285F4"
        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
      />
      <path
        fill="#34A853"
        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
      />
      <path
        fill="#FBBC05"
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
      />
      <path
        fill="#EB4335"
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
      />
    </svg>
  );
};
