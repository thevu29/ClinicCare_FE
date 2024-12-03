import { TextInput } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";

const SearchDoctor = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const handleSearch = useDebouncedCallback((search) => {
    const params = new URLSearchParams(location.search);

    params.set("search", search);
    params.delete("page");

    if (!search) params.delete("search");

    navigate(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="bg-[#1975dc]">
      <div className="max-w-4xl mx-auto p-6">
        <TextInput
          radius="xl"
          placeholder="Tìm theo chuyên khoa, bác sĩ"
          size="md"
          rightSection={<IconSearch width={20} height={20} />}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchDoctor;
