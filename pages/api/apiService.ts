import axios from 'axios';
import { NextRouter } from 'next/router';

/**
 * BackAPIリクエストを接続管理
 * */
// APIURL
const BackApiURL = "https://loginapi-atgue5hbdugadzf2.z01.azurefd.net/api"
console.log("Backend URL in apiService.ts :", BackApiURL);

//ENDPOINTS
export const API_ENDPOINTS = {
    login: "login",
    display_by_store: "display_by_store",
    display_by_date: "display_by_date",
    download: "download",
    adimn_login: "admin_login",
} 

//APIリクエスト関数
export const fetchData = async (endpoint: string, data: any, router: NextRouter) => {
  try {

    let url = "";

    // ログイン認証
    if (endpoint === "login") {
        url = "https://loginapi-atgue5hbdugadzf2.z01.azurefd.net/api/login";
    }
    // 店舗別データ表示
    if (endpoint === "display_by_store") {
        url = "https://displaybystore-h8aagzbhegc6d7ch.z01.azurefd.net/api/display_by_store";
    }
    // 日別データ表示
    if (endpoint === "display_by_date") {
        url = "https://displaybystore-h8aagzbhegc6d7ch.z01.azurefd.net/api/display_by_store";
    }

    console.log("endpoint and url: ", endpoint);

    const response = await axios.post(url, data, {
      withCredentials: true
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);

    if (error.response && error.response.status === 401) {
      router.push('/login');
    }
    throw error;
  }
};
