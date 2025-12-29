import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createBlog, getMyBlogs } from "../api/blogs";
import { Button } from "../components/ui/button";
import { queryClient } from "../main";
import BlogCard from "../components/BlogCard";
import { useAuthStore } from "../store/AuthStore";
import { Skeleton } from "../components/ui/skeleton";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../components/ui/select";
import { Label } from "@radix-ui/react-label";
import { Plus } from "lucide-react";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const MyBlogs = () => {

  const addBlogSchema = z.object({
  title: z.string().min(5, "Title must be more that 5 characters"),
  content: z.string().min(20, "Content must be more than 20 characters"),
  category: z.enum(["tech", "lifestyle", "education"], {error: "Category is required"})
})

type AddBlogFormData = z.infer<typeof addBlogSchema>

 const {register, handleSubmit, reset, control, formState: {errors},}= useForm<AddBlogFormData>({
  resolver: zodResolver(addBlogSchema)
})

  const { token } = useAuthStore();
  const [dialogOpen, setDialogOpen] = useState(false);

  const categories = ["tech", "lifestyle", "education"];
  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => getMyBlogs(token!),
    queryKey: ["my-blogs"],
  });

  const addBlog = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      reset();
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["my-blogs"] });
    },
    
  });
  
  const onSubmit = (data: AddBlogFormData) => {
    if(!token) return;
    addBlog.mutate({payload: data, token})
}
  if (isError) {
    return <div>{error.message}</div>;
  }

  if (isLoading)
    return (
      <div className="min-h-screen grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-10">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-64 bg-gray-200" />
        ))}
      </div>
    );

  return (
    <div className="bg-gray-100 relative sm:p-10 p-5 w-full space-y-4 ">
      <h2 className="text-2xl font-bold">My Blogs</h2>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger>
          <Button className="absolute right-10 top-10">
            <Plus />
            Create
          </Button>
        </DialogTrigger>
        <DialogContent className="overflow-y-auto max-h-[90vh]">
          <form
            action=""
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-5"
            noValidate
          >
            <DialogHeader>
              <DialogTitle>Create Blog</DialogTitle>
            </DialogHeader>
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              required
             {...register('title')}
              placeholder="Enter title"
              className="bg-gray-100 px-4 py-2 rounder-sm "
            />
            {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
            <Label htmlFor="content">Content</Label>
            <Textarea
              required
             {...register('content')}
              placeholder="Enter Content"
              className="bg-gray-100 mt-2 block px-4 py-2 rounder-sm "
            />
            {errors.content && <p className="text-sm text-red-600">{errors.content.message}</p>}
            <Label htmlFor="category">Category</Label>

<Controller
  control={control}
  name="category"
  render={({ field }) => (
    <Select
      value={field.value}
      onValueChange={field.onChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>

      <SelectContent>
        {categories.map((t) => (
          <SelectItem key={t} value={t}>
            {t}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )}
/>

{errors.category && (
  <p className="text-sm text-red-600">{errors.category.message}</p>
)}
            <DialogFooter className="">
              <DialogClose>
                <Button
                  disabled={addBlog.isPending}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={addBlog.isPending}>
                {addBlog.isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <div>
        {data?.length === 0 ? (
          <p className="text-center text-lg text-gray-600 py-20">
            You haven't created any blogs yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {data?.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBlogs;
