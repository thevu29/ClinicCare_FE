import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ActionIcon,
  Group,
  NumberInput,
  Table,
  Text,
  Transition,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronUp, IconCircleX } from "@tabler/icons-react";
import { handleSorting } from "../../../utils/sort";
import { formatDate, formatDateTime } from "../../../utils/date";
import { getAppointmentsService } from "../../../services/appointmentService";
import { getScheduleByIdService } from "../../../services/scheduleService";
import clsx from "clsx";
import PaginationComponent from "../../Pagination/Pagination";
import ScheduleInformationModal from "./Modal/ScheduleInformationModal";
import CancelScheduleModal from "./Modal/CancelScheduleModal";
import FilterAppointmentDate from "./Filter/FilterAppointmentDate";
import FilterAppointmentStatus from "./Filter/FilterAppointmentStatus";

const AppointmentTable = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [appointments, setAppoinments] = useState(null);
  const [size, setSize] = useState(4);
  const [sortBy, setSortBy] = useState(null);
  const [order, setOrder] = useState("asc");
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchAppointments = useCallback(
    async (search, date, status, page, sortBy, order) => {
      try {
        const res = await getAppointmentsService({
          search,
          date,
          status,
          page,
          size,
          sortBy,
          order,
        });

        if (res.success) {
          for (let appointment of res.data) {
            const schedule = await getScheduleByIdService(
              appointment.scheduleId
            );

            appointment.schedule = schedule.data;
            delete appointment.scheduleId;
          }

          setAppoinments(res);
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
    const date = params.get("date") || "";
    const status = params.get("status") || "";
    const page = +params.get("page") || 1;
    const _sortBy = params.get("sortBy") || "";
    const _order = params.get("order") || "";

    setSortBy(_sortBy);
    setOrder(_order);

    fetchAppointments(search, date, status, page, _sortBy, _order);
  }, [location.search, fetchAppointments]);

  const handleSort = (field) => {
    let newOrder = "asc";
    if (sortBy === field) {
      newOrder = order === "asc" ? "desc" : "asc";
    }
    setSortBy(field);
    setOrder(newOrder);
    handleSorting(field, newOrder, location, pathname, navigate);
  };

  const handleSizeChange = (size) => {
    setSize(+size);
    const params = new URLSearchParams(location.search);
    params.delete("page");
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handleOpenScheduleInformation = async (schedule) => {
    setSelectedSchedule(schedule);
    open();
  };

  const handleOpenCancelScheduleModal = (appointment) => {
    setSelectedAppointment(appointment);
    open();
  };

  const rows =
    appointments &&
    appointments.data &&
    appointments.data.length > 0 &&
    appointments.data.map((appointment) => (
      <Table.Tr key={appointment.appointmentId}>
        <Table.Td>{appointment.patientName}</Table.Td>
        <Table.Td>{appointment.patientPhone}</Table.Td>
        <Table.Td>
          <span
            className="cursor-pointer hover:text-blue-500"
            onClick={() => handleOpenScheduleInformation(appointment.schedule)}
          >
            {appointment.schedule.serviceName} -{" "}
            {formatDateTime(appointment.schedule.dateTime)}
          </span>
        </Table.Td>
        <Table.Td>{formatDate(appointment.date)}</Table.Td>
        <Table.Td>
          <span
            className={clsx("px-4 py-3 font-bold", {
              "bg-green-500 text-white": !appointment.cancelBy,
              "bg-red-500 text-white": appointment.cancelBy,
            })}
          >
            {appointment.cancelBy ? "Canceled" : "Active"}
          </span>
        </Table.Td>
        <Table.Td>
          <ActionIcon
            variant="transparent"
            color="red"
            radius="xl"
            title="Cancel appointment"
            onClick={() => handleOpenCancelScheduleModal(appointment)}
          >
            <IconCircleX style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>
    ));

  return (
    <>
      <Table highlightOnHover horizontalSpacing="md" verticalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th
              onClick={() => handleSort("patientName")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Patient Name</span>
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
              onClick={() => handleSort("patientPhone")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Patient Phone</span>
                <Transition
                  mounted={sortBy === "patientPhone"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "patientPhone" && (
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
            <Table.Th>Schedule</Table.Th>
            <Table.Th
              onClick={() => handleSort("date")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group>
                <Group justify="space-between">
                  <span>Date</span>
                  <Transition
                    mounted={sortBy === "date"}
                    transition={{
                      type: "rotate-left",
                      duration: 200,
                      timingFunction: "ease",
                    }}
                  >
                    {(styles) =>
                      sortBy === "date" && (
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

                <FilterAppointmentDate />
              </Group>
            </Table.Th>
            <Table.Th>
              <Group>
                <span>Status</span>
                <FilterAppointmentStatus />
              </Group>
            </Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Group justify="space-between" mt={24}>
        <Group>
          {appointments && (
            <span className="text-sm italic text-gray-700 dark:text-gray-400">
              Showing <strong>{appointments?.meta?.take}</strong> of{" "}
              <strong>{appointments?.meta?.totalElements}</strong> entries
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
          currentPage={appointments?.meta?.page || 1}
          totalPages={appointments?.meta?.totalPages || 1}
        />
      </Group>

      <ScheduleInformationModal
        opened={opened}
        close={close}
        schedule={selectedSchedule}
      />

      <CancelScheduleModal
        opened={opened}
        close={close}
        appointment={selectedAppointment}
      />
    </>
  );
};

export default AppointmentTable;
