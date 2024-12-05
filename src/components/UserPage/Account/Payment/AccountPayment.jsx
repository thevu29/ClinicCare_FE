import { ScrollArea, TextInput } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import {
  IconAlertSquareRounded,
  IconCircleCheckFilled,
  IconCircleXFilled,
} from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/Auth/authContext";
import { formatDateTime, formatTimeDate } from "../../../../utils/date";
import { getPaymentsService } from "../../../../services/paymentService";
import clsx from "clsx";

const AccountPayment = () => {
  const { token } = useAuth();

  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [hasInitialData, setHasInitialData] = useState(false);

  const fetchPayments = useCallback(
    async ({ search }) => {
      try {
        const res = await getPaymentsService({
          search,
          size: 99,
          patientId: token?.userId,
        });

        if (res.success) {
          setPayments(res.data);
          setSelectedPayment(res.data[0]);

          if (!search) {
            setHasInitialData(res.data.length > 0);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) {
      const params = new URLSearchParams(location.search);

      const search = params.get("search") || "";

      fetchPayments({ search });
    }
  }, [token, fetchPayments, location.search]);

  const handleSearch = useDebouncedCallback((search) => {
    const params = new URLSearchParams(location.search);

    params.set("search", search);
    params.delete("page");

    if (!search) params.delete("search");

    navigate(`${pathname}?${params.toString()}`);
  }, 300);
  return (
    <>
      <div className="flex items-center justify-between mb-2 p-4 md:px-0">
        <h1 className="text-xl font-bold">Lịch sử thanh toán</h1>
      </div>
      <div className="bg-gray-100 grid md:grid-cols-10 md:rounded-lg md:gap-px">
        <div className="bg-white flex flex-col md:col-span-4 md:rounded-tl-lg md:rounded-bl-lg overflow-hidden">
          {(hasInitialData || location.search.includes("search")) && (
            <div className="p-4">
              <TextInput
                placeholder="Tên dịch vụ, tên bệnh nhân,..."
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          )}

          <ScrollArea.Autosize mah={300}>
            {payments &&
              payments.length > 0 &&
              payments.map((payment) => (
                <div
                  key={payment?.paymentId}
                  className={clsx(
                    "flex p-4 items-center gap-4 cursor-pointer",
                    {
                      "bg-gray-50":
                        selectedPayment?.paymentId === payment?.paymentId,
                    }
                  )}
                  onClick={() => setSelectedPayment(payment)}
                >
                  <div className="flex flex-1 flex-col">
                    <h2 className="font-medium">{payment?.serviceName}</h2>
                    <p className="text-gray-600 text-sm">
                      {formatTimeDate(payment?.date)}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {payment?.patientName}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {payment?.totalPrice.toLocaleString()}đ
                    </p>
                  </div>
                  <div>
                    <p
                      className={clsx(
                        "px-2 py-1 inline-block rounded-full text-sm bg-gray-50",
                        {
                          "text-red-500":
                            payment?.status.toLowerCase() === "cancelled",
                          "text-green-500":
                            payment?.status.toLowerCase() === "paid",
                          "text-yellow-500":
                            payment?.status.toLowerCase() === "pending",
                        }
                      )}
                    >
                      {payment?.status.toLowerCase() === "paid"
                        ? "Đã thanh toán"
                        : payment?.status.toLowerCase() === "cancelled"
                        ? "Đã hủy"
                        : "Chưa thanh toán"}
                    </p>
                  </div>
                </div>
              ))}
          </ScrollArea.Autosize>
        </div>

        {payments && payments.length === 0 && (
          <div className="text-center md:col-span-10 text-xl">
            Chưa có thanh toán nào
          </div>
        )}

        {selectedPayment && (
          <div className="bg-white md:col-span-6 md:rounded-r-lg overflow-hidden pt-4">
            <div className="flex justify-between items-center px-4 lg:px-6 font-semibold">
              <div className="flex items-center text-gray-500">
                {selectedPayment?.status.toLowerCase() === "paid" ? (
                  <>
                    <IconCircleCheckFilled
                      className="text-green-500"
                      size={24}
                    />
                    <p className="ml-1 text-green-500">Đã thanh toán</p>
                  </>
                ) : selectedPayment?.status.toLowerCase() === "cancelled" ? (
                  <>
                    <IconCircleXFilled className="text-red-500" size={24} />
                    <p className="ml-1 text-red-500">Đã hủy</p>
                  </>
                ) : (
                  <>
                    <IconAlertSquareRounded
                      className="text-yellow-500"
                      size={24}
                    />
                    <p className="ml-1 text-yellow-500">Chưa thanh toán</p>
                  </>
                )}
              </div>
            </div>
            <div className="p-4 lg:p-6 space-y-3">
              <h4 className="font-medium">Thông tin dịch vụ</h4>
              <div className="flex justify-between">
                <span className="whitespace-nowrap mr-2">Dịch vụ</span>
                <span className="font-medium text-right">
                  {selectedPayment?.serviceName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="whitespace-nowrap mr-2">Ngày khám</span>
                <span className="font-medium text-right">
                  {formatDateTime(selectedPayment?.date).split(" ")[0]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="whitespace-nowrap mr-2">Phương thức</span>
                <span className="font-medium text-right">
                  {selectedPayment?.method.toLowerCase() === "cash"
                    ? "Tiền mặt"
                    : "Chuyển khoản"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="whitespace-nowrap mr-2">Tổng tiền</span>
                <span className="font-medium text-right">
                  {selectedPayment?.totalPrice.toLocaleString()} VNĐ
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AccountPayment;
