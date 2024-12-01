import { useDisclosure } from "@mantine/hooks";
import {
  ActionIcon,
  Flex,
  Group,
  NumberInput,
  Table,
  Text,
  ThemeIcon,
  Transition,
} from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  IconChevronUp,
  IconEdit,
  IconWallet,
  IconQrcode,
} from "@tabler/icons-react";
import { getPaymentsService } from "../../../services/paymentService";
import { handleSorting } from "../../../utils/sort";
import { formatDate } from "../../../utils/date";
import clsx from "clsx";
import PaginationComponent from "../../Pagination/Pagination";
import FilterPaymentDate from "./Filter/FilterPaymenDate";
import FilterPaymentPrice from "./Filter/FilterPaymentPrice";
import FilterPaymentStatus from "./Filter/FilterPaymentStatus";
import FilterPaymentMethod from "./Filter/FilterPaymentMethod";

const PaymentTable = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [payments, setPayments] = useState(null);
  const [size, setSize] = useState(4);
  const [sortBy, setSortBy] = useState(null);
  const [order, setOrder] = useState("asc");
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const fetchPayments = useCallback(
    async (search, status, date, method, price, page, sortBy, order) => {
      try {
        const res = await getPaymentsService({
          search,
          status,
          method,
          date,
          price,
          page,
          size,
          sortBy,
          order,
        });

        if (res.success) {
          setPayments(res);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [size]
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const search = params.get("search") || "";
    const status = params.get("status") || "";
    const method = params.get("method") || "";
    const date = params.get("date") || "";
    const price = params.get("price") || "";
    const page = +params.get("page") || 1;
    const _sortBy = params.get("sortBy") || "";
    const _order = params.get("order") || "";

    setSortBy(_sortBy);
    setOrder(_order);

    fetchPayments(search, status, date, method, price, page, _sortBy, _order);
  }, [location.search, fetchPayments]);

  const handleSort = (field) => {
    let newOrder = "asc";
    if (sortBy === field) {
      newOrder = order === "asc" ? "desc" : "asc";
    }
    setSortBy(field);
    setOrder(newOrder);
    handleSorting(field, newOrder, location, pathname, navigate);
  };

  const handleSizeChange = (size) => {
    setSize(+size);
    const params = new URLSearchParams(location.search);
    params.delete("page");
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const rows =
    payments &&
    payments.data &&
    payments.data.length > 0 &&
    payments.data.map((payment) => (
      <Table.Tr key={payment.paymentId}>
        <Table.Td>{payment.patientName}</Table.Td>
        <Table.Td>{payment.serviceName}</Table.Td>
        <Table.Td>{formatDate(payment.date)}</Table.Td>
        <Table.Td>{payment.totalPrice}</Table.Td>
        <Table.Td>
          <span
            className={clsx("px-4 py-3 font-bold text-white", {
              "bg-green-500": payment.status.toLowerCase() === "paid",
              "bg-gray-500": payment.status.toLowerCase() === "pending",
              "bg-red-500": payment.status.toLowerCase() === "cancelled",
            })}
          >
            {payment.status}
          </span>
        </Table.Td>
        <Table.Td>
          <Flex align="center" gap={8}>
            {payment.method.toLowerCase() === "cash" ? (
              <ThemeIcon variant="light" color="yellow">
                <IconWallet style={{ width: "70%", height: "70%" }} />
              </ThemeIcon>
            ) : (
              <ThemeIcon variant="light" color="black">
                <IconQrcode style={{ width: "70%", height: "70%" }} />
              </ThemeIcon>
            )}
            <span>{payment.method}</span>
          </Flex>
        </Table.Td>
        <Table.Td>
          <ActionIcon
            variant="transparent"
            color="yellow"
            radius="xl"
            title="Update payment"
            // onClick={() => handleOpenCancelScheduleModal(appointment)}
          >
            <IconEdit style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>
    ));

  return (
    <>
      <Table highlightOnHover horizontalSpacing="md" verticalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Patient</Table.Th>
            <Table.Th>Service</Table.Th>
            <Table.Th
              onClick={() => handleSort("date")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group>
                <Group justify="space-between">
                  <span>Date</span>
                  <Transition
                    mounted={sortBy === "date"}
                    transition={{
                      type: "rotate-left",
                      duration: 200,
                      timingFunction: "ease",
                    }}
                  >
                    {(styles) =>
                      sortBy === "date" && (
                        <IconChevronUp
                          style={{
                            transform:
                              order === "asc"
                                ? "rotate(0deg)"
                                : "rotate(180deg)",
                            ...styles,
                          }}
                          width={16}
                          height={16}
                        />
                      )
                    }
                  </Transition>
                </Group>

                <FilterPaymentDate />
              </Group>
            </Table.Th>
            <Table.Th
              onClick={() => handleSort("totalPrice")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group>
                <Group justify="space-between">
                  <span>Total price</span>
                  <Transition
                    mounted={sortBy === "totalPrice"}
                    transition={{
                      type: "rotate-left",
                      duration: 200,
                      timingFunction: "ease",
                    }}
                  >
                    {(styles) =>
                      sortBy === "totalPrice" && (
                        <IconChevronUp
                          style={{
                            transform:
                              order === "asc"
                                ? "rotate(0deg)"
                                : "rotate(180deg)",
                            ...styles,
                          }}
                          width={16}
                          height={16}
                        />
                      )
                    }
                  </Transition>
                </Group>

                <FilterPaymentPrice />
              </Group>
            </Table.Th>
            <Table.Th>
              <Group>
                <span>Status</span>
                <FilterPaymentStatus />
              </Group>
            </Table.Th>
            <Table.Th>
              <Group>
                <span>Method</span>
                <FilterPaymentMethod />
              </Group>
            </Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Group justify="space-between" mt={24}>
        <Group>
          {payments && (
            <span className="text-sm italic text-gray-700 dark:text-gray-400">
              Showing <strong>{payments?.meta?.take}</strong> of{" "}
              <strong>{payments?.meta?.totalElements}</strong> entries
            </span>
          )}

          <Group gap={4}>
            <Text size="xs" fw={700}>
              Per page:
            </Text>
            <NumberInput
              maw={50}
              size="xs"
              value={size}
              onChange={(e) => handleSizeChange(e)}
            />
          </Group>
        </Group>

        <PaginationComponent
          currentPage={payments?.meta?.page || 1}
          totalPages={payments?.meta?.totalPages || 1}
        />
      </Group>

      {/* <CancelScheduleModal
        opened={opened}
        close={close}
        payment={selectedPayment}
      /> */}
    </>
  );
};

export default PaymentTable;
