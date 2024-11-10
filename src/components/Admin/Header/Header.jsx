import {
  Group,
  ThemeIcon,
  UnstyledButton,
  Tooltip,
  Menu,
  ScrollArea,
  Divider,
  Text,
  Box,
} from "@mantine/core";
import {
  IconBell,
  IconPower,
  IconLayoutSidebarLeftCollapse,
} from "@tabler/icons-react";
import classes from "./Header.module.scss";
import { useEffect, useState } from "react";
import { getByUserIdService } from "../../../services/notificationService";

const Header = ({ isCollapsed, setIsCollapsed }) => {
  const [notifications, setNotifications] = useState([]);

  // Cursor
  const [cursor, setCursor] = useState("");

  // Admin Id
  const userId = "1112c29f-aa3c-40ce-ad10-4266c06b8461";

  // Handle for load more notification
  const handleLoadMore = async () => {
    try {
      const res = await getByUserIdService(userId, cursor);
      console.log(res);

      if (res && res.success) {
        // Set cursor
        setCursor(res.data.cursor);
        // Set notification
        setNotifications((prev) => [...prev, ...res.data.notifications]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Get notification with admin Id
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const res = await getByUserIdService(userId);
        console.log(res);

        if (res && res.success) {
          // Set cursor
          setCursor(res.data.cursor);
          // Set notification
          setNotifications(res.data.notifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotification();
  }, []);

  useEffect(() => {
    console.log(notifications);
  }, [notifications]);

  return (
    <header className={`h-[60px] px-6 ${classes.header}`}>
      <Group justify="space-between" className="h-full">
        <Tooltip label="Toggle sidebar">
          <UnstyledButton
            className="size-7 flex justify-center items-center"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ThemeIcon variant="white" className="hover:bg-[#228be61f]">
              <IconLayoutSidebarLeftCollapse
                className={classes.chevron}
                style={{
                  transform: isCollapsed ? "rotate(180deg)" : "rotate(0)",
                }}
                rotate={isCollapsed.toString()}
              />
            </ThemeIcon>
          </UnstyledButton>
        </Tooltip>

        <Group>
          <Menu shadow="md">
            <Menu.Target>
              <Tooltip label="Notifications">
                <UnstyledButton className="size-10 flex justify-center items-center">
                  <ThemeIcon
                    variant="white"
                    size="lg"
                    className="hover:bg-[#228be61f]"
                  >
                    <IconBell />
                  </ThemeIcon>
                </UnstyledButton>
              </Tooltip>
            </Menu.Target>

            <Menu.Dropdown>
              <Box w={300} mah={300} style={{ overflowY: "auto" }}>
                {notifications.map((item) => (
                  <Menu.Item py={20} key={item.notificationId}>
                    {item.message}
                  </Menu.Item>
                ))}
              </Box>

              <Divider />

              <Text
                c="blue"
                align="center"
                className="hover:underline cursor-pointer"
                onClick={handleLoadMore}
              >
                More
              </Text>
            </Menu.Dropdown>
          </Menu>

          <Tooltip label="Logout">
            <UnstyledButton className="size-10 flex justify-center items-center">
              <ThemeIcon
                variant="white"
                size="lg"
                className="hover:bg-[#228be61f]"
              >
                <IconPower />
              </ThemeIcon>
            </UnstyledButton>
          </Tooltip>
        </Group>
      </Group>
    </header>
  );
};

export default Header;
