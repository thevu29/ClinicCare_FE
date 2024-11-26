import { useCallback, useEffect, useState } from "react";
import { Button, Group, LoadingOverlay, Title, Text } from "@mantine/core";
import { IconPlus, IconTrashX } from "@tabler/icons-react";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import Search from "../Search/Search";
import DoctorTable from "./DoctorTable";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { showNotification } from "../../../utils/notification";
import { handleSorting } from "../../../utils/sort";
import {
  getDoctorsService,
  deleteDoctorService,
} from "../../../services/doctorService";
import { modals } from "@mantine/modals";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Doctors", href: "/admin/doctors" },
];

const Doctor = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState(null);
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [order, setOrder] = useState("asc");
  const [size, setSize] = useState(4);

  const fetchDoctors = useCallback(
    async (search, page, sortBy, order) => {
      try {
        const res = await getDoctorsService({
          search,
          page,
          size,
          sortBy,
          order,
        });

        if (res.success) {
          setDoctors(res);
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

    fetchDoctors(search, page, _sortBy, _order);
  }, [fetchDoctors, location.search]);

  const handleSort = (field) => {
    let newOrder = "asc";
    if (sortBy === field) {
      newOrder = order === "asc" ? "desc" : "asc";
    }
    setSortBy(field);
    setOrder(newOrder);
    handleSorting(field, newOrder, location, pathname, navigate);
  };

  const clearSelectedDoctors = () => setSelectedDoctors([]);

  const deleteDoctors = async () => {
    try {
      setIsLoading(true);
      const deleteDoctorRes = selectedDoctors.map((id) =>
        deleteDoctorService(id)
      );
      const res = await Promise.all(deleteDoctorRes);

      if (res.every((r) => r.success)) {
        showNotification("Doctors deleted successfully", "Success");
        clearSelectedDoctors();
        await fetchDoctors();
      } else {
        showNotification("Error deleting doctors", "Error");
      }
    } catch (error) {
      console.log(error);
      showNotification("An error occured", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: <Text size="xl">Delete doctors</Text>,
      children: (
        <>
          <Text size="md">
            Are you sure you want to delete checked doctors?
          </Text>
          <Text mt="sm" c="yellow" fs="italic" size="sm">
            This action is irreversible and you will have to contact support to
            restore your data.
          </Text>
        </>
      ),
      labels: { confirm: "Delete doctor", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: deleteDoctors,
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
        Doctors
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="space-between" mb={24}>
          <Search placeholder="Search doctors" />

          <Group>
            {selectedDoctors.length > 0 && (
              <Button
                variant="light"
                color="red"
                radius="md"
                onClick={openDeleteModal}
              >
                <IconTrashX width={18} height={18} />
              </Button>
            )}
            <Link to="/admin/doctors/create">
              <Button
                leftSection={<IconPlus />}
                variant="filled"
                color="indigo"
                radius="md"
              >
                Create doctor
              </Button>
            </Link>
          </Group>
        </Group>

        <DoctorTable
          doctors={doctors}
          fetchDoctors={fetchDoctors}
          sortBy={sortBy}
          order={order}
          setIsLoading={setIsLoading}
          selectedDoctors={selectedDoctors}
          setSelectedDoctors={setSelectedDoctors}
          handleSort={handleSort}
          size={size}
          setSize={setSize}
        />
      </div>
    </>
  );
};

export default Doctor;
