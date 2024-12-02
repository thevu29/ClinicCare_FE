import { Button, Group, LoadingOverlay, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconPlus, IconTrashX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { deleteServiceManager } from "../../../services/serviceManager";
import { handleSorting } from "../../../utils/sort";
import { showNotification } from "../../../utils/notification";
import { useServices } from "../../../hooks/serviceHook";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import ServiceTable from "./ServiceTable";
import Search from "../Search/Search";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Service", href: "/admin/services" },
];

const Service = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [selectedServices, setSelectedServices] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [order, setOrder] = useState("asc");

  const { services, size, setSize, isLoading, setIsLoading, fetchServices } =
    useServices();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const search = params.get("search") || "";
    const status = params.get("status") || "";
    const price = params.get("price") || "";
    const page = +params.get("page") || 1;
    const _sortBy = params.get("sortBy") || "";
    const _order = params.get("order") || "";

    setSortBy(_sortBy);
    setOrder(_order);

    fetchServices(search, status, price, page, _sortBy, _order);
  }, [location.search, fetchServices]);

  const handleSort = (field) => {
    let newOrder = "asc";
    if (sortBy === field) {
      newOrder = order === "asc" ? "desc" : "asc";
    }
    setSortBy(field);
    setOrder(newOrder);
    handleSorting(field, newOrder, location, pathname, navigate);
  };

  const clearSelectedServices = () => setSelectedServices([]);

  const deleteServices = async () => {
    try {
      setIsLoading(true);
      const deleteUsersRes = selectedServices.map((id) =>
        deleteServiceManager(id)
      );
      const res = await Promise.all(deleteUsersRes);

      if (res.every((response) => response.success)) {
        showNotification("Services deleted successfully", "Success");
        clearSelectedServices();
        await fetchServices();
      } else {
        showNotification("Some Services could not be deleted", "Error");
      }
    } catch (error) {
      console.log(error);
      showNotification("Error deleting services", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: <Text size="xl">Delete Services</Text>,
      children: (
        <>
          <Text size="md">
            Are you sure you want to delete checked Services?
          </Text>
          <Text mt="sm" c="yellow" fs="italic" size="sm">
            This action is irreversible and you will have to contact support to
            restore your data.
          </Text>
        </>
      ),
      labels: { confirm: "Delete Services", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: deleteServices,
    });

  return (
    <>
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <BreadcumbsComponent items={breadcumbData} />
      <Title order={1} mt={32}>
        Services
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="space-between" mb={24}>
          <Search placeholder="Search service" />
          <Group>
            {selectedServices.length > 0 && (
              <Button
                variant="light"
                color="red"
                radius="md"
                onClick={openDeleteModal}
              >
                <IconTrashX width={18} height={18} />
              </Button>
            )}
            <Link to="/admin/services/create">
              <Button
                leftSection={<IconPlus />}
                variant="filled"
                color="indigo"
                radius="md"
              >
                Create service
              </Button>
            </Link>
          </Group>
        </Group>

        <ServiceTable
          services={services}
          fetchServices={fetchServices}
          sortBy={sortBy}
          order={order}
          setIsLoading={setIsLoading}
          selectedServices={selectedServices}
          setSelectedServices={setSelectedServices}
          handleSort={handleSort}
          size={size}
          setSize={setSize}
        />
      </div>
    </>
  );
};

export default Service;
