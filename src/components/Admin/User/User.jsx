import { Button, Group, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import UserTable from "./UserTable";
import Search from "../Search/Search";
import { Link } from "react-router-dom";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Users" },
];

const User = () => {
  return (
    <>
      <BreadcumbsComponent items={breadcumbData} />
      <Title order={1} mt={32}>
        Users
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="space-between" mb={24}>
          <Search placeholder="Search users" />
          <Link to="/admin/users/create">
            <Button leftSection={<IconPlus />} variant="filled" color="indigo">
              Create user
            </Button>
          </Link>
        </Group>

        <UserTable />
      </div>
    </>
  );
};

export default User;
