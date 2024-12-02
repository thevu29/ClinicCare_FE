import { Button } from "@mantine/core";

const DoctorCard = ({ doctor }) => {
  return (
    <div className="relative flex-1 bg-white p-4 lg:p-6 flex flex-col items-center lg:flex-row gap-4 group">
      <div className="flex flex-row flex-1 gap-4 hover:text-gray-800">
        <div className="flex-none relative aspect-square w-28 h-28 sm:w-32 sm:h-32 overflow-hidden border border-slate-100 mx-auto rounded-full bg-slate-100">
          <img
            className="absolute inset-0 object-contain w-full h-full"
            width={128}
            height={128}
            src={doctor.image}
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center flex-wrap gap-2">
            <h2 className="md:text-lg font-semibold">
              BS {doctor.name}
            </h2>
          </div>
          <div className="font-medium text-sm bg-gray-100 rounded-full px-3 py-1 mt-3 whitespace-nowrap w-fit">
            {doctor.specialty}
          </div>
        </div>
      </div>
      <div>
        <Button variant="filled" color="indigo" size="md">
          Đặt khám
        </Button>
      </div>
    </div>
  );
};

export default DoctorCard;
