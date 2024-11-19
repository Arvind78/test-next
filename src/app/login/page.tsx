"use client";
import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../assets/Header navigation.png";
import backgroundImage from "../../assets/Graphic Side.jpg";
import mailIcon from "../../assets/mail.png";
import lockIcon from "../../assets/lock.png";
import { signIn } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";

const LoginPage: FC = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      await axios.post("/api/send-otp", { email });
      setIsOtpSent(true);
      toast.success("OTP sent to your email!");
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
       console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("email-otp", {
        email,
        otp,
        redirect: false,
      });
      if (res?.error) {
        toast.error("Error: Invalid OTP. Please try again.");
      } else {
        toast.success("OTP validation successful");
      }
    } catch (error:any) {
      toast.error("An error occurred during OTP validation.");
      console.log(error);

    } finally {
      setLoading(false);
      router.push("/"); 

    }
  };

  return (
    <div className="flex h-screen custom-login-container">
      <div className="w-full md:w-[96%] lg:w-1/2 bg-white flex flex-col py-1 md:py-0 justify-between rounded-custom">
        <div>
          <Image src={logo} alt="Logo" />
        </div>

        <div className="flex justify-center flex-col gap-4 items-center">
          <form className="space-y-6 w-[92%] md:w-[88%] lg:w-[55%] loginForm" onSubmit={handleSubmit}>
            <h2 className="text-[34px] sm:text-[36px] font-[600] text-[#101828] leading-[25px] sm:leading-[20px]">Log in</h2>
            <p className="text-gray-600 font-[500] text-[16px] leading-[24px] lg:leading-[33px]">
              Welcome back! Please enter your details.
            </p>

            <div>
              <label htmlFor="email" className="block mb-[6px] text-[15px] font-[500]">Email</label>
              <div className="flex items-center border border-gray-300 rounded-[26px] p-3">
                <Image src={mailIcon} alt="Mail Icon" className="w-5 h-5 mr-2" />
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {isOtpSent && (
              <div>
                <label htmlFor="otp" className="block mb-[6px] text-[15px] font-[500]">OTP</label>
                <div className="flex items-center border border-gray-300 rounded-[26px] p-3">
                  <Image src={lockIcon} alt="Lock Icon" className="w-5 h-5 mr-2" />
                  <input
                    type="text"
                    id="otp"
                    placeholder="Enter your OTP"
                    className="w-full outline-none"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {!isOtpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full loginBtn text-white py-[14px] rounded-[30px] text-[16px] hover:bg-blue-700 cursor-pointer transition duration-200"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            ) : (
              <button
                type="submit"
                className="w-full loginBtn text-white py-[14px] rounded-[30px] text-[16px] hover:bg-blue-700 cursor-pointer transition duration-200"
              >
                {loading ? 'Verifying...' : 'Validate OTP'}
              </button>
            )}

         

            {/* <p className="text-center text-[#667085]">
             . Don’t have an account? <a href="#" className="text-[#0AB4D8] cursor-pointer font-[600]">Create account</a>
            </p> */}
          </form >
          <div className="flex justify-center  ">
               <GoogleSignInButton onClick={(e) =>{ 
                 e.stopPropagation() 
                 const id = signIn("google")
                 console.log(id)
                 router.replace("/")
              }}/>
            </div >
        </div >

        {/* Footer */}
        <div className="block lg:flex justify-between px-12 items-center pb-4 md:py-14">
          <div className="flex justify-center gap-5 mb-[6px] lg:mb-[0px] text-[15.5px] md:text-[16px] lg:text-[15px]">
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
          </div>
          <div className="font-[400] mt-2 md:mt-0 text-[14px] text-center cursor-pointer">
            <p>© 2024 <span className="text-[#0AB4D8] cursor-pointer">DeFa A Protocol by Invoicemate.</span></p>
          </div>
        </div>
      </div >

      <div className="hidden md:block w-1/2 relative">
        <Image src={backgroundImage} alt="Background" layout="fill" objectFit="cover" className="object-cover" />
      </div>
    </div >
  );
};

export default LoginPage;
