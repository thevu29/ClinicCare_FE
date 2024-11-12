import { Button, Group, Title } from "@mantine/core";
import { IconPlus, IconTrashX } from "@tabler/icons-react";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import Search from "../Search/Search";
import MedicalRecordTable from "./MedicalRecordTable";
import { Link } from "react-router-dom";
import { useState } from "react";
const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Medical Record", href: "/admin/medical-records" },
];

const MedicalRecord = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  
  return (
    <>
      <BreadcumbsComponent items={breadcumbData} />
      <Title order={1} mt={32}>
        Medical Records
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="space-between" mb={24}>
          <Search placeholder="Search records" />

          <Group>
            {selectedRows.length > 0 && (
              <Button variant="light" color="red" radius="md">
                <IconTrashX width={18} height={18} />
              </Button>
            )}
            <Link to="/admin/medical-records/create">
              <Button
                leftSection={<IconPlus />}
                variant="filled"
                color="indigo"
                radius="md"
              >
                Create record
              </Button>
            </Link>
          </Group>
        </Group>

        <MedicalRecordTable
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      </div>
    </>
  );
};

export default MedicalRecord;
