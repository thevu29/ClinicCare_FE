import { ActionIcon, Button, PinInput } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { IconArrowNarrowLeft } from "@tabler/icons-react";
import { showNotification } from "../../../utils/notification";
import { verifyOtpService } from "../../../services/authService";

const VerifyOtpForm = ({ email, prevStep, nextStep, setIsLoading }) => {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      otp: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const res = await verifyOtpService(email, data.otp);

      if (res.success) {
        nextStep();
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
    <div className="relative max-w-[500px] my-[48px] mx-auto py-12 px-14 bg-white rounded-[4px] shadow-[0_3px_10px_0_rgba(0,0,0,0.14)]">
      <ActionIcon
        variant="white"
        size="xl"
        color="black"
        style={{ position: "absolute", top: "10px", left: "10px" }}
        onClick={prevStep}
      >
        <IconArrowNarrowLeft
          style={{ width: "70%", height: "70%" }}
          stroke={1.5}
        />
      </ActionIcon>

      <h1 className="text-[20px] font-bold text-center mb-6">Nhập mã OTP</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="otp"
          control={control}
          rules={{
            required: "Mã OTP không được để trống",
          }}
          render={({ field }) => (
            <>
              <PinInput
                {...field}
                length={6}
                type="number"
                placeholder=""
                style={{ justifyContent: "space-between" }}
              />
            </>
          )}
        />

        <Button fullWidth mt="xl" size="md" type="submit">
          Xác nhận OTP
        </Button>
      </form>
    </div>
  );
};

export default VerifyOtpForm;
