import { deleteFeedbackService } from "../../../services/feedbackService";
import {
  Table,
  Checkbox,
  ActionIcon,
  Group,
  Transition,
  NumberInput,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconChevronUp, IconTrash } from "@tabler/icons-react";
import { useLocation } from "react-router-dom";
import { showNotification } from "../../../utils/notification";
import { formatDate } from "../../../utils/date";
import PaginationComponent from "../../Pagination/Pagination";
import FilterFeedback from "./Filter/FilterFeedback";

const FeedbackTable = ({
  feedbacks,
  fetchFeedbacks,
  sortBy,
  order,
  setIsLoading,
  selectedFeedbacks,
  setSelectedFeedbacks,
  handleSort,
  size,
  setSize,
}) => {
  const location = useLocation();

  const toggleFeedbackSelection = (feedbackId) => {
    setSelectedFeedbacks((prev) =>
      prev.includes(feedbackId)
        ? prev.filter((id) => id !== feedbackId)
        : [...prev, feedbackId]
    );
  };

  const toggleAllFeedbacks = (feedbackIds) => {
    setSelectedFeedbacks((prev) =>
      prev.length === feedbackIds.length ? [] : feedbackIds
    );
  };

  const deleteFeedback = async () => {
    try {
      setIsLoading(true);

      const res = await deleteFeedbackService(selectedFeedbacks);

      if (res.success) {
        showNotification(res.message, "Success");
        fetchFeedbacks();
      } else {
        showNotification(res.message, "Error");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (id) =>
    modals.openConfirmModal({
      title: <Text size="xl">Delete feedback</Text>,
      children: (
        <>
          <Text size="md">Are you sure you want to delete this feedback?</Text>
          <Text mt="sm" c="yellow" fs="italic" size="sm">
            This action is irreversible and you will have to contact support to
            restore your data.
          </Text>
        </>
      ),
      labels: { confirm: "Delete feedback", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteFeedback(id),
    });

  const rows =
    feedbacks &&
    feedbacks.data &&
    feedbacks.data.length > 0 &&
    feedbacks.data.map((feedback) => (
      <Table.Tr
        key={feedback.feedbackId}
        bg={
          selectedFeedbacks.includes(feedback.feedbackId)
            ? "var(--mantine-color-blue-light)"
            : undefined
        }
      >
        <Table.Td>
          <Checkbox
            checked={selectedFeedbacks.includes(feedback.feedbackId)}
            onChange={() => toggleFeedbackSelection(feedback.feedbackId)}
          />
        </Table.Td>
        <Table.Td>{feedback.patientName}</Table.Td>
        <Table.Td>{feedback.doctorName}</Table.Td>
        <Table.Td>{feedback.serviceName}</Table.Td>
        <Table.Td>{feedback.feedback}</Table.Td>
        <Table.Td>{formatDate(feedback.date)}</Table.Td>
        <Table.Td>
          <ActionIcon
            variant="transparent"
            color="red"
            radius="xl"
            title="Delete"
            onClick={() => openDeleteModal(feedback.feedbackId)}
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
                  feedbacks && feedbacks.data && feedbacks.data.length > 0
                    ? selectedFeedbacks.length === feedbacks.data.length
                    : false
                }
                onChange={() =>
                  toggleAllFeedbacks(
                    feedbacks.data.map((feedback) => feedback.feedbackId)
                  )
                }
              />
            </Table.Th>
            <Table.Th
              onClick={() => handleSort("patientName")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Patient&apos;s name</span>
                <Transition
                  mounted={sortBy === "patientName"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "patientName" && (
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
              onClick={() => handleSort("doctorName")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Doctor&apos;s name</span>
                <Transition
                  mounted={sortBy === "doctorName"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "doctorName" && (
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
              onClick={() => handleSort("serviceName")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Service&apos;s name</span>
                <Transition
                  mounted={sortBy === "serviceName"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "serviceName" && (
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
            <Table.Th>Feedback</Table.Th>
            <Table.Th
              onClick={() => handleSort("createAt")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group>
                <Group justify="space-between">
                  <span>Date</span>
                  <Transition
                    mounted={sortBy === "createAt"}
                    transition={{
                      type: "rotate-left",
                      duration: 200,
                      timingFunction: "ease",
                    }}
                  >
                    {(styles) =>
                      sortBy === "createAt" && (
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

                <FilterFeedback />
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
};

export default FeedbackTable;
