import { useNavigate, useParams } from "react-router-dom";
import { edituser, getUser } from "../api/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Input } from "../components/ui/input";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { PencilIcon } from "lucide-react";
import { queryClient } from "../main";
import { Label } from "@radix-ui/react-label";
import { Skeleton } from "../components/ui/skeleton";
import { Textarea } from "../components/ui/textarea";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const profileschema = z.object({
  firstName: z.string().min(3, "Name  must be more than 3 characters"),
  lastName: z.string().min(3, "Name  must be more than 3 characters"),
    email: z.email(),
    age: z.number(),
    bio: z.string(),
    address: z.string()
})

type ProfileFormData = z.infer<typeof profileschema>

const Profile = () => {

 const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
  resolver: zodResolver(profileschema),
  defaultValues: {
    firstName: "",
    lastName: "",
    email: "",
    age: 0,
    bio: "",
    address: "",
  }
});
   
const onSubmit = (formData: ProfileFormData) => {
  if(!userId) return;
  updateUser.mutate({
    payload: formData,
    userId,
  });
};

const { id: userId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryFn: () => getUser({ userId: userId! }),
    queryKey: ["user", userId],
  });

  const updateUser = useMutation({
    mutationFn: edituser,
    onSuccess: () => {
      navigate(`/profile/${userId}`);
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (data) {
      reset({
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
        email: data.email ?? "",
        age: data.age ?? 0,
        bio: data.bio ?? "",
        address: data.address ?? "",
      });
    }
  }, [data, reset]);

  if (isLoading) {
    return (
      <div className="w-full p-10">
        <Skeleton className="w-40 h-10 bg-gray-200 mb-3" />

          <Skeleton className="mx-auto md:w-[60%] w-[90%] h-100 bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] w-full min-h-screen flex flex-col items-center justify-center py-10">
      <h2 className="text-3xl font-bold self-start text-gray-700 ml-10">Profile</h2>
        <div className="md:w-[60%] w-[90%] flex flex-col bg-white shadow-xl rounded-2xl my-10 pb-10 overflow-hidden">
          <div className="bg-amber-600 h-32 relative">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg">
                <div className="h-full w-full rounded-full bg-amber-100 flex items-center justify-center text-3xl font-bold text-amber-700">
                  {data?.firstName ? data.firstName.charAt(0) : ''}
                  {data?.lastName ? data.lastName.charAt(0) : ''}
                </div>
              </div>
            </div>
          </div>
        <div className="pt-20 p-3 gap-3">
          {!isEditing && (
            <div>
          <h4 className="text-center text-2xl font-bold">
            {data?.firstName} {data?.lastName}
          </h4>
          <p className="text-lg text-gray-600 text-center">{data?.email}</p>
        </div>)}

        </div>
        {!isEditing ? (
          <div className="flex flex-col">
            <div className="space-y-4 p-10 border-b mb-5">
              {data?.firstName && (
                <div className="flex items-start gap-3">
                  <span className="text-sm font-medium text-gray-500 w-24">
                    First Name:
                  </span>
                  <span className="text-gray-900 break-all">{data.firstName}</span>
                </div>
              )}
              {data?.lastName && (
                <div className="flex items-start gap-3">
                  <span className="text-sm font-medium text-gray-500 w-24">
                    Last Name:
                  </span>
                  <span className="text-gray-900 break-all">{data.lastName}</span>
                </div>
              )}
              {data?.email && (
                <div className="flex items-start gap-3">
                  <span className="text-sm font-medium text-gray-500 w-24">
                    Email:
                  </span>
                  <span className="text-gray-900 break-all">{data.email}</span>
                </div>
              )}
              {data?.age && (
                <div className="flex items-start gap-3">
                  <span className="text-sm font-medium text-gray-500 w-24">
                    Age:
                  </span>
                  <span className="text-gray-900 break-all">{data.age}</span>
                </div>
              )}

              {data?.address && (
                <div className="flex items-start gap-3">
                  <span className="text-sm font-medium text-gray-500 w-24">
                    Location:
                  </span>
                  <span className="text-gray-900 break-all">{data.address}</span>
                </div>
              )}
              {data?.bio && (
                <div className="flex items-start gap-3">
                  <span className="text-sm font-medium text-gray-500 w-24 ">
                    Bio:
                  </span>
                  <span className="text-gray-900 break-all">{data.bio}</span>
                </div>
              )}
            </div>
            <Button
              onClick={() => setIsEditing(true)}
              className="w-fit mx-auto"
              variant="outline"
            >
              <PencilIcon /> Edit Profile
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="md:px-10 px-5 space-y-5" noValidate>
            <div className="w-full flex sm:flex-row flex-col justify-between gap-3">
              <div className="md:w-1/2 flex flex-col space-y-2">
                 <Label htmlFor="firstName" className="block text-sm text-gray-700">First Name</Label>
                <Input
                id="firstName"
                   className="border-gray-200 bg-gray-50 mt-1"
                  {...register('firstName')}
                 />
                 {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
              </div>
              <div className="md:w-1/2 flex flex-col space-y-2">
                <Label htmlFor="lastName" className="block text-sm text-gray-700">Last Name</Label>
                 <Input
                 id="lastName"
                   className="border-gray-200 bg-gray-50 mt-1"
                   type="text"
                  {...register('lastName')}
                 />
                 {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email" className="block text-sm text-gray-700">Email</Label>
                 <Input
                 id="email"
                   className="border-gray-200 bg-gray-50 mt-1"
                   type="text"
                   {...register('email')}
                 />
                 {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="age" className="block text-sm text-gray-700">Age</Label>
                 <Input
                 id="age"
                   className="border-gray-200 bg-gray-50 mt-1"
                    {...register("age", { valueAsNumber: true })}
                 />
                 {errors.age && <p className="text-sm text-red-600">{errors.age.message}</p>}
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="address" className="block text-sm text-gray-700">Address</Label>
                 <Input
                 id="address"
                   className="border-gray-200 bg-gray-50 mt-1"
                  {...register('address')}
                 />
                 {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="bio" className="block text-sm text-gray-700">Bio</Label>
                 <Textarea
                 id="bio"
                   className="border-gray-200 bg-gray-50 mt-1"
                  {...register('bio')}
                 />
                 {errors.bio && <p className="text-sm text-red-600">{errors.bio.message}</p>}
            </div>
            <div className="flex gap-5">
              <Button onClick={() => setIsEditing(false)} variant="outline">Cancel</Button>
              <Button type="submit"
                   disabled={updateUser.isPending}
                   className="bg-amber-600 hover:bg-amber-700 text-white">{updateUser.isPending ? 'Saving...' : 'Save'}</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
