import {
  Table,
  Checkbox,
  Avatar,
  Group,
  ActionIcon,
  Transition,
  Text,
  NumberInput,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconEdit, IconTrash, IconChevronUp } from "@tabler/icons-react";
import { showNotification } from "../../../utils/notification";
import { deleteDoctorService } from "../../../services/doctorService";
import { Link } from "react-router-dom";
import PaginationComponent from "../../Pagination/Pagination";

const DoctorTable = ({
  doctors,
  fetchDoctors,
  sortBy,
  order,
  setIsLoading,
  selectedDoctors,
  setSelectedDoctors,
  handleSort,
  size,
  setSize,
}) => {
  const toggleDoctorsSelection = (doctorProfileId) => {
    setSelectedDoctors((prev) =>
      prev.includes(doctorProfileId)
        ? prev.filter((id) => id !== doctorProfileId)
        : [...prev, doctorProfileId]
    );
  };

  const toggleAllDoctors = (doctorProfileIds) => {
    setSelectedDoctors((prev) =>
      prev.length === doctorProfileIds.length ? [] : doctorProfileIds
    );
  };

  const deleteDoctor = async (id) => {
    try {
      setIsLoading(true);

      const res = await deleteDoctorService(id);

      if (res.success) {
        showNotification(res.message, "Success");
        fetchDoctors();
      } else showNotification(res.message, "Error");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (id) =>
    modals.openConfirmModal({
      title: <Text size="xl">Delete doctor</Text>,
      children: (
        <>
          <Text size="md">Are you sure you want to delete this doctor?</Text>
          <Text mt="sm" c="yellow" fs="italic" size="sm">
            This action is irreversible and you will have to contact support to
            restore your data.
          </Text>
        </>
      ),
      labels: { confirm: "Delete doctor", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteDoctor(id),
    });

  const rows =
    doctors &&
    doctors.data &&
    doctors.data.length > 0 &&
    doctors.data.map((doctor) => (
      <Table.Tr
        key={doctor.doctorProfileId}
        bg={
          selectedDoctors.includes(doctor.doctorProfileId)
            ? "var(--mantine-color-blue-light)"
            : undefined
        }
      >
        <Table.Td>
          <Checkbox
            checked={selectedDoctors.includes(doctor.doctorProfileId)}
            onChange={() => toggleDoctorsSelection(doctor.doctorProfileId)}
          />
        </Table.Td>
        <Table.Td>
          {doctor.image ? (
            <Avatar size="sm" src={doctor.image} alt="Doctor Image" />
          ) : (
            <Avatar size="sm" />
          )}
        </Table.Td>
        <Table.Td>{doctor.name}</Table.Td>
        <Table.Td>{doctor.email}</Table.Td>
        <Table.Td>{doctor.phone}</Table.Td>
        <Table.Td>{doctor.specialty}</Table.Td>
        <Table.Td>
          <Group gap={6}>
            <Link to={`/admin/doctors/${doctor.doctorProfileId}/update`}>
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
              onClick={() => openDeleteModal(doctor.doctorProfileId)}
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
                  doctors && doctors.data && doctors.data.length > 0
                    ? selectedDoctors.length === doctors.data.length
                    : false
                }
                onChange={() =>
                  toggleAllDoctors(
                    doctors.data.map((doctor) => doctor.doctorProfileId)
                  )
                }
              />
            </Table.Th>
            <Table.Th />
            <Table.Th
              onClick={() => handleSort("name")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Name</span>
                <Transition
                  mounted={sortBy === "name"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "name" && (
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
              onClick={() => handleSort("email")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Email</span>
                <Transition
                  mounted={sortBy === "email"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "email" && (
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
              onClick={() => handleSort("phone")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Phone</span>
                <Transition
                  mounted={sortBy === "phone"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "phone" && (
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
              onClick={() => handleSort("specialty")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Specialty</span>
                <Transition
                  mounted={sortBy === "specialty"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "specialty" && (
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
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Group justify="space-between" mt={24}>
        <Group>
          {doctors && doctors.meta && (
            <span className="text-xs italic text-gray-700 dark:text-gray-400">
              Showing <strong>{doctors.meta.take}</strong> of{" "}
              <strong>{doctors.meta.totalElements}</strong> entries
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
          totalPages={doctors?.meta?.totalPages || 1}
        />
      </Group>
    </>
  );
};

export default DoctorTable;
