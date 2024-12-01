import { Button, Menu, Select } from "@mantine/core";
import { IconFilter } from "@tabler/icons-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const methods = [
  { value: "cash", label: "Cash" },
  { value: "banking", label: "Banking" },
];

const FilterPaymentMethod = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [selectedMethod, setSelectedMethod] = useState(null);

  const handleMethodChange = (method) => {
    setSelectedMethod(method);

    const params = new URLSearchParams(location.search);

    params.set("method", method);
    params.delete("page");

    if (!method) params.delete("method");

    navigate(`${pathname}?${params.toString()}`);
  };

  return (
    <Menu shadow="md" width={150}>
      <Menu.Target>
        <Button variant="white" color="rgba(0, 0, 0, 1)" size="xs">
          <IconFilter width={18} height={18} />
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Select
          placeholder="Select method"
          data={methods}
          allowDeselect
          value={selectedMethod}
          onChange={handleMethodChange}
          maw={150}
        />
      </Menu.Dropdown>
    </Menu>
  );
};

export default FilterPaymentMethod;
