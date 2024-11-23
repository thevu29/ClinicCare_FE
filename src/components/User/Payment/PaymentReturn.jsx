import PaymentSuccess from "./PaymentSuccess";
import PaymentFailure from "./PaymentFailure";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkResponseFromVNPay } from "../../../services/paymentService";

export default function PaymentReturn() {
  const [searchParams] = useSearchParams();

  const paymentId = searchParams.get("vnp_TxnRef");

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const checkResponse = async () => {
    const response = await checkResponseFromVNPay(searchParams);
    if (response && response.success) {
      setPaymentSuccess(true);
      setMessage(response.message);
    } else {
      setPaymentSuccess(false);
      setMessage(response.message);
    }
  };

  useEffect(() => {
    checkResponse();
  }, []);

  return paymentSuccess ? (
    <PaymentSuccess paymentId={paymentId} message={message} />
  ) : (
    <PaymentFailure paymentId={paymentId} message={message} />
  );
}
