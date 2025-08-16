import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useUser from "@/hooks/useUser";

export default function PaymentHistory() {
  const axiosSecure = useAxiosSecure();
  const { userData } = useUser();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payment-history", userData?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/payments/history?email=${userData?.email}`
      );
      return data;
    },
    enabled: !!userData?.email,
  });

  if (isLoading)
    return <p className="text-center py-10">Loading payment history...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <h2 className="text-3xl font-bold text-primary text-center">
        My Payment History
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="px-4 py-2">Transaction ID</th>
              <th className="px-4 py-2">Amount (৳)</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((txn) => (
              <tr key={txn._id} className="border-t">
                <td className="px-4 py-2">{txn.transactionId}</td>
                <td className="px-4 py-2">{txn.amount}</td>
                <td className="px-4 py-2">
                  {new Date(txn.paidAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
