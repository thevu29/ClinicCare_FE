import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { getAllSchedulesService } from "../../services/scheduleService";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timegridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./ScheduleCalendar.scss";
import ScheduleInformationModal from "../Admin/Schedule/Modal/ScheduleInformationModal";

const ScheduleCalendar = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [schedules, setSchedules] = useState([]);
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await getAllSchedulesService();

        if (res.success) {
          const events = res.data.map((schedule) => {
            const [date, time] = schedule.dateTime.split("T");

            const startTime = new Date(`${date}T${time}`);
            const endTime = new Date(
              startTime.getTime() + schedule.duration * 60000
            );

            return {
              title: `${schedule.serviceName} - ${schedule.doctorName}`,
              start: startTime,
              end: endTime,
              extendedProps: {
                id: schedule.scheduleId,
                doctorId: schedule.doctorProfileId,
                doctorName: schedule.doctorName,
                serviceId: schedule.serviceId,
                duration: schedule.duration,
                status: schedule.status,
              },
              className: "cursor-pointer",
            };
          });

          setSchedules(events);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSchedules();
  }, []);

  const handleEventClick = (info) => {
    const schedule = {
      id: info.event.extendedProps.id,
      serviceName: info.event.title,
      doctorName: info.event.extendedProps.doctorName,
      date: info.event.start.toLocaleString(),
      status: info.event.extendedProps.status,
      duration: info.event.extendedProps.duration,
    };

    setSchedule(schedule);
    open();
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timegridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={schedules}
        eventClick={handleEventClick}
        headerToolbar={{
          start: "prev,next today",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        buttonText={{
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
        }}
        slotMinTime="08:00:00"
        slotMaxTime="24:00:00"
        allDaySlot={false}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
      />

      <ScheduleInformationModal
        opened={opened}
        close={close}
        schedule={schedule}
      />
    </>
  );
};

export default ScheduleCalendar;
