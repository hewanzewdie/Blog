import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllBlogs } from "../api/blogs";
import { Button } from "../components/ui/button";
import BlogCard from "../components/BlogCard";
import { Skeleton } from "../components/ui/skeleton";

const Home = () => {
  const [page, setPage] = useState(1);
  const limit = 9;

  const {data, isLoading, isError} = useQuery({
    queryFn: ()=>getAllBlogs({page, limit}),
    queryKey: ['all-blogs', page, limit]
  })

  if (isLoading) {
    return (
      <div className="min-h-screen w-full space-y-10">
        <div className="flex flex-col items-center justify-center gap-5 p-10 px-10 sm:px-5">

        <Skeleton className="w-full h-20 bg-gray-200 "/>
        <Skeleton className="w-full h-10 bg-gray-200"/>
</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-5 sm:px-10">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500">Failed to load blogs</p>;
  }

  return (
    <div className="flex flex-col sm:items-center space-y-5">
     
<div className="min-h-screen flex flex-col items-center justify-center gap-5 p-10 sm:px-5">
  <h1 className="text-6xl font-bold md:text-cdnter">Stories for the <span className="text-amber-600">Curious</span>.</h1>
  <p className="text-xl text-gray-700 md:text-center">Discover thoughtful writing on technology, design, and modern life. A space for ideas to breathe.</p>
</div>
      <main className="w-full bg-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    <h4 className="text-3xl font-bold text-gray-800 mb-10">Featured Blogs</h4>

    {data?.blogs.length === 0 ? (
      <p className="text-center text-gray-600 py-20 text-xl">No blogs found.</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data?.blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    )}

      <div className="flex items-center justify-center gap-6 mt-16">
        <Button
          disabled={!data?.hasPrevPage}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </Button>

        <span className="text-lg font-medium">
          {page} of {data?.totalPages}
        </span>

        <Button
          disabled={!data?.hasNextPage}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
  </div>
</main>    
    </div>
  );
};

export default Home;
