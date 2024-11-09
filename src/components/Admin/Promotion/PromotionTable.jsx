import { useEffect, useState } from "react";
import { Table, Checkbox } from "@mantine/core";
import { getPromotionsService } from "../../../services/promotionService";

const elements = [];

const PromotionTable = () => {
  const [promotions, setPromotions] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await getPromotionsService();
        if (res.success) {
          setPromotions(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPromotions();
  }, []);

  const rows =
    promotions &&
    promotions.length &&
    promotions.map((promotion) => (
      <Table.Tr
        key={promotion.promotionId}
        bg={
          selectedRows.includes(promotion.promotionId)
            ? "var(--mantine-color-blue-light)"
            : undefined
        }
      >
        <Table.Td>
          <Checkbox
            checked={selectedRows.includes(promotion.promotionId)}
            onChange={(e) =>
              setSelectedRows(
                e.currentTarget.checked
                  ? [...selectedRows, promotion.promotionId]
                  : selectedRows.filter(
                      (position) => position !== promotion.promotionId
                    )
              )
            }
          />
        </Table.Td>
        <Table.Td>{promotion.description}</Table.Td>
        <Table.Td>{promotion.discount}</Table.Td>
        <Table.Td>{promotion.status}</Table.Td>
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
          <Table.Th>Description</Table.Th>
          <Table.Th>Discount</Table.Th>
          <Table.Th>Status</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
};

export default PromotionTable;
