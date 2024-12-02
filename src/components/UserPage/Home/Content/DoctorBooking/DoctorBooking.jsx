import { Carousel } from "@mantine/carousel";
import { Button } from "@mantine/core";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import DoctorCard from "../Card/DoctorCard";
import { useEffect, useState } from "react";
import { getDoctorsService } from "../../../../../services/doctorService";

const DoctorBooking = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await getDoctorsService({ page: 1, size: 10 });

        if (res.success) {
          setDoctors(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center px-4 gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold mb-0">
              Đặt khám bác sĩ
            </h2>
            <p className="hidden md:block text-sm">
              Phiếu khám kèm số thứ tự và thời gian của bạn được xác nhận.
            </p>
          </div>

          <Link to="/doctors">
            <Button
              variant="filled"
              color="indigo"
              radius="xl"
              rightSection={<IconArrowNarrowRight />}
            >
              Xem tất cả
            </Button>
          </Link>
        </div>

        <div className="pt-8 pb-4 mx-4">
          <Carousel
            slideSize="25%"
            slideGap="md"
            loop
            align="start"
            withControls={doctors.length > 5}
            controlsOffset="xs"
          >
            {doctors &&
              doctors.length > 0 &&
              doctors.map((doctor) => (
                <Carousel.Slide key={doctor.doctorProfileId}>
                  <DoctorCard doctor={doctor} />
                </Carousel.Slide>
              ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default DoctorBooking;
