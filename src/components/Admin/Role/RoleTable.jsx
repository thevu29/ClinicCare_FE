import { getRolesService } from "../../../services/roleService";
import {
  Table,
  Checkbox,
  ActionIcon,
  Group,
  Transition,
  NumberInput,
  Text,
} from "@mantine/core";
import { IconChevronUp, IconEdit } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { handleSorting } from "../../../utils/sort";
import PaginationComponent from "../../Pagination/Pagination";

const RoleTable = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [roles, setRoles] = useState({ data: [], meta: {} });
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [order, setOrder] = useState("asc");
  const [size, setSize] = useState(4);

  const fetchRoles = useCallback(
    async (search, page, sortBy, order) => {
      try {
        const res = await getRolesService({
          search,
          page,
          size,
          sortBy,
          order,
        });

        if (res && res.success) {
          setRoles(res);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [size]
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const search = params.get("search") || "";
    const page = parseInt(params.get("page")) || 1;
    const _sortBy = params.get("sortBy") || "";
    const _order = params.get("order") || "";

    setSortBy(_sortBy);
    setOrder(_order);

    fetchRoles(search, page, _sortBy, _order);
  }, [location.search, fetchRoles]);

  const handleSort = (field) => {
    let newOrder = "asc";

    if (sortBy === field) {
      newOrder = order === "asc" ? "desc" : "asc";
    }

    setSortBy(field);
    setOrder(newOrder);
    handleSorting(field, newOrder, location, pathname, navigate);
  };

  const rows =
    roles &&
    roles.data &&
    roles.data.length > 0 &&
    roles.data.map((role) => (
      <Table.Tr
        key={role.roleId}
        bg={
          selectedRows.includes(role.roleId)
            ? "var(--mantine-color-blue-light)"
            : undefined
        }
      >
        <Table.Td>
          <Checkbox
            checked={selectedRows.includes(role.roleId)}
            onChange={(e) =>
              setSelectedRows(
                e.currentTarget.checked
                  ? [...selectedRows, role.roleId]
                  : selectedRows.filter((id) => id !== role.roleId)
              )
            }
          />
        </Table.Td>
        <Table.Td>{role.name}</Table.Td>
        <Table.Td>{role.description}</Table.Td>
        <Table.Td>
          <Link to={`/admin/roles/${role.roleId}/update`}>
            <ActionIcon
              variant="transparent"
              color="yellow"
              radius="xl"
              title="Update"
            >
              <IconEdit style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
          </Link>
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
                  roles.data.length <= 0
                    ? false
                    : selectedRows.length === roles.data.length
                }
                onChange={(e) =>
                  setSelectedRows(
                    e.currentTarget.checked
                      ? roles.data.map((role) => role.roleId)
                      : []
                  )
                }
              />
            </Table.Th>
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
            <Table.Th>Description</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Group justify="space-between" mt={24}>
        <Group>
          {roles && roles.meta && (
            <span className="text-xs italic text-gray-700 dark:text-gray-400">
              Showing <strong>{roles.meta.take}</strong> of{" "}
              <strong>{roles.meta.totalElements}</strong> entries
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
          totalPages={roles?.meta?.totalPages || 1}
        />
      </Group>
    </>
  );
};

export default RoleTable;
