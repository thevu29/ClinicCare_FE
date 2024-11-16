import {
  Table,
  Checkbox,
  ActionIcon,
  Group,
  Text,
  Transition,
  NumberInput,
} from "@mantine/core";
import { deleteMedicalRecordService } from "../../../services/medicalRecordService";
import { IconEdit, IconTrash, IconChevronUp } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import PaginationComponent from "../../Pagination/Pagination";
import { modals } from "@mantine/modals";
import { showNotification } from "../../../utils/notification";

const MedicalRecordTable = ({
  medicalRecords,
  fetchMedicalRecords,
  sortBy,
  order,
  setIsLoading,
  selectedMedicalRecords,
  setSelectedMedicalRecords,
  handleSort,
  size,
  setSize,
}) => {
  const toggleMedicalRecordSelection = (medicalRecordId) => {
    setSelectedMedicalRecords((prev) =>
      prev.includes(medicalRecordId)
        ? prev.filter((id) => id !== medicalRecordId)
        : [...prev, medicalRecordId]
    );
  };

  const toggleAllMedicalRecords = (medicalRecordIds) => {
    setSelectedMedicalRecords((prev) =>
      prev.length === medicalRecordIds.length ? [] : medicalRecordIds
    );
  };

  const deleteMedicalRecord = async (id) => {
    try {
      setIsLoading(true);

      const res = await deleteMedicalRecordService(id);

      if (res.success) {
        showNotification(res.message, "Success");
        fetchMedicalRecords();
      } else {
        showNotification(res.message, "Error");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (medicalRecordId) => {
    modals.openConfirmModal({
      title: <Text size="xl">Delete medical record</Text>,
      children: (
        <>
          <Text size="md">
            Are you sure you want to delete this medical record?
          </Text>
          <Text mt="sm" c="yellow" fs="italic" size="sm">
            This action is irreversible and you will have to contact support to
            restore your data.
          </Text>
        </>
      ),
      labels: { confirm: "Delete medical record", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteMedicalRecord(medicalRecordId),
    });
  };

  const rows =
    medicalRecords &&
    medicalRecords.data &&
    medicalRecords.data.length > 0 &&
    medicalRecords.data.map((medicalRecord) => (
      <Table.Tr
        key={medicalRecord.medicalRecordId}
        bg={
          selectedMedicalRecords.includes(medicalRecord.medicalRecordId)
            ? "var(--mantine-color-blue-light)"
            : undefined
        }
      >
        <Table.Td>
          <Checkbox
            checked={selectedMedicalRecords.includes(
              medicalRecord.medicalRecordId
            )}
            onChange={() =>
              toggleMedicalRecordSelection(medicalRecord.medicalRecordId)
            }
          />
        </Table.Td>
        <Table.Td>{medicalRecord.patientName}</Table.Td>
        <Table.Td>{medicalRecord.doctorName}</Table.Td>
        <Table.Td>{medicalRecord.serviceName}</Table.Td>
        <Table.Td>{new Date(medicalRecord.date).toLocaleDateString()}</Table.Td>
        <Table.Td>{medicalRecord.description}</Table.Td>
        <Table.Td>
          <Group gap={6}>
            <Link
              to={`/admin/medical-records/${medicalRecord.medicalRecordId}/update`}
            >
              <ActionIcon
                variant="transparent"
                color="yellow"
                radius="xl"
                title="Update"
              >
                <IconEdit
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              </ActionIcon>
            </Link>

            <ActionIcon
              variant="transparent"
              color="red"
              radius="xl"
              title="Delete"
              onClick={() => openDeleteModal(medicalRecord.medicalRecordId)}
            >
              <IconTrash style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
          </Group>
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
                checked={
                  medicalRecords &&
                  medicalRecords.data &&
                  medicalRecords.data.length > 0
                    ? selectedMedicalRecords.length ===
                      medicalRecords.data.length
                    : false
                }
                onChange={() =>
                  toggleAllMedicalRecords(
                    medicalRecords.data.map(
                      (medicalRecord) => medicalRecord.medicalRecordId
                    )
                  )
                }
              />
            </Table.Th>
            <Table.Th
              onClick={() => handleSort("patientName")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Patient</span>
                <Transition
                  mounted={sortBy === "patientName"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "patientName" && (
                      <IconChevronUp
                        style={{
                          transform:
                            order === "asc" ? "rotate(0deg)" : "rotate(180deg)",
                          ...styles,
                        }}
                        width={16}
                        height={16}
                      />
                    )
                  }
                </Transition>
              </Group>
            </Table.Th>
            <Table.Th
              onClick={() => handleSort("doctorName")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Doctor</span>
                <Transition
                  mounted={sortBy === "doctorName"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "doctorName" && (
                      <IconChevronUp
                        style={{
                          transform:
                            order === "asc" ? "rotate(0deg)" : "rotate(180deg)",
                          ...styles,
                        }}
                        width={16}
                        height={16}
                      />
                    )
                  }
                </Transition>
              </Group>
            </Table.Th>
            <Table.Th
              onClick={() => handleSort("serviceName")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Service</span>
                <Transition
                  mounted={sortBy === "serviceName"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "serviceName" && (
                      <IconChevronUp
                        style={{
                          transform:
                            order === "asc" ? "rotate(0deg)" : "rotate(180deg)",
                          ...styles,
                        }}
                        width={16}
                        height={16}
                      />
                    )
                  }
                </Transition>
              </Group>
            </Table.Th>
            <Table.Th
              onClick={() => handleSort("createAt")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Date</span>
                <Transition
                  mounted={sortBy === "createAt"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "createAt" && (
                      <IconChevronUp
                        style={{
                          transform:
                            order === "asc" ? "rotate(0deg)" : "rotate(180deg)",
                          ...styles,
                        }}
                        width={16}
                        height={16}
                      />
                    )
                  }
                </Transition>
              </Group>
            </Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Group justify="space-between" mt={24}>
        <Group>
          {medicalRecords && medicalRecords.meta && (
            <span className="text-xs italic text-gray-700 dark:text-gray-400">
              Showing <strong>{medicalRecords.meta.take}</strong> of{" "}
              <strong>{medicalRecords.meta.totalElements}</strong> entries
            </span>
          )}

          <Group gap={4}>
            <Text size="xs" fw={700}>
              Per page:
            </Text>
            <NumberInput maw={50} size="xs" value={size} onChange={setSize} />
          </Group>
        </Group>

        <PaginationComponent
          currentPage={
            parseInt(new URLSearchParams(location.search).get("page")) || 1
          }
          totalPages={medicalRecords?.meta?.totalPages || 1}
        />
      </Group>
    </>
  );
};

export default MedicalRecordTable;
