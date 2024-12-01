import { Button, Group, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import Search from "../Search/Search";
import PaymentTable from "./PaymentTable";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Payments" },
];

const Payment = () => {
  return (
    <>
      <BreadcumbsComponent items={breadcumbData} />
      <Title order={1} mt={32}>
        Payments
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="space-between" mb={24}>
          <Search placeholder="Search payments" />

          <Link to="/admin/payments/create">
            <Button
              leftSection={<IconPlus />}
              variant="filled"
              color="indigo"
              radius="md"
            >
              Create payment
            </Button>
          </Link>
        </Group>

        <PaymentTable />
      </div>
    </>
  );
};

export default Payment;
