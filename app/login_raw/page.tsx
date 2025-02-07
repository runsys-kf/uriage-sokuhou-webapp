import Image from "next/image";
import Layout from "@/components/Layout";
import * as React from "react";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoginSideImage from "@/public/images/login-side-image.webp";
//import { mockLoginResponses } from "../__tests__/loginMockData";
const LoginPage = () => {
  return (
    <Layout title="売上速報 | メンテナンス中">
      <div className="flex flex-row-reverse min-h-screen items-stretch">
        <div className="hidden md:block md:w-2/5 md:h-auto bg-gray-800 justify-center">
          <Image
            src={LoginSideImage}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-3/5 flex flex-col items-center justify-center p-10">
          <div className="text-left">
            <h1 className="text-xl md:text-2xl mb-4 md:mb-6 font-bold">
              只今、メンテナンス中です。
            </h1>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
