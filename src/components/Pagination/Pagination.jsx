import { Pagination } from "@mantine/core";

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page);

    if (page === currentPage) return;
    if (page === 1) params.delete("page");

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.pushState({}, "", newUrl);

    onPageChange(page);
  };

  return (
    <Pagination
      page={currentPage}
      total={totalPages}
      onChange={handlePageChange}
    />
  );
};

export default PaginationComponent;
