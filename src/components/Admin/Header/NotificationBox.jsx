import { Menu, Divider, Text, Box, Loader } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { getByUserIdService } from "../../../services/notificationService";

export default function NotificationBox() {
  const [isLoading, setIsLoading] = useState(false);
  const [isShowMore, setIsShowMore] = useState(false);

  const [notifications, setNotifications] = useState([]);

  // Cursor
  const [cursor, setCursor] = useState("");

  // Admin Id
  const userId = "1112c29f-aa3c-40ce-ad10-4266c06b8461";

  const boxRef = useRef(null);

  // Handle for load more notification
  const loadMoreNotification = async () => {
    // If cursor have value then I can load more
    if (cursor) {
      try {
        const res = await getByUserIdService(userId, cursor);
        console.log(res);

        if (res && res.success) {
          // Set cursor
          setCursor(res.data.cursor);
          // Set notification
          setNotifications((prev) => [...prev, ...res.data.notifications]);
        } else {
          setCursor("");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
    setIsLoading(false);
  };

  const handleScroll = () => {
    if (isShowMore) {
      if (boxRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = boxRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
          //   If reaching bottom will load more notification
          setIsLoading(true);
        }
      }
    }
  };

  // Get notification with admin Id
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const res = await getByUserIdService(userId);
        console.log(res);

        if (res && res.success) {
          // Set cursor
          setCursor(res.data.cursor);
          // Set notification
          setNotifications(res.data.notifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotification();
  }, []);

  //   When loading it will get more notification
  useEffect(() => {
    if (isLoading) {
      loadMoreNotification();
    }
  }, [isLoading]);

  return (
    <>
      <Box
        ref={boxRef}
        w={300}
        mah={isShowMore ? 600 : 300}
        style={{ overflowY: "auto" }}
        onScroll={handleScroll}
      >
        {notifications.map((item) => (
          <Menu.Item py={20} key={item.notificationId}>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text>{item.message}</Text>

              {!item.isRead && (
                <Box
                  style={{
                    width: 8,
                    height: 8,
                    backgroundColor: "red",
                    borderRadius: "50%",
                    marginLeft: 8,
                  }}
                ></Box>
              )}
            </Box>
          </Menu.Item>
        ))}
      </Box>

      {isLoading && (
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 15,
          }}
        >
          <Loader color="blue" size={20} />
        </Box>
      )}

      <Divider />

      <Text
        c="blue"
        align="center"
        className="hover:underline cursor-pointer"
        onClick={() => {
          setIsShowMore((prev) => !prev);
          if (!isShowMore) {
            setIsLoading(true);
          }
        }}
      >
        {isShowMore ? "Less" : "More"}
      </Text>
    </>
  );
}
