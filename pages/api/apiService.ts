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
  logout: "logout",
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
          throw new Error('認証エラーが発生しました');
        case 404:
          throw new Error('データが見つかりません');
        case 500:
          throw new Error('サーバーエラーが発生しました');
        default:
          throw new Error('データの取得に失敗しました');
      }
    }

    throw new Error('予期せぬエラーが発生しました');
  }
};
