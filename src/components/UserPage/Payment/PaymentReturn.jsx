import PaymentSuccess from "./PaymentSuccess";
import PaymentFailure from "./PaymentFailure";
import { useSearchParams } from "react-router-dom";

export default function PaymentReturn() {
  const [searchParams] = useSearchParams();

  // Get payment status from VNPay
  const transactionStatus = searchParams.get("vnp_TransactionStatus");

  // Get paymentId from VNPay
  const paymentId = searchParams.get("vnp_TxnRef");

  return transactionStatus === "00" ? (
    <PaymentSuccess paymentId={paymentId} />
  ) : (
    <PaymentFailure paymentId={paymentId} />
  );
}
