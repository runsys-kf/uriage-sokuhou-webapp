import Layout from "@/components/Layout";
import axios from "axios";  // これを追加

import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import LogoutIcon from "@mui/icons-material/Logout";
import FormControlLabel from "@mui/material/FormControlLabel";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useTheme } from "@mui/material/styles";
import Holidays from "date-holidays";
import { fetchData, API_ENDPOINTS } from "./api/apiService";
import { storeProcessData, dateProcessData } from "./api/dataTransformer";
import { initialStores } from "../data/shopData";
//import { mockStoreResponse, mockDateResponse } from "__tests__/salesMockData";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ja";
// add 20240828
import { useRouter } from "next/router";
import { GetServerSideProps } from 'next';
// add 20241117 16:23
import nookies from 'nookies';
import jwt from 'jsonwebtoken';

const JWT_SECRET = '100'; // サーバー側と同じ秘密鍵

export const getServerSideProps: GetServerSideProps = async (context) => {

    const cookies = nookies.get(context);
    const token = cookies['access_token'];

    if (!token) {
        // トークンがない場合、ログインページにリダイレクト
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    try {
        // トークンを検証
        const decoded = jwt.verify(token, JWT_SECRET);

        // 認証成功
        return {
            props: {
                user: decoded,
            },
        };
    } catch (error) {
        console.error('Token verification failed:', error.message);
        // 認証失敗、ログインページにリダイレクト
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }
};

const dayjsAdapter = new AdapterDayjs({ locale: "ja" });

const IndexPage = () => {
  //Muiのtheme設定を読み込む
  const theme = useTheme();
  const router = useRouter();

  // 認証チェック
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("index.tsx res:");
        const response = await axios.get("https://salesrepo.runsystem.co.jp/", {
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

  // カレンダー用状態 前日を選択させる処理含む
  const [date1, setDate1] = useState(dayjs());
  const [date2, setDate2] = useState(dayjs());
  const [date3, setDate3] = useState(
    dayjs().subtract(1, "day").subtract(1, "year")
  );
  const [date4, setDate4] = useState(
    dayjs().subtract(1, "day").subtract(1, "year")
  );

  // モーダル用状態
  const [openStoreModal, setOpenStoreModal] = useState(false);
  const [openPrefectureModal, setOpenPrefectureModal] = useState(false);

  const [selectedStores, setSelectedStores] = useState([]); //選択した店舗名
  //const [selectedArea, setSelectedArea] = useState("");
  const [selectedPrefecture, setSelectedPrefecture] = useState<string[]>([]); //選択した都道府県名

  const [searchText, setSearchText] = useState(""); //店舗名でフィルタリング時の入力値
  const [filteredStores, setFilteredStores] = useState(initialStores); // 入力値によるフィルタリング店舗(初期値は全店)
  //const [selectedPrefectureStores, setSelectedPrefectureStores] = useState([]); // 都道府県選択によるフィルタリング店舗

  // チェックボックス用状態
  const [dailyCheck, setDailyCheck] = useState("店舗別"); //日別or店舗別
  const [compareCheck, setCompareCheck] = useState(false); //比較対象チェックボックスの状態

  //ラジオボタン用状態
  const [locationValue, setLocationValue] = useState("全て"); //"全て or 駅前 or 郊外"
  const [typeValue, setTypeValue] = useState("全て"); //"全て or 直営 or FC"
  const [salesInclusionValue, setSalesInclusionValue] = useState("true"); //その他売り上げ込みかどうか
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //型指定
  interface TotalData {
    storeName: string;
    storeNumber: string;
    netSalesA: string;
    netSalesB: string;
    netSalesChange: string;
    netSalesRatio: string;
    usersA: string;
    usersB: string;
    usersChange: string;
    usersRatio: string;
    avgPriceA: string;
    avgPriceB: string;
    avgPriceChange: string;
    avgPriceRatio: string;
    newUsersA: string;
    newUsersB: string;
    newUsersChange: string;
    newUsersRatio: string;
    newUsersRateA: string;
    newUsersRateB: string;
    otherSalesA: string;
    otherSalesB: string;
    otherSalesChange: string;
    otherSalesRatio: string;
  }
  interface StoreData {
    storeName: string;
    storeNumber: string;
    netSalesA: string;
    netSalesB: string;
    netSalesChange: string;
    netSalesRatio: string;
    usersA: string;
    usersB: string;
    usersChange: string;
    usersRatio: string;
    avgPriceA: string;
    avgPriceB: string;
    avgPriceChange: string;
    avgPriceRatio: string;
    newUsersA: string;
    newUsersB: string;
    newUsersChange: string;
    newUsersRatio: string;
    newUsersRateA: string;
    newUsersRateB: string;
    otherSalesA: string;
    otherSalesB: string;
    otherSalesChange: string;
    otherSalesRatio: string;
  }
  interface StoresData {
    totalData: TotalData;
    storeData: StoreData[];
  }

  const [storesData, setStoresData] = useState<StoresData>({
    totalData: {
      storeName: "合計",
      storeNumber: "",
      netSalesA: "",
      netSalesB: "",
      netSalesChange: "",
      netSalesRatio: "",
      usersA: "",
      usersB: "",
      usersChange: "",
      usersRatio: "",
      avgPriceA: "",
      avgPriceB: "",
      avgPriceChange: "",
      avgPriceRatio: "",
      newUsersA: "",
      newUsersB: "",
      newUsersChange: "",
      newUsersRatio: "",
      newUsersRateA: "",
      newUsersRateB: "",
      otherSalesA: "",
      otherSalesB: "",
      otherSalesChange: "",
      otherSalesRatio: "",
    },
    storeData: [],
  });

  //昇順、降順 現在の状況
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  //ソート列　現在ソートしている列
  const [sortKey, setSortKey] = useState<string>("storeName");

  // 店舗選択モーダルの開閉を制御
  const handleOpenStoreModal = () => setOpenStoreModal(true);
  const handleCloseStoreModal = () => setOpenStoreModal(false);

  // 都道府県選択モーダルの開閉を制御
  const handleOpenPrefectureModal = () => setOpenPrefectureModal(true);
  const handleClosePrefectureModal = () => {
    setOpenPrefectureModal(false);
    setSelectedPrefecture([]); // 都道府県の選択をクリア
  };

  //全選択/全解除
  const toggleAllStores = () => {
    if (selectedStores.length > 0) {
      // 1つでも選択されている場合は全解除
      setSelectedStores([]);
    } else {
      // 何も選択されていない場合は全選択
      setSelectedStores(initialStores);
    }
  };

  //店舗検索入力値の管理ハンドラ
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // エンターキー押下時のハンドラを修正
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSelectOpen();
      // MouseEventを使用してクリックイベントを生成
      setTimeout(() => {
        const selectElement = document.querySelector(".MuiSelect-select");
        if (selectElement) {
          const mouseEvent = new MouseEvent("mousedown", {
            bubbles: true,
            cancelable: true,
            view: window,
          });
          selectElement.dispatchEvent(mouseEvent);
        }
      }, 100);
    }
  };

  //入力値からフィルタリング
  const handleSelectOpen = () => {
    //let filtered = radioValueFilterStores();//ラジオボタンフィルタリング
    let filtered = initialStores;
    if (searchText) {
      filtered = filtered.filter((store) =>
        store.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredStores(filtered);
      const newSelectedStores = Array.from(
        new Set([...selectedStores, ...filtered])
      );
      setSelectedStores(newSelectedStores);
    } else {
      setFilteredStores(filtered); // 未入力の場合は全データを表示
      setSelectedStores(filtered);
    }
  };

  // 選択都道府県セットハンドラ
  const setPrefectureChange = (event) => {
    const {
      target: { value },
    } = event;
    // 文字列か配列かを処理して、必ず配列として扱う
    const selectedValues = typeof value === "string" ? [value] : value;
    setSelectedPrefecture(selectedValues);
  };
  // 都道府県選択からのフィルタリング
  const handlePrefectureChange = () => {
    //let filtered = radioValueFilterStores();//ラジオボタンフィルタリング
    let filtered = initialStores;
    if (selectedPrefecture.length > 0) {
      filtered = filtered.filter((store) =>
        selectedPrefecture.includes(store.prefecture)
      );
      setFilteredStores(filtered);
      const newSelectedStores = Array.from(
        new Set([...selectedStores, ...filtered])
      );
      setSelectedStores(newSelectedStores);
    } else {
      setFilteredStores(filtered); // 未入力の場合は全データを表示
      setSelectedStores(filtered);
      //setSelectedStores([]); // 選択都道府県がない場合は選択を解除
    }
  };

  //店舗名チェックボックスがチェックされたら発動するハンドラ
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    const selectedStoreIds =
      typeof value === "string" ? value.split(",") : value;

    const newSelectedStores = initialStores.filter((store) =>
      selectedStoreIds.includes(store.id)
    );

    setSelectedStores(newSelectedStores);
  };
  // areas オブジェクトを初期化する関数
  const generateAreasFromStores = (stores) => {
    const areas = {};

    stores.forEach((store) => {
      const { areaDivision, prefecture } = store;

      // エリアが存在しない場合、新しい配列を作成
      if (!areas[areaDivision]) {
        areas[areaDivision] = [];
      }

      // 都道府県がエリアに追加されていない場合、追加
      if (!areas[areaDivision].includes(prefecture)) {
        areas[areaDivision].push(prefecture);
      }
    });

    return areas;
  };
  // 都道府県のリストを抽出する関数
  const extractPrefecturesFromAreas = (areas) => {
    const prefectures = [];

    // 各エリアの都道府県を取得してリストに追加
    Object.keys(areas).forEach((areaDivision) => {
      areas[areaDivision].forEach((prefecture) => {
        if (!prefectures.includes(prefecture)) {
          prefectures.push(prefecture);
        }
      });
    });

    return prefectures;
  };
  // 都道府県とエリア
  const areas = generateAreasFromStores(initialStores);
  // 都道府県のリストを取得
  const prefectures = extractPrefecturesFromAreas(areas);

  //祝日取得オブジェクト作成
  const hd = new Holidays("JP");
  //祝日データ取得
  const holidays = hd.getHolidays(new Date().getFullYear());
  // 祝日リスト（祝日取得のライブラリ ）
  const japaneseHolidays = holidays.reduce((acc, holiday) => {
    const date = new Date(holiday.date);
    const dateKey = dayjs(date).startOf("day").format("YYYY-MM-DD"); // 時間部分を取り除く
    if (holiday.type === "public") {
      acc[dateKey] = holiday.name;
    }
    return acc;
  }, {});
  // 祝日かどうかを判定する関数
  const isHoliday = (day: Dayjs): boolean => {
    const formattedDate = day.format("YYYY-MM-DD");
    return Object.hasOwnProperty.call(japaneseHolidays, formattedDate);
  };

  //チェックボックス変換ハンドラ
  const handleDailyCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDailyCheck(e.target.checked ? "日別" : "店舗別");
  };

  //駅前、郊外変更ハンドラ
  const handleLocationChange = (event) => {
    setLocationValue(event.target.value);
  };
  //直営、FC変更ハンドラ
  const handleTypeChange = (event) => {
    setTypeValue(event.target.value);
  };
  const handleSalesInclusionChange = (event) => {
    setSalesInclusionValue(event.target.value);
  };
  useEffect(() => {
    if (compareCheck) {
      setDate3(date1.subtract(1, "year"));
      setDate4(date2.subtract(1, "year"));
    }
  }, [compareCheck]);

  //昇降順セット、ソート列のキー名をセット
  const handleSort = (key: string) => {
    setSortDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc"
    );
    setSortKey(key);
  };

// ソート処理
const sortedStoresData = [...storesData.storeData].sort((a, b) => {
  // 空文字列の処理
  if (a[sortKey] === "" && b[sortKey] === "") return 0;
  if (a[sortKey] === "") return sortDirection === "asc" ? -1 : 1;
  if (b[sortKey] === "") return sortDirection === "asc" ? 1 : -1;

  // パーセント記号と区切りカンマを除去して数値に変換
  const cleanValue = (val: string) => {
    return String(val)
      .replace(/[,％%]/g, '') // カンマとパーセント記号（全角・半角）を除去
      .trim();
  };

  const valueA = Number(cleanValue(a[sortKey]));
  const valueB = Number(cleanValue(b[sortKey]));

  // 数値として有効な場合は数値比較
  if (!isNaN(valueA) && !isNaN(valueB)) {
    return sortDirection === "asc" 
      ? valueA - valueB 
      : valueB - valueA;
  }

  // 数値変換できない場合は文字列として比較
  return sortDirection === "asc"
    ? String(a[sortKey]).localeCompare(String(b[sortKey]))
    : String(b[sortKey]).localeCompare(String(a[sortKey]));
});

  ///***<送信時データ変換処理>***///
  const createRequestData = (endpoint) => {
    let startDate3 = "";
    let endDate4 = "";
    if (compareCheck) {
      // 比較対象がある場合
      startDate3 = date3.format("YYYY-MM-DD");
      endDate4 = date4.format("YYYY-MM-DD");
    }
    return {
      displayType: dailyCheck, //  '日別' または '店舗別'

      range: {
        start: date1.format("YYYY-MM-DD"),
        end: date2.format("YYYY-MM-DD"),
      },
      comparisonRange: {
        start: startDate3,
        end: endDate4,
      },
      storeSelection: {
        selectedStore: selectedStores.map((store) => store.id).join(", "), // 店舗IDをカンマ区切りで連結
        prefecture: selectedStores.map((store) => store.prefecture).join(", "), // 選択された店舗の都道府県をカンマ区切りで連結
      },
      otherConditions: {
        storeLocation: locationValue, // 例: '全て', '駅前', '郊外'
        businessType: typeValue, // 例: '全て', '直営', 'FC'
      },
      includeSales: salesInclusionValue, // 'true' または 'false'
    };
  };
  // 初期化処理
  const initialStoresData: StoresData = {
    totalData: {
      storeName: "合計",
      storeNumber: "",
      netSalesA: "",
      netSalesB: "",
      netSalesChange: "",
      netSalesRatio: "",
      usersA: "",
      usersB: "",
      usersChange: "",
      usersRatio: "",
      avgPriceA: "",
      avgPriceB: "",
      avgPriceChange: "",
      avgPriceRatio: "",
      newUsersA: "",
      newUsersB: "",
      newUsersChange: "",
      newUsersRatio: "",
      newUsersRateA: "",
      newUsersRateB: "",
      otherSalesA: "",
      otherSalesB: "",
      otherSalesChange: "",
      otherSalesRatio: "",
    },
    storeData: [],
  };
  //バックエンドAPIにデータ送信、受信
  // add 20240828
  const fetchAndTransformData = async (endpoint) => {
    if (selectedStores.length === 0) {
      setErrorMessage("対象店舗が選択されていません");
      setOpenErrorModal(true);
      return;
    }
    try {
      setStoresData(initialStoresData); //初期化処理
      setSortKey("");
      setSortDirection("desc");
      /**テスト環境用　if (isTestMode) にするとモックデータを参照する*/
      // const isTestMode = process.env.NODE_ENV === "development"; //テスト環境か本番化フラグ
      // if (isTestMode) {
      //   if (dailyCheck === "日別") {
      //     //setStoresData(mockDateResponse());
      //   } else {
      //     setStoresData(mockStoreResponse());
      //   }
      //   return;
      // }

      /**本番環境用 */
      let params;
      console.log("API_ENDPOINT: ", API_ENDPOINTS);
      console.log("endpoint: ", endpoint);

      if (endpoint === API_ENDPOINTS.display_by_store) {
        //店舗別
        params = createRequestData(endpoint);
        const data = await fetchData(endpoint, params, router);
        setStoresData(storeProcessData(data));
      } else if (endpoint === API_ENDPOINTS.display_by_date) {
        //日別
        params = createRequestData(endpoint);
        const data = await fetchData(endpoint, params, router);
        setStoresData(dateProcessData(data));
      } else if (endpoint === API_ENDPOINTS.download) {
        //ダウンロード
        // const data = await fetchData(endpoint, params, router);
        // setStoresData(processData(data));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage(error.message || "データの取得に失敗しました");
      setOpenErrorModal(true);
    }
  };

  // エラーモーダルを閉じる関数
  const handleCloseErrorModal = () => {
    setOpenErrorModal(false);
  };

  // ログアウト処理を修正
  const handleLogout = async () => {
    try {
      //await fetchData(API_ENDPOINTS.logout, null, router);
      router.replace("/login"); // pushではなくreplaceを使用
    } catch (error) {
      console.error("Logout failed:", error);
      router.replace("/login");
    }
  };

  // 固定幅のスタイルを定義
  const fixedColumnStyles = {
    firstColumn: "sticky left-0 z-10 bg-white min-w-[120px] max-w-[120px]", // 店舗名列
    secondColumn: "sticky left-[120px] z-10 bg-white min-w-[80px] max-w-[80px]", // 店舗番号列
  };

  return (
    <>
      <Layout title="店舗売上集計<速報> | 売上速報">
        <div className="bg-gray-50 min-h-screen flex flex-col pb-20">
          <div className="flex justify-between items-center bg-white">
            <h1 className="text-lg font-bold tracking-tighter py-1 pl-4">
              店舗売上集計{"<速報>"}
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
          <div className="flex flex-col gap-2 flex-1 p-2">
            <div className="flex flex-col md:flex-row gap-2 lg:gap-4 items-stretch">
              <div className="w-full md:w-5/12 lg:w-4/12">
                <div className="bg-white border rounded-lg p-2 px-4 py-2 h-full">
                  <h2 className="text-base font-bold mb-2 md:mb-1">対象期間</h2>
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale={dayjsAdapter.locale}
                  >
                    <div className="grid grid-cols-1 gap-2 md:gap-2">
                      <div className="flex w-full gap-2 lg:gap-4 items-center">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "45%",
                          }}
                        >
                          <DatePicker
                            label="抽出対象"
                            value={date1}
                            onChange={setDate1}
                            maxDate={dayjs()}
                            slotProps={{
                              textField: {
                                size: "small",
                                inputProps: {
                                  "data-testid": "date-picker-1",
                                },
                              },
                              day: ({ day }) => ({
                                sx: {
                                  ...(isHoliday(day) && {
                                    color: theme.palette.secondary.main,
                                  }),
                                },
                              }),
                            }}
                          />
                        </Box>
                        <p>～</p>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "45%",
                          }}
                        >
                          <DatePicker
                            label=""
                            value={date2}
                            onChange={setDate2}
                            minDate={date1}
                            maxDate={dayjs()}
                            slotProps={{
                              textField: {
                                size: "small",
                                inputProps: {
                                  "data-testid": "date-picker-2",
                                },
                              },
                              day: ({ day }) => ({
                                sx: {
                                  ...(isHoliday(day) && {
                                    color: theme.palette.secondary.main,
                                  }),
                                },
                              }),
                            }}
                          />
                        </Box>
                      </div>
                      {compareCheck && (
                        <>
                          <div className="flex w-full gap-2 lg:gap-4 items-center">
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: "45%",
                              }}
                            >
                              <DatePicker
                                label="比較対象"
                                value={date3}
                                onChange={setDate3}
                                maxDate={dayjs()}
                                slotProps={{
                                  textField: {
                                    size: "small",
                                    inputProps: {
                                      "data-testid": "date-picker-3",
                                    },
                                  },
                                  day: ({ day }) => ({
                                    sx: {
                                      ...(isHoliday(day) && {
                                        color: theme.palette.secondary.main,
                                      }),
                                    },
                                  }),
                                }}
                              />
                            </Box>
                            <p>～</p>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: "45%",
                              }}
                            >
                              <DatePicker
                                label=""
                                value={date4}
                                onChange={setDate4}
                                minDate={date3}
                                maxDate={dayjs()}
                                slotProps={{
                                  textField: {
                                    size: "small",
                                    inputProps: {
                                      "data-testid": "date-picker-4",
                                    },
                                  },
                                  day: ({ day }) => ({
                                    sx: {
                                      ...(isHoliday(day) && {
                                        color: theme.palette.secondary.main,
                                      }),
                                    },
                                  }),
                                }}
                              />
                            </Box>
                          </div>
                        </>
                      )}
                      <div className="flex w-full gap-4 items-center justify-between">
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={compareCheck}
                              onChange={(e) =>
                                setCompareCheck(e.target.checked)
                              }
                              sx={{
                                "& .MuiSvgIcon-root": { fontSize: 18 },
                                p: "6px",
                              }}
                            />
                          }
                          label="比較対象"
                          sx={{
                            "& .MuiFormControlLabel-label": { fontSize: 14 },
                          }}
                        />
                        {/* <FormControlLabel
                          control={
                            <Checkbox
                              checked={dailyCheck === "日別"}
                              onChange={handleDailyCheckChange}
                              sx={{
                                "& .MuiSvgIcon-root": { fontSize: 18 },
                                p: "6px",
                              }}
                            />
                          }
                          label="日別"
                          sx={{
                            "& .MuiFormControlLabel-label": { fontSize: 14 },
                          }}
                        /> */}
                      </div>
                    </div>
                  </LocalizationProvider>
                </div>
              </div>
              <div className="w-full md:w-4/12 lg:w-3/12">
                <div className="bg-white border rounded-lg p-2 px-4 py-2 h-full">
                  <h2 className="text-base font-bold mb-2 md:mb-1">対象店舗</h2>
                  <div className="">
                    <Button
                      onClick={handleOpenStoreModal}
                      className="bg-blue-500 hover:bg-blue-800 text-white w-full p-1 md:p-1"
                      variant="contained"
                      size="large"
                    >
                      店舗選択
                    </Button>
                    <Modal
                      open={openStoreModal}
                      onClose={handleCloseStoreModal}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: { xs: "95%", sm: 400 },
                          bgcolor: "background.paper",
                          boxShadow: 24,
                          p: { xs: 2, sm: 4 },
                          borderRadius: 2,
                          maxWidth: "95%",
                        }}
                      >
                        <IconButton
                          aria-label="close"
                          onClick={handleCloseStoreModal}
                          sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                        <div className="flex justify-between items-center mb-4 mt-4 pt-2">
                          <Typography
                            variant="h6"
                            component="h3"
                            sx={{
                              fontSize: "1rem",
                            }}
                          >
                            店舗を選択してください
                          </Typography>
                          <Button
                            size="small"
                            variant="contained"
                            className="bg-blue-500 hover:bg-blue-800 text-white"
                            onClick={toggleAllStores}
                          >
                            {selectedStores.length > 0 ? "全解除" : "全選択"}
                          </Button>
                        </div>
                        <TextField
                          margin="normal"
                          fullWidth
                          label="店舗を検索"
                          type="search"
                          value={searchText}
                          onChange={handleSearchChange}
                          onKeyDown={handleSearchKeyDown}
                        />
                        <FormControl sx={{ mt: 2, width: "100%" }}>
                          <InputLabel>店舗選択</InputLabel>
                          <Select
                            multiple
                            value={selectedStores.map((store) => store.id)}
                            input={<OutlinedInput label="店舗選択" />}
                            onChange={handleChange}
                            onOpen={handleSelectOpen}
                            renderValue={(selected) =>
                              //選択ボックスに選択店舗名を表示
                              selectedStores
                                .filter((store) => selected.includes(store.id))
                                .map((store) => store.name)
                                .join(", ")
                            }
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: "90vh", // 画面の高さ100
                                  width: "fit-content",
                                },
                              },
                              // スクロール位置を先頭に設定
                              TransitionProps: {
                                onEnter: (node) => {
                                  if (node) {
                                    node.scrollTop = 0;
                                  }
                                },
                              },
                              anchorOrigin: {
                                vertical: "bottom",
                                horizontal: "left",
                              },
                              transformOrigin: {
                                vertical: "top",
                                horizontal: "left",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                position: "sticky",
                                top: 0,
                                bgcolor: "background.paper",
                                zIndex: 1,
                                borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                                display: "flex",
                                justifyContent: "flex-end",
                                padding: "4px",
                              }}
                            >
                              <IconButton
                                onClick={(event) => {
                                  event.stopPropagation();
                                  const selectElement =
                                    document.querySelector('[role="listbox"]');
                                  if (selectElement) {
                                    const closeEvent = new KeyboardEvent(
                                      "keydown",
                                      {
                                        key: "Escape",
                                        code: "Escape",
                                        keyCode: 27,
                                        which: 27,
                                        bubbles: true,
                                      }
                                    );
                                    selectElement.dispatchEvent(closeEvent);
                                  }
                                }}
                                size="small"
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Box>
                            {filteredStores.map((store) => (
                              <MenuItem
                                key={store.id}
                                value={store.id}
                                dense
                                sx={{ py: 0 }}
                              >
                                <Checkbox
                                  checked={selectedStores.some(
                                    (selectedStore) =>
                                      selectedStore.id === store.id
                                  )}
                                  sx={{ py: 0 }}
                                />
                                <ListItemText
                                  primary={store.name}
                                  primaryTypographyProps={{
                                    fontSize: "1.2rem",
                                  }}
                                />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Modal>
                  </div>
                  <div className="">
                    <Button
                      onClick={handleOpenPrefectureModal}
                      className="bg-blue-500 hover:bg-blue-800 text-white w-full p-1 md:p-1 mt-2 md:mt-2"
                      variant="contained"
                      color="primary"
                      size="large"
                    >
                      都道府県検索
                    </Button>
                    <Modal
                      open={openPrefectureModal}
                      onClose={handleClosePrefectureModal}
                    >
                      <div>
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: { xs: "95%", sm: 400 },
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: { xs: 2, sm: 4 },
                            borderRadius: 2,
                            maxWidth: "95%",
                          }}
                        >
                          <IconButton
                            aria-label="close"
                            onClick={handleClosePrefectureModal}
                            sx={{
                              position: "absolute",
                              right: 8,
                              top: 8,
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                          <div className="flex justify-between items-center mb-4 mt-4 pt-2">
                            <Typography
                              variant="h6"
                              component="h3"
                              sx={{
                                fontSize: "1rem",
                              }}
                            >
                              都道府県を選択してください
                            </Typography>
                            <Button
                              size="small"
                              variant="contained"
                              className="bg-blue-500 hover:bg-blue-800 text-white"
                              onClick={toggleAllStores}
                            >
                              {selectedStores.length > 0 ? "全解除" : "全選択"}
                            </Button>
                          </div>
                          <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>都道府県選択</InputLabel>
                            <Select
                              label="都道府県選択"
                              value={selectedPrefecture}
                              onChange={setPrefectureChange}
                              multiple
                              renderValue={(selected: string[]) =>
                                selected.join(", ")
                              }
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: "90vh", // 画面の高さ100
                                    width: "fit-content",
                                  },
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  position: "sticky",
                                  top: 0,
                                  bgcolor: "background.paper",
                                  zIndex: 1,
                                  borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  padding: "4px",
                                }}
                              >
                                <IconButton
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    const selectElement =
                                      document.querySelector(
                                        '[role="listbox"]'
                                      );
                                    if (selectElement) {
                                      const closeEvent = new KeyboardEvent(
                                        "keydown",
                                        {
                                          key: "Escape",
                                          code: "Escape",
                                          keyCode: 27,
                                          which: 27,
                                          bubbles: true,
                                        }
                                      );
                                      selectElement.dispatchEvent(closeEvent);
                                    }
                                  }}
                                  size="small"
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </Box>
                              {prefectures.map((prefecture) => (
                                <MenuItem
                                  key={prefecture}
                                  value={prefecture}
                                  dense
                                  sx={{ py: 0 }}
                                >
                                  <Checkbox
                                    checked={
                                      selectedPrefecture.indexOf(prefecture) >
                                      -1
                                    }
                                    sx={{ py: 0 }}
                                  />
                                  <ListItemText
                                    primary={prefecture}
                                    primaryTypographyProps={{
                                      fontSize: "1.2rem",
                                    }}
                                  />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl sx={{ mt: 2, width: "100%" }}>
                            <InputLabel id="multiple-store-select-label">
                              店舗選択
                            </InputLabel>
                            <Select
                              labelId="multiple-store-select-label"
                              multiple
                              value={selectedStores.map((store) => store.id)}
                              input={<OutlinedInput label="店舗選択" />}
                              onChange={handleChange}
                              renderValue={(selected) =>
                                //選択ボックスに選択店舗名を表示
                                selectedStores
                                  .filter((store) =>
                                    selected.includes(store.id)
                                  )
                                  .map((store) => store.name)
                                  .join(", ")
                              }
                              onOpen={
                                //フィルタリング
                                handlePrefectureChange
                              }
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: "90vh", // 画面高さまで100
                                    width: "fit-content",
                                  },
                                },
                                TransitionProps: {
                                  onEnter: (node) => {
                                    if (node) {
                                      node.scrollTop = 0;
                                    }
                                  },
                                },
                                anchorOrigin: {
                                  vertical: "bottom",
                                  horizontal: "left",
                                },
                                transformOrigin: {
                                  vertical: "top",
                                  horizontal: "left",
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  position: "sticky",
                                  top: 0,
                                  bgcolor: "background.paper",
                                  zIndex: 1,
                                  borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  padding: "4px",
                                }}
                              >
                                <IconButton
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    const selectElement =
                                      document.querySelector(
                                        '[role="listbox"]'
                                      );
                                    if (selectElement) {
                                      const closeEvent = new KeyboardEvent(
                                        "keydown",
                                        {
                                          key: "Escape",
                                          code: "Escape",
                                          keyCode: 27,
                                          which: 27,
                                          bubbles: true,
                                        }
                                      );
                                      selectElement.dispatchEvent(closeEvent);
                                    }
                                  }}
                                  size="small"
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </Box>
                              {filteredStores.map((store) => (
                                <MenuItem
                                  key={store.id}
                                  value={store.id}
                                  dense
                                  sx={{ py: 0 }}
                                >
                                  <Checkbox
                                    checked={selectedStores.some(
                                      (selectedStore) =>
                                        selectedStore.id === store.id
                                    )}
                                    sx={{ py: 0 }}
                                  />
                                  <ListItemText
                                    primary={store.name}
                                    primaryTypographyProps={{
                                      fontSize: "1.2rem",
                                    }}
                                  />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      </div>
                    </Modal>
                  </div>
                </div>
              </div>
              <div className="md:w-4/12 lg:w-3/12">
                <div className="bg-white border rounded-lg p-2 px-4 py-2 h-full min-w-32">
                  <h2 className="text-base font-bold mb-2 md:mb-1">選択店舗</h2>
                  <div className="mb-2 md:mt-2">
                    <div className="max-h-32 overflow-y-auto">
                      {" "}
                      {/* 最大高さとスクロールを追加 */}
                      <p className="text-sm text-gray-700">
                        {selectedStores.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {" "}
                            {/* gap-1 で適切な間隔を設定 */}
                            {selectedStores.map((store, index) => (
                              <span
                                key={store.id}
                                className="whitespace-nowrap bg-gray-100 px-2 py-1 rounded" // 各店舗名を見やすく区切る
                              >
                                {store.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">
                            選択されていません
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-auto">
                <div className="bg-white border rounded-lg p-2 px-4 py-2 h-full inline-block">
                  <h2 className="text-base font-bold mb-2 md:mb-1">
                    その他条件
                  </h2>
                  <div className="flex gap-4">
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue={locationValue}
                      name="radio-location-group"
                      className="flex flex-row md:flex-col mb-2 md:gap-0"
                      onChange={handleLocationChange}
                    >
                      <FormControlLabel
                        value="全て"
                        control={
                          <Radio
                            sx={{
                              "& .MuiSvgIcon-root": {
                                fontSize: 16,
                              },
                              ".MuiFormControlLabel-label": { fontSize: 14 },
                              p: "4px",
                            }}
                          />
                        }
                        label="全て"
                        sx={{
                          "& .MuiFormControlLabel-label": { fontSize: 14 },
                        }}
                      />
                      <FormControlLabel
                        value="駅前"
                        control={
                          <Radio
                            sx={{
                              "& .MuiSvgIcon-root": {
                                fontSize: 16,
                              },
                              ".MuiFormControlLabel-label": { fontSize: 14 },
                              p: "4px",
                            }}
                          />
                        }
                        label="駅前"
                        sx={{
                          "& .MuiFormControlLabel-label": { fontSize: 14 },
                        }}
                      />
                      <FormControlLabel
                        value="郊外"
                        control={
                          <Radio
                            sx={{
                              "& .MuiSvgIcon-root": {
                                fontSize: 16,
                              },
                              ".MuiFormControlLabel-label": { fontSize: 14 },
                              p: "4px",
                            }}
                          />
                        }
                        label="郊外"
                        sx={{
                          "& .MuiFormControlLabel-label": { fontSize: 14 },
                        }}
                      />
                    </RadioGroup>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue={typeValue}
                      name="radio-type-group"
                      className="flex flex-row md:flex-col md:gap-0"
                      onChange={handleTypeChange}
                    >
                      <FormControlLabel
                        value="全て"
                        control={
                          <Radio
                            sx={{
                              "& .MuiSvgIcon-root": { fontSize: 16 },
                              p: "4px",
                            }}
                          />
                        }
                        label="全て"
                        sx={{
                          "& .MuiFormControlLabel-label": { fontSize: 14 },
                        }}
                      />
                      <FormControlLabel
                        value="直営"
                        control={
                          <Radio
                            sx={{
                              "& .MuiSvgIcon-root": { fontSize: 16 },
                              p: "4px",
                            }}
                          />
                        }
                        label="直営"
                        sx={{
                          "& .MuiFormControlLabel-label": { fontSize: 14 },
                        }}
                      />
                      <FormControlLabel
                        value="FC"
                        control={
                          <Radio
                            sx={{
                              "& .MuiSvgIcon-root": { fontSize: 16 },
                              p: "4px",
                            }}
                          />
                        }
                        label="FC"
                        sx={{
                          "& .MuiFormControlLabel-label": { fontSize: 14 },
                        }}
                      />
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-wrap gap-2 justify-between">
              <div className="bg-white border rounded-lg p-2 px-4 md:px-4 mr-0 md:mr-4 w-full md:w-auto">
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-salesInclusion-group"
                    defaultValue={salesInclusionValue}
                    onChange={handleSalesInclusionChange}
                  >
                    <FormControlLabel
                      value="true"
                      control={
                        <Radio
                          sx={{
                            "& .MuiSvgIcon-root": {
                              fontSize: 16,
                            },
                            p: "4px",
                          }}
                        />
                      }
                      label="その他売上込み"
                      sx={{
                        "& .MuiFormControlLabel-label": { fontSize: 14 },
                      }}
                    />
                    <FormControlLabel
                      value="false"
                      control={
                        <Radio
                          sx={{
                            "& .MuiSvgIcon-root": {
                              fontSize: 16,
                            },
                            p: "4px",
                          }}
                        />
                      }
                      label="その他売上抜き"
                      sx={{
                        "& .MuiFormControlLabel-label": { fontSize: 14 },
                      }}
                    />
                  </RadioGroup>
                </FormControl>
              </div>
              <div className="flex gap-4 self-end w-full md:w-auto justify-end">
                <Button
                  variant="contained"
                  className="bg-gray-400 hover:bg-gray-500 text-white px-2 md:px-4 py-2"
                  startIcon={<ArrowBackIcon className="md:inline hidden" />}
                  onClick={() => { }}
                >
                  店舗別に戻る
                </Button>

                <Button
                  variant="contained"
                  className="bg-gray-400 hover:bg-gray-500 text-white px-2 md:px-4 py-2"
                  startIcon={<DownloadIcon className="md:inline hidden" />}
                //onClick={() => fetchAndTransformData(API_ENDPOINTS.download)}
                >
                  ダウンロード
                </Button>

                <Button
                  variant="contained"
                  className="bg-blue-500 hover:bg-blue-800 text-white px-2 md:px-4 py-2"
                  startIcon={<SearchIcon className="md:inline hidden" />}
                  onClick={() =>
                    fetchAndTransformData(
                      dailyCheck === "日別"
                        ? API_ENDPOINTS.display_by_date
                        : API_ENDPOINTS.display_by_store
                    )
                  }
                >
                  集計実行
                </Button>
              </div>
            </div>
            <div className="w-full">
              <div className="overflow-x-auto rounded-lg border-gray-300 shadow-sm overflow-y-auto h-[400px]">
                <table className="min-w-full divide-y divide-x divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-20">
                    {/*大分類*/}
                    <tr>
                      <th
                        colSpan={2}
                        className="sticky left-0 z-20 bg-gray-50 px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-r-2 border-r-gray-400"
                      >
                        店舗情報
                      </th>
                      <th
                        colSpan={compareCheck ? 4 : 1}
                        className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-r-2 border-r-gray-400"
                      >
                        税抜売上
                      </th>
                      <th
                        colSpan={compareCheck ? 4 : 1}
                        className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-r-2 border-r-gray-400"
                      >
                        利用者
                      </th>
                      <th
                        colSpan={compareCheck ? 4 : 1}
                        className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-r-2 border-r-gray-400"
                      >
                        客単価
                      </th>
                      <th
                        colSpan={compareCheck ? 4 : 1}
                        className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-r-2 border-r-gray-400"
                      >
                        新規
                      </th>
                      <th
                        colSpan={compareCheck ? 2 : 1}
                        className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-r-2 border-r-gray-400"
                      >
                        新規率
                      </th>
                      <th
                        colSpan={compareCheck ? 4 : 1}
                        className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border"
                      >
                        その他売上
                      </th>
                    </tr>
                    <tr>
                      {/*小分類*/}
                      <th className={`px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border ${fixedColumnStyles.firstColumn}`}>
                        店舗名
                      </th>
                      <th className={`px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border border-r-2 border-r-gray-400 ${fixedColumnStyles.secondColumn}`}>
                        <div className="flex items-center justify-between">
                          店番
                          <div>
                            <IconButton
                              size="small"
                              onClick={() => handleSort("storeNumber")}
                            >
                              {sortKey === "storeNumber" &&
                                sortDirection === "asc" ? (
                                <ArrowUpwardIcon fontSize="inherit" />
                              ) : (
                                <ArrowDownwardIcon fontSize="inherit" />
                              )}
                            </IconButton>
                          </div>
                        </div>
                      </th>
                      <th className={`px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border ${!compareCheck ? 'border-r-2 border-r-gray-400' : ''}`}>
                        <div className="flex items-center justify-between">
                          対象期間
                          <div>
                            <IconButton
                              size="small"
                              onClick={() => handleSort("netSalesA")}
                            >
                              {sortKey === "netSalesA" &&
                                sortDirection === "asc" ? (
                                <ArrowUpwardIcon fontSize="inherit" />
                              ) : (
                                <ArrowDownwardIcon fontSize="inherit" />
                              )}
                            </IconButton>
                          </div>
                        </div>
                      </th>
                      {compareCheck && (
                        <>
                          <th className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border">
                            比較期間
                          </th>
                          <th className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border">
                            差異
                          </th>
                          <th className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border border border-r-2 border-r-gray-400">
                            比率
                          </th>
                        </>
                      )}
                      <th className={`px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border ${!compareCheck ? 'border-r-2 border-r-gray-400' : ''}`}>
                        <div className="flex items-center justify-between">
                          対象期間
                          <div>
                            <IconButton
                              size="small"
                              onClick={() => handleSort("usersA")}
                            >
                              {sortKey === "usersA" &&
                                sortDirection === "asc" ? (
                                <ArrowUpwardIcon fontSize="inherit" />
                              ) : (
                                <ArrowDownwardIcon fontSize="inherit" />
                              )}
                            </IconButton>
                          </div>
                        </div>
                      </th>
                      {compareCheck && (
                        <>
                          <th className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border">
                            比較期間
                          </th>
                          <th className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border">
                            差異
                          </th>
                          <th className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border border-r-2 border-r-gray-400">
                            比率
                          </th>
                        </>
                      )}
                      <th className={`px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border ${!compareCheck ? 'border-r-2 border-r-gray-400' : ''}`}>
                        <div className="flex items-center justify-between">
                          対象期間
                          <div>
                            <IconButton
                              size="small"
                              onClick={() => handleSort("avgPriceA")}
                            >
                              {sortKey === "avgPriceA" &&
                                sortDirection === "asc" ? (
                                <ArrowUpwardIcon fontSize="inherit" />
                              ) : (
                                <ArrowDownwardIcon fontSize="inherit" />
                              )}
                            </IconButton>
                          </div>
                        </div>
                      </th>
                      {compareCheck && (
                        <>
                          <th className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border">
                            比較期間
                          </th>
                          <th className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border">
                            差異
                          </th>
                          <th className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border border border-r-2 border-r-gray-400">
                            比率
                          </th>
                        </>
                      )}
                      <th className={`px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border ${!compareCheck ? 'border-r-2 border-r-gray-400' : ''}`}>
                        <div className="flex items-center justify-between">
                          対象期間
                          <div>
                            <IconButton
                              size="small"
                              onClick={() => handleSort("newUsersA")}
                            >
                              {sortKey === "newUsersA" &&
                                sortDirection === "asc" ? (
                                <ArrowUpwardIcon fontSize="inherit" />
                              ) : (
                                <ArrowDownwardIcon fontSize="inherit" />
                              )}
                            </IconButton>
                          </div>
                        </div>
                      </th>
                      {compareCheck && (
                        <>
                          <th className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border">
                            比較期間
                          </th>
                          <th className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border">
                            差異
                          </th>
                          <th className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border border border-r-2 border-r-gray-400">
                            比率
                          </th>
                        </>)}
                      <th className={`px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border ${!compareCheck ? 'border-r-2 border-r-gray-400' : ''}`}>
                        <div className="flex items-center justify-between">
                          対象期間
                          <div>
                            <IconButton
                              size="small"
                              onClick={() => handleSort("newUsersRateA")}
                            >
                              {sortKey === "newUsersRateA" &&
                                sortDirection === "asc" ? (
                                <ArrowUpwardIcon fontSize="inherit" />
                              ) : (
                                <ArrowDownwardIcon fontSize="inherit" />
                              )}
                            </IconButton>
                          </div>
                        </div>
                      </th>
                      {compareCheck && (
                        <>
                          <th className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border border border-r-2 border-r-gray-400">
                            比較期間
                          </th>
                        </>)}
                      <th className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border">
                        <div className="flex items-center justify-between">
                          対象期間
                          <div>
                            <IconButton
                              size="small"
                              onClick={() => handleSort("otherSalesA")}
                            >
                              {sortKey === "otherSalesA" &&
                                sortDirection === "asc" ? (
                                <ArrowUpwardIcon fontSize="inherit" />
                              ) : (
                                <ArrowDownwardIcon fontSize="inherit" />
                              )}
                            </IconButton>
                          </div>
                        </div>
                      </th>
                      {compareCheck && (
                        <>
                          <th className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border">
                            比較期間
                          </th>
                          <th className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border">
                            差異
                          </th>
                          <th className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border border">
                            比率
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  {/* 合計行 */}
                  <tbody className="bg-white divide-y divide-x divide-gray-200">
                    <tr>
                      <td className={`px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border ${fixedColumnStyles.firstColumn}`}>
                        {storesData.totalData.storeName.toLocaleString()}
                      </td>
                      <td className={`px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border border-r-2 border-r-gray-400 ${fixedColumnStyles.secondColumn}`}>
                        {storesData.totalData.storeNumber.toLocaleString()}
                      </td>
                      <td className={`px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border bg-gray-50 text-right ${!compareCheck ? 'border-r-2 border-r-gray-400' : ''}`}>
                        {storesData.totalData.netSalesA.toLocaleString()}
                      </td>
                      {compareCheck && (
                        <>
                          <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border bg-gray-50 text-right">
                            {storesData.totalData.netSalesB.toLocaleString()}
                          </td>
                          <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border bg-gray-50 text-right">
                            {storesData.totalData.netSalesChange.toLocaleString()}
                          </td>
                          <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border bg-gray-50 border border-r-2 border-r-gray-400 text-right">
                            {storesData.totalData.netSalesRatio.toLocaleString()}
                          </td>
                        </>
                      )}
                      <td className={`px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border text-right ${!compareCheck ? 'border-r-2 border-r-gray-400' : ''}`}>
                        {storesData.totalData.usersA.toLocaleString()}
                      </td>
                      {compareCheck && (
                        <>
                          <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border text-right ">
                            {storesData.totalData.usersB.toLocaleString()}
                          </td>
                          <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border text-right">
                            {storesData.totalData.usersChange.toLocaleString()}
                          </td>
                          <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border border border-r-2 border-r-gray-400 text-right">
                            {storesData.totalData.usersRatio.toLocaleString()}
                          </td>
                        </>
                      )}
                      <td className={`px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border bg-gray-50 text-right ${!compareCheck ? 'border-r-2 border-r-gray-400' : ''}`}>
                        {storesData.totalData.avgPriceA.toLocaleString()}
                      </td>
                      {compareCheck && (
                        <>
                          <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border bg-gray-50 text-right">
                            {storesData.totalData.avgPriceB.toLocaleString()}
                          </td>
                          <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border bg-gray-50 text-right">
                            {storesData.totalData.avgPriceChange.toLocaleString()}
                          </td>
                          <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border bg-gray-50 border border-r-2 border-r-gray-400 text-right">
                            {storesData.totalData.avgPriceRatio.toLocaleString()}
                          </td>
                        </>
                      )}
                      <td className={`px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border text-right ${!compareCheck ? 'border-r-2 border-r-gray-400' : ''}`}>
                        {storesData.totalData.newUsersA.toLocaleString()}
                      </td>
                      {compareCheck && (
                        <>
                          <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border text-right">
                            {storesData.totalData.newUsersB.toLocaleString()}
                          </td>
                          <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border text-right">
                            {storesData.totalData.newUsersChange.toLocaleString()}
                          </td>
                          <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border border border-r-2 border-r-gray-400 text-right">
                            {storesData.totalData.newUsersRatio.toLocaleString()}
                          </td>
                        </>
                      )}
                      <td className={`px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border bg-gray-50 text-right ${!compareCheck ? 'border-r-2 border-r-gray-400' : ''}`}>
                        {storesData.totalData.newUsersRateA.toLocaleString()}
                      </td>
                      {compareCheck && (
                        <>
                          <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border bg-gray-50  border border-r-2 border-r-gray-400 text-right">
                            {storesData.totalData.newUsersRateB.toLocaleString()}
                          </td>
                        </>
                      )}
                      <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border text-right">
                        {storesData.totalData.otherSalesA.toLocaleString()}
                      </td>
                      {compareCheck && (
                        <>
                          <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border text-right">
                            {storesData.totalData.otherSalesB.toLocaleString()}
                          </td>
                          <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border text-right">
                            {storesData.totalData.otherSalesChange.toLocaleString()}
                          </td>
                          <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border text-right">
                            {storesData.totalData.otherSalesRatio.toLocaleString()}
                          </td>
                        </>
                      )}
                    </tr>
                    {/* データ行 */}
                    {sortedStoresData.map((store, index) => (
                      <tr key={`${store.storeNumber}-${index}`}>
                        <td className={`px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border ${fixedColumnStyles.firstColumn}`}>
                          {store.storeName}
                        </td>
                        <td className={`px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border border-r-2 border-r-gray-400 ${fixedColumnStyles.secondColumn}`}>
                          {store.storeNumber}
                        </td>
                        <td className={`px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border bg-gray-50 text-right ${!compareCheck ? 'border-r-2 border-r-gray-400' : ''}`}>
                          {store.netSalesA.toLocaleString()}
                        </td>
                        {compareCheck && (
                          <>
                            <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border bg-gray-50 text-right">
                              {store.netSalesB.toLocaleString()}
                            </td>
                            <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border bg-gray-50 text-right">
                              {store.netSalesChange.toLocaleString()}
                            </td>

                            <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border bg-gray-50  border border-r-2 border-r-gray-400 text-right">
                              {store.netSalesRatio.toLocaleString()}
                            </td>
                          </>
                        )}
                        <td className={`px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border text-right ${!compareCheck ? 'border-r-2 border-r-gray-400' : ''}`}>
                          {store.usersA.toLocaleString()}
                        </td>
                        {compareCheck && (
                          <>
                            <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border text-right">
                              {store.usersB.toLocaleString()}
                            </td>
                            <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border text-right">
                              {store.usersChange.toLocaleString()}
                            </td>
                            <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border border border-r-2 border-r-gray-400 text-right">
                              {store.usersRatio.toLocaleString()}
                            </td>
                          </>
                        )}
                        <td className={`px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border bg-gray-50 text-right ${!compareCheck ? 'border-r-2 border-r-gray-400' : ''}`}>
                          {store.avgPriceA.toLocaleString()}
                        </td>
                        {compareCheck && (
                          <>
                            <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border bg-gray-50 text-right">
                              {store.avgPriceB.toLocaleString()}
                            </td>
                            <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border bg-gray-50 text-right">
                              {store.avgPriceChange.toLocaleString()}
                            </td>
                            <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border bg-gray-50 border border-r-2 border-r-gray-400 text-right">
                              {store.avgPriceRatio.toLocaleString()}
                            </td>
                          </>
                        )}
                        <td className={`px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border text-right ${!compareCheck ? 'border-r-2 border-r-gray-400' : ''}`}>
                          {store.newUsersA.toLocaleString()}
                        </td>
                        {compareCheck && (
                          <>
                            <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border text-right">
                              {store.newUsersB.toLocaleString()}
                            </td>
                            <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border text-right">
                              {store.newUsersChange.toLocaleString()}
                            </td>
                            <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border  border border-r-2 border-r-gray-400 text-right">
                              {store.newUsersRatio.toLocaleString()}
                            </td>
                          </>
                        )}
                        <td className={`px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border bg-gray-50 text-right ${!compareCheck ? 'border-r-2 border-r-gray-400' : ''}`}>
                          {store.newUsersRateA.toLocaleString()}
                        </td>
                        {compareCheck && (
                          <>
                            <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border bg-gray-50  border border-r-2 border-r-gray-400 text-right">
                              {store.newUsersRateB.toLocaleString()}
                            </td>
                          </>)}
                        <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border text-right">
                          {store.otherSalesA.toLocaleString()}
                        </td>
                        {compareCheck && (
                          <>
                            <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border text-right">
                              {store.otherSalesB.toLocaleString()}
                            </td>
                            <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border text-right">
                              {store.otherSalesChange.toLocaleString()}
                            </td>
                            <td className="px-4 py-1 whitespace-nowrap text-sm font-medium-mono text-gray-900 border text-right">
                              {store.otherSalesRatio.toLocaleString()}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Layout>
      <Dialog
        open={openErrorModal}
        onClose={handleCloseErrorModal}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
      >
        <DialogTitle
          id="error-dialog-title"
          className="flex items-center gap-2"
        >
          <ErrorOutlineIcon className="text-red-500" />
          <span>エラー</span>
        </DialogTitle>
        <DialogContent>
          <p className="text-gray-700">{errorMessage}</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseErrorModal}
            variant="contained"
            className="bg-blue-500 hover:bg-blue-800"
          >
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default IndexPage;