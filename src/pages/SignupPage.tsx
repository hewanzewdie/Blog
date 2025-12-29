import { useNavigate, Link } from "react-router-dom";
import { Label } from "@radix-ui/react-label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { signupUser } from "../api/auth";
import { PenTool } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const SignUpPage = () => {
  const navigate = useNavigate();
  const signupSchema = z.object({
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters")
  })
 type SignupFormData = z.infer<typeof signupSchema>;

 const {register, handleSubmit, formState: {errors},}=useForm<SignupFormData>({
  resolver: zodResolver(signupSchema)
 })

const mutation = useMutation({
  mutationFn: (credentials: SignupFormData)=> signupUser(credentials),
  onSuccess: ()=>{
    navigate('/login')
  },
  onError: ()=>{

  }
})

const onSubmit = (data: SignupFormData) => {
  mutation.mutate(data)
}

  return (
    <div className="py-10 flex flex-col items-center justify-center space-y-3 bg-[#FDFBF7]">
              <PenTool className="bg-amber-600 text-white p-2 w-10 h-10 rounded-lg"/>

      <h3 className="text-2xl font-bold">Create an account</h3>
      <p className="text-gray-700">Join our community of writers</p>

      <form
        className="bg-white p-6 rounded-xl border shadow-md w-full max-w-md"
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
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          placeholder="********"
          className="border p-2 my-2 w-full"
          {...register('password')}
          required
        />
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        <Button
          type="submit"
          disabled={mutation.isPending}
          className={`bg-amber-600 hover:bg-amber-700 text-white m-2 p-2 w-full rounded `}        >
          {mutation.isPending ?  'Signing up...' :'Sign Up'}
        </Button>
            <p className="text-center">Already have an account? <Link to='/login' className="text-amber-600 hover:underline ">Login</Link></p>
      </form>
    </div>
  );
};

export default SignUpPage;