import { getRolesService } from "../../../services/roleService";
import { Table, Checkbox, ActionIcon } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function RoleTable() {
  const [roles, setRoles] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getRolesService();
        if (res && res.success) {
          setRoles(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

  const rows = roles.map((role) => (
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
      <Table.Td>{role.description || "None"}</Table.Td>
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
    <Table highlightOnHover horizontalSpacing="md" verticalSpacing="md">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>
            <Checkbox
              checked={selectedRows.length === roles.length}
              onChange={(e) =>
                setSelectedRows(
                  e.currentTarget.checked
                    ? roles.map((role) => role.roleId)
                    : []
                )
              }
            />
          </Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th>Description</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
