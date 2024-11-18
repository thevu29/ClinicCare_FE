import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import { Button, Group, Title } from "@mantine/core";
import Search from "../Search/Search";
import FeedbackTable from "./FeedbackTable";
import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { deleteFeedbacksService } from "../../../services/feedbackService";
import { showNotification } from "../../../utils/notification";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Feedbacks" },
];

export default function Feedback() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [reload, setReload] = useState(false);

  return (
    <>
      <BreadcumbsComponent items={breadcumbData} />
      <Title order={1} mt={32}>
        Feedbacks
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="space-between" mb={24}>
          <Search placeholder="Search feedbacks" />

          <Button
            leftSection={<IconTrash />}
            variant="filled"
            color="red"
            onClick={async () => {
              try {
                const res = await deleteFeedbacksService(selectedRows);

                // If delete successfully then reload the page
                if (res && res.success) {
                  showNotification(res.message, "Success");
                  setReload(true);
                } else {
                  showNotification(res.message, "Error");
                }
              } catch (error) {
                console.log(error);
                showNotification("An error occured", "Error");
              }
            }}
          >
            Delete role(s)
          </Button>
        </Group>

        <FeedbackTable
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          reload={reload}
          setReload={setReload}
        />
      </div>
    </>
  );
}
