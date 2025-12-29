import { toggleLike, type Blog } from "../api/blogs";
import { Heart, User } from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../main";
import { useAuthStore } from "../store/AuthStore";

const BlogCard = ({ blog }: { blog: Blog }) => {
  const { token, user } = useAuthStore();
  const toggleLikeBlog = useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["all-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog", blog] });
    },
  });
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/blogs/${blog.category}/${blog._id}`);
  };
  return (
    <Card
      onClick={handleCardClick}
      className="h-64 flex flex-col hover:shadow-xl group hover:cursor-pointer"
    >
      <div className="p-2 flex flex-col h-full">
        <CardHeader className="flex flex-col gap-3">
          <div className="flex justify-between w-full">
            <div className="px-2 text-sm rounded-xl bg-amber-100 text-amber-900 flex items-center">
              {blog.category || "none"}
            </div>
            {user && (
              <CardAction
                onClick={(e) => {
                  e.stopPropagation();
                  if (!token || !user) return;

                  const hasLikedBlog = blog.likes.includes(user.id);

                  toggleLikeBlog.mutate({
                    blogId: blog._id,
                    token,
                    hasLiked: hasLikedBlog,
                  });
                }}
                className="flex items-center hover:bg-gray-100 p-1 rounded-lg text-sm"
              >
                <Heart
                  size={20}
                  className={`h-4 w-4 mr-1 ${
                    user &&
                    Array.isArray(blog.likes) &&
                    blog.likes.includes(user?.id)
                      ? "fill-current text-rose-400"
                      : ""
                  }`}
                />
                <p
                  className={`${
                    user &&
                    Array.isArray(blog.likes) &&
                    blog.likes.includes(user?.id)
                      ? "text-rose-400"
                      : ""
                  }`}
                >
                  {blog.likes?.length || 0}
                </p>
              </CardAction>
            )}
          </div>
          <CardTitle className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-700 transition-colors line-clamp-1">
            {blog.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-gray-600 line-clamp-2">
          {blog.content}
        </CardContent>

        <CardFooter className="flex items-center justify-between text-sm text-gray-500 mt-auto border-t border-gray-50">
          <CardDescription className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <User className="h-3 w-3" />
            </div>
            <span className="font-medium text-gray-700">
              By {blog.author?.firstName || blog.author?.email.split("@")[0]}
            </span>
          </CardDescription>
          <span className="text-xs text-gray-400">
            {format(new Date(blog.createdAt), "MMM dd, yyyy")}
          </span>
        </CardFooter>
      </div>
    </Card>
  );
};

export default BlogCard;
