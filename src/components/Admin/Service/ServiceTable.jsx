import {
  Table,
  Checkbox,
  Group,
  ActionIcon,
  Text,
  Transition,
  NumberInput,
  Menu,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconEdit,
  IconTrash,
  IconChevronUp,
  IconRosetteDiscount,
  IconDotsVertical,
  IconRosetteDiscountCheckOff,
} from "@tabler/icons-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import {
  deleteServiceManager,
  removePromotionService,
} from "../../../services/serviceManager";
import { showNotification } from "../../../utils/notification";
import clsx from "clsx";
import PaginationComponent from "../../Pagination/Pagination";
import FilterServiceStatus from "./Filter/FilterServiceStatus";
import FilterServicePrice from "./Filter/FilterServicePrice";
import ApplyPromotionModal from "./Modal/ApplyPromotionModal";

const ServiceTable = ({
  services,
  fetchServices,
  sortBy,
  order,
  setIsLoading,
  selectedServices,
  setSelectedServices,
  handleSort,
  size,
  setSize,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [opened, { open, close }] = useDisclosure(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const toggleServiceSelection = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const toggleAllServices = (serviceIds) => {
    setSelectedServices((prev) =>
      prev.length === serviceIds.length ? [] : serviceIds
    );
  };

  const handleSizeChange = (size) => {
    setSize(+size);
    const params = new URLSearchParams(location.search);
    params.delete("page");
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const deleteService = async (id) => {
    try {
      setIsLoading(true);

      const res = await deleteServiceManager(id);

      if (res.success) {
        showNotification(res.message, "Success");
        fetchServices();
      } else {
        showNotification(res.message, "Error");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (id) =>
    modals.openConfirmModal({
      title: <Text size="xl">Delete service</Text>,
      children: (
        <>
          <Text size="md">Are you sure you want to delete this service?</Text>
          <Text mt="sm" c="yellow" fs="italic" size="sm">
            This action is irreversible and you will have to contact support to
            restore your data.
          </Text>
        </>
      ),
      labels: { confirm: "Delete service", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteService(id),
    });

  const handleOpenApplyPromotionModal = (serviceId) => {
    setSelectedServiceId(serviceId);
    open();
  };

  const handleRemovePromotion = async (serviceId) => {
    try {
      setIsLoading(true);

      const res = await removePromotionService(serviceId);

      if (res.success) {
        showNotification("Promotion removed successfully", "Success");
        fetchServices();
      } else {
        showNotification(res.message, "Error");
      }
    } catch (error) {
      console.error(error);
      showNotification("An error occured", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  const openRemovePromotionModal = (serviceId) => {
    modals.openConfirmModal({
      title: <Text size="xl">Remove promotion</Text>,
      children: (
        <>
          <Text size="md">
            Are you sure you want to remove promotion from this service?
          </Text>
          <Text mt="sm" c="yellow" fs="italic" size="sm">
            This action is irreversible and you will have to contact support to
            restore your data.
          </Text>
        </>
      ),
      labels: { confirm: "Remove promotion", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => handleRemovePromotion(serviceId),
    });
  };

  const rows =
    services &&
    services.data &&
    services.data.length > 0 &&
    services.data.map((service) => (
      <Table.Tr
        key={service.serviceId}
        bg={
          selectedServices.includes(service.serviceId)
            ? "var(--mantine-color-blue-light)"
            : undefined
        }
      >
        <Table.Td>
          <Checkbox
            checked={selectedServices.includes(service.serviceId)}
            onChange={() => toggleServiceSelection(service.serviceId)}
          />
        </Table.Td>
        <Table.Td>{service.name}</Table.Td>
        <Table.Td>{service.description}</Table.Td>
        <Table.Td>{service.price}</Table.Td>
        <Table.Td>
          <span
            className={clsx(
              "py-1 px-[6px] flex justify-center items-center max-w-28",
              {
                "bg-red-600 text-white": service.status === "UNAVAILABLE",
                "bg-green-600 text-white": service.status === "AVAILABLE",
              }
            )}
          >
            {service.status}
          </span>
        </Table.Td>
        <Table.Td>{service.promotionDiscount}</Table.Td>
        <Table.Td>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon
                variant="transparent"
                aria-label="Actions"
                color="black"
              >
                <IconDotsVertical
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                color="blue"
                leftSection={
                  <IconRosetteDiscount
                    style={{ width: "70%", height: "70%" }}
                    stroke={1.5}
                  />
                }
                onClick={() => handleOpenApplyPromotionModal(service.serviceId)}
              >
                Apply promotion
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconRosetteDiscountCheckOff
                    style={{ width: "70%", height: "70%" }}
                    stroke={1.5}
                  />
                }
                onClick={() => openRemovePromotionModal(service.serviceId)}
              >
                Remove promotion
              </Menu.Item>
              <Link to={`/admin/services/${service.serviceId}/update`}>
                <Menu.Item
                  color="yellow"
                  leftSection={
                    <IconEdit
                      style={{ width: "70%", height: "70%" }}
                      stroke={1.5}
                    />
                  }
                >
                  Update service
                </Menu.Item>
              </Link>
              <Menu.Item
                color="red"
                leftSection={
                  <IconTrash
                    style={{ width: "70%", height: "70%" }}
                    stroke={1.5}
                  />
                }
                onClick={() => openDeleteModal(service.serviceId)}
              >
                Delete service
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
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
                  services && services.data && services.data.length > 0
                    ? selectedServices.length === services.data.length
                    : false
                }
                onChange={() =>
                  toggleAllServices(
                    services.data.map((service) => service.serviceId)
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
            <Table.Th
              onClick={() => handleSort("price")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group>
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
                <FilterServicePrice />
              </Group>
            </Table.Th>
            <Table.Th>
              <Group>
                <span>Status</span>
                <FilterServiceStatus />
              </Group>
            </Table.Th>
            <Table.Th>
              <Group justify="space-between">
                <span>Promotion(%)</span>
              </Group>
            </Table.Th>

            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Group justify="space-between" mt={24}>
        <Group>
          {services && services.meta && (
            <span className="text-xs italic text-gray-700 dark:text-gray-400">
              Showing <strong>{services.meta.take}</strong> of{" "}
              <strong>{services.meta.totalElements}</strong> entries
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
          totalPages={services?.meta?.totalPage || 1}
        />
      </Group>

      <ApplyPromotionModal
        opened={opened}
        close={close}
        serviceId={selectedServiceId}
        fetchServices={fetchServices}
        setIsLoading={setIsLoading}
      />
    </>
  );
};

export default ServiceTable;
