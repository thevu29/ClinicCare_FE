import { Button, Group, Title } from "@mantine/core";
import { IconPlus, IconTrashX } from "@tabler/icons-react";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import Search from "../Search/Search";
import DoctorTable from "./DoctorTable";
import { Link } from "react-router-dom";
import { useState } from "react";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Doctors", href: "/admin/doctors" },
];

const Doctor = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  return (
    <>
      <BreadcumbsComponent items={breadcumbData} />
      <Title order={1} mt={32}>
        Doctors
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="space-between" mb={24}>
          <Search placeholder="Search doctors" />
          <Group>
            {selectedRows.length > 0 && (
              <Button variant="light" color="red" radius="md">
                <IconTrashX width={18} height={18} />
              </Button>
            )}

            <Link to="/admin/doctors/create">
              <Button
                leftSection={<IconPlus />}
                variant="filled"
                color="indigo"
                radius="md"
              >
                Create doctor
              </Button>
            </Link>
          </Group>
        </Group>

        <DoctorTable
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      </div>
    </>
  );
};

export default Doctor;
