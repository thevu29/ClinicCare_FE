import { useCallback, useState } from "react";
import { getPromotionsService } from "../services/promotionService";

export const usePromotions = (initialSize = 4) => {
  const [promotions, setPromotions] = useState(null);
  const [size, setSize] = useState(initialSize);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPromotions = useCallback(
    async (search, status, discount, page, sortBy, order) => {
      try {
        const res = await getPromotionsService({
          search,
          status,
          discount,
          page,
          size,
          sortBy,
          order,
        });
        if (res.success) {
          setPromotions(res);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [size]
  );

  return {
    promotions,
    size,
    setSize,
    isLoading,
    setIsLoading,
    fetchPromotions,
  };
};
