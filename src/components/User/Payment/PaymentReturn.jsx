import PaymentSuccess from "./PaymentSuccess";
import PaymentFailure from "./PaymentFailure";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkResponseFromVNPay } from "../../../services/paymentService";
import { Loader } from "@mantine/core";

export default function PaymentReturn() {
  const [searchParams] = useSearchParams();

  const paymentId = searchParams.get("vnp_TxnRef");

  const [isLoading, setIsLoading] = useState(true);
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
    setIsLoading(false);
  };

  useEffect(() => {
    checkResponse();
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Loader color="blue" />
      </div>
    );
  }

  if (!isLoading && paymentSuccess) {
    return <PaymentSuccess paymentId={paymentId} message={message} />;
  }

  return <PaymentFailure paymentId={paymentId} message={message} />;
}
