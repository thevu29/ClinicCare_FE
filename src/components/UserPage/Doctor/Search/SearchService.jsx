import { TextInput } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";

const SearchService = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const handleSearch = useDebouncedCallback((search) => {
    const params = new URLSearchParams(location.search);

    params.set("service", search);
    params.delete("page");

    if (!search) params.delete("service");

    navigate(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <TextInput
      radius="xs"
      placeholder="Tìm chuyên khoa"
      leftSection={<IconSearch width={16} height={16} />}
      onChange={(e) => handleSearch(e.target.value)}
    />
  );
};

export default SearchService;
