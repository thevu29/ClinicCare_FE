import { ActionIcon, Button, Flex, Group, rem, Select } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showNotification } from "../../../../utils/notification";
import { IconClock } from "@tabler/icons-react";

const types = [
  { value: ">", label: "Greater than" },
  { value: "<", label: "Less than" },
  { value: "to", label: "Between" },
  { value: "=", label: "Equal" },
];

const FilterScheduleTime = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState(null);
  const [time, setTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const ref = useRef(null);

  const pickerControl = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => ref.current?.showPicker()}
    >
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  const handleChangeType = (type) => {
    setSelectedType(type);
  };
  
  const handleTimeChange = (e) => {
    const inputValue = e.target.value;
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (timeRegex.test(inputValue)) {
      setTime(inputValue);
    }
  };

  const handleFilterTime = () => {
    if (!selectedType) {
      showNotification("Please select a type", "Error");
      return;
    }
    if (!time) {
      showNotification("Please enter a time", "Error");
      return;
    }
    console.log(time);

    const params = new URLSearchParams(location.search);

    let timeStr;
    if (selectedType === "=") {
      timeStr = time;
    } else if (selectedType === "to") {
      if (!endTime) {
        showNotification("Please enter an end time", "Error");
        return;
      }

      timeStr = `${time}to${endTime}`;
    } else {
      timeStr = `${selectedType}${time}`;
    }

    params.set("time", timeStr);
    params.delete("page");

    if (!timeStr) params.delete("time");

    navigate(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (!selectedType) {
      setTime(null);
      setEndTime(null);
    }
  }, [selectedType]);

  const handleReset = () => {
    const params = new URLSearchParams(location.search);
    params.delete("time");
    params.delete("page");

    setSelectedType(null);
    setTime(null);
    setEndTime(null);

    navigate(`${pathname}?${params.toString()}`);
  };

  return (
    <Flex
      align={selectedType === "to" ? "flex-start" : "center"}
      direction={selectedType === "to" ? "column" : "row"}
      gap="md"
      mt="md"
    >
      <Select
        placeholder="Select type"
        data={types}
        allowDeselect
        value={selectedType}
        onChange={handleChangeType}
        maw={150}
      />

      <Group>
        <TimeInput
          placeholder="Enter value"
          valueFormat="HH:mm"
          disabled={!selectedType}
          ref={ref}
          rightSection={pickerControl}
          value={time}
          onChange={handleTimeChange}
        />

        {selectedType === "to" && (
          <Group>
            <span className="text-sm">To</span>
            <TimeInput
              placeholder="Enter value"
              valueFormat="HH:mm"
              disabled={!selectedType}
              value={endTime}
              onChange={setEndTime}
            />
          </Group>
        )}
      </Group>

      <Group
        justify={selectedType === "to" && "flex-end"}
        className={selectedType === "to" && "w-full"}
      >
        <Button variant="filled" color="gray" onClick={handleReset}>
          Reset
        </Button>
        <Button variant="filled" onClick={handleFilterTime}>
          Filter
        </Button>
      </Group>
    </Flex>
  );
};

export default FilterScheduleTime;
