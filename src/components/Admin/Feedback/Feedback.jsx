import { Button, Group, LoadingOverlay, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconTrashX } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  deleteFeedbacksService,
  getFeedbacksService,
} from "../../../services/feedbackService";
import { showNotification } from "../../../utils/notification";
import { handleSorting } from "../../../utils/sort";
import { useAuth } from "../../../context/Auth/authContext";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import Search from "../Search/Search";
import FeedbackTable from "./FeedbackTable";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Feedbacks" },
];

const Feedback = () => {
  const { token } = useAuth();

  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [order, setOrder] = useState("desc");
  const [size, setSize] = useState(4);
  const [selectedFeedbacks, setSelectedFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFeedbacks = useCallback(
    async (search, date, page, sortBy, order) => {
      try {
        const res = await getFeedbacksService({
          search,
          date,
          page,
          size,
          sortBy,
          order,
          userId: token?.role.toLowerCase() !== "admin" ? token?.userId : null,
        });

        if (res && res.success) {
          setFeedbacks(res);
        } else {
          showNotification(res.message, "Error");
        }
      } catch (error) {
        console.log(error);
      }
    },
    [size, token]
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const search = params.get("search") || "";
    const date = params.get("date") || "";
    const page = parseInt(params.get("page")) || 1;
    const _sortBy = params.get("sortBy") || "";
    const _order = params.get("order") || "";

    setSortBy(_sortBy);
    setOrder(_order);

    fetchFeedbacks(search, date, page, _sortBy, _order);
  }, [location.search, fetchFeedbacks]);

  const handleSort = (field) => {
    let newOrder = "asc";

    if (sortBy === field) {
      newOrder = order === "asc" ? "desc" : "asc";
    }

    setSortBy(field);
    setOrder(newOrder);
    handleSorting(field, newOrder, location, pathname, navigate);
  };

  const clearSelectedFeedbacks = () => setSelectedFeedbacks([]);

  const deleteFeedbacks = async () => {
    try {
      setIsLoading(true);
      const deleteFeedbacksRes = selectedFeedbacks.map((id) =>
        deleteFeedbacksService(id)
      );
      const res = await Promise.all(deleteFeedbacksRes);

      if (res.every((response) => response.success)) {
        showNotification("Feedbacks deleted successfully", "Success");
        clearSelectedFeedbacks();
        await fetchFeedbacks();
      } else {
        showNotification("Some feedbacks could not be deleted", "Error");
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
      title: <Text size="xl">Delete feedbacks</Text>,
      children: (
        <>
          <Text size="md">
            Are you sure you want to delete checked feedbacks?
          </Text>
          <Text mt="sm" c="yellow" fs="italic" size="sm">
            This action is irreversible and you will have to contact support to
            restore your data.
          </Text>
        </>
      ),
      labels: { confirm: "Delete feedbacks", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: deleteFeedbacks,
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
        Feedbacks
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="space-between" mb={24}>
          <Search placeholder="Search feedbacks" />

          {selectedFeedbacks.length > 0 && (
            <Button
              variant="light"
              color="red"
              radius="md"
              onClick={openDeleteModal}
            >
              <IconTrashX width={18} height={18} />
            </Button>
          )}
        </Group>

        <FeedbackTable
          feedbacks={feedbacks}
          fetchFeedbacks={fetchFeedbacks}
          sortBy={sortBy}
          order={order}
          setIsLoading={setIsLoading}
          selectedFeedbacks={selectedFeedbacks}
          setSelectedFeedbacks={setSelectedFeedbacks}
          handleSort={handleSort}
          size={size}
          setSize={setSize}
        />
      </div>
    </>
  );
};

export default Feedback;
