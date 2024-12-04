import { CheckIcon, Flex, Radio, ScrollArea } from "@mantine/core";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getALlServicesManager } from "../../../services/serviceManager";
import { getDoctorsService } from "../../../services/doctorService";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import SearchDoctor from "./Search/SearchDoctor";
import DoctorCard from "./Card/DoctorCard";
import PaginationComponent from "../../Pagination/Pagination";
import SearchService from "./Search/SearchService";

const breadcumbData = [{ title: "Trang chủ", href: "/" }, { title: "Bác sĩ" }];

const DoctorPage = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const initialServiceId = params.get("serviceId") || "";

  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedService, setSelectedService] = useState(initialServiceId);

  const fetchServices = async (search) => {
    try {
      const res = await getALlServicesManager(search);

      if (res.success) {
        setServices(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const search = params.get("service") || "";

    fetchServices(search);
  }, [location.search]);

  const fetchDoctors = async (search, page, serviceId) => {
    try {
      const res = await getDoctorsService({
        search,
        serviceId,
        page,
        size: 5,
      });

      if (res.success) {
        setDoctors(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const search = params.get("search") || "";
    const page = parseInt(params.get("page")) || 1;
    const serviceId = params.get("serviceId");

    fetchDoctors(search, page, serviceId);
  }, [location.search]);

  const handleSelectService = (serviceId) => {
    setSelectedService(serviceId);

    const params = new URLSearchParams(location.search);

    params.set("serviceId", serviceId);
    params.delete("page");

    if (!serviceId) params.delete("serviceId");

    navigate(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="container">
      <div className="max-w-7xl mx-auto block py-3">
        <BreadcumbsComponent items={breadcumbData} />
      </div>

      <SearchDoctor />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 md:px-4 py-4">
        <div className="md:col-span-4 lg:col-span-3">
          <Flex direction="column" className="px-4">
            <SearchService />

            <ScrollArea h={350} offsetScrollbars mt="lg">
              <Radio.Group
                value={selectedService}
                onChange={handleSelectService}
              >
                <Flex direction="column" gap={12}>
                  <Radio
                    icon={CheckIcon}
                    value=""
                    label="Tất cả"
                    checked={selectedService === ""}
                  />
                  {services &&
                    services.length > 0 &&
                    services.map((service) => (
                      <Radio
                        key={service.serviceId}
                        icon={CheckIcon}
                        value={service.serviceId}
                        label={service.name}
                        checked={selectedService === service.serviceId}
                      />
                    ))}
                </Flex>
              </Radio.Group>
            </ScrollArea>
          </Flex>
        </div>
        <div className="md:col-span-8 lg:col-span-9 bg-white md:border-l">
          <div>
            <div className="p-4 md:p-6 border-b">
              <h1 className="text-sm md:text-base text-gray-500 font-medium">
                Tìm thấy{" "}
                <span className="border-b border-b-primary text-gray-800">
                  {doctors?.meta?.totalElements || 0}
                </span>{" "}
                kết quả
              </h1>
            </div>
            <div className="bg-slate-100 divide-y">
              {doctors &&
                doctors.data &&
                doctors.data.length > 0 &&
                doctors.data.map((doctor) => (
                  <div className="flex flex-col" key={doctor.doctorProfileId}>
                    <DoctorCard doctor={doctor} />
                  </div>
                ))}

              {doctors && doctors.data && doctors.data.length === 0 && (
                <div className="flex justify-center p-4">
                  <h1 className="text-lg font-semibold text-gray-500">
                    Hiện tại chưa có lịch khám nào
                  </h1>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <PaginationComponent
              currentPage={
                parseInt(new URLSearchParams(location.search).get("page")) || 1
              }
              totalPages={doctors?.meta?.totalPages || 1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPage;
