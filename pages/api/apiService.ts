import axios from 'axios';
import { NextRouter } from 'next/router';

/**
 * BackAPIリクエストを接続管理
 * */
//APIURL
const BackApiURL = "http://127.0.0.1:5000";
//ENDPOINTS
export const API_ENDPOINTS = {
    login: "login",
    display_by_store: "display_by_store",
    display_by_date: "display_by_date",
    download: "download",
} 

//APIリクエスト関数
export const fetchData = async (endpoint: string, data: any, router: NextRouter) => {
  try {
    console.log("BackApiURL: ", BackApiURL);
    console.log("endpoint: ", endpoint);
    console.log("data: ", data);
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
