export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const offset = 7 * 60;
  const localDate = new Date(date.getTime() + offset * 60 * 1000);
  return localDate
    .toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .replace(",", "");
};

export const formatDateForApi = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const timeString = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateString = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return `${dateString} ${timeString}`;
};

export const formatTimeDate = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const timeString = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateString = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return `${timeString} ${dateString}`;
};

export const formatTime = (timeString) => {
  const date = new Date(timeString);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateWithLeadingZeros = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const convertToGMT7 = (date) => {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + 7);
  return newDate;
};

export const getDatesInMonth = (year, month) => {
  const dates = [];
  const date = new Date(year, month, 1);

  while (date.getMonth() === month) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
};
