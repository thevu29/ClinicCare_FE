import { useParams } from "react-router-dom";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import VerifiedIcon from "../../../assets/icon/verified.svg";
import { useEffect, useState } from "react";
import { getDoctorByIdService } from "../../../services/doctorService";
import ScheduleList from "./ScheduleList/ScheduleList";
import Feedback from "./Feedback/Feedback";

const breadcumbData = [
  { title: "Trang chủ", href: "/" },
  { title: "Bác sĩ", href: "/doctors" },
  { title: "Lịch làm việc" },
];

const DoctorSchedule = () => {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await getDoctorByIdService(id);

        if (res.success) {
          setDoctor(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchDoctor();
  }, [id]);

  return (
    <div className="bg-slate-100 pb-8">
      <div className="max-w-4xl mx-auto block py-4">
        <BreadcumbsComponent items={breadcumbData} />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white flex flex-col md:flex-row items-stretch relative lg:rounded-t-xl">
          <div className="p-4 pb-0 md:p-6 text-center">
            <div className="relative aspect-square rounded-full overflow-hidden mx-auto w-40 h-40 md:w-44 md:h-44 bg-slate-200">
              <img
                className="object-cover absolute inset-0 size-[180px]"
                src={doctor?.image}
              />
            </div>
          </div>
          <div className="flex flex-col justify-center flex-1 p-4 md:pl-0 gap-1">
            <h1 className="text-lg text-center md:text-left md:text-xl font-bold">
              Bác sĩ {doctor?.name}
            </h1>
            <div className="flex items-center justify-center md:justify-start divide-x mb-2">
              <div className="font-semibold flex items-center pr-2 text-[#1975dc]">
                <img width={20} height={20} src={VerifiedIcon} />
                <span>Bác sĩ</span>
              </div>
            </div>
            <div className="flex flex-col items-center md:flex-row md:items-end md:gap-3">
              <h2 className="text-gray-600 text-sm doctorinfo-label">
                Chuyên khoa
              </h2>
              <h3 className="font-medium text-primary mr-1 text-[#1975dc]">
                Nội tiết
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="py-4">
            <h2 className="text-lg font-semibold mb-0 pl-4 md:pl-6">
              Đặt khám nhanh
            </h2>
          </div>

          <ScheduleList doctorId={id} />
        </div>
      </div>

      <Feedback doctorId={id} />
    </div>
  );
};

export default DoctorSchedule;
