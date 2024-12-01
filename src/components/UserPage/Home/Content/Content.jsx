import DoctorBooking from "./DoctorBooking/DoctorBooking";
import Policy from "./Policy/Policy";
import SpecialtyBooking from "./SpecialtyBooking/SpecialtyBooking";

const Content = () => {
  return (
    <>
      <div className="container mx-auto text-center my-10">
        <h2 className="text-xl md:text-4xl font-bold mb-4">
          Đặt lịch khám trực tuyến
        </h2>
        <p className="opacity-80">
          Tìm Bác sĩ chính xác - Đặt lịch khám dễ dàng
        </p>
      </div>

      <DoctorBooking />

      <SpecialtyBooking />

      <Policy />
    </>
  );
};

export default Content;
