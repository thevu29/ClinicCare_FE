import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Flex,
  Group,
  LoadingOverlay,
  TextInput,
  Title,
  Textarea,
} from "@mantine/core";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  updateMedicalRecordService,
  getMedicalRecordServiceById,
} from "../../../../services/medicalRecordService";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";
import { showNotification } from "../../../../utils/notication";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Medical Records", href: "/admin/medical-record" },
  { title: "Update medical record", href: "/admin/medical-record/update" },
];

const FORM_VALIDATION = {
  description: { required: "Description is required" },
  patientName: { required: "Patient name is required" },
  doctorName: { required: "Doctor name is required" },
  serviceName: { required: "Service name is required" },
};

const UpdateMedicalRecordForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [medicalRecord, setMedicalRecord] = useState({});
  const { handleSubmit, control, setValue, reset } = useForm({
    defaultValues: {
      description: "",
      patientName: "",
      doctorName: "",
      serviceName: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchMedicalRecord = async () => {
      try {
        setIsLoading(true);
        const medicalRecordRes = await getMedicalRecordServiceById(id);
        if (medicalRecordRes.success) {
          const medicalRecord = medicalRecordRes.data;
          setMedicalRecord(medicalRecord);
          reset(medicalRecord);
        } else {
          showNotification(medicalRecordRes.message, "Error");
        }
      } catch (error) {
        showNotification(error.message, "Error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMedicalRecord();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const medicalRecordRes = await updateMedicalRecordService(id, data);
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
        Update Medical Record
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Group justify="space-between" grow>
            <Flex direction="column" gap={20}>
              <Controller
                name="patientName"
                control={control}
                rules={FORM_VALIDATION.patientName}
                render={({ field, fieldState }) => (
                  <TextInput
                    {...field}
                    placeholder="Patient Name"
                    label="Patient Name"
                    error={fieldState.error}
                    required
                    disabled
                  />
                )}
              />
              <Controller
                name="doctorName"
                control={control}
                rules={FORM_VALIDATION.doctorName}
                render={({ field, fieldState }) => (
                  <TextInput
                    {...field}
                    placeholder="Doctor Name"
                    label="Doctor Name"
                    error={fieldState.error}
                    required
                    disabled
                  />
                )}
              />
              <Controller
                name="serviceName"
                control={control}
                rules={FORM_VALIDATION.serviceName}
                render={({ field, fieldState }) => (
                  <TextInput
                    {...field}
                    placeholder="Service Name"
                    label="Service Name"
                    error={fieldState.error}
                    required
                    disabled
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
          <Group grow mt={20}></Group>
          <Group mt={32} justify="flex-end">
            <Button
              variant="filled"
              color="gray"
              onClick={() => navigate("/admin/medical-records")}
            >
              Cancel
            </Button>
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
