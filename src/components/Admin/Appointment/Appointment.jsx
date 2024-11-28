import { Group, Title } from "@mantine/core";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import Search from "../Search/Search";
import AppointmentTable from "./AppointmentTable";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Appointments" },
];

const Appointment = () => {
  return (
    <>
      <BreadcumbsComponent items={breadcumbData} />
      <Title order={1} mt={32}>
        Appointments
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="space-between" mb={24}>
          <Search placeholder="Search appointments" />
        </Group>

        <AppointmentTable />
      </div>
    </>
  );
};

export default Appointment;
