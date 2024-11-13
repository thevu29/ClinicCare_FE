import { useEffect, useState } from "react";
import {
  Table,
  Checkbox,
  Group,
  ActionIcon,
  Text,
  LoadingOverlay,
  Transition,
  Menu,
  Select,
  Button,
} from "@mantine/core";

import { modals } from "@mantine/modals";
import {
  IconEdit,
  IconTrash,
  IconChevronUp,
  IconFilter,
} from "@tabler/icons-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  getServicesManager,
  deleteServiceManager,
} from "../../../services/serviceManager";
import { getAllPromotionsService } from "../../../services/promotionService";
import { showNotification } from "../../../utils/notication";
import PaginationComponent from "../../Pagination/Pagination";
import { handleSorting } from "../../../utils/sort";

const ITEMS_PER_PAGE = 4;

const statuses = [
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
];

const ServiceTable = ({ selectedRows, setSelectedRows }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [services, setServices] = useState({ results: [], meta: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [order, setOrder] = useState("asc");
  const [promotions, setPromotions] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState(null);

  const fetchServices = async (search, page, sortBy, order) => {
    try {
      const res = await getServicesManager({
        search,
        page,
        size: ITEMS_PER_PAGE,
        sortBy,
        order,
      });

      if (res.success) {
        const data = { results: res.data, meta: res.meta };
        setServices(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllPromotions = async () => {
    try {
      const res = await getAllPromotionsService();

      if (res.success) {
        setPromotions(res.data);
      }
    } catch (error) {
      console.error(error);
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

    fetchServices(search, page, _sortBy, _order);
    fetchAllPromotions();
  }, [location.search, services]);

  const deleteService = async (id) => {
    try {
      setIsLoading(true);

      const res = await deleteServiceManager(id);

      if (res.success) {
        showNotification(res.message, "success");
      } else {
        showNotification(res.message, "error");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (id) =>
    modals.openConfirmModal({
      title: <Text size="xl">Delete Service</Text>,
      children: (
        <>
          <Text size="md">Are you sure you want to delete this service?</Text>
          <Text mt="sm" c="yellow" fs="italic" size="sm">
            This action is irreversible and you will have to contact support to
            restore your data
          </Text>
        </>
      ),
      labels: { confirm: "Delete service", cancel: "Cancel" },
      confirmDrops: { color: "red" },
      onConfirm: () => deleteService(id),
    });

  const rows =
    services &&
    services.results &&
    services.results.length > 0 &&
    services.results.map((service) => (
      <Table.Tr
        key={service.serviceId}
        bg={
          selectedRows.includes(service.serviceId)
            ? "var(--mantine-color-blue-light)"
            : undefined
        }
      >
        <Table.Td>
          <Checkbox
            checked={selectedRows.includes(service.serviceId)}
            onChange={(e) =>
              setSelectedRows(
                e.currentTarget.checked
                  ? [...selectedRows, service.serviceId]
                  : selectedRows.filter(
                      (position) => position !== service.serviceId
                    )
              )
            }
          />
        </Table.Td>
        <Table.Td>{service.name}</Table.Td>
        <Table.Td>{service.description}</Table.Td>
        <Table.Td>{service.price}</Table.Td>
        <Table.Td>{service.status}</Table.Td>
        <Table.Td>
          {promotions.map((promotion) => {
            return promotion.promotionId === service.promotionId
              ? promotion.description
              : null;
          })}
        </Table.Td>
        <Table.Td>
          <Group gap={6}>
            <Link to={`/admin/services/${service.serviceId}/update`}>
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
              onClick={() => openDeleteModal(service.serviceId)}
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

  const handleStatusChange = (status) => {
    setSelectedStatus(status);

    const params = new URLSearchParams(location.search);

    params.set("status", status);
    params.delete("page");

    if (!status) params.delete("status");

    navigate(`${pathname}?${params.toString()}`);
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
                  services.results.length <= 0
                    ? false
                    : selectedRows.length === services.results.length
                }
                onChange={(e) =>
                  setSelectedRows(
                    e.currentTarget.checked
                      ? services.results.map((service) => service.serviceId)
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
            <Table.Th
              onClick={() => handleSort("description")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Description</span>
                <Transition
                  mounted={sortBy === "desciption"}
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
              onClick={() => handleSort("price")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Price</span>
                <Transition
                  mounted={sortBy === "price"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "price" && (
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
              </Group>
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
            </Table.Th>
            <Table.Th>
              <Group justify="space-between">
                <span>Promotion</span>
              </Group>
            </Table.Th>

            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Group justify="space-between" mt={24}>
        {services && services.meta && (
          <span className="text-sm italic text-gray-700 dark:text-gray-400">
            Showing <strong>{services.meta.take}</strong> of{" "}
            <strong>{services.meta.totalElements}</strong> entries
          </span>
        )}

        <PaginationComponent
          currentPage={
            parseInt(new URLSearchParams(location.search).get("page")) || 1
          }
          totalPages={services?.meta?.totalPage || 1}
        />
      </Group>
    </>
  );
};

export default ServiceTable;
