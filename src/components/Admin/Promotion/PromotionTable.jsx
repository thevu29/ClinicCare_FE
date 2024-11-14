import { useEffect, useState } from "react";
import {
  Table,
  Checkbox,
  Group,
  ActionIcon,
  LoadingOverlay,
  Transition,
  Button,
  Menu,
  Select,
} from "@mantine/core";
import { getPromotionsService } from "../../../services/promotionService";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { handleSorting } from "../../../utils/sort";

import { IconEdit, IconChevronUp, IconFilter } from "@tabler/icons-react";

import PaginationComponent from "../../Pagination/Pagination";

const ITEMS_PER_PAGE = 4;

const statuses = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "expired", label: "Expired" },
  { value: "end", label: "End" },
];

const PromotionTable = ({ selectedRows, setSelectedRows }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = useState(null);

  const [promotions, setPromotions] = useState({ results: [], meta: {} });
  const [sortBy, setSortBy] = useState(null);
  const [order, setOrder] = useState("asc");

  const fetchPromotions = async (search, page, sortBy, order) => {
    try {
      const res = await getPromotionsService({
        search,
        page,
        ITEMS_PER_PAGE,
        sortBy,
        order,
      });
      if (res.success) {
        const data = { results: res.data, meta: res.meta };
        setPromotions(data);
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

    fetchPromotions(search, page, _sortBy, _order);
  }, [location.search]);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);

    const params = new URLSearchParams(window.location.search);

    params.set("status", status);
    params.delete("page");

    if (!status) params.delete("status");

    navigate(`${pathname}?${params.toString()}`);
  };

  const rows =
    promotions &&
    promotions.results &&
    promotions.results.length > 0 &&
    promotions.results.map((promotion) => (
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
        <Table.Td>{promotion.status}</Table.Td>
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

  return (
    <>
      <LoadingOverlay
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Table highlightOnHover horizontalSpacing="md" verticalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Checkbox
                checked={
                  promotions.results.length <= 0
                    ? false
                    : selectedRows.length === promotions.results.length
                }
                onChange={(e) =>
                  setSelectedRows(
                    e.currentTarget.checked
                      ? promotions.results.map(
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
              className="cursor-pointer hover:bg-slate-50"
            >
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
              <Group justify="space-between">
                <span>Status</span>
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <Button variant="white" color="rgba(0, 0, 0, 1)" size="xs">
                      <IconFilter width={18} height={18} />
                    </Button>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Select
                      placeholder="Select status"
                      data={statuses}
                      allowDeselect
                      value={selectedStatus}
                      onChange={handleStatusChange}
                      maw={150}
                    />
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Group justify="space-between" mt={24}>
        {promotions && promotions.meta && (
          <span className="text-sm italic text-gray-700 dark:text-gray-400">
            Showing <strong>{promotions.meta.take}</strong> of{" "}
            <strong>{promotions.meta.totalElements}</strong> entries
          </span>
        )}

        <PaginationComponent
          currentPage={
            parseInt(new URLSearchParams(location.search).get("page")) || 1
          }
          totalPages={promotions?.meta?.totalPage || 1}
        />
      </Group>
    </>
  );
};

export default PromotionTable;
