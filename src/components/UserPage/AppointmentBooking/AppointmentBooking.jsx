import { Button, LoadingOverlay, Textarea, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../../../context/Auth/authContext";
import { getScheduleByIdService } from "../../../services/scheduleService";
import { formatDateWithLeadingZeros, formatTime } from "../../../utils/date";
import { showNotification } from "../../../utils/notification";
import { addAppointmentService } from "../../../services/appointmentService";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";

const breadcumbData = [
  { title: "Trang chủ", href: "/" },
  { title: "Đặt lịch khám" },
];

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { scheduleId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await getScheduleByIdService(scheduleId);

        if (res.success) {
          console.log(res.data);
          setSchedule(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (scheduleId) fetchSchedule();
  }, [scheduleId]);

  const generateStartEndTime = (dateTime, duration) => {
    const startTime = formatTime(dateTime);
    const endTime = formatTime(
      new Date(new Date(dateTime).getTime() + duration * 60000)
    );

    return `${startTime} - ${endTime}`;
  };

  const { handleSubmit, control } = useForm({
    defaultValues: {
      patientname: "",
      patientPhone: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      if (!token || !scheduleId) {
        showNotification("Có lỗi xảy ra. Vui lòng thử lại!", "Error");
        return;
      }

      const payload = {
        ...data,
        scheduleId,
        patientId: token.userId,
      };

      const res = await addAppointmentService(payload);

      if (res.success) {
        showNotification("Đặt lịch khám thành công", "Success");
      } else {
        showNotification(res.message, "Error");
      }
    } catch (error) {
      console.log(error);
      showNotification("Có lỗi xảy ra. Vui lòng thử lại!", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <div className="bg-gray-100 py-5 text-gray-800">
        <div className="max-w-7xl mx-auto md:px-2">
          <div className="mb-5">
            <BreadcumbsComponent items={breadcumbData} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-7 lg:col-span-8 space-y-4 bg-white p-4 rounded-lg">
                <h1 className="font-semibold text-[#1975dc]">
                  Thông tin bệnh nhân
                </h1>
                <div className="flex flex-col gap-4">
                  <Controller
                    name="patientName"
                    control={control}
                    rules={{ required: "Họ và tên không được để trống" }}
                    render={({ field, fieldState: { error } }) => (
                      <TextInput
                        {...field}
                        error={error?.message}
                        label="Họ và tên"
                        placeholder="Nhập họ và tên"
                        withAsterisk
                      />
                    )}
                  />

                  <Controller
                    name="patientPhone"
                    control={control}
                    rules={{
                      required: "Số điện thoại không được để trống",
                      pattern: {
                        value: /^[0-9]{10,11}$/,
                        message: "Số điện thoại không hợp lệ",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextInput
                        {...field}
                        error={error?.message}
                        label="Số điện thoại"
                        placeholder="Nhập số điện thoại"
                        withAsterisk
                      />
                    )}
                  />

                  <Textarea
                    rows={4}
                    resize="vertical"
                    label="Ghi chú"
                    placeholder="Triệu chứng, thuốc đang dùng, tiền sử,..."
                  />
                </div>
              </div>

              <div className="col-span-12 md:p-0 md:z-auto p-4 md:col-span-5 lg:col-span-4 bg-white md:bg-transparent py-6">
                <div className="hidden md:block divide-y divide-gray-100">
                  <div className="flex flex-row justify-between px-4 lg:px-6 py-4 bg-white rounded-t-md">
                    <div className="font-semibold text-base text-gray-800">
                      Thông tin đặt khám
                    </div>
                  </div>

                  {schedule && (
                    <>
                      <div className="flex flex-row items-center gap-4 px-4 lg:px-6 py-2 bg-white">
                        <div className="flex-none">
                          <img
                            src="https://cdn.youmed.vn/photos/6482af81-ab7d-4587-b011-8a9bad38a1e9.png"
                            className="w-[60px] h-[60px] object-scale-down rounded-full"
                          />
                        </div>
                        <div className="font-medium text-base">
                          Bác sĩ {schedule?.doctorName}
                        </div>
                      </div>
                      <div className="p-4 lg:px-6 bg-white">
                        <div className="flex flex-row justify-between py-2 text-gray-800">
                          <div>Ngày khám</div>
                          <div className="font-medium">
                            {formatDateWithLeadingZeros(
                              schedule.dateTime.split("T")[0]
                            )}
                          </div>
                        </div>
                        <div className="flex flex-row justify-between py-2 text-gray-800">
                          <div>Khung giờ</div>
                          <div className="font-medium">
                            {generateStartEndTime(
                              schedule?.dateTime,
                              schedule?.duration
                            )}
                          </div>
                        </div>
                        <div className="flex flex-row justify-between py-2 text-gray-800">
                          <div>Tài khoản bệnh nhân</div>
                          <div className="font-medium">{token?.name}</div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="md:p-4 bg-white">
                    <Button type="submit" fullWidth variant="filled">
                      Đặt khám
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AppointmentBooking;
