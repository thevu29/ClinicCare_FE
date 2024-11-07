import { notifications } from "@mantine/notifications";

export const showNotification = (message, type) => {
  notifications.show({
    title: type,
    message: message,
    color: type.toLowerCase() === "success" ? "green" : "red",
    position: "top-right",
  });
};
