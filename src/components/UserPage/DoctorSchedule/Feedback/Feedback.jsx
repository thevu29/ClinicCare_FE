import { Avatar, Button, Textarea } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/Auth/authContext";
import {
  addFeedbackService,
  getFeedbacksService,
} from "../../../../services/feedbackService";
import { formatDateTime } from "../../../../utils/date";
import { showNotification } from "../../../../utils/notification";

const Feedback = ({ doctor }) => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState([]);

  const fetchFeedbacks = useCallback(async () => {
    try {
      const res = await getFeedbacksService({
        size: 5,
        userId: doctor?.userId,
      });

      if (res.success) {
        setFeedbacks(res);
      }
    } catch (error) {
      console.log(error);
    }
  }, [doctor]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      feedback: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      if (!token) {
        showNotification("Vui lòng đăng nhập để đánh giá", "Warning");
        navigate("/login");
        return;
      }

      const res = await addFeedbackService({
        doctorId: doctor?.doctorProfileId,
        patientId: token?.userId,
        feedback: data.feedback,
      });

      if (res.success) {
        setValue("feedback", "");
        fetchFeedbacks();
      } else {
        showNotification(res.message, "Error");
      }
    } catch (error) {
      console.log(error);
      showNotification("Có lỗi xảy ra. Vui lòng thử lại!", "Error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white mt-10 p-5">
      <h1 className="text-lg font-bold">ĐÁNH GIÁ</h1>

      <div className="mt-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-start gap-4">
            <Avatar src={token?.image} key={token?.name} name={token?.name} />

            <Controller
              name="feedback"
              control={control}
              rules={{ required: "Vui lòng nhập đánh giá" }}
              render={({ field, fieldState: { error } }) => (
                <Textarea
                  {...field}
                  error={error?.message}
                  className="flex-1"
                  placeholder="Đánh giá của bạn"
                  rows={4}
                />
              )}
            />
          </div>

          <div className="flex justify-end mt-3">
            <Button type="submit" variant="filled" color="indigo">
              Gửi đánh giá
            </Button>
          </div>
        </form>
      </div>

      <div className="flex flex-col mt-5">
        {feedbacks &&
          feedbacks.data &&
          feedbacks.data.length > 0 &&
          feedbacks.data.map((feedback) => (
            <div
              key={feedback.feedbackId}
              className="flex gap-3 border-t-[1px] border-t-slate-200 py-5"
            >
              <Avatar
                src={feedback?.image}
                key={feedback?.patientName}
                name={feedback?.patientName}
              />
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">
                    {feedback?.patientName}
                  </span>
                  <div className="flex items-center gap-1">
                    <IconClock color="#707070" width={16} height={16} />
                    <span className="text-xs text-[#707070] font-bold">
                      {formatDateTime(feedback?.date)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#4A4A4A]">
                    {feedback?.feedback}
                  </p>
                </div>
              </div>
            </div>
          ))}

        {feedbacks && feedbacks.data && feedbacks.data.length === 0 && (
          <h1 className="text-lg font-semibold text-gray-500 w-full text-center pb-3">
            Chưa có đánh giá nào
          </h1>
        )}
      </div>
    </div>
  );
};

export default Feedback;
