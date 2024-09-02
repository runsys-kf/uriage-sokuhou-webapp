import axios from 'axios';
import { NextRouter } from 'next/router';

/**
 * BackAPIリクエストを接続管理
 * */
// APIURL
// const BackApiURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
// const BackApiURL = "http://localhost:5000";
const BackApiURL = "http://127.0.0.1:5000";
// const BackApiURL = "http://backend:5000";
// const BackApiURL = "http://172.26.0.2:5000";
// const BackApiURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://backend:5000';
// const BackApiURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
// const BackApiURL = '/api';

//ENDPOINTS
export const API_ENDPOINTS = {
    login: "login",
    display_by_store: "display_by_store",
    display_by_date: "display_by_date",
    download: "download",
} 

//APIリクエスト関数
export const fetchData = async (endpoint: string, data: any, router: NextRouter) => {
  console.log(endpoint, data);
  try {
    // ここのリクエストが上手くわたっていない
    const response = await axios.post(`${BackApiURL}/${endpoint}`, data, {
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
