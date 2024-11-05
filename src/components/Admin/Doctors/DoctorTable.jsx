import { useEffect, useState } from "react";
import { Table, Checkbox, ActionIcon } from "@mantine/core";
import { getDoctorsService } from "../../../services/doctorService";
import { IconEye, IconEdit, IconTrash } from "@tabler/icons-react";

const elements = [];

const DoctorTable = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await getDoctorsService();
        if (res.success) {
          setDoctors(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchDoctors();
  }, []);

  const rows =
    doctors &&
    doctors.length > 0 &&
    doctors.map((doctor) => (
      <Table.Tr
        key={doctor.doctorProfileId}
        bg={
          selectedRows.includes(doctor.doctorProfileId)
            ? "var(--mantine-color-blue-light)"
            : undefined
        }
      >
        <Table.Td>
          <Checkbox
            checked={selectedRows.includes(doctor.doctorProfileId)}
            onChange={(e) =>
              setSelectedRows(
                e.currentTarget.checked
                  ? [...selectedRows, doctor.doctorProfileId]
                  : selectedRows.filter(
                      (position) => position !== doctor.doctorProfileId
                    )
              )
            }
          />
        </Table.Td>
        <Table.Td />
        {/* <Table.Td>{doctor.image}</Table.Td> */}
        <Table.Td>{doctor.name}</Table.Td>
        <Table.Td>{doctor.email}</Table.Td>
        <Table.Td>{doctor.phone}</Table.Td>
        <Table.Td>{doctor.specialty}</Table.Td>
        <Table.Td>
          <ActionIcon variant="filled" radius="xl" onClick={() => onView(doctor.id)} title="View" className="mr-2">
            <IconEye style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon variant="filled" radius="xl" onClick={() => onEdit(doctor.id)} title="Edit" className="mr-2">
            <IconEdit style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon variant="filled" radius="xl" onClick={() => onDelete(doctor.id)} title="Delete" className="mr-2">
            <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>
    ));

  return (
    <Table highlightOnHover horizontalSpacing="md" verticalSpacing="md">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>
            <Checkbox
              checked={selectedRows.length === elements.length}
              onChange={(e) =>
                setSelectedRows(
                  e.currentTarget.checked
                    ? elements.map((element) => element.position)
                    : []
                )
              }
            />
          </Table.Th>
          <Table.Th />
          <Table.Th>Name</Table.Th>
          <Table.Th>Email</Table.Th>
          <Table.Th>Phone</Table.Th>
          <Table.Th>Specialty</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
};

export default DoctorTable;
