import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FacebookShareButton, FacebookIcon } from "react-share";

export default function Community() {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [role, setRole] = useState("");

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ["community-stories", sort, order, role],
    queryFn: async () => {
      const { data } = await axiosPublic.get(
        `/stories?sort=${sort}&order=${order}&role=${
          role === "all" ? "" : role
        }`
      );
      return data;
    },
  });

  if (isLoading) return <p className="text-center py-10">Loading stories...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-primary">
          🌍 Community Travel Stories
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Browse stories shared by travelers across Bangladesh. Filter by role
          and sort how you want!
        </p>
      </div>

      {/* Filter and Sort Controls */}
      <div className="flex gap-4 flex-wrap justify-end">
        <Select onValueChange={setSort} defaultValue="createdAt">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Latest</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="author.name">Author</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setOrder} defaultValue="desc">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setRole} defaultValue="">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="tourist">Tourist</SelectItem>
            <SelectItem value="guide">Guide</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stories Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <Card key={story._id}>
            <CardHeader>
              <img
                src={story.images?.[0]}
                alt={story.title}
                className="w-full h-56 object-cover rounded-md"
              />
              <CardTitle className="text-xl">{story.title}</CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {story.description}
              </p>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              {user ? (
                <FacebookShareButton
                  url={`https://yourdomain.com/stories/${story._id}`}
                  quote={story.title}
                >
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
              ) : (
                <Button onClick={() => navigate("/login")}>
                  Login to Share
                </Button>
              )}
              <span className="text-xs text-muted-foreground">
                By {story.author?.name}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
