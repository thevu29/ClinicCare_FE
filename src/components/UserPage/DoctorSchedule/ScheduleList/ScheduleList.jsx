import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, ScrollArea } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import {
  formatDateForApi,
  formatTime,
  getDatesInMonth,
} from "../../../../utils/date";
import { getSchedulesService } from "../../../../services/scheduleService";
import { showNotification } from "../../../../utils/notification";
import { useAuth } from "../../../../context/Auth/authContext";
import classes from "./ScheduleList.module.scss";
import clsx from "clsx";

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
const datesInMonth = getDatesInMonth(currentYear, currentMonth);
const weekDays = ["CN", "TH 2", "TH 3", "TH 4", "TH 5", "TH 6", "TH 7"];

const ScheduleList = ({ doctor }) => {
  const { token } = useAuth();

  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(today);
  const [schedules, setSchedule] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}-${month}`;
  };

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const date = formatDateForApi(selectedDate);
        const res = await getSchedulesService({
          date,
          size: 99,
          userId: doctor?.userId,
        });

        if (res.success) {
          const sortedSchedules = res.data.sort(
            (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
          );

          setSchedule(sortedSchedules);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSchedules();
  }, [selectedDate, doctor]);

  const handleBookAppointment = () => {
    if (!token) {
      showNotification("Vui lòng đăng nhập để đặt lịch khám", "Warning");
      navigate("/login");
      return;
    }

    if (!selectedSchedule) {
      showNotification("Vui lòng chọn lịch khám", "Warning");
      return;
    }

    navigate(`/appointment-booking/${selectedSchedule.scheduleId}`);
  };

  const normalizeDate = (date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  const isPastSchedule = (scheduleDateTime) => {
    const now = new Date();
    const scheduleDate = new Date(scheduleDateTime);

    if (
      normalizeDate(now).getTime() === normalizeDate(scheduleDate).getTime()
    ) {
      return scheduleDate.getTime() < now.getTime();
    }

    return false;
  };

  return (
    <>
      <div className="px-8 md:px-5">
        <Carousel
          classNames={classes}
          draggable={false}
          slideSize="12.5%"
          slideGap="md"
          align="start"
          slidesToScroll={5}
          controlsOffset="xs"
        >
          {datesInMonth.map((date, index) => (
            <Carousel.Slide key={index}>
              <div
                className={clsx(
                  "pl-5 pr-5 flex flex-col items-center py-2 whitespace-nowrap mx-px hover:bg-slate-50 cursor-pointer",
                  {
                    "border-b-[#1975dc] bg-blue-50 border-b-4":
                      normalizeDate(date).getTime() ===
                      normalizeDate(selectedDate).getTime(),
                  }
                )}
                onClick={() => setSelectedDate(date)}
              >
                <p className="font-semibold">{`${
                  weekDays[date.getDay()]
                }, ${formatDate(date)}`}</p>
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>

      <div className="px-2 pt-2 md:px-4 md:pt-4">
        <ScrollArea.Autosize mah={200} offsetScrollbars>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 py-3 overflow-x-auto max-h-52">
            {schedules &&
              schedules.length > 0 &&
              schedules
                .filter((schedule) => !isPastSchedule(schedule.dateTime))
                .map((schedule) => {
                  const startTime = formatTime(schedule.dateTime);
                  const endTime = formatTime(
                    new Date(
                      new Date(schedule.dateTime).getTime() +
                        schedule.duration * 60000
                    )
                  );

                  return (
                    <button
                      className={clsx(
                        "text-center border rounded-md py-3 tabular-nums transition hover:text-white hover:border-white hover:bg-[#1975dc]",
                        {
                          "bg-[#1975dc] text-white border-white":
                            selectedSchedule?.scheduleId ===
                            schedule.scheduleId,
                          "cursor-not-allowed bg-slate-200 text-slate-400 hover:bg-slate-200 hover:text-slate-400":
                            schedule.status.toLowerCase() !== "available",
                        }
                      )}
                      key={schedule.scheduleId}
                      onClick={() => setSelectedSchedule(schedule)}
                      disabled={schedule.status.toLowerCase() !== "available"}
                    >
                      {`${startTime}-${endTime}`}
                    </button>
                  );
                })}
          </div>
        </ScrollArea.Autosize>
        {schedules &&
          (schedules.length === 0 ||
            schedules.filter((schedule) => !isPastSchedule(schedule.dateTime))
              .length === 0) && (
            <h1 className="text-lg font-semibold text-gray-500 w-full text-center pb-3">
              Chưa có lịch khám nào
            </h1>
          )}
      </div>

      <div className="mt-5 px-6 pb-9">
        <Button
          size="md"
          fullWidth
          disabled={selectedSchedule == null}
          onClick={handleBookAppointment}
        >
          Đặt khám ngay
        </Button>
      </div>
    </>
  );
};

export default ScheduleList;
