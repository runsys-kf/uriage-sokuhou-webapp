import axios from 'axios';
import { NextRouter } from 'next/router';

/**
 * BackAPIリクエストを接続管理
 * */

//ENDPOINTS
export const API_ENDPOINTS = {
  login: "login",//メイン画面ログイン
  display_by_store: "display_by_store",//店舗別
  display_by_date: "display_by_date",//日別
  download: "download",//ダウンロード
  adimn_login: "admin_login",//管理画面ログイン
  new_shop_addition: "new_shop_addition",//新規店舗追加
  store_edit: "store_edit",//店舗編集
  store_deletiet: "store_deletiet",//店舗削除
  getStoreList: "getStoreList",
}

//APIリクエスト関数
export const fetchData = async (endpoint: string, data: any, router: NextRouter) => {
  const token = localStorage.getItem('access_token');
  try {

    let url = "";

    // 店舗別データ表示
    if (endpoint === "display_by_store") {
      url = "https://displaybystore-h8aagzbhegc6d7ch.z01.azurefd.net/api/display_by_store";
    }
    // 日別データ表示
    if (endpoint === "display_by_date") {
      url = "https://displaybystore-h8aagzbhegc6d7ch.z01.azurefd.net/api/display_by_date";
    }
    //ダウンロード
    if (endpoint === "download") {
      url = "https://download-hzd8f3fbe0d3h9g0.z01.azurefd.net/api/download";
    }
    //店舗情報取得
    if (endpoint === "getStoreList") {
      url = "http://localhost:3000/api/getStoreList";
    }

    // URLが空の場合はエラーをスロー
    if (!url) {
      throw new Error('有効なエンドポイントが指定されていません');
    }

    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(response);
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
          //router.push('/login');
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