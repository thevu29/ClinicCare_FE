import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Group,
  LoadingOverlay,
  Title,
  Textarea,
  Select,
} from "@mantine/core";
import { useParams, Link } from "react-router-dom";
import {
  updateMedicalRecordService,
  getMedicalRecordServiceById,
} from "../../../../services/medicalRecordService";
import { showNotification } from "../../../../utils/notification";
import { getALlServicesManager } from "../../../../services/serviceManager";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Medical Records", href: "/admin/medical-records" },
  { title: "Update medical record", href: "/admin/medical-record/update" },
];

const FORM_VALIDATION = {
  serviceId: { required: "Service name is required" },
};

const UpdateMedicalRecordForm = () => {
  const { id } = useParams();

  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [medicalRecord, setMedicalRecord] = useState(null);

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      serviceId: "",
      description: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchMedicalRecord = async () => {
      try {
        setIsLoading(true);

        const res = await getMedicalRecordServiceById(id);

        if (res.success) {
          const medicalRecord = res.data;
          setMedicalRecord(medicalRecord);

          reset({
            serviceId: medicalRecord.serviceId,
            description: medicalRecord.description,
          });
        } else {
          showNotification(res.message, "Error");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
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
        console.log(error);
      }
    };

    fetchServices();
    fetchMedicalRecord();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const res = await updateMedicalRecordService(id, data);

      res.success
        ? showNotification(res.message, "Success")
        : showNotification(res.message, "Error");
    } catch (error) {
      console.log(error);
      showNotification("An error occured", "Error");
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
        Update Medical Record
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            searchabl
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

          <Controller
            name="description"
            control={control}
            rules={FORM_VALIDATION.description}
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                mt={20}
                placeholder="Description"
                label="Description"
                error={fieldState?.error?.message}
                rows={10}
              />
            )}
          />

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

export default UpdateMedicalRecordForm;
