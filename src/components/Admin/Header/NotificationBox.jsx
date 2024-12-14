import { Menu, Divider, Text, Box, Loader } from "@mantine/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { getByUserIdService } from "../../../services/notificationService";
import { useAuth } from "../../../context/Auth/authContext";

const NotificationBox = () => {
  const { token } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isShowMore, setIsShowMore] = useState(false);

  const [notifications, setNotifications] = useState([]);

  const [cursor, setCursor] = useState("");

  const boxRef = useRef(null);

  const loadMoreNotification = useCallback(async () => {
    if (cursor) {
      try {
        const res = await getByUserIdService(token?.userId, cursor);

        if (res && res.success) {
          setCursor(res.data.cursor);
          setNotifications((prev) => [...prev, ...res.data.notifications]);
        } else {
          setCursor("");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
    setIsLoading(false);
  }, [cursor, token]);

  const handleScroll = () => {
    if (isShowMore) {
      if (boxRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = boxRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
          setIsLoading(true);
        }
      }
    }
  };

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const res = await getByUserIdService(token?.userId);
        console.log(res);

        if (res && res.success) {
          setCursor(res.data.cursor);
          setNotifications(res.data.notifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotification();
  }, [token]);

  useEffect(() => {
    if (isLoading) {
      loadMoreNotification();
    }
  }, [isLoading, loadMoreNotification]);

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
};

export default NotificationBox;
