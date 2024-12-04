import {
  Table,
  Group,
  Transition,
  Text,
  NumberInput,
  ActionIcon,
} from "@mantine/core";
import { IconChevronUp, IconEdit } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getSchedulesService } from "../../../services/scheduleService";
import { handleSorting } from "../../../utils/sort";
import { formatDateTime } from "../../../utils/date";
import PaginationComponent from "../../Pagination/Pagination";
import FilterScheduleDateTime from "./Filter/FilterScheduleDateTime";
import clsx from "clsx";
import FilterScheduleStatus from "./Filter/FilterScheduleStatus";

const ScheduleTable = ({ token }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState(null);
  const [size, setSize] = useState(4);
  const [sortBy, setSortBy] = useState(null);
  const [order, setOrder] = useState("asc");

  const fetchSchedules = useCallback(
    async (search, date, status, page, sortBy, order) => {
      try {
        const res = await getSchedulesService({
          search,
          date,
          status,
          page,
          size,
          sortBy,
          order,
          userId: token?.role.toLowerCase() !== "admin" ? token?.userId : null,
        });

        if (res.success) {
          setSchedules(res);
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
    const status = params.get("status") || "";
    const page = +params.get("page") || 1;
    const _sortBy = params.get("sortBy") || "";
    const _order = params.get("order") || "";

    setSortBy(_sortBy);
    setOrder(_order);

    fetchSchedules(search, date, status, page, _sortBy, _order);
  }, [location.search, fetchSchedules]);

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
    schedules &&
    schedules.data &&
    schedules.data.length > 0 &&
    schedules.data.map((schedule, index) => (
      <Table.Tr key={index}>
        <Table.Td>{schedule.serviceName}</Table.Td>
        <Table.Td>{schedule.doctorName}</Table.Td>
        <Table.Td>{formatDateTime(schedule.dateTime)}</Table.Td>
        <Table.Td>{schedule.duration}</Table.Td>
        <Table.Td>
          <span
            className={clsx("px-3 py-3", {
              "bg-[#4c6ef5] text-white":
                schedule.status.toLowerCase() === "available",
              "bg-[#868e96] text-white":
                schedule.status.toLowerCase() === "unavailable",
              "bg-[#fab005] text-white":
                schedule.status.toLowerCase() === "booked",
              "bg-[#fa5252] text-white":
                schedule.status.toLowerCase() === "cancelled",
              "bg-[#40c057] text-white":
                schedule.status.toLowerCase() === "completed",
            })}
          >
            {schedule.status}
          </span>
        </Table.Td>
        <Table.Td>
          <Link to={`/admin/schedules/${schedule.scheduleId}/update`}>
            <ActionIcon
              variant="transparent"
              color="yellow"
              radius="xl"
              title="Update"
            >
              <IconEdit style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
          </Link>
        </Table.Td>
      </Table.Tr>
    ));

  const handleSizeChange = (size) => {
    setSize(+size);
    const params = new URLSearchParams(location.search);
    params.delete("page");
    navigate(`${location.pathname}?${params.toString()}`);
  };

  return (
    <>
      <Table highlightOnHover horizontalSpacing="md" verticalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Service</Table.Th>
            <Table.Th>Doctor</Table.Th>
            <Table.Th
              onClick={() => handleSort("dateTime")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group>
                <Group justify="space-between">
                  <span>Date</span>
                  <Transition
                    mounted={sortBy === "dateTime"}
                    transition={{
                      type: "rotate-left",
                      duration: 200,
                      timingFunction: "ease",
                    }}
                  >
                    {(styles) =>
                      sortBy === "dateTime" && (
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

                <FilterScheduleDateTime />
              </Group>
            </Table.Th>
            <Table.Th>Duration (minutes)</Table.Th>
            <Table.Th>
              <Group>
                <span>Status</span>
                <FilterScheduleStatus />
              </Group>
            </Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Group justify="space-between" mt={24}>
        <Group>
          {schedules && (
            <span className="text-sm italic text-gray-700 dark:text-gray-400">
              Showing <strong>{schedules?.meta?.take}</strong> of{" "}
              <strong>{schedules?.meta?.totalElements}</strong> entries
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
          currentPage={schedules?.meta?.page || 1}
          totalPages={schedules?.meta?.totalPages || 1}
        />
      </Group>
    </>
  );
};

export default ScheduleTable;
