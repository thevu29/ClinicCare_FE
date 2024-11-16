import { useEffect, useState } from "react";
import {
  Table,
  Checkbox,
  Group,
  ActionIcon,
  Transition,
  Text,
  NumberInput,
} from "@mantine/core";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { handleSorting } from "../../../utils/sort";
import { IconEdit, IconChevronUp } from "@tabler/icons-react";
import { usePromotions } from "../../../hooks/promotionHook";
import clsx from "clsx";
import PaginationComponent from "../../Pagination/Pagination";
import FilterPromotionStatus from "./Filter/FilterPromotionStatus";
import FilterPromotionDiscount from "./Filter/FilterPromotionDiscount";

const PromotionTable = ({ selectedRows, setSelectedRows }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState(null);
  const [order, setOrder] = useState("asc");

  const { promotions, size, setSize, fetchPromotions } = usePromotions();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const search = params.get("search") || "";
    const status = params.get("status") || "";
    const discount = params.get("discount") || "";
    const page = parseInt(params.get("page")) || 1;
    const _sortBy = params.get("sortBy") || "";
    const _order = params.get("order") || "";

    setSortBy(_sortBy);
    setOrder(_order);

    fetchPromotions(search, status, discount, page, _sortBy, _order);
  }, [location.search, fetchPromotions]);

  const rows =
    promotions &&
    promotions.data &&
    promotions.data.length > 0 &&
    promotions.data.map((promotion) => (
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
        <Table.Td>{promotion.expireAt}</Table.Td>
        <Table.Td>
          <span
            className={clsx("p-3", {
              "bg-green-600 text-white":
                promotion.status.toLowerCase() === "active",
              "bg-gray-600 text-white":
                promotion.status.toLowerCase() === "inactive",
              "bg-red-600 text-white":
                promotion.status.toLowerCase() === "expired",
            })}
          >
            {promotion.status}
          </span>
        </Table.Td>
        <Table.Td>
          <Group gap={6}>
            <Link to={`${promotion.promotionId}/update`}>
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

  const handleSizeChange = (size) => {
    setSize(+size);
    const params = new URLSearchParams(location.search);
    params.delete("page");
  };

  return (
    <>
      <Table highlightOnHover horizontalSpacing="md" verticalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Checkbox
                checked={
                  promotions && promotions.data && promotions.data.length > 0
                    ? selectedRows.length === promotions.data.length
                    : false
                }
                onChange={(e) =>
                  setSelectedRows(
                    e.currentTarget.checked
                      ? promotions.data.map(
                          (promotion) => promotion.promotionId
                        )
                      : []
                  )
                }
              />
            </Table.Th>
            <Table.Th
              onClick={() => handleSort("description")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group>
                <span>Description</span>
                <Transition
                  mounted={sortBy === "description"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "description" && (
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
              onClick={() => handleSort("discount")}
              className="cursor-pointer hover:bg-slate-50 p-0"
            >
              <Group>
                <Group>
                  <span>Discount</span>
                  <Transition
                    mounted={sortBy === "discount"}
                    transition={{
                      type: "rotate-left",
                      duration: 200,
                      timingFunction: "ease",
                    }}
                  >
                    {(styles) =>
                      sortBy === "discount" && (
                        <IconChevronUp
                          style={{
                            transform:
                              order === "asc"
                                ? "rotate(0deg)"
                                : "rotate(180deg)",
                            ...styles,
                          }}
                          width={16}
                          height={16}
                        />
                      )
                    }
                  </Transition>
                </Group>
                <FilterPromotionDiscount />
              </Group>
            </Table.Th>
            <Table.Th
              onClick={() => handleSort("expireAt")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group>
                <span>Expire At</span>
                <Transition
                  mounted={sortBy === "expireAt"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "expireAt" && (
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
            <Table.Th>
              <Group>
                <span>Status</span>
                <FilterPromotionStatus />
              </Group>
            </Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Group justify="space-between" mt={24}>
        <Group>
          {promotions && promotions.meta && (
            <span className="text-xs italic text-gray-700 dark:text-gray-400">
              Showing <strong>{promotions.meta.take}</strong> of{" "}
              <strong>{promotions.meta.totalElements}</strong> entries
            </span>
          )}

          <Group gap={4}>
            <Text size="xs" fw={700}>
              Per page:
            </Text>
            <NumberInput
              maw={50}
              size="xs"
              value={size}
              onChange={(e) => handleSizeChange(e)}
            />
          </Group>
        </Group>

        <PaginationComponent
          currentPage={
            parseInt(new URLSearchParams(location.search).get("page")) || 1
          }
          totalPages={promotions?.meta?.totalPages || 1}
        />
      </Group>
    </>
  );
};

export default PromotionTable;
