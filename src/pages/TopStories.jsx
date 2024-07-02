import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const fetchTopStories = async () => {
  const response = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );
  const storyIds = await response.json();
  const stories = await Promise.all(
    storyIds.slice(0, 100).map(async (id) => {
      const storyResponse = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      return storyResponse.json();
    })
  );
  return stories;
};

const TopStories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, error, isLoading } = useQuery({
    queryKey: ["topStories"],
    queryFn: fetchTopStories,
  });

  const filteredStories = data?.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Input
        type="text"
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {isLoading && (
        <div>
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="h-20 mb-4" />
          ))}
        </div>
      )}
      {error && <div>Error fetching stories</div>}
      {filteredStories?.map((story) => (
        <Card key={story.id} className="mb-4">
          <CardHeader>
            <CardTitle>{story.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{story.score} upvotes</p>
            <a href={story.url} target="_blank" rel="noopener noreferrer">
              Read More
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TopStories;