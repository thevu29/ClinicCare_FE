import {
  IconChevronDown,
  IconLogout,
  IconSettings,
  IconCalendarClock,
  IconFile,
  IconReceipt,
} from "@tabler/icons-react";
import {
  Avatar,
  Button,
  Group,
  Menu,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useState } from "react";
import { useAuth } from "../../../context/Auth/authContext";
import { Link, useNavigate } from "react-router-dom";
import { showNotification } from "../../../utils/notification";
import { logoutService } from "../../../services/authService";
import classes from "./Header.module.scss";
import Logo from "../../../assets/images/logo.png";
import clsx from "clsx";

const Header = () => {
  const navigate = useNavigate();
  const { token, removeToken } = useAuth();

  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const theme = useMantineTheme();

  const handleLogout = async () => {
    try {
      const res = await logoutService();

      if (res.success) {
        showNotification("Đăng xuất thành công", "Success");
        removeToken();
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      showNotification("An error occurred", "Error");
    }
  };

  return (
    <header className={classes.header}>
      <Group justify="space-between" h="100%">
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="w-8" />
          <Text fw={700} size="lg">
            ClinicCare
          </Text>
        </Link>

        <Group h="100%" gap={0} visibleFrom="sm">
          <Link to="/" className={classes.link}>
            Trang chủ
          </Link>
          <Link to="/doctors" className={classes.link}>
            Đặt khám
          </Link>
          <Link to="/" className={classes.link}>
            Tư vấn
          </Link>
        </Group>

        {token ? (
          <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: "pop-top-right" }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton
                className={clsx(classes.user, {
                  [classes.userActive]: userMenuOpened,
                })}
              >
                <Group gap={7}>
                  <Avatar
                    src={token.image}
                    alt={token.name}
                    radius="xl"
                    size={20}
                  />
                  <Text fw={500} size="sm" lh={1} mr={3}>
                    {token.name}
                  </Text>
                  <IconChevronDown size={12} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Link to="/account/appointments">
                <Menu.Item
                  leftSection={
                    <IconCalendarClock
                      size={16}
                      color={theme.colors.gray[6]}
                      stroke={1.5}
                    />
                  }
                >
                  Lịch khám
                </Menu.Item>
              </Link>
              <Menu.Item
                leftSection={
                  <IconFile
                    size={16}
                    color={theme.colors.red[6]}
                    stroke={1.5}
                  />
                }
              >
                Hồ sơ bệnh án
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconReceipt
                    size={16}
                    color={theme.colors.yellow[6]}
                    stroke={1.5}
                  />
                }
              >
                Lịch sử thanh toán
              </Menu.Item>

              <Menu.Label>Tài khoản</Menu.Label>
              <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />}>
                Thông tin cá nhân
              </Menu.Item>
              <Menu.Item
                leftSection={<IconLogout size={16} stroke={1.5} />}
                onClick={handleLogout}
              >
                Đăng xuất
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <Group visibleFrom="sm">
            <Link to="/login">
              <Button variant="default">Đăng nhập</Button>
            </Link>
            <Link to="/register">
              <Button>Đăng ký</Button>
            </Link>
          </Group>
        )}
      </Group>
    </header>
  );
};

export default Header;
