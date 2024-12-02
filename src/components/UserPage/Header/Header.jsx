import {
  IconChevronDown,
  IconLogout,
  IconMessage,
  IconNurse,
  IconSettings,
  IconSocial,
  IconCalendarClock,
} from "@tabler/icons-react";
import {
  Avatar,
  Box,
  Button,
  Center,
  Group,
  HoverCard,
  Menu,
  SimpleGrid,
  Text,
  ThemeIcon,
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

const mockdata = [
  {
    icon: IconNurse,
    title: "Đặt khám bác sĩ",
    description: "Đặt lịch khám không chờ đợi",
  },
  {
    icon: IconSocial,
    title: "Đặt khám chuyên khoa",
    description: "Đặt khám, thanh toán, nhận kết quả",
  },
];

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

  const links = mockdata.map((item) => (
    <Link to="/doctors" className={classes.subLink} key={item.title}>
      <UnstyledButton>
        <Group wrap="nowrap" align="flex-start">
          <ThemeIcon size={34} variant="default" radius="md">
            <item.icon size={22} color={theme.colors.blue[6]} />
          </ThemeIcon>
          <div>
            <Text size="sm" fw={500}>
              {item.title}
            </Text>
            <Text size="xs" c="dimmed">
              {item.description}
            </Text>
          </div>
        </Group>
      </UnstyledButton>
    </Link>
  ));

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
          <HoverCard position="bottom" radius="md" shadow="md" withinPortal>
            <HoverCard.Target>
              <div className={clsx(classes.link, "cursor-pointer")}>
                <Center inline>
                  <Box component="span" mr={5}>
                    Đặt khám
                  </Box>
                  <IconChevronDown size={16} color={theme.colors.blue[6]} />
                </Center>
              </div>
            </HoverCard.Target>

            <HoverCard.Dropdown style={{ overflow: "hidden" }}>
              <SimpleGrid cols={1} spacing={0}>
                {links}
              </SimpleGrid>
            </HoverCard.Dropdown>
          </HoverCard>
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
              <Menu.Item
                leftSection={
                  <IconCalendarClock
                    size={16}
                    color={theme.colors.yellow[6]}
                    stroke={1.5}
                  />
                }
              >
                Lịch khám
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconMessage
                    size={16}
                    color={theme.colors.blue[6]}
                    stroke={1.5}
                  />
                }
              >
                Nhận xét
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
