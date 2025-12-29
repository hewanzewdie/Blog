import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginUser, type LoginResponse } from "../api/auth";
import { useAuthStore } from "../store/AuthStore";
import { Label } from "@radix-ui/react-label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { PenTool } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const LoginPage = () => {

  const loginSchema = z.object({
  email: z.email(),
  password: z.string()
})

type LoginFormData = z.infer<typeof loginSchema>;

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const {register, handleSubmit, formState: {errors},}= useForm<LoginFormData>({
  resolver: zodResolver(loginSchema)
})

  const mutation = useMutation({
    mutationFn: (credentials: LoginFormData) => loginUser(credentials),
    onSuccess: (data: LoginResponse) => {
      login(data.user, data.accessToken);
      navigate("/my-blogs");
    },
  });

const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data)
}

  return (
    <div className="py-10 flex flex-col items-center justify-center space-y-3 bg-[#FDFBF7]">
      <PenTool className="bg-amber-600 text-white p-2 w-10 h-10 rounded-lg"/>
      <h3 className="text-2xl font-bold">Welcome back</h3>
      <p className="text-gray-700">Sign in to continue your journey</p>
      <form
        className="bg-white p-6 shadow-md w-full max-w-md rounded-xl border"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <p className="text-red-600">{mutation.error?.message}</p>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          placeholder="your@email.com"
          className="border p-2 my-2 w-full"
          {...register('email')}
          required
        />
        {errors.email && (
          <p className="text-sm text-red-700">{errors.email.message}</p>
        )}
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          placeholder="********"
          className="border p-2 my-2 w-full"
          {...register('password')}
          required
        />
        {errors.password && (
          <p className="text-sm text-red-700">{errors.password.message}</p>
        )}
        <Button
          type="submit"
          disabled={mutation.isPending}
          className={`bg-amber-600 hover:bg-amber-700 text-white p-2 m-2 w-full rounded ${
            mutation.isPending ? "bg-gray-300" : ""
          }`}
        >
          {mutation.isPending ? "Logging in..." : "Login"}
        </Button>
        <p className="text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-amber-600 hover:underline ">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
