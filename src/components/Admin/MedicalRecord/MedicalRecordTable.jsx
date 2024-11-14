import { useEffect, useState } from "react";
import {
  Table,
  Checkbox,
  ActionIcon,
  Group,
  Text,
  Transition,
  LoadingOverlay,
} from "@mantine/core";
import {
  getMedicalRecordsService,
  deleteMedicalRecordService,
} from "../../../services/medicalRecordService";
import { IconEdit, IconTrash, IconChevronUp } from "@tabler/icons-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import PaginationComponent from "../../Pagination/Pagination";
import { modals } from "@mantine/modals";
import { showNotification } from "../../../utils/notication";
import { handleSorting } from "../../../utils/sort";

const ITEMS_PER_PAGE = 4;

const MedicalRecordTable = ({ selectedRows, setSelectedRows }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [medicalRecords, setMedicalRecords] = useState({
    results: [],
    meta: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [order, setOrder] = useState("asc");

  const fetchMedicalRecords = async (search, page, sortBy, order) => {
    try {
      const res = await getMedicalRecordsService({
        page,
        size: ITEMS_PER_PAGE,
        search,
        sortBy,
        order,
      });
      if (res.success) {
        const data = { results: res.data, meta: res.meta };
        setMedicalRecords(data);
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

    fetchMedicalRecords(search, page, _sortBy, _order);
  }, [location.search]);

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
    medicalRecords.results &&
    medicalRecords.results.length > 0 &&
    medicalRecords.results.map((medicalRecord) => (
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
        <Table.Td>{new Date(medicalRecord.date).toLocaleDateString()}</Table.Td>
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
                  medicalRecords.results.length <= 0
                    ? false
                    : selectedRows.length === medicalRecords.results.length
                }
                onChange={(e) =>
                  setSelectedRows(
                    e.currentTarget.checked
                      ? medicalRecords.results.map(
                          (medicalRecord) => medicalRecord.medicalRecordId
                        )
                      : []
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
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Group justify="space-between" mt={24}>
        {medicalRecords && medicalRecords.meta && (
          <span className="text-sm italic text-gray-700 dark:text-gray-400">
            Showing <strong>{medicalRecords.meta.take}</strong> of{" "}
            <strong>{medicalRecords.meta.totalElements}</strong> entries
          </span>
        )}

        <PaginationComponent
          currentPage={
            parseInt(new URLSearchParams(location.search).get("page")) || 1
          }
          totalPages={medicalRecords?.meta?.totalPage || 1}
        />
      </Group>
    </>
  );
};

export default MedicalRecordTable;
