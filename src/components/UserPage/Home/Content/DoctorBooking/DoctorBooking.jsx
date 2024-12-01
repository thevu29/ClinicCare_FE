import { Carousel } from "@mantine/carousel";
import { Button } from "@mantine/core";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import DoctorCard from "../Card/DoctorCard";

const DoctorBooking = () => {
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

          <Link to="/">
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
            withIndicators
            slideSize={{ base: "100%", sm: "50%", md: "33.333333%" }}
            slideGap={{ base: 0, sm: "md" }}
            loop
            align="start"
            controlsOffset="xs"
          >
            <Carousel.Slide>
              <DoctorCard />
            </Carousel.Slide>
            <Carousel.Slide>
              <DoctorCard />
            </Carousel.Slide>
            <Carousel.Slide>
              <DoctorCard />
            </Carousel.Slide>
            <Carousel.Slide>
              <DoctorCard />
            </Carousel.Slide>
            <Carousel.Slide>
              <DoctorCard />
            </Carousel.Slide>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default DoctorBooking;
