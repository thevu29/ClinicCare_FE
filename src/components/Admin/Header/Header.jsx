import {
  Group,
  ThemeIcon,
  UnstyledButton,
  Tooltip,
  TextInput,
} from "@mantine/core";
import {
  IconBell,
  IconPower,
  IconSearch,
  IconChevronLeft,
} from "@tabler/icons-react";
import classes from "./Header.module.scss";

const Header = ({ isCollapsed, setIsCollapsed }) => {
  return (
    <header className={`h-[60px] px-6 ${classes.header}`}>
      <Group justify="space-between" className="h-full">
        <Group gap={24}>
          <Tooltip label="Toggle sidebar">
            <UnstyledButton
              className="size-7 flex justify-center items-center"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <ThemeIcon variant="white" className="hover:bg-[#228be61f]">
                <IconChevronLeft
                  className={classes.chevron}
                  style={{ transform: isCollapsed ? "rotate(180deg)" : "rotate(0)" }}
                />
              </ThemeIcon>
            </UnstyledButton>
          </Tooltip>

          <TextInput
            radius="md"
            leftSectionPointerEvents="none"
            leftSection={<IconSearch width={16} height={16} />}
            placeholder="Search"
            className="w-[300px]"
          />
        </Group>

        <Group>
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
