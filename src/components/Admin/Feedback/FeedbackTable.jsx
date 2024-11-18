import {
  deleteFeedbackService,
  getFeedbacksService,
} from "../../../services/feedbackService";
import {
  Table,
  Checkbox,
  ActionIcon,
  Group,
  Transition,
  NumberInput,
  Text,
} from "@mantine/core";
import { IconChevronUp, IconTrash } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { handleSorting } from "../../../utils/sort";
import PaginationComponent from "../../Pagination/Pagination";
import { showNotification } from "../../../utils/notification";

export default function FeedbackTable({
  selectedRows,
  setSelectedRows,
  reload,
  setReload,
}) {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState({ data: [], meta: {} });
  const [sortBy, setSortBy] = useState(null);
  const [order, setOrder] = useState("desc");
  const [size, setSize] = useState(4);

  const fetchFeedbacks = useCallback(
    async (search, page, sortBy, order) => {
      try {
        const res = await getFeedbacksService({
          search,
          page,
          size,
          sortBy,
          order,
        });

        if (res && res.success) {
          setFeedbacks(res);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [size]
  );

  const fetchData = () => {
    const params = new URLSearchParams(location.search);

    const search = params.get("search") || "";
    const page = parseInt(params.get("page")) || 1;
    const _sortBy = params.get("sortBy") || "";
    const _order = params.get("order") || "";

    setSortBy(_sortBy);
    setOrder(_order);

    fetchFeedbacks(search, page, _sortBy, _order);
  };

  useEffect(fetchData, [location.search, fetchFeedbacks]);

  useEffect(() => {
    if (reload) {
      setReload(false);
      fetchData();
    }
  }, [reload]);

  const handleSort = (field) => {
    let newOrder = "asc";

    if (sortBy === field) {
      newOrder = order === "asc" ? "desc" : "asc";
    }

    setSortBy(field);
    setOrder(newOrder);
    handleSorting(field, newOrder, location, pathname, navigate);
  };

  const rows =
    feedbacks &&
    feedbacks.data &&
    feedbacks.data.length > 0 &&
    feedbacks.data.map((feedback) => (
      <Table.Tr
        key={feedback.feedbackId}
        bg={
          selectedRows.includes(feedback.feedbackId)
            ? "var(--mantine-color-blue-light)"
            : undefined
        }
      >
        <Table.Td>
          <Checkbox
            checked={selectedRows.includes(feedback.feedbackId)}
            onChange={(e) =>
              setSelectedRows(
                e.currentTarget.checked
                  ? [...selectedRows, feedback.feedbackId]
                  : selectedRows.filter((id) => id !== feedback.feedbackId)
              )
            }
          />
        </Table.Td>
        <Table.Td>{feedback.patientName}</Table.Td>
        <Table.Td>{feedback.patientPhone}</Table.Td>
        <Table.Td>{feedback.doctorName}</Table.Td>
        <Table.Td>{feedback.serviceName}</Table.Td>
        <Table.Td>{feedback.feedback}</Table.Td>
        <Table.Td>
          {new Date(feedback.date).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </Table.Td>
        <Table.Td>
          <ActionIcon
            variant="transparent"
            color="red"
            radius="xl"
            title="Delete"
            onClick={async () => {
              try {
                const res = await deleteFeedbackService(feedback.feedbackId);

                // If delete successfully then reload the page
                if (res && res.success) {
                  showNotification(res.message, "Success");
                  fetchData();
                } else {
                  showNotification(res.message, "Error");
                }
              } catch (error) {
                console.log(error);
                showNotification("An error occured", "Error");
              }
            }}
          >
            <IconTrash style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
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
                  feedbacks.data.length <= 0
                    ? false
                    : selectedRows.length === feedbacks.data.length
                }
                onChange={(e) =>
                  setSelectedRows(
                    e.currentTarget.checked
                      ? feedbacks.data.map((feedback) => feedback.feedbackId)
                      : []
                  )
                }
              />
            </Table.Th>
            <Table.Th>Patient's name</Table.Th>
            <Table.Th>Patient's phone</Table.Th>
            <Table.Th>Doctor's name</Table.Th>
            <Table.Th>Service's name</Table.Th>
            <Table.Th>Feedback</Table.Th>
            <Table.Th
              onClick={() => handleSort("createAt")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Date</span>
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
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Group justify="space-between" mt={24}>
        <Group>
          {feedbacks && feedbacks.meta && (
            <span className="text-xs italic text-gray-700 dark:text-gray-400">
              Showing <strong>{feedbacks.meta.take}</strong> of{" "}
              <strong>{feedbacks.meta.totalElements}</strong> entries
            </span>
          )}

          <Group gap={4}>
            <Text size="xs" fw={700}>
              Per page:
            </Text>
            <NumberInput maw={50} size="xs" value={size} onChange={setSize} />
          </Group>
        </Group>

        <PaginationComponent
          currentPage={
            parseInt(new URLSearchParams(location.search).get("page")) || 1
          }
          totalPages={feedbacks?.meta?.totalPages || 1}
        />
      </Group>
    </>
  );
}
