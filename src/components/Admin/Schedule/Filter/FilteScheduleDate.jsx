import { Button, Flex, Group, Select } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showNotification } from "../../../../utils/notification";
import { formatDateForApi } from "../../../../utils/date";

const types = [
  { value: ">", label: "Greater than" },
  { value: "<", label: "Less than" },
  { value: "to", label: "Between" },
  { value: "=", label: "Equal" },
];

const FilterScheduleDate = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState(null);
  const [date, setDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleChangeType = (type) => {
    setSelectedType(type);
  };

  const handleFilterDate = () => {
    if (!selectedType) {
      showNotification("Please select a type", "Error");
      return;
    }
    if (!date) {
      showNotification("Please enter a date", "Error");
      return;
    }

    const params = new URLSearchParams(location.search);

    let dateStr;
    if (selectedType === "=") {
      dateStr = formatDateForApi(date);
    } else if (selectedType === "to") {
      if (!endDate) {
        showNotification("Please enter an end date", "Error");
        return;
      }

      dateStr = `${formatDateForApi(date)}to${formatDateForApi(endDate)}`;
    } else {
      dateStr = `${selectedType}${formatDateForApi(date)}`;
    }

    params.set("date", dateStr);
    params.delete("page");

    if (!dateStr) params.delete("date");

    navigate(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (!selectedType) {
      setDate(null);
      setEndDate(null);
    }
  }, [selectedType]);

  const handleReset = () => {
    const params = new URLSearchParams(location.search);
    params.delete("date");
    params.delete("page");

    setSelectedType(null);
    setDate(null);
    setEndDate(null);

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
        <DateInput
          placeholder="Enter value"
          valueFormat="DD/MM/YYYY"
          disabled={!selectedType}
          value={date}
          onChange={setDate}
        />

        {selectedType === "to" && (
          <Group>
            <span className="text-sm">To</span>
            <DateInput
              placeholder="Enter value"
              valueFormat="DD/MM/YYYY"
              disabled={!selectedType}
              value={endDate}
              onChange={setEndDate}
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
        <Button variant="filled" onClick={handleFilterDate}>
          Filter
        </Button>
      </Group>
    </Flex>
  );
};

export default FilterScheduleDate;
