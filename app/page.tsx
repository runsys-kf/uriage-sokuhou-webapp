"use client";
import Layout from "@/components/Layout";
import axios from "axios"; // これを追加
import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";
import nookies from "nookies";
import jwt from "jsonwebtoken";
const JWT_SECRET = "100"; // サーバー側と同じ秘密鍵

const Home = () => {
  const router = useRouter();
  	/* -----認証処理開始-----*/
	const hostUrl = process.env.NEXT_PUBLIC_HOST_URL;
	if (!hostUrl) {
		throw new Error("NEXT_PUBLIC_HOST_URL 環境変数が設定されていません");
	}

	// 認証チェック
	useEffect(() => {
		const isDevelopment = process.env.NODE_ENV === "development";
		if (isDevelopment) {
			// 開発環境では認証チェックをスキップ
			console.log("Development mode: Skipping authentication check");
			return;
		}

		const checkAuth = async () => {

			try {
				const cookies = nookies.get();
				const token = cookies['access_token'];

				if (!token) {
					// トークンがない場合、ログインページにリダイレクト
					router.replace('/login');
					return;
				}

				// トークンを検証
				const decoded = jwt.verify(token, JWT_SECRET);
				console.log("User is authenticated:", decoded);

				const response = await axios.get(hostUrl, {
					withCredentials: true
				});
				console.log("index.tsx res: ", response);
				// 認証成功
				console.log("User is authenticated:", response.data.user);
			} catch (error) {
				// 認証失敗時はログインページへリダイレクト
				console.error("Authentication check failed:", error);
				router.replace('/login'); // pushではなくreplaceを使用
			}
		};
		checkAuth();
	}, [router]);
	/* -----認証処理終了-----*/

  // ログアウト処理を修正
  const handleLogout = async () => {
    try {
      localStorage.removeItem("Authority");
      router.replace("/login"); // pushではなくreplaceを使用
    } catch (error) {
      console.error("Logout failed:", error);
      router.replace("/login");
    }
  };

  return (
    <Layout title="売上速報 | 売上速報&自空マップ">
      <div className="bg-gray-50 min-h-screen flex flex-col pb-20">
        <div className="flex justify-between items-center bg-white">
          <h1 className="text-lg font-bold tracking-tighter py-1 pl-4">

          </h1>
          <Button
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            variant="outlined"
            size="small"
            className="text-gray-600 border-gray-400 hover:bg-gray-100"
          >
            ログアウト
          </Button>
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white border rounded-lg p-10 max-w-md w-full flex flex-col items-center">
            <div className="text-xl mb-5">welcome</div>
            <Button
              className="bg-blue-500 hover:bg-blue-800 text-white w-full p-3 mb-5"
              onClick={() => router.push("/app1/")}>
              売上速報
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-800 text-white w-full p-3"
              onClick={() => router.push("/app2/")}>
              自空MAP
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;