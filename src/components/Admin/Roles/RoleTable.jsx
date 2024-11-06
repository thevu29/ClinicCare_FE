import { getRolesService } from "../../../services/roleService";
import { Table, Checkbox } from "@mantine/core";
import { useEffect, useState } from "react";

const elements = [];

export default function RoleTable() {
  const [roles, setRoles] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getRolesService();
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

  const rows = elements.map((element) => (
    <Table.Tr
      key={element.name}
      bg={
        selectedRows.includes(element.position)
          ? "var(--mantine-color-blue-light)"
          : undefined
      }
    >
      <Table.Td>
        <Checkbox
          checked={selectedRows.includes(element.position)}
          onChange={(e) =>
            setSelectedRows(
              e.currentTarget.checked
                ? [...selectedRows, element.position]
                : selectedRows.filter(
                    (position) => position !== element.position
                  )
            )
          }
        />
      </Table.Td>
      <Table.Td>{element.position}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.symbol}</Table.Td>
      <Table.Td>{element.mass}</Table.Td>
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
          <Table.Th>Description</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
