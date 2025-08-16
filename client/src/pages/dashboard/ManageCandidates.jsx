import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ManageCandidates() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: candidates = [] } = useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      const res = await axiosSecure.get("/candidates");
      return res.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.post(`/candidates/${id}/approve`);
    },
    onSuccess: () => {
      toast.success("Candidate promoted to Tour Guide");
      queryClient.invalidateQueries(["candidates"]);
    },
    onError: () => toast.error("Approval failed"),
  });

  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/candidates/${id}`);
    },
    onSuccess: () => {
      toast.success("Candidate rejected");
      queryClient.invalidateQueries(["candidates"]);
    },
    onError: () => toast.error("Rejection failed"),
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <h2 className="text-3xl font-bold text-primary text-center">
        Manage Candidates
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">CV</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="px-4 py-2">{c.applicantName}</td>
                <td className="px-4 py-2">{c.applicantEmail}</td>
                <td className="px-4 py-2">{c.title}</td>
                <td className="px-4 py-2">
                  <a
                    href={c.cvLink}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    View CV
                  </a>
                </td>
                <td className="px-4 py-2 capitalize">{c.status}</td>
                <td className="px-4 py-2 space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => approveMutation.mutate(c._id)}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => rejectMutation.mutate(c._id)}
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
