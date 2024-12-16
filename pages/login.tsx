import Image from "next/image";
import Layout from "@/components/Layout";
import * as React from "react";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/router";
import axios from 'axios';  // これを追加
//import { mockLoginResponses } from "../__tests__/loginMockData";
import LoginSideImage from "../public/images/login-side-image.webp";

import Cookies from 'js-cookie';

const LoginPage = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const router = useRouter();
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    // event.preventDefault();
  };

  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  // ログインボタン押下時の処理
  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage('ユーザー名またはパスワードを入力してください。');
      return;
    }
    try {
      let response;
      //if (process.env.NODE_ENV === 'development') { // 開発環境の場合はモックデータを使用
      if (false) {
        //response = mockLoginResponses[username] || mockLoginResponses.not200;
      } else {
        response = await axios.post('https://loginapi-atgue5hbdugadzf2.z01.azurefd.net/api/login',
          { username, password },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        // 店舗情報チェック
        console.log("response", response);
      }
      console.log("response.status: ", response.status)
      if (response.status === 200) {
        localStorage.setItem('Authority', JSON.stringify(response.data.Authority));
        const token = response.data.token;
        Cookies.set('access_token', token, { expires: 1, path: '/' });
        router.push('/'); // 成功時にリダイレクト
      } 
    } catch (error) {
      console.error("ログインに失敗しました:", error);
      // ステータスコードに応じたエラー処理
      if (error.response) {
        console.error('Response error: ', error.response);
        if (error.response.status === 401) {
          setErrorMessage('ログインに失敗しました。ユーザー名とパスワードを確認してください。');
        } else {
          setErrorMessage('サーバーでエラーが発生しました。もう一度お試しください。');
        }
      } else if (error.request) {
        console.error('No response received: ', error.request);
        setErrorMessage('ネットワークエラーが発生しました。通信環境を確認してください。');
      } else {
        console.error('Error message: ', error.message);
        setErrorMessage('予期しないエラーが発生しました。');
      }
      //// ネットワークエラーの場合
      //if (error.response) {
      //  console.error('Response error: ', error.response);
      //  setErrorMessage('サーバーでエラーが発生しました。もう一度お試しください。');
      //} else if (error.request) {
      //  console.error('No response received: ', error.request);
      //  setErrorMessage('ネットワークエラーが発生しました。通信環境を確認してください。');
      //} else {
      //  console.error('Error message: ', error.message);
      //  setErrorMessage('予期しないエラーが発生しました。');
      //}
    }
  };

  return (
    <Layout title="ログイン | 売上速報">
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
              売上速報アプリ
            </h1>
            {errorMessage && (
              <p className="text-red-600 mb-4">{errorMessage}</p> // エラーメッセージを表示
            )}
            <form action="">
              <div className="flex flex-col gap-2 md:gap-4 items-center">
                <TextField
                  id="outlined-search"
                  label="ID"
                  type="search"
                  sx={{ width: "288px" }}
                  value={username}
                  onChange={handleUsernameChange}
                />

                <FormControl sx={{ width: "288px" }} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    パスワード
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="パスワード表示非表示ボタン"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
                <Button
                  className="bg-accent hover:bg-accent-dark text-white transition-colors duration-200 w-full p-2 md:p-4"
                  variant="contained"
                  onClick={handleLogin}
                >
                  ログイン
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
