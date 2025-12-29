import { api } from "../lib/axios";

export interface User{
  firstName?: string;
  lastName?: string;
  age?: number;
  address?: string;
  bio?: string;
  email: string;
  id: string;
}
interface LoginPayload {
  email: string;
  password: string;
}
export interface LoginResponse {
  user: {
    id: string;
    email: string;
  };
  accessToken: string;
  message?: string;
}

export const loginUser = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/auth/signin", payload);
  return res.data;
};

export const signupUser = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/auth/signup", payload);
  return res.data;
};

interface GetUserParams {
  userId: string;
}

export const getUser = async ({ userId}: GetUserParams) =>{
  const res = await api.get<User>(`/users/${userId}`, {
  })
  return res.data
}

interface EditUserPayload {
  payload: {firstName: string; lastName: string; age: number; address: string; bio: string; email: string};
  userId: string;
}
interface EditUserResponse {
  message: string;
  user: User;
}
export const edituser = async ({
  payload, userId
}: EditUserPayload): Promise<EditUserResponse>=>{
  const res = await api.put<EditUserResponse>(`/users/${userId}`, payload)
  return res.data
}