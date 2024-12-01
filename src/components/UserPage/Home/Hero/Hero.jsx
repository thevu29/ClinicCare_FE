import { IconSearch } from "@tabler/icons-react";
import { TextInput } from "@mantine/core";
import HeroImage from "../../../../assets/images/home-hero.webp";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-[#1975dc]">
      <div className="relative z-20 max-w-7xl mx-auto px-4 py-16 lg:px-6 md:min-h-[520px] flex flex-col justify-center">
        <div className="max-w-4xl w-full mx-auto">
          <div className="flex flex-col justify-center items-center text-center">
            <h1 className="text-white font-bold text-xl md:text-4xl">
              Ứng dụng đặt khám
            </h1>
            <p className="text-white text-sm md:text-lg mt-2 mb-0">
              Đặt khám với hơn 50 bác sĩ trên ClinicCare để có số thứ tự <br />
              và khung giờ khám trước.
            </p>
          </div>
          <div className="wrapper-search flex flex-col gap-3 pt-6">
            <TextInput
              placeholder="Chuyên khoa, bác sĩ,..."
              size="lg"
              radius="xl"
              rightSection={<IconSearch />}
            />
          </div>
        </div>
      </div>
      <div className="absolute z-0 bottom-0 right-0">
        <img
          src={HeroImage}
          className="opacity-40 lg:opacity-100 block"
          width={676}
          height={520}
        />
      </div>
    </div>
  );
};

export default Hero;
