import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import { toast, Toaster} from "sonner";

type FormData = {
  name: string;
  email: string;
  message: string;
};

const Contact: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const formRef = useRef<HTMLFormElement>(null);

  const sendEmail = async () => {
    if (!formRef.current) return;

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_PUBLIC_KEY
      );

      toast.success("Thank you for reaching us, Message sent successfully!");
      reset(); 
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Error sending message. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 sm:px-8 lg:px-[3rem] xl:px-[5rem] pb-16 lg:pb-24 lg:pt-16 pt-20 min-h-screen"
    >
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#48392e] dark:text-[#e0e0e0] mb-8 text-center">
        Contact Us
      </h1>

      <div className="max-w-2xl sm:w-lg mx-auto">
        <form
          ref={formRef}
          onSubmit={handleSubmit(sendEmail)}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="name"
              className="block font-medium text-[#48392e] dark:text-[#e0e0e0]"
            >
              Name
            </label>
            <input
              {...register("name", { required: true })}
              type="text"
              id="name"
              placeholder="e.g Tiana Nelson"
              className="w-full mt-1 p-2 pl-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] outline-0 placeholder:opacity-70 dark:placeholder:opacity-50 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block font-medium text-[#48392e] dark:text-[#e0e0e0]"
            >
              Email
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              id="email"
              placeholder="e.g tiananelson@xmail.com"
              className="w-full mt-1 p-2 pl-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] outline-0 placeholder:opacity-70 dark:placeholder:opacity-50 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block font-medium text-[#48392e] dark:text-[#e0e0e0]"
            >
              Message
            </label>
            <textarea
              {...register("message", { required: true })}
              id="message"
              rows={4}
              placeholder="We always like to hear from you, kindly be as expressive as you can. Thanks for keeping us informed."
              className="w-full mt-1 p-2 pl-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-[#48392e] dark:text-[#e0e0e0] outline-0 placeholder:opacity-70 dark:placeholder:opacity-50 placeholder:text-slate-400"
            ></textarea>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-[#4b774a] dark:bg-[#6a9e69] dark:text-[#1a1a1a] text-white text-lg py-2 px-4 rounded-md hover:bg-[#3a6639] transition duration-300 cursor-pointer"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>

      <Toaster position="top-right" richColors />
    </motion.div>
  );
};

export default Contact;
