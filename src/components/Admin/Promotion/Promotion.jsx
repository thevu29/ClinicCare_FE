import { Button, Group, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import PromotionTable from "./PromotionTable";
import Search from "../Search/Search";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Promotion", href: "/admin/promoitons" },
];

const PromotionManagement = () => {
  return (
    <>
      <BreadcumbsComponent
        items={breadcumbData}
      />
      <Title order={1} mt={32}>
        Promotions
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="space-between" mb={24}>
          <Search placeholder="Search promotion" />
          <Button leftSection={<IconPlus />} variant="filled" color="indigo">
            Create promotion
          </Button>
        </Group>

        <PromotionTable />
      </div>
    </>
  );
};

export default PromotionManagement;
