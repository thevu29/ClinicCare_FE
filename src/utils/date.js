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
