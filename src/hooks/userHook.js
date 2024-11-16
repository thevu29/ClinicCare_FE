import { useCallback, useState } from "react";
import { getUsersService } from "../services/userService";

export const useUsers = (initialSize = 4) => {
  const [users, setUsers] = useState(null);
  const [size, setSize] = useState(initialSize);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = useCallback(
    async (search, role, page, sortBy, order) => {
      try {
        const res = await getUsersService({
          search,
          role,
          page,
          size,
          sortBy,
          order,
        });

        if (res.success) {
          setUsers(res);
        }

        return res;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [size]
  );

  return {
    users,
    size,
    setSize,
    isLoading,
    setIsLoading,
    fetchUsers,
  };
};
