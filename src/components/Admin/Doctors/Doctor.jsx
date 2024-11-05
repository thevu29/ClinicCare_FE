import { Button, Group, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import Search from "../Search/Search";
import DoctorTable from "./DoctorTable";
const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Doctors", href: "/admin/doctors" },
];

const DoctorsManagement = () => {
  return (
    <>
      <BreadcumbsComponent items={breadcumbData} />
      <Title order={1} mt={32}>
        Doctors
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="space-between" mb={24}>
          <Search placeholder="Search doctors" />
          <Button leftSection={<IconPlus />} variant="filled" color="indigo">
            Create doctor
          </Button>
        </Group>

        <DoctorTable />
      </div>
    </>
  );
};

export default DoctorsManagement;
