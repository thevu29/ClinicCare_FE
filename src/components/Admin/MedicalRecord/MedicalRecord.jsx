import { useCallback, useEffect, useState } from "react";
import { Button, Group, LoadingOverlay, Title, Text } from "@mantine/core";
import { IconPlus, IconTrashX } from "@tabler/icons-react";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import Search from "../Search/Search";
import MedicalRecordTable from "./MedicalRecordTable";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { showNotification } from "../../../utils/notification";
import { handleSorting } from "../../../utils/sort";
import {
  getMedicalRecordsService,
  deleteMedicalRecordService,
} from "../../../services/medicalRecordService";

import { modals } from "@mantine/modals";
const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Medical Record", href: "/admin/medical-records" },
];

const MedicalRecord = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [medicalRecords, setMedicalRecords] = useState(null);
  const [selectedMedicalRecords, setSelectedMedicalRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [order, setOrder] = useState("asc");
  const [size, setSize] = useState(4);

  const fetchMedicalRecords = useCallback(
    async (search, page, sortBy, order) => {
      try {
        const res = await getMedicalRecordsService({
          search,
          page,
          size,
          sortBy,
          order,
        });

        if (res.success) {
          setMedicalRecords(res);
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

    fetchMedicalRecords(search, page, _sortBy, _order);
  }, [fetchMedicalRecords, location.search]);

  const handleSort = (field) => {
    let newOrder = "asc";
    if (sortBy === field) {
      newOrder = order === "asc" ? "desc" : "asc";
    }
    setSortBy(field);
    setOrder(newOrder);
    handleSorting(field, newOrder, location, pathname, navigate);
  };

  const clearSelectedMedicalRecords = () => setSelectedMedicalRecords([]);

  const deleteMedicalRecord = async () => {
    try {
      setIsLoading(true);
      const deleteDoctorRes = selectedMedicalRecords.map((id) =>
        deleteMedicalRecordService(id)
      );
      const res = await Promise.all(deleteDoctorRes);

      if (res.every((r) => r.success)) {
        showNotification("Medical record deleted successfully", "Success");
        clearSelectedMedicalRecords();
        await fetchMedicalRecords();
      } else {
        showNotification("Error deleting medical record", "Error");
      }
    } catch (error) {
      console.log(error);
      showNotification("Error deleting medical record", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: <Text size="xl">Delete medical record</Text>,
      children: (
        <>
          <Text size="md">
            Are you sure you want to delete checked medical record?
          </Text>
          <Text mt="sm" c="yellow" fs="italic" size="sm">
            This action is irreversible and you will have to contact support to
            restore your data.
          </Text>
        </>
      ),
      labels: { confirm: "Delete doctor", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: deleteMedicalRecord,
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
        Medical Records
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="space-between" mb={24}>
          <Search placeholder="Search records" />

          <Group>
            {selectedMedicalRecords.length > 0 && (
              <Button
                variant="light"
                color="red"
                radius="md"
                onClick={openDeleteModal}
              >
                <IconTrashX width={18} height={18} />
              </Button>
            )}
            <Link to="/admin/medical-records/create">
              <Button
                leftSection={<IconPlus />}
                variant="filled"
                color="indigo"
                radius="md"
              >
                Create record
              </Button>
            </Link>
          </Group>
        </Group>

        <MedicalRecordTable
          medicalRecords={medicalRecords}
          fetchMedicalRecords={fetchMedicalRecords}
          sortBy={sortBy}
          order={order}
          setIsLoading={setIsLoading}
          selectedMedicalRecords={selectedMedicalRecords}
          setSelectedMedicalRecords={setSelectedMedicalRecords}
          handleSort={handleSort}
          size={size}
          setSize={setSize}
        />
      </div>
    </>
  );
};

export default MedicalRecord;
