import { useEffect, useState } from "react";
import {
  Table,
  Checkbox,
  Avatar,
  Group,
  ActionIcon,
  LoadingOverlay,
  Transition,
  Text,
} from "@mantine/core";
import {
  deleteDoctorService,
  getDoctorsService,
} from "../../../services/doctorService";
import { IconEdit, IconTrash, IconChevronUp } from "@tabler/icons-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PaginationComponent from "../../Pagination/Pagination";
import { modals } from "@mantine/modals";
import { showNotification } from "../../../utils/notication";
import { handleSorting } from "../../../utils/sort";

const ITEMS_PER_PAGE = 4;

const DoctorTable = () => {
  const [doctors, setDoctors] = useState({ results: [], meta: {} });
  const [sortBy, setSortBy] = useState(null);
  const [order, setOrder] = useState("asc");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const fetchDoctors = async (search, page, sortBy, order) => {
    try {
      const res = await getDoctorsService({
        search,
        page,
        size: ITEMS_PER_PAGE,
        sortBy,
        order,
      });

      if (res.success) {
        const data = { results: res.data, meta: res.meta };
        setDoctors(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
    const page = parseInt(params.get("page")) || 1;
    const _sortBy = params.get("sortBy") || "";
    const _order = params.get("order") || "";

    setSortBy(_sortBy);
    setOrder(_order);

    fetchDoctors(search, page, _sortBy, _order);
  }, [location.search]);

  const deleteDoctor = async (doctorId) => {
    try {
      setIsLoading(true);

      const res = await deleteDoctorService(doctorId);

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

  const openDeleteModal = (doctorId) =>
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
      onConfirm: () => deleteDoctor(doctorId),
    });

  const rows =
    doctors &&
    doctors.results &&
    doctors.results.length > 0 &&
    doctors.results.map((doctor) => (
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

  const handleSort = (field) => {
    let newOrder = "asc";
    if (sortBy === field) {
      newOrder = order === "asc" ? "desc" : "asc";
    }
    setSortBy(field);
    setOrder(newOrder);
    handleSorting(field, newOrder, location, pathname, navigate);
  };

  return (
    <>
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Table highlightOnHover horizontalSpacing="md" verticalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Checkbox
                checked={
                  doctors.results.length <= 0
                    ? false
                    : selectedRows.length === doctors.results.length
                }
                onChange={(e) =>
                  setSelectedRows(
                    e.currentTarget.checked
                      ? doctors.results.map((doctor) => doctor.doctorProfileId)
                      : []
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
        {doctors && doctors.meta && (
          <span className="text-sm italic text-gray-700 dark:text-gray-400">
            Showing <strong>{doctors.meta.take}</strong> of{" "}
            <strong>{doctors.meta.totalElements}</strong> entries
          </span>
        )}

        <PaginationComponent
          currentPage={
            parseInt(new URLSearchParams(location.search).get("page")) || 1
          }
          totalPages={doctors?.meta?.totalPage || 1}
        />
      </Group>
    </>
  );
};

export default DoctorTable;
