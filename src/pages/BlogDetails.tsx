import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, TrashIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { useAuthStore } from "../store/AuthStore";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { DialogFooter, DialogHeader } from "../components/ui/dialog";
import { deleteBlog, getBlogByCategory, getBlogById, toggleLike, type Blog } from "../api/blogs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../main";
import BlogCard from "../components/BlogCard";

const BlogDetails = () => {
  const { id: blogId, category } = useParams<{ id: string, category: string }>();
  const navigate = useNavigate();
  const { token, user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryFn: () => getBlogById({ blogId: blogId! }),
    queryKey: ["blog", blogId],
  });

  const toggleLikeBlog = useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["all-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog"] });
    },
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const removeBlog = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      navigate("/my-blogs");
      queryClient.invalidateQueries({ queryKey: ["my-blogs"] });
    },
  });
  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !blogId) return;
    removeBlog.mutate({
      token,
      blogId,
    });
  };
  
const { data: suggestedBlogs } = useQuery({
  queryKey: ["similar-blogs", category, blogId],
  queryFn: () =>
    getBlogByCategory({
      category: category!,
      blogId: blogId!,
      limit: 3
    }),
});

  if (isLoading)
    return (
      <div className="sm:p-10 p-5">
        <div className="my-5">
          <Skeleton className="w-24 h-10 bg-gray-200 mb-3" />
          <Skeleton className="w-full sm:max-w-3/4 mx-auto h-50 bg-gray-200" />
        </div>
        <Skeleton className="w-40 h-10 bg-gray-200 my-3" />
        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-5">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 bg-gray-200" />
          ))}
        </div>
      </div>
    );
  if (!data) return <p className="p-10">Blog not found.</p>;

  return (
    <div className="min-h-screen sm:p-10 flex flex-col items-center bg-[#FDFBF7]">
      <div className="w-full">
        <Button className="self-start mb-5 text-gray-800" variant='ghost' onClick={() => navigate(-1)}>
        <ArrowLeft /> Back to Home
      </Button>
        <div className="bg-white w-full sm:max-w-3/4 mx-auto p-10 rounded-xl shadow-md space-y-3">
          
<div className="flex items-center gap-3">
              <div className="px-2 text-sm rounded-xl bg-amber-100 text-amber-900 flex items-center w-fit">{data.category || 'none'}</div>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-500">
              {format(new Date(data.createdAt), "MMM dd, yyyy")}
              </span>
            </div>
          <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
          <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg">
                  {data.author.firstName?.charAt(0) || data.author.email.split('@')[0].charAt(0)}
                </div>
                  <p className="text-sm font-medium text-gray-700">
                    {data.author.firstName || data.author.email.split('@')[0]}
                  </p>
              </div>
          <p className="mb-4 text-gray-700">{data.content}</p>
          {user && (
            <div className="flex justify-between">
              <div className="flex items-center gap-2 text-red-700">
                <Button
                  variant="outline"
                  className="border-red-300"
                  onClick={() => {
                    if (!token || !user) return;

                    const hasLikedBlog = data.likes.includes(user.id);

                    toggleLikeBlog.mutate({
                      blogId: data._id,
                      token,
                      hasLiked: hasLikedBlog,
                    });
                  }}
                >
                  <Heart
                    fill={
                      user &&
                      Array.isArray(data.likes) &&
                      data.likes.includes(user?.id)
                        ? "red"
                        : "white"
                    }
                  />
                  {data.likes?.length || 0} likes
                </Button>
              </div>

              {user.id === data.author._id && (
                <Dialog
                  open={deleteDialogOpen}
                  onOpenChange={setDeleteDialogOpen}
                >
                  <DialogTrigger>
                    <Button variant="destructive">
                      <TrashIcon />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-96">
                    <DialogHeader>
                      <DialogTitle className="text-center mt-5">
                        Delete Blog
                        <span className="font-light">"{data.title}"</span>
                      </DialogTitle>
                    </DialogHeader>
                    <p className="text-center">This action can't be undone</p>
                    <DialogFooter>
                      <DialogClose>
                        <Button variant="outline" className="sm:w-auto w-full">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={removeBlog.isPending}
                      >
                        {removeBlog.isPending ? "Deleting..." : "Delete"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="w-full mt-16">
        <h2 className="text-2xl font-bold mb-8">Similar Blogs</h2>

        {suggestedBlogs?.length === 0 ? (
          <p className="text-gray-600 text-center py-12">
            No similar blogs found in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {suggestedBlogs?.map((blog: Blog) => (
              <div key={blog._id} className="flex justify-center">
                <div className="w-full max-w-sm">
                  <BlogCard blog={blog} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;
