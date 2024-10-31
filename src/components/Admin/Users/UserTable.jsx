import { useEffect, useState } from "react";
import { Table, Checkbox } from "@mantine/core";
import { getUsersService } from "../../../services/userService";

const elements = [];

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsersService();
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
          <Table.Th>Email</Table.Th>
          <Table.Th>Phone</Table.Th>
          <Table.Th>Role</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
};

export default UserTable;
