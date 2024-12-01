import { Button, Menu, Select } from "@mantine/core";
import { IconFilter } from "@tabler/icons-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const statuses = [
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "cancelled", label: "Cancelled" },
];

const FilterPaymentStatus = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);

    const params = new URLSearchParams(location.search);

    params.set("status", status);
    params.delete("page");

    if (!status) params.delete("status");

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
          placeholder="Select status"
          data={statuses}
          allowDeselect
          value={selectedStatus}
          onChange={handleStatusChange}
          maw={150}
        />
      </Menu.Dropdown>
    </Menu>
  );
};

export default FilterPaymentStatus;
