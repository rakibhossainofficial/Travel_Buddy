import EditProfileForm from "@/components/Forms/EditProfileForm";
import ReusableModal from "@/components/Shared/ReusableModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useUser from "@/hooks/useUser";
import { useState } from "react";

export default function ManageProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const { userData, isLoading, refetch } = useUser();

  if (isLoading)
    return (
      <p className="text-center mt-10 text-muted-foreground">
        Loading profile...
      </p>
    );

  const roleBadge = {
    tourist: "bg-blue-100 text-blue-700",
    guide: "bg-yellow-100 text-yellow-700",
    admin: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-3xl mx-auto flex justify-center items-center flex-col space-y-6">
      <div className="text-center flex justify-center items-center flex-col space-y-1">
        <h2 className="text-4xl font-bold text-primary">
          Welcome, {userData?.name} 👋
        </h2>
        <p className="text-sm text-muted-foreground">
          View and update your profile information
        </p>
      </div>

      <Card className="w-full">
        <CardHeader className="flex flex-col items-center space-y-4">
          <img
            src={userData?.image}
            alt="Profile"
            className="w-24 h-24 rounded-full border shadow"
          />
          <CardTitle className="text-xl font-semibold">
            {userData?.name}{" "}
            <span className="text-sm">({userData?.email})</span>
          </CardTitle>
          <Badge
            variant="outline"
            className={`capitalize ${roleBadge[userData?.role] || ""}`}
          >
            {userData?.role}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6 text-sm text-center">
          {/* <div>
            <span className="text-muted-foreground font-medium">Email:</span>{" "}
            <span>{userData?.email}</span>
          </div> */}

          <Button onClick={() => setIsOpen(true)}>Edit Profile</Button>

          <ReusableModal
            isOpen={isOpen}
            onClose={setIsOpen}
            title="Edit Profile"
            description="Update your info below"
            size="md"
          >
            <EditProfileForm
              user={userData}
              refetch={refetch}
              modalClose={setIsOpen}
            />
          </ReusableModal>
        </CardContent>
      </Card>
    </div>
  );
}
