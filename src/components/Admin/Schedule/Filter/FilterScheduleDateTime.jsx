import { Button, Menu } from "@mantine/core";
import { IconFilter } from "@tabler/icons-react";
import FilterScheduleDate from "./FilteScheduleDate";

// const values = [
//   { value: "date", label: "Date" },
//   { value: "time", label: "Time" },
// ];

const FilterScheduleDateTime = () => {
  // const [value, setValue] = useState(null);

  return (
    <Menu shadow="md" closeOnClickOutside={false}>
      <Menu.Target>
        <Button
          variant="white"
          color="rgba(0, 0, 0, 1)"
          size="xs"
          onClick={(e) => e.stopPropagation()}
        >
          <IconFilter width={18} height={18} />
        </Button>
      </Menu.Target>

      <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
        <FilterScheduleDate />

        {/* <Select
          placeholder="Select value"
          data={values}
          allowDeselect
          value={value}
          onChange={setValue}
          maw={150}
        />

        {value === "date" ? (
          <FilterScheduleDate />
        ) : value === "time" ? (
          <FilterScheduleTime />
        ) : (
          <></>
        )} */}
      </Menu.Dropdown>
    </Menu>
  );
};

export default FilterScheduleDateTime;
