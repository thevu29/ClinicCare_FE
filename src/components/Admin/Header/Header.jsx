import { Group, ThemeIcon, UnstyledButton, Tooltip, Menu } from "@mantine/core";
import {
  IconPower,
  IconLayoutSidebarLeftCollapse,
  IconBell,
} from "@tabler/icons-react";
import { useState } from "react";
import { useAuth } from "../../../context/Auth/authContext";
import { logoutService } from "../../../services/authService";
import { showNotification } from "../../../utils/notification";
import { useNavigate } from "react-router-dom";
import classes from "./Header.module.scss";
import NotificationBox from "./NotificationBox";

const Header = ({ isCollapsed, setIsCollapsed }) => {
  const { removeToken } = useAuth();
  const navigate = useNavigate();

  const [isNotifiOpen, setIsNotifiOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await logoutService();

      if (res.success) {
        removeToken();
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      showNotification("An error occurred", "Error");
    }
  };

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
          <Menu
            shadow="md"
            onOpen={() => setIsNotifiOpen(true)}
            onClose={() => setIsNotifiOpen(false)}
          >
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

            <Menu.Dropdown>{isNotifiOpen && <NotificationBox />}</Menu.Dropdown>
          </Menu>

          <Tooltip label="Logout">
            <UnstyledButton
              className="size-10 flex justify-center items-center"
              onClick={handleLogout}
            >
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
