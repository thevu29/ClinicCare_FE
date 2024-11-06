import { useEffect, useState } from "react";
import { Table, Checkbox, Avatar, Group, ActionIcon } from "@mantine/core";
import { getDoctorsService } from "../../../services/doctorService";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";
import PaginationComponent from "../../Pagination/Pagination";

const ITEMS_PER_PAGE = 4;

const DoctorTable = () => {
  const [doctors, setDoctors] = useState({ results: [], meta: {} });
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const location = useLocation();

  const fetchDoctors = async (page, search) => {
    try {
      const res = await getDoctorsService({
        page,
        size: ITEMS_PER_PAGE,
        search,
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
    fetchDoctors(currentPage, search);
  }, [currentPage, location.search]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Phone</Table.Th>
            <Table.Th>Specialty</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Group justify="space-between" mt={24}>
        {doctors && doctors.meta && (
          <span className="text-sm italic text-gray-700 dark:text-gray-400">
            Showing <strong></strong> of <strong></strong> entries
          </span>
        )}

        <PaginationComponent
          currentPage={doctors?.meta?.page || 1}
          totalPages={doctors?.meta?.totalPage || 1}
          onPageChange={handlePageChange}
        />
      </Group>
    </>
  );
};

export default DoctorTable;
