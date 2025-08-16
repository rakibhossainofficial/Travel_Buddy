import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";

export default function ManageUsers() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/users");
      return data;
    },
    staleTime: 0,
    cacheTime: 0,
  });

  const updateRole = useMutation({
    mutationFn: async ({ id, role }) => {
      await axiosSecure.patch(`/users/${id}/role`, { role });
    },
    onSuccess: () => {
      toast.success("User role updated");
      queryClient.invalidateQueries(["all-users"]);
    },
    onError: () => {
      toast.error("Failed to update role");
    },
  });

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <p className="text-center py-10">Loading users...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4  space-y-6">
      <h2 className="text-3xl font-bold text-primary text-center">
        Manage Users
      </h2>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name..."
        className="max-w-sm mx-auto"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border mt-6 text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 capitalize">{user.role}</td>
                <td className="px-4 py-2 space-x-2">
                  {["admin", "guide", "tourist"]
                    .filter((r) => r !== user.role)
                    .map((role) => (
                      <Button
                        key={role}
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          updateRole.mutate({ id: user._id, role })
                        }
                      >
                        Make {role}
                      </Button>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
