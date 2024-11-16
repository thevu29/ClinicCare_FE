import { UnstyledButton, Group, Avatar, Text } from "@mantine/core";
import classes from "./NavbarFooter.module.scss";

const NavbarFooter = ({ isCollapsed }) => {
  return (
    <UnstyledButton className={classes.user}>
      <Group wrap="no">
        <Avatar
          src="https://media.yeah1.com/files/ngoctran/2022/07/01/289693821_582015943280803_2102006602626651935_n-205941.jpg"
          radius="xl"
        />

        {!isCollapsed && (
          <div style={{ flex: 1 }}>
            <Text size="sm" fw={500}>
              Lâm Quốc Đại
            </Text>

            <Text c="dimmed" size="xs">
              daisex@gmail.com  
            </Text>
          </div>
        )}
      </Group>
    </UnstyledButton>
  );
};

export default NavbarFooter;
