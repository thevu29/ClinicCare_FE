import { UnstyledButton, Group, Avatar, Text } from "@mantine/core";
import { useAuth } from "../../../context/Auth/authContext";
import classes from "./NavbarFooter.module.scss";

const NavbarFooter = ({ isCollapsed }) => {
  const { token } = useAuth();

  return (
    <UnstyledButton className={classes.user}>
      <Group wrap="no">
        <Avatar src={token?.image} radius="xl" />

        {!isCollapsed && (
          <div style={{ flex: 1 }}>
            <Text size="sm" fw={500}>
              {token?.name}
            </Text>

            <Text c="dimmed" size="xs">
              {token?.username}
            </Text>
          </div>
        )}
      </Group>
    </UnstyledButton>
  );
};

export default NavbarFooter;
