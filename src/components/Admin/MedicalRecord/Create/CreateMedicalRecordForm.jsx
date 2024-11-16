import {
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Select,
  Title,
  Textarea,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { createMedicalRecordService } from "../../../../services/medicalRecordService";
import { getAllPatientsService } from "../../../../services/userService";
import { getAllDoctorsService } from "../../../../services/doctorService";
import { getALlServicesManager } from "../../../../services/serviceManager";
import { showNotification } from "../../../../utils/notification";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Medical Records", href: "/admin/medical-records" },
  { title: "Create medical record" },
];

const FORM_VALIDATION = {
  patientId: {
    required: "Patient is required",
  },
  doctorProfileId: {
    required: "Doctor is required",
  },
  serviceId: {
    required: "Service is required",
  },
};

const CreateMedicalRecordForm = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      patientId: "",
      doctorProfileId: "",
      serviceId: "",
      description: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await getAllPatientsService("user");

        if (res.success) {
          const data = res.data.map((patient) => ({
            value: patient.userId,
            label: patient.phone
              ? `${patient.name} - ${patient.phone}`
              : patient.name,
          }));

          setPatients(data);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    const fetchDoctors = async () => {
      try {
        const res = await getAllDoctorsService();

        if (res.success) {
          const data = res.data.map((doctor) => ({
            value: doctor.doctorProfileId,
            label: doctor.phone
              ? `${doctor.name} - ${doctor.phone}`
              : doctor.name,
          }));

          setDoctors(data);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const res = await getALlServicesManager();

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

      const res = await createMedicalRecordService(data);

      if (res.success) {
        showNotification(res.message, "Success");
        navigate("/admin/medical-records");
      } else {
        showNotification(res.message, "Error");
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
                    searchable
                    error={error?.message}
                    label="Patient"
                    placeholder="Select patient"
                    data={patients}
                    allowDeselect={false}
                    value={field.value}
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
                    searchable
                    error={error?.message}
                    label="Doctor"
                    placeholder="Select doctor"
                    data={doctors}
                    allowDeselect={false}
                    value={field.value}
                  />
                )}
              />

              <Controller
                searchabl
                name="serviceId"
                control={control}
                rules={FORM_VALIDATION.serviceName}
                render={({ field, fieldState: { error } }) => (
                  <Select
                    {...field}
                    searchable
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
