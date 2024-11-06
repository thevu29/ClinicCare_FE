import { Button, Group, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import Search from "../Search/Search";
import DoctorTable from "./DoctorTable";
import { Link } from "react-router-dom";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Doctors", href: "/admin/doctors" },
];

const Doctor = () => {
  return (
    <>
      <BreadcumbsComponent items={breadcumbData} />
      <Title order={1} mt={32}>
        Doctors
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="space-between" mb={24}>
          <Search placeholder="Search doctors" />
          <Link to="/admin/doctors/create">
            <Button leftSection={<IconPlus />} variant="filled" color="indigo">
              Create doctor
            </Button>
          </Link>
        </Group>

        <DoctorTable />
      </div>
    </>
  );
};

export default Doctor;
