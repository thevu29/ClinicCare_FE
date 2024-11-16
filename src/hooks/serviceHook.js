import { useCallback, useState } from "react";
import { getServicesManager } from "../services/serviceManager";

export const useServices = (initialSize = 4) => {
  const [services, setServices] = useState(null);
  const [size, setSize] = useState(initialSize);
  const [isLoading, setIsLoading] = useState(false);

  const fetchServices = useCallback(
    async (search, status, price, page, sortBy, order) => {
      try {
        const res = await getServicesManager({
          search,
          status,
          price,
          page,
          size,
          sortBy,
          order,
        });

        if (res.success) {
          setServices(res);
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
    services,
    size,
    setSize,
    isLoading,
    setIsLoading,
    fetchServices,
  };
};
