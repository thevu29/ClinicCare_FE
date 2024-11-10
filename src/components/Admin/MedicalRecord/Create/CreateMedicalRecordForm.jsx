import {
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Select,
  Title,
  Textarea,
} from "@mantine/core";
import { useEffect, useState, forwardRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  createMedicalRecordService,
  getUserFormService,
  getDoctorFormService,
  getServiceManager,
} from "../../../../services/medicalRecordService";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";
import { showNotification } from "../../../../utils/notication";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Medical Records", href: "/admin/medical-records" },
  { title: "Create medical record" },
];

const FORM_VALIDATION = {
  patientName: {
    required: "Patient is required",
  },
  doctorName: {
    required: "Doctor is required",
  },
  serviceName: {
    required: "Service is required",
  },
};

const CreateMedicalRecordForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedPatientImage, setSelectedPatientImage] = useState(null);
  const [selectedDoctorImage, setSelectedDoctorImage] = useState(null);
  const { handleSubmit, control } = useForm({
    defaultValues: {
      patientName: "",
      doctorName: "",
      serviceName: "",
      description: "",
      createAt: "",
    },
    mode: "onChange",
  });

  const SelectItem = forwardRef(({ label, image, ...others }, ref) => (
    <div ref={ref} {...others} className="flex items-center justify-between">
      <span>{label}</span>
    </div>
  ));

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await getUserFormService("user");
        if (res.success) {
          const data = res.data.map((patient) => ({
            value: patient.userId,
            label: patient.name,
            image: patient.image,
          }));
          console.log(data);

          setPatients(data);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    const fetchDoctors = async () => {
      try {
        const res = await getDoctorFormService();
        if (res.success) {
          const data = res.data.map((doctor) => ({
            value: doctor.doctorProfileId,
            label: doctor.name,
            image: doctor.image,
          }));
          setDoctors(data);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const res = await getServiceManager();
        if (res.success) {
          const data = res.data.map((service) => ({
            value: service.serviceId,
            label: service.name,
          }));

          setServices(data);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchPatient();
    fetchDoctors();
    fetchServices();
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const medicalRecordRes = await createMedicalRecordService(data);
      if (medicalRecordRes.success) {
        showNotification(medicalRecordRes.message, "Success");
        navigate("/admin/medical-records");
      } else {
        showNotification(medicalRecordRes.message, "Error");
      }
    } catch (error) {
      showNotification(error.message, "Error");
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
      <BreadcumbsComponent items={breadcumbData} />
      <Title order={1} mt={32}>
        Create Medical Record
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Group justify="space-between" grow>
            <Flex direction="column" gap={20}>
              <Controller
                name="patientId"
                control={control}
                rules={FORM_VALIDATION.patientName}
                render={({ field, fieldState: { error } }) => (
                  <Select
                    {...field}
                    error={error?.message}
                    label="Patient"
                    placeholder="Select patient"
                    data={patients}
                    allowDeselect={false}
                    itemComponent={SelectItem}
                    onChange={(value) => {
                      field.onChange(value); 
                      const selectedPatient = patients.find(
                        (p) => p.value === value
                      );
                      setSelectedPatientImage(selectedPatient?.image);
                    }}
                    value={field.value}
                    styles={{
                      input: {
                        paddingLeft: selectedPatientImage
                          ? "2.5rem"
                          : undefined,
                      },
                      wrapper: {
                        position: "relative",
                      },
                    }}
                    leftSection={
                      selectedPatientImage && (
                        <img
                          src={selectedPatientImage}
                          alt="Selected patient"
                          className="w-6 h-6 rounded-full absolute left-2 top-1/2 transform -translate-y-1/2"
                        />
                      )
                    }
                  />
                )}
              />

              <Controller
                name="doctorProfileId"
                control={control}
                rules={FORM_VALIDATION.doctorName}
                render={({ field, fieldState: { error } }) => (
                  <Select
                    {...field}
                    error={error?.message}
                    label="Doctor"
                    placeholder="Select doctor"
                    data={doctors}
                    allowDeselect={false}
                    itemComponent={SelectItem}
                    onChange={(value) => {
                      field.onChange(value); 
                      const selectedDoctor = doctors.find(
                        (p) => p.value === value
                      );
                      setSelectedDoctorImage(selectedDoctor?.image);
                    }}
                    value={field.value}
                    styles={{
                      input: {
                        paddingLeft: selectedDoctorImage ? "2.5rem" : undefined,
                      },
                      wrapper: {
                        position: "relative",
                      },
                    }}
                    leftSection={
                      selectedDoctorImage && (
                        <img
                          src={selectedDoctorImage}
                          alt="Selected doctor"
                          className="w-6 h-6 rounded-full absolute left-2 top-1/2 transform -translate-y-1/2"
                        />
                      )
                    }
                  />
                )}
              />
              <Controller
                name="serviceId"
                control={control}
                rules={FORM_VALIDATION.serviceName}
                render={({ field, fieldState: { error } }) => (
                  <Select
                    {...field}
                    error={error?.message}
                    label="Service"
                    placeholder="Select service"
                    data={services}
                    allowDeselect={false}
                  />
                )}
              />
            </Flex>
            <Controller
              name="description"
              control={control}
              rules={FORM_VALIDATION.description}
              render={({ field, fieldState }) => (
                <Textarea
                  {...field}
                  placeholder="Description"
                  label="Description"
                  error={fieldState?.error?.message}
                  required
                  rows={10}
                />
              )}
            />
          </Group>

          <Group mt={32} justify="flex-end">
            <Link to="/admin/medical-records">
              <Button variant="filled" color="gray">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="filled">
              Save
            </Button>
          </Group>
        </form>
      </div>
    </>
  );
};

export default CreateMedicalRecordForm;
