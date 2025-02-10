import type React from "react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  interests: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one interest"),
}) as yup.ObjectSchema<FormData>;

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  interests: string[];
}

interface SubscriptionFormProps {
  onSuccess: () => void;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      interests: [],
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    try {
      await addDoc(collection(db, "subscribers"), {
        ...data,
        timestamp: new Date(),
      });
      reset();
      onSuccess();
    } catch (error) {
      console.error("Error adding subscriber: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <input
            {...register("firstName")}
            type="text"
            placeholder="First Name"
            className="w-full sm:w-2/3 p-2 pl-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0]"
          />
          {errors.firstName && (
            <p className="mt-1 text-red-800 italic text-sm">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div>
          <input
            {...register("lastName")}
            type="text"
            placeholder="Last Name"
            className="w-full sm:w-2/3 p-2 pl-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0]"
          />
          {errors.lastName && (
            <p className="mt-1 text-red-800 italic text-sm">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          className="w-full sm:w-2/3 p-2 pl-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0]"
        />
        {errors.email && (
          <p className="mt-1 text-red-800 italic text-sm">
            {errors.email.message}
          </p>
        )}
      </div>
      <div>
        <p className="mb-2 text-[#f8f7f2] flex flex-col text-lg font-medium ">
          Interests:
        </p>
        <div className="space-y-2">
          {["skincare", "haircare"].map((interest) => (
            <label
              key={interest}
              className="flex justify-center items-center space-x-2 cursor-pointer lg:text-lg"
            >
              <input
                type="checkbox"
                value={interest}
                {...register("interests")}
                className="form-checkbox accent-[#d79f63] dark:accent-[#b58552]"
              />
              <span className="text-[#f8f7f2] capitalize ">{interest}</span>
            </label>
          ))}
        </div>
        {errors.interests && (
          <p className="mt-1 text-red-800 italic text-sm">
            {errors.interests.message}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-2/3 inline-flex items-center justify-center px-6 py-3 bg-[#4b774a] dark:bg-[#6a9e69] text-[#e0e0e0] dark:text-[#1a1a1a] rounded-full hover:bg-opacity-80 transition duration-300 disabled:opacity-50 "
      >
        {isLoading ? "Subscribing..." : "Subscribe"}
      </button>
    </form>
  );
};

export default SubscriptionForm;
