import { api } from "../lib/axios";

export interface Blog {
  _id: string;
  title: string;
  content: string;
  category:string;
  author: {
    _id: string;
    email: string;
    firstName?: string;
  };
  createdAt: string;
  likes: string[];
}

export interface GetAllBlogsResponse {
  blogs: Blog[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
interface GetAllBlogsParams {
  page: number;
  limit: number;
}

export const getAllBlogs = async ({ page, limit }: GetAllBlogsParams) => {
  const res = await api.get<GetAllBlogsResponse>(`/blogs`, {
    params: { page, limit },
  });
  return res.data;
};

export const getMyBlogs = async (token: string) => {
  const res = await api.get<Blog[]>(`/blogs/my-blogs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

interface GetBlogByIdParams {
  blogId: string;
}
export const getBlogById = async ({ blogId} : GetBlogByIdParams) => {
  const res = await api.get<Blog>(`/blogs/${blogId}`, {  
  })
    return res.data;
}
interface GetBlogByCategoryParams {
  category: string;
  blogId: string;
  limit: number;
}

export const getBlogByCategory = async ({
  category,
  blogId,
  limit,
}: GetBlogByCategoryParams) => {
  const res = await api.get("/blogs", {
    params: {
      category,
      blogId,
      limit
    },
  });

  return res.data.blogs.filter((blog: Blog)=>{
    return blog.category === category && blog._id != blogId
  });
};


interface CreateBlogPayload {
  payload: { title: string; content: string; category: string; };
  token: string;
}
interface CreateBlogResponse {
  message: string;
  blog: Blog;
}
export const createBlog = async ({
  payload,
  token,
}: CreateBlogPayload): Promise<CreateBlogResponse> => {
  const res = await api.post<CreateBlogResponse>("/blogs", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

interface DeleteBlogParams {
  blogId: string;
  token: string;
}
export const deleteBlog = async({token, blogId}: DeleteBlogParams) => {
const res = await api.delete<Blog>(`/blogs/${blogId}`,{
  headers: {
      Authorization: `Bearer ${token}`,
    },
})
return res.data
}

interface LikeBlogPayload {
  blogId: string;
  token: string;
  hasLiked: boolean;
}
interface LikeBlogResponse {
  message: string;
  blog: Blog;
}
export const toggleLike = async ({
  blogId,
  token,
  hasLiked,
}: LikeBlogPayload): Promise<LikeBlogResponse> => {
  const endpoint = hasLiked
    ? `/blogs/${blogId}/unlike`
    : `/blogs/${blogId}/like`;

  const res = await api.post<LikeBlogResponse>(endpoint, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
