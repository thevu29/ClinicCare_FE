import { Button, Group, Title } from "@mantine/core";
import { IconPlus, IconTrashX } from "@tabler/icons-react";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import PromotionTable from "./PromotionTable";
import Search from "../Search/Search";
import { useState } from "react";
import { Link } from "react-router-dom";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Promotion", href: "/admin/promoitons" },
];

const Promotion = () => {
  const [selectedRows, setSelectedRows] = useState([]);

  return (
    <>
      <BreadcumbsComponent items={breadcumbData} />
      <Title order={1} mt={32}>
        Promotions
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="space-between" mb={24}>
          <Search placeholder="Search promotion" />
          <Group>
            {selectedRows.length > 0 && (
              <Button variant="light" color="red" radius="md">
                <IconTrashX width={18} height={18} />
              </Button>
            )}
            <Link to="/admin/promotions/create">
              <Button
                leftSection={<IconPlus />}
                variant="filled"
                color="indigo"
                radius="md"
              >
                Create promotion
              </Button>
            </Link>
          </Group>
        </Group>

        <PromotionTable
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      </div>
    </>
  );
};

export default Promotion;
