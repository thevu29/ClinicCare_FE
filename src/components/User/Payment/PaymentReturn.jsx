import PaymentSuccess from "./PaymentSuccess";
import PaymentFailure from "./PaymentFailure";
import { useSearchParams } from "react-router-dom";

export default function PaymentReturn() {
  const [searchParams] = useSearchParams();

  const transactionStatus = searchParams.get("vnp_TransactionStatus");

  return transactionStatus === "00" ? <PaymentSuccess /> : <PaymentFailure />;
}
