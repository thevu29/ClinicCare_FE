import { Button, Group, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import Search from "../Search/Search";
import MedicalRecordTable from "./MedicalRecordTable";
const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Medical Record", href: "/admin/medical-records" },
];

const DoctorsManagement = () => {
  return (
    <>
      <BreadcumbsComponent items={breadcumbData} />
      <Title order={1} mt={32}>
        Medical Records
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="space-between" mb={24}>
          <Search placeholder="Search records" />
          <Button leftSection={<IconPlus />} variant="filled" color="indigo">
            Create record
          </Button>
        </Group>

        <MedicalRecordTable />
      </div>
    </>
  );
};

export default DoctorsManagement;
