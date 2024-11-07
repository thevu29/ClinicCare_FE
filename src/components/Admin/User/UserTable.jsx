import { useEffect, useState } from "react";
import { Table, Checkbox, Avatar, Group, ActionIcon } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { getUsersService } from "../../../services/userService";
import PaginationComponent from "../../Pagination/Pagination";
import { Link, useLocation } from "react-router-dom";

const ITEMS_PER_PAGE = 4;

const UserTable = () => {
  const [users, setUsers] = useState({ results: [], meta: {} });
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const location = useLocation();

  const fetchUsers = async (page, search) => {
    try {
      const res = await getUsersService({ page, size: ITEMS_PER_PAGE, search });

      if (res.success) {
        const data = { results: res.data, meta: res.meta };
        setUsers(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
    fetchUsers(currentPage, search);
  }, [currentPage, location.search]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const rows =
    users &&
    users.results &&
    users.results.length > 0 &&
    users.results.map((user) => (
      <Table.Tr
        key={user.userId}
        bg={
          selectedRows.includes(user.userId)
            ? "var(--mantine-color-blue-light)"
            : undefined
        }
      >
        <Table.Td>
          <Checkbox
            checked={selectedRows.includes(user.userId)}
            onChange={(e) =>
              setSelectedRows(
                e.currentTarget.checked
                  ? [...selectedRows, user.userId]
                  : selectedRows.filter((position) => position !== user.userId)
              )
            }
          />
        </Table.Td>
        <Table.Td>
          {user.image ? (
            <Avatar size="sm" src={user.image} alt="User Image" />
          ) : (
            <Avatar size="sm" />
          )}
        </Table.Td>
        <Table.Td>{user.name}</Table.Td>
        <Table.Td>{user.email}</Table.Td>
        <Table.Td>{user.phone}</Table.Td>
        <Table.Td>{user.role}</Table.Td>
        <Table.Td>
          <Group gap={6}>
            <Link to={`/admin/users/${user.userId}/update`}>
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
                  users.results.length <= 0
                    ? false
                    : selectedRows.length === users.results.length
                }
                onChange={(e) =>
                  setSelectedRows(
                    e.currentTarget.checked
                      ? users.results.map((user) => user.userId)
                      : []
                  )
                }
              />
            </Table.Th>
            <Table.Th />
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Phone</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Group justify="space-between" mt={24}>
        {users && users.meta && (
          <span className="text-sm italic text-gray-700 dark:text-gray-400">
            Showing <strong></strong> of <strong></strong> entries
          </span>
        )}

        <PaginationComponent
          currentPage={users?.meta?.page || 1}
          totalPages={users?.meta?.totalPage || 1}
          onPageChange={handlePageChange}
        />
      </Group>
    </>
  );
};

export default UserTable;
