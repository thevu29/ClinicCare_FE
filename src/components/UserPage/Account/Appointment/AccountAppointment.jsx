import { Button, ScrollArea, TextInput } from "@mantine/core";
import { useDebouncedCallback, useDisclosure } from "@mantine/hooks";
import {
  IconAlertCircleFilled,
  IconCircleCheckFilled,
} from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/Auth/authContext";
import { getAppointmentsService } from "../../../../services/appointmentService";
import { formatDateTime, formatTimeDate } from "../../../../utils/date";
import { getScheduleByIdService } from "../../../../services/scheduleService";
import clsx from "clsx";
import CancelInformationModal from "../Modal/InformationModal";
import CancelScheduleModal from "../Modal/CancelScheduleModal";

const AccountAppointment = () => {
  const { token } = useAuth();

  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [hasInitialData, setHasInitialData] = useState(false);

  const [opened, { open, close }] = useDisclosure();
  const [openedCancel, { open: openCancel, close: closeCancel }] =
    useDisclosure();

  const fetchAppointments = useCallback(
    async ({ search }) => {
      try {
        const res = await getAppointmentsService({
          search,
          size: 99,
          patientId: token?.userId,
        });

        if (res.success) {
          const data = await Promise.all(
            res.data.map(async (appointment) => {
              const schedule = await getScheduleByIdService(
                appointment.scheduleId
              );

              if (!schedule.success) {
                return appointment;
              }

              delete appointment.scheduleId;

              return {
                ...appointment,
                schedule: schedule?.data,
              };
            })
          );

          setAppointments(data);
          setSelectedAppointment(data[0]);

          if (!search) {
            setHasInitialData(data.length > 0);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) {
      const params = new URLSearchParams(location.search);

      const search = params.get("search") || "";

      fetchAppointments({ search });
    }
  }, [token, fetchAppointments, location.search]);

  const handleSearch = useDebouncedCallback((search) => {
    const params = new URLSearchParams(location.search);

    params.set("search", search);
    params.delete("page");

    if (!search) params.delete("search");

    navigate(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <>
      <div className="flex items-center justify-between mb-2 p-4 md:px-0">
        <h1 className="text-xl font-bold">Lịch khám</h1>
      </div>
      <div className="bg-gray-100 grid md:grid-cols-10 md:rounded-lg md:gap-px">
        <div className="bg-white flex flex-col md:col-span-4 md:rounded-tl-lg md:rounded-bl-lg overflow-hidden">
          {(hasInitialData || location.search.includes("search")) && (
            <div className="p-4">
              <TextInput
                placeholder="Tên dịch vụ, tên bệnh nhân,..."
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          )}

          <ScrollArea.Autosize mah={300}>
            {appointments &&
              appointments.length > 0 &&
              appointments.map((appointment) => (
                <div
                  key={appointment?.appointmentId}
                  className={clsx(
                    "flex p-4 items-center gap-4 cursor-pointer",
                    {
                      "bg-gray-50":
                        selectedAppointment?.appointmentId ===
                        appointment?.appointmentId,
                    }
                  )}
                  onClick={() => setSelectedAppointment(appointment)}
                >
                  <div className="flex flex-1 flex-col">
                    <h2 className="font-medium">
                      {appointment?.schedule?.doctorName}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {formatTimeDate(appointment?.schedule?.dateTime)}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {appointment?.patientName}
                    </p>
                  </div>
                  {appointment?.cancelBy && (
                    <div>
                      <p className="text-red-500 px-2 py-1 inline-block rounded-full text-sm bg-gray-50">
                        Đã hủy
                      </p>
                    </div>
                  )}
                  {appointment?.completed && (
                    <div>
                      <p className="text-green-500 px-2 py-1 inline-block rounded-full text-sm bg-gray-50">
                        Đã hoàn thành
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </ScrollArea.Autosize>
        </div>

        {appointments && appointments.length === 0 && (
          <div className="text-center md:col-span-10 text-xl">
            Chưa có lịch khám nào
          </div>
        )}

        {selectedAppointment && (
          <div className="bg-white md:col-span-6 md:rounded-r-lg overflow-hidden space-y-4 pt-4">
            {!selectedAppointment?.completed &&
              selectedAppointment?.cancelBy && (
                <div className="flex justify-between items-center px-4 lg:px-6 font-semibold">
                  <div
                    className="flex items-center text-red-500 cursor-pointer"
                    onClick={open}
                  >
                    <IconAlertCircleFilled size={24} />
                    <p className="ml-1 text-red-500">Đã hủy</p>
                  </div>
                </div>
              )}

            {selectedAppointment?.completed && (
              <div className="flex justify-between items-center px-4 lg:px-6 font-semibold">
                <div
                  className="flex items-center text-green-500 cursor-pointer"
                  onClick={open}
                >
                  <IconCircleCheckFilled size={24} />
                  <p className="ml-1 text-green-500">Đã hoàn thành</p>
                </div>
              </div>
            )}

            <div className="file:first-letter:px-4 lg:px-6 flex flex-col md:flex-row gap-4 flex-wrap justify-center items-center">
              <img
                className="bg-gray-50 w-16 h-16"
                src={selectedAppointment?.schedule?.doctorImage}
                alt={selectedAppointment?.schedule?.doctorName}
              />
              <div className="text-center md:text-left flex-1">
                <h3 className="text-base font-medium">
                  Bác sĩ {selectedAppointment?.schedule?.doctorName}
                </h3>
              </div>
              {!selectedAppointment?.cancelBy &&
                !selectedAppointment?.completed && (
                  <Button variant="outline" size="xs" onClick={openCancel}>
                    Hủy lịch
                  </Button>
                )}
            </div>
            <div className="p-4 lg:p-6 space-y-3">
              <h4 className="font-medium">Thông tin đặt khám</h4>
              <div className="flex justify-between">
                <span className="whitespace-nowrap mr-2">Ngày khám</span>
                <span className="font-medium text-right">
                  {
                    formatDateTime(
                      selectedAppointment?.schedule?.dateTime
                    ).split(" ")[0]
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="whitespace-nowrap mr-2">Chuyên khoa</span>
                <span className="font-medium text-right">
                  {selectedAppointment?.schedule?.serviceName}
                </span>
              </div>
            </div>

            <div className="p-4 lg:p-6 space-y-3">
              <h4 className="font-medium">Thông tin bệnh nhân</h4>
              <div className="flex justify-between">
                <span className="whitespace-nowrap mr-2">Họ và tên</span>
                <span className="font-medium text-right">
                  {selectedAppointment?.patientName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="whitespace-nowrap mr-2">Số điện thoại</span>
                <span className="font-medium text-right">
                  {selectedAppointment?.patientPhone}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <CancelInformationModal
        opened={opened}
        close={close}
        appointment={selectedAppointment}
      />

      <CancelScheduleModal
        opened={openedCancel}
        close={closeCancel}
        appointment={selectedAppointment}
        userId={token?.userId}
        fetchAppointments={fetchAppointments}
      />
    </>
  );
};

export default AccountAppointment;
