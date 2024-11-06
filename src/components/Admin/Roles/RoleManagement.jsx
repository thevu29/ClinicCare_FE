import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import RoleTable from "./RoleTable";
import { Button, Group, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Search from "../Search/Search";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Roles", href: "/admin/roles" },
];

export default function RoleManagement() {
  return (
    <>
      <BreadcumbsComponent items={breadcumbData} />
      <Title order={1} mt={32}>
        Roles
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="space-between" mb={24}>
          <Search placeholder="Search roles" />
          <Button leftSection={<IconPlus />} variant="filled" color="indigo">
            Create role
          </Button>
        </Group>

        <RoleTable />
      </div>
    </>
  );
}
