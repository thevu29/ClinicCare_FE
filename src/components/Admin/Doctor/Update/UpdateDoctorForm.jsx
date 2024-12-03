import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Flex,
  Group,
  LoadingOverlay,
  TextInput,
  Title,
} from "@mantine/core";
import { useParams, useNavigate } from "react-router-dom";
import {
  updateDoctorService,
  getDoctorByIdService,
} from "../../../../services/doctorService";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";
import AvatarDropzone from "../Dropzone/AvatarDropzone";
import { showNotification } from "../../../../utils/notification";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Doctors", href: "/admin/doctors" },
  { title: "Update doctor", href: "/admin/doctors/update" },
];

const FORM_VALIDATION = {
  name: { required: "Name is required" },
  email: {
    required: "Email is required",
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      message: "Invalid email address",
    },
  },
  specialty: { required: "Specialty is required" },
};

const UpdateDoctorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [doctor, setDoctor] = useState({});
  
  const { handleSubmit, control, setValue, reset } = useForm({
    defaultValues: { name: "", phone: "", specialty: "", image: "" },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setIsLoading(true);
        const doctorRes = await getDoctorByIdService(id);
        if (doctorRes.success) {
          const doctor = doctorRes.data;
          setDoctor(doctor);

          reset({
            name: doctor.name,
            phone: doctor.phone,
            image: doctor.image,
            specialty: doctor.specialty,
          });
        } else {
          showNotification(doctorRes.message, "Error");
        }
      } catch (error) {
        console.log(error);
        showNotification("An error occured", "Error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctor();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key !== "image") formData.append(key, data[key]);
      });

      if (data.image && typeof data.image !== "string") {
        formData.append("image", data.image);
      }

      const response = await updateDoctorService(id, formData);
      
      if (response.success) {
        showNotification(response.message, "Success");
        navigate("/admin/doctors");
      } else {
        showNotification(response.message, "Error");
      }
    } catch (error) {
      showNotification(error.message, "Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (file) => {
    setValue("image", file);
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
        Update Doctor
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Group justify="space-between" grow>
            <Flex direction="column" gap={20}>
              <Controller
                name="name"
                control={control}
                rules={FORM_VALIDATION.name}
                render={({ field, fieldState: { error } }) => (
                  <TextInput
                    {...field}
                    error={error?.message}
                    label="Name"
                    size="md"
                    placeholder="Enter doctor's name"
                  />
                )}
              />
              <Controller
                name="phone"
                control={control}
                rules={FORM_VALIDATION.phone}
                render={({ field, fieldState: { error } }) => (
                  <TextInput
                    {...field}
                    error={error?.message}
                    label="Phone"
                    size="md"
                    type="number"
                    placeholder="Enter phone number"
                  />
                )}
              />
            </Flex>
            <Controller
              name="image"
              control={control}
              render={() => (
                <AvatarDropzone user={doctor} onUpload={handleImageUpload} />
              )}
            />
          </Group>
          <Group grow mt={20}>
            <Controller
              name="specialty"
              control={control}
              rules={FORM_VALIDATION.specialty}
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  {...field}
                  error={error?.message}
                  label="Specialty"
                  size="md"
                  type="text"
                  placeholder="Enter specialty"
                />
              )}
            />
          </Group>
          <Group mt={32} justify="flex-end">
            <Button
              variant="filled"
              color="gray"
              onClick={() => navigate("/admin/doctors")}
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

export default UpdateDoctorForm;
