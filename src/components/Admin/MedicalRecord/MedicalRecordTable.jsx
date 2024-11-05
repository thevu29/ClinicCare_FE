import { useEffect, useState } from "react";
import { Table, Checkbox, ActionIcon, Modal, Text } from "@mantine/core";
import { getMedicalRecordsService } from "../../../services/medicalRecordService";
import { IconEye, IconEdit, IconTrash } from "@tabler/icons-react";

const DoctorTable = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const res = await getMedicalRecordsService();
        if (res.success) {
          setMedicalRecords(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchMedicalRecords();
  }, []);

  const rows =
    medicalRecords &&
    medicalRecords.length > 0 &&
    medicalRecords.map((medicalRecord) => (
      <Table.Tr
        key={medicalRecord.medicalRecordId}
        bg={
          selectedRows.includes(medicalRecord.medicalRecordId)
            ? "var(--mantine-color-blue-light)"
            : undefined
        }
      >
        <Table.Td>
          <Checkbox
            checked={selectedRows.includes(medicalRecord.medicalRecordId)}
            onChange={(e) =>
              setSelectedRows(
                e.currentTarget.checked
                  ? [...selectedRows, medicalRecord.medicalRecordId]
                  : selectedRows.filter(
                      (position) => position !== medicalRecord.medicalRecordId
                    )
              )
            }
          />
        </Table.Td>
        <Table.Td>{medicalRecord.patientName}</Table.Td>
        <Table.Td>{medicalRecord.doctorName}</Table.Td>
        <Table.Td>{medicalRecord.serviceName}</Table.Td>
        <Table.Td>{medicalRecord.createAt}</Table.Td>
        <Table.Td>
          <ActionIcon
            variant="filled"
            radius="xl"
            title="View"
            className="mr-2"
          >
            <IconEye style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            variant="filled"
            radius="xl"
            title="Edit"
            className="mr-2"
          >
            <IconEdit style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            variant="filled"
            radius="xl"
            title="Delete"
            className="mr-2"
          >
            <IconTrash style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>
    ));

  return (
    <>
      <Table highlightOnHover horizontalSpacing="md" verticalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Checkbox
                checked={selectedRows.length === medicalRecords.length}
                onChange={(e) =>
                  setSelectedRows(
                    e.currentTarget.checked
                      ? medicalRecords.map((record) => record.medicalRecordId)
                      : []
                  )
                }
              />
            </Table.Th>
            <Table.Th>Patient</Table.Th>
            <Table.Th>Doctor</Table.Th>
            <Table.Th>Service</Table.Th>
            <Table.Th>Create At</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
};

export default DoctorTable;
