import axios from 'axios';
import { NextRouter } from 'next/router';

/**
 * BackAPIリクエストを接続管理
 * */
// APIURL
const BackApiURL = "https://loginapi-atgue5hbdugadzf2.z01.azurefd.net/api";

//ENDPOINTS
export const API_ENDPOINTS = {
  login: "login",
  display_by_store: "display_by_store",
  display_by_date: "display_by_date",
  download: "download",
  adimn_login: "admin_login",
  logout: "logout",
}

//APIリクエスト関数
export const fetchData = async (endpoint: string, data: any, router: NextRouter) => {
  const token = localStorage.getItem('access_token');
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
    // if (endpoint === "display_by_date") {
    //     url = "https://displaybystore-h8aagzbhegc6d7ch.z01.azurefd.net/api/display_by_store";
    // }
    // 日別データ表示
    if (endpoint === "admin/admin_login") {
        url = "https://adminlogin-hxcxe2dxcchehvh3.z01.azurefd.net/api/admin/admin_login";
    }


    if(endpoint === "logout"){
      url = "";
    }

    const response = await axios.post(url, data, {
            headers:{
          	  'Authorization': `Bearer ${token}`,
          	  'Content-Type': 'application/json'
            }
    });

    return response.data;
  } catch (error) {
    // 開発環境でのみ詳細なエラーログを表示
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching data:', error);
    }

    // ネットワークエラーの場合
    if (error.message === 'Network Error') {
      throw new Error('サーバーに接続できません。ネットワーク接続を確認してください。');
    }

    // その他のエラー
    if (error.response) {
      switch (error.response.status) {
        case 401:
          router.push('/login');
          throw new Error('401 : 認証エラーが発生しました');
        case 404:
          throw new Error('404 : データが見つかりません');
        case 500:
          throw new Error('500 : サーバーエラーが発生しました');
        default:
          throw new Error('データの取得に失敗しました');
      }
    }

    throw new Error('予期せぬエラーが発生しました');
  }
};
