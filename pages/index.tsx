import Layout from "@/components/Layout";
import axios from "axios"; // これを追加

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
  FormLabel,
  Tooltip,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import RemoveIcon from "@mui/icons-material/Remove";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import LogoutIcon from "@mui/icons-material/Logout";
import FormControlLabel from "@mui/material/FormControlLabel";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useTheme } from "@mui/material/styles";
import Holidays from "date-holidays";
import { fetchData, API_ENDPOINTS } from "./api/apiService";
import { storeProcessData, dateProcessData, weekProcessData } from "./api/dataTransformer";
import { initialStores } from "../data/shopData";
import ErrorModal from "../components/ErrorModal";
import { mockStoreResponse, mockDateResponse, mockWeekResponse } from "__tests__/salesMockData";
import { csvDlResData } from "__tests__/csvDlResData";
import { convertToCSV, downloadCSV } from "./api/downloadCSV";
import dayjs, { Dayjs } from "dayjs";
import { saveAs } from 'file-saver'; // ファイル保存用のライブラリをインポート
import "dayjs/locale/ja";
// add 20240828
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
// add 20241117 16:23
import nookies from "nookies";
import jwt from "jsonwebtoken";
import { set, setDate } from "date-fns";

const JWT_SECRET = "100"; // サーバー側と同じ秘密鍵

// export const getServerSideProps: GetServerSideProps = async (context) => {

//   const cookies = nookies.get(context);
//   const token = cookies['access_token'];

//   if (!token) {
//     // トークンがない場合、ログインページにリダイレクト
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false,
//       },
//     };
//   }

//   try {
//     // トークンを検証
//     const decoded = jwt.verify(token, JWT_SECRET);

//     // 認証成功
//     return {
//       props: {
//         user: decoded,
//       },
//     };
//   } catch (error) {
//     console.error('Token verification failed:', error.message);
//     // 認証失敗、ログインページにリダイレクト
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false,
//       },
//     };
//   }
// };

const dayjsAdapter = new AdapterDayjs({ locale: "ja" });

const IndexPage = () => {
  //Muiのtheme設定を読み込む
  const theme = useTheme();
  const router = useRouter();

  // 初期表示時店舗を選択する
  useEffect(() => {
    fetchStoreList(); // 店舗情報取得
    fetchConditions(); // 条件を取得取得
  }, []);

  const fetchStoreList = async () => {
    try {
      const data = await fetchData(API_ENDPOINTS.getStoreList, {}, router);
      const stores = data.map((store) => ({
        id: store.BaseNo,
        name: store.BaseName,
        prefecture: store.Prefecture,
      }));
      // stores.some((store) => {
      //   console.log("store.id : " + store.id);});

      const authority = JSON.parse(localStorage.getItem("Authority"));
      console.log("Authority : " + authority);
      if (authority) {
        // '9999'のみの場合は全店舗を選択
        if (authority.length === 1 && authority.includes("9999")) {
          setSelectedStores(stores);
          setAuthorizedStores(stores);
          setFilteredStores(stores);
        } else {
          // '9999'が含まれていても他の店舗IDがある場合はその店舗のみを選択
          const authorizedStoreList = stores.filter((store) =>
            authority.includes(store.id)
          );
          console.log("authorizedStoreList : " + authorizedStoreList);
          setSelectedStores(authorizedStoreList);//選択状態店舗
          setAuthorizedStores(authorizedStoreList);//表示される店舗
          setFilteredStores(authorizedStoreList);//絞り込み店舗
        }
      }
    } catch (error) {
      setModalType("error");
      setErrorMessage("店舗情報の取得に失敗しました");
      setOpenErrorModal(true);
    }
  };

  // 条件を取得する関数
  const fetchConditions = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('ユーザーIDが取得できませんでした : ' + userId);
      return;
    }

    try {
      const data = { userId: userId };
      const response = await fetchData(API_ENDPOINTS.getAggregationConditions, data, router);
      setConditionList(response.conditions || []);
    } catch (error) {
      console.error('条件の取得に失敗しました:', error);
      setErrorMessage(error.message);
      setOpenErrorModal(true);
    }
  };


  // 認証チェック
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       console.log("index.tsx res:");
  //       const response = await axios.get("http://localhost:3000", {
  //         withCredentials: true
  //       });
  //       console.log("index.tsx res: ", response);
  //       // 認証成功
  //       console.log("User is authenticated:", response.data.user);
  //     } catch (error) {
  //       // 認証失敗時はログインページへリダイレクト
  //       console.error("Authentication check failed:", error);
  //       router.replace('/login'); // pushではなくreplaceを使用
  //     }
  //   };

  //   checkAuth();
  // }, [router]);

  // カレンダー用状態 前日を選択させる処理含む
  const [date1, setDate1] = useState(dayjs().subtract(1, "day"));
  const [date2, setDate2] = useState(dayjs().subtract(1, "day"));
  const [date3, setDate3] = useState(
    dayjs().subtract(1, "day").subtract(1, "year")
  );
  const [date4, setDate4] = useState(
    dayjs().subtract(1, "day").subtract(1, "year")
  );

  // 店舗選択モーダル用状態
  const [openStoreModal, setOpenStoreModal] = useState(false);
  const [openPrefectureModal, setOpenPrefectureModal] = useState(false);
  const [selectedStores, setSelectedStores] = useState([]); //選択した店舗
  const [authorizedStores, setAuthorizedStores] = useState([]); //表示できる店舗
  const [filteredStores, setFilteredStores] = useState([]); //絞り込み店舗
  const [selectedPrefecture, setSelectedPrefecture] = useState<string[]>([]); //選択した都道府県名
  const [searchText, setSearchText] = useState(""); //店舗名でフィルタリング時の入力値

  //条件登録モーダル
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [conditionName, setConditionName] = useState("");
  const [conditionError, setConditionError] = useState("");

  //条件取得
  const [conditionList, setConditionList] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState("");//選択した条件

  // チェックボックス用状態
  const [dailyCheck, setDailyCheck] = useState("店舗別"); //日別or店舗別or曜日別
  const [compareCheck, setCompareCheck] = useState(false); //比較対象チェックボックスの状態
  const [allSelected, setAllSelected] = useState(false); // 全選択/全解除の状態を管理

  //ラジオボタン用状態
  const [locationValue, setLocationValue] = useState("全て"); //"全て or 駅前 or 郊外"
  const [typeValue, setTypeValue] = useState("全て"); //"全て or 直営 or FC"
  const [closedStoreValue, setClosedStoreValue] = useState(true); //閉店かどうか
  const [salesInclusionValue, setSalesInclusionValue] = useState(true); //その他売り上げ込みかどうか
  const [consignmentSales, setConsignmentSales] = useState(true);

  //集計ボタン ダウンロードボタン　の状態
  const [isLoading, setIsLoading] = useState(false); // 集計中の状態を管理
  const [isDlLoading, setIsDlLoading] = useState(false); // ダウンロード中の状態を管理

  //お知らせモーダル関連
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalType, setModalType] = useState<"error" | "info">("error"); //エラーかお知らせか

  //型指定
  interface TotalData {
    storeName: string;
    area: string;
    storeNumber: string;
    storeDate: string;
    week: string;
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
    consignmentSalesA: string;
    consignmentSalesB: string;
    consignmentSalesChange: string;
    consignmentSalesRatio: string;
  }
  interface StoreData {
    storeName: string;
    area: string;
    storeNumber: string;
    storeDate: string;
    week: string;
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
    consignmentSalesA: string;
    consignmentSalesB: string;
    consignmentSalesChange: string;
    consignmentSalesRatio: string;
  }
  interface StoresData {
    totalData: TotalData;
    storeData: StoreData[];
  }

  const [storesData, setStoresData] = useState<StoresData>({
    totalData: {
      storeName: "合計",
      area: "",
      storeNumber: "",
      storeDate: "",
      week: "",
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
      consignmentSalesA: "",
      consignmentSalesB: "",
      consignmentSalesChange: "",
      consignmentSalesRatio: "",
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

  //全選択/全解除チェックボックス
  const toggleAllStores = () => {
    if (allSelected) {
      const filteredStoreIds = filteredStores.map((store) => store.id); //絞り込み中店舗のid取得
      const newSelectedStores = selectedStores.filter(
        (store) => !filteredStoreIds.includes(store.id)
      ); //絞り込み絞り込み以外の店舗をフィルタリング
      setSelectedStores(newSelectedStores); //絞り込み中以外をセット
    } else {
      const combinedStores = Array.from(
        new Set([...selectedStores, ...filteredStores])
      );
      setSelectedStores(combinedStores);
    }
    setAllSelected(!allSelected);
  };

  //全店舗選択/全店舗解除ボタン
  const selectAllStores = () => {
    if (selectedStores.length > 0) {
      setSelectedStores([]);
    } else {
      setSelectedStores(authorizedStores);
    }
  };

  //店舗検索入力値の管理ハンドラ
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };
  // MenuItemのクリックハンドラを修正
  const handleMenuItemClick = (event) => {
    event.stopPropagation(); // イベントの伝播を停止
    toggleAllStores();
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
    let filtered = authorizedStores;
    if (searchText) {
      filtered = filtered.filter((store) =>
        store.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredStores(filtered);
      const newSelectedStores = Array.from(
        new Set([...selectedStores, ...filtered])
      );
      //setSelectedStores(newSelectedStores);
    } else {
      setFilteredStores(filtered); //全店舗表示
      //setSelectedStores(filtered); //全店舗選択
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
    //setAllSelected(false);
    let filtered = authorizedStores;
    if (selectedPrefecture.length > 0) {
      filtered = filtered.filter((store) =>
        selectedPrefecture.includes(store.prefecture)
      );
      setFilteredStores(filtered);
      const newSelectedStores = Array.from(
        new Set([...selectedStores, ...filtered])
      );
      //setSelectedStores(newSelectedStores);
    } else {
      setFilteredStores(filtered); // 未入力の場合は全データを表示
      //setSelectedStores(filtered);
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

    const newSelectedStores = authorizedStores.filter((store) =>
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
  const areas = generateAreasFromStores(authorizedStores);
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

  //カレンダー共通コンポーネント
  const CustomDatePicker = ({ label, value, onChange, minDate, maxDate, dataTestId }) => {
    const theme = useTheme();
    // 祝日かどうかを判定する関数
    const isHoliday = (day: Dayjs): boolean => {
      const formattedDate = day.format("YYYY-MM-DD");
      return Object.hasOwnProperty.call(japaneseHolidays, formattedDate);
    };

    return (
      <Box sx={{ display: "flex", alignItems: "center", width: "45%" }}>
        <DesktopDatePicker
          label={label}
          value={value}
          onChange={onChange}
          minDate={minDate}
          maxDate={maxDate}
          slotProps={{
            textField: {
              size: "small",
              inputProps: { "data-testid": dataTestId },
            },
            day: ({ day }) => ({
              sx: {
                ...(isHoliday(day) && { color: theme.palette.secondary.main }),
              },
            }),
          }}
        />
      </Box>
    );
  };

  //月変更処理　unit=単位（月）、amount=変更する月の量（前月：-1、後月：1）、date=変更前の日付、dateSetter=対象のセット関数
  const handleDateChange = (dateSetter, date, amount, unit) => {
    let newDate;

    if (dateSetter === setDate1 || dateSetter === setDate3) {
      //開始日
      if (amount === 1) {
        //翌月
        newDate = dayjs(date).add(1, 'month').startOf('month');
      } else if (amount === -1) {
        //前月
        if (dayjs(date).isSame(dayjs(date).startOf('month'), 'day')) {
          //すでに1日だった場合
          newDate = dayjs(date).subtract(1, 'month').startOf('month');
        } else {
          //その月の1日に
          newDate = dayjs(date).startOf('month');
        }
      }
    } else if (dateSetter === setDate2 || dateSetter === setDate4) {
      //終了日
      if (amount === 1) {
        //翌月
        if (dayjs(date).isSame(dayjs(date).endOf('month'), 'day')) {
          //すでに末日だった場合
          newDate = dayjs(date).add(1, 'month').endOf('month');
        } else {
          //その月の末日に
          newDate = dayjs(date).endOf('month');
        }
      } else if (amount === -1) {
        //前月
        newDate = dayjs(date).subtract(1, 'month').endOf('month');
      }
    } else {
      newDate = dayjs(date).add(amount, unit);
    }

    if (newDate.isBefore(dayjs())) {
      dateSetter(newDate);
    }
  };

  //月変更ボタン共通化
  const CustomButton = ({ onClick, children }) => (
    <Button
      className="bg-gray-400 hover:bg-gray-500 text-white p-1 md:p-1 mb-1 md:mt-1"
      variant="contained"
      color="primary"
      size="small"
      style={{ width: '50px' }}
      onClick={onClick}
    >
      {children}
    </Button>
  );

  //ラジオボタン共通コンポーネント
  const CustomRadioGroup = ({ label, value, onChange, options }) => (
    <FormControl component="fieldset">
      <FormLabel component="legend" style={{ fontSize: "0.875rem" }}>{label}</FormLabel>
      <RadioGroup
        value={value}
        onChange={onChange}
        className="flex flex-row gap-3"
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
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
            label={option.label}
            sx={{
              "& .MuiFormControlLabel-label": { fontSize: 14 },
            }}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );

  //チェックボックス変換ハンドラ
  const handleDailyCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDailyCheck(e.target.value);
  };

  //駅前、郊外変更ハンドラ
  const handleLocationChange = (event) => {
    setLocationValue(event.target.value);
  };
  //直営、FC変更ハンドラ
  const handleTypeChange = (event) => {
    setTypeValue(event.target.value);
  };
  //閉店変更ハンドラ
  const handleClosedStoreChange = (event) => {
    setClosedStoreValue(event.target.value);
  };
  //その他売上変更ハンドラ
  const handleSalesInclusionChange = (event) => {
    setSalesInclusionValue(event.target.value);
  };
  //委託販売変更ハンドラ
  const consignmentSalesInclusionChange = (event) => {
    setConsignmentSales(event.target.value);
  };

  // 条件選択から各集計条件を変更するハンドラ
  const handleConditionChange = (event) => {

    const selectedConditionName = event.target.value;
    setSelectedCondition(selectedConditionName);
    if (!selectedConditionName) {
      console.log("条件名ナシ");
      return;
    }


    //条件名から条件データを取得
    const selectedConditionData = conditionList.find(condition => condition.conditionName === event.target.value);

    //選択中店舗を条件データから絞り込み
    const selectedConditionStores = authorizedStores.filter(store => selectedConditionData.storeSelection.selectedStore.includes(store.id));

    //条件データを各集計条件にセット
    setDailyCheck(selectedConditionData.displayType);//集計タイプ
    setSelectedStores(selectedConditionStores);//選択店舗
    setLocationValue(selectedConditionData.otherConditions.storeLocation);//区分
    setTypeValue(selectedConditionData.otherConditions.businessType);//エリア
    setSalesInclusionValue(selectedConditionData.includeSales);//閉店店舗
    setClosedStoreValue(selectedConditionData.includeClose);//その他売上
    setConsignmentSales(selectedConditionData.include_consign_sales);//委託販売
  };
  const handleDeleteCondition = async (conditionName) => {
    const userId = localStorage.getItem('userId'); // ローカルストレージからユーザーIDを取得
    // 条件パラメータを保存
    const dellCondition = {
      userId: userId,
      conditionName: conditionName,
    };
    try {
      const response = await fetchData(API_ENDPOINTS.dellAggregationConditions, dellCondition, router);
      setConditionError(""); // エラーをクリア
      await fetchConditions();// 条件を再取得
      console.log('条件が正常に保存されました:', response);
      setErrorMessage(response.message);
      setModalType('info');
      setOpenErrorModal(true);
    } catch (error) {
      console.error('条件の削除中にエラーが発生しました:', error);
      setErrorMessage(error.message);
      setOpenErrorModal(true);
    }
  }

  //条件保存処理
  const handleSaveCondition = async () => {

    // 条件の数をチェック
    if (conditionList.length >= 10) {
      console.log("条件数が上限に達しました。" + conditionList.length);
      setErrorMessage("条件の数が上限に達しました。最大10個まで登録できます。");
      setOpenErrorModal(true);
      return;
    }

    //入力値エラーチェック
    if (conditionError || !conditionName) {
      return;
    }

    const userId = localStorage.getItem('userId'); // ローカルストレージからユーザーIDを取得
    // 条件パラメータを保存
    const newCondition = {
      userId: userId,
      conditionName,
      displayType: dailyCheck,
      storeSelection: {
        selectedStore: selectedStores.map((store) => store.id).join(", "), // 店舗IDをカンマ区切りで連結
        prefecture: selectedStores.map((store) => store.prefecture).join(", "), // 選択された店舗の都道府県をカンマ区切りで連結
      },
      otherConditions: {
        storeLocation: locationValue,
        businessType: typeValue
      },
      includeSales: salesInclusionValue,
      includeClose: closedStoreValue,
      include_consign_sales: consignmentSales
    };

    try {
      const response = await fetchData(API_ENDPOINTS.addAggregationConditions, newCondition, router);//条件登録
      setOpenSaveModal(false);//モーダルを閉じる
      setConditionError(""); // エラーをクリア
      setConditionName(''); //条件名をクリア
      await fetchConditions();// 条件を再取得
      console.log('条件が正常に保存されました:', response);
      setErrorMessage(response.message);
      setModalType('info');
      setOpenErrorModal(true);
    } catch (error) {
      console.error('条件の保存中にエラーが発生しました:', error);
      setErrorMessage(error.message);
      setOpenErrorModal(true);
    }
  };

  //条件保存モーダルを閉じる
  const handleCloseSaveModal = () => {
    setOpenSaveModal(false);
  };

  //条件名入力値の管理ハンドラ
  const handleConditionNameChange = (e) => {
    setConditionName(e.target.value);
    if (e.target.value.length <= 10) {
      setConditionError("");
    } else {
      setConditionError("条件名は10文字以内で入力してください");
    }
  };

  //比較対象日付を抽出対象の1年前にする
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
        .replace(/[,％%]/g, "") // カンマとパーセント記号（全角・半角）を除去
        .trim();
    };

    const valueA = Number(cleanValue(a[sortKey]));
    const valueB = Number(cleanValue(b[sortKey]));

    // 数値として有効な場合は数値比較
    if (!isNaN(valueA) && !isNaN(valueB)) {
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    }

    // 数値変換できない場合は文字列として比較
    return sortDirection === "asc"
      ? String(a[sortKey]).localeCompare(String(b[sortKey]))
      : String(b[sortKey]).localeCompare(String(a[sortKey]));
  });

  ///***<送信時データ変換処理>***///
  const createRequestData = () => {
    let startDate3 = "";
    let endDate4 = "";
    if (compareCheck) {
      // 比較対象がある場合
      startDate3 = date3.format("YYYY-MM-DD");
      endDate4 = date4.format("YYYY-MM-DD");
    }
    return {
      displayType: dailyCheck, //  日別/店舗別/曜日別

      range: {
        start: date1.format("YYYY-MM-DD"), //始まり日付
        end: date2.format("YYYY-MM-DD"), //終わり日付
      },
      comparisonRange: {
        start: startDate3, //始まり日付
        end: endDate4, //終わり日付
      },
      storeSelection: {
        selectedStore: selectedStores.map((store) => store.id).join(", "), // 店舗IDをカンマ区切りで連結
        prefecture: selectedStores.map((store) => store.prefecture).join(", "), // 選択された店舗の都道府県をカンマ区切りで連結
      },
      otherConditions: {
        storeLocation: locationValue, // 区分
        businessType: typeValue, // エリア
      },
      includeSales: salesInclusionValue, // 税抜
      includeClose: closedStoreValue, // 閉店
      include_consign_sales: consignmentSales,//委託販売
    };
  };
  // 初期化処理
  const initialStoresData: StoresData = {
    totalData: {
      storeName: "合計",
      storeNumber: "",
      area: "",
      storeDate: "",
      week: "",
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
      consignmentSalesA: "",
      consignmentSalesB: "",
      consignmentSalesChange: "",
      consignmentSalesRatio: ""
    },
    storeData: [],
  };
  //バックエンドAPIにデータ送信、受信
  // add 20240828
  const fetchAndTransformData = async (endpoint) => {

    if (selectedStores.length === 0) {
      setModalType("error");
      setErrorMessage("対象店舗が選択されていません");
      setOpenErrorModal(true);
      return;
    }
    try {
      if (!(endpoint === "download")) {
        setStoresData(initialStoresData); // 初期化処理
        setSortKey("");
        setSortDirection("desc");
      }
      /**テスト環境用　if (isTestMode) にするとモックデータを参照する*/
      const isTestMode = process.env.NODE_ENV === "development"; //テスト環境か本番化フラグ
      if (isTestMode) {
        setIsLoading(true); // 集計中...に設定
        if (endpoint === "display_by_date") {
          setStoresData(mockDateResponse());
        } else if (endpoint === "display_by_store") {
          setStoresData(mockStoreResponse());
        } else if (endpoint === "display_by_dotw") {
          console.log("曜日別");
          setStoresData(mockWeekResponse());
        } else if (endpoint === "download") {
          console.log("ダウンロード");
          return csvDlResData;
        }
        console.log("storesData.storeData[0]" + storesData.storeData[0]);
        if (storesData.storeData.length > 0) {
          console.log("テスト" + storesData.storeData[0].storeDate);
        }
        return;
      }

      /**本番環境用 */
      endpoint === "download" ? setIsDlLoading(true) : setIsLoading(true);
      console.log("API_ENDPOINT: ", API_ENDPOINTS);
      console.log("endpoint確認: ", endpoint);

      const params = createRequestData();                     //送信データ作成
      const response = await fetchData(endpoint, params, router); //バックエンドへ送信
      let transformedData;
      // ダウンロードの場合はデータを返す
      if (endpoint === "download") {
        return response;
      }

      //取得データ変換、格納
      switch (endpoint) {
        case API_ENDPOINTS.display_by_store:
          transformedData = storeProcessData(response);
          break;
        case API_ENDPOINTS.display_by_date:
          transformedData = dateProcessData(response);
          break;
        case API_ENDPOINTS.display_by_dotw:
          transformedData = weekProcessData(response);
          break;
        default:
          throw new Error('Invalid endpoint');
      }

      setStoresData(transformedData);

    } catch (error) {
      console.error("Error fetching data:", error);
      setModalType("error");
      setErrorMessage(error.message || "データの取得に失敗しました");
      setOpenErrorModal(true);
    } finally {
      setIsLoading(false); // 集計実行に戻す
      setIsDlLoading(false);
    }
  };

  // Base64エンコードされたデータをデコードしてCSVファイルを生成し、ダウンロードする関数
  const downloadCSV = (encodedData: string, filename: string) => {
    // Base64デコード
    const binaryString = atob(encodedData);

    // バイナリデータをUint8Arrayに変換
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // TextDecoderを使用して文字エンコーディングを処理
    const decodedData = new TextDecoder('utf-8').decode(bytes);

    // BOMを追加
    const bom = '\uFEFF';
    const csvData = bom + decodedData;

    // Blobを作成
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

    // ファイルを保存
    saveAs(blob, filename);
  };

  // エラーモーダルを閉じる関数
  const handleCloseErrorModal = () => {
    setOpenErrorModal(false);
  };

  // ログアウト処理を修正
  const handleLogout = async () => {
    try {
      //await fetchData(API_ENDPOINTS.logout, null, router);
      localStorage.removeItem("Authority");
      router.replace("/login"); // pushではなくreplaceを使用
    } catch (error) {
      console.error("Logout failed:", error);
      router.replace("/login");
    }
  };

  // ヘッダーの固定幅のスタイルを定義
  const headerFixedColumnStyles = {
    firstColumn: "sticky left-0 z-10 text-center bg-gray-300 min-w-[20px] max-w-[60px] px-0", // 店舗名列
    //secondColumn: "text-center bg-gray-300 min-w-[100px]", // 店舗番号列
    noColumn: "text-center bg-gray-300 min-w-[20px] max-w-[40px] px-0", // No列
    areaColumn: "text-center bg-gray-300 min-w-[20px] max-w-[60px] px-0", // エリア列
    storeNumberColumn: "text-center bg-gray-300 min-w-[20px] max-w-[70px] px-0", // 店番列
    dateColumn: "text-center bg-gray-300 min-w-[70px] max-w-[70px] px-0", // 日付列
  };

  // データ行の固定幅のスタイルを定義
  const dataFixedColumnStyles = {
    firstColumn: "sticky left-0 z-20 text-center min-w-[100px] bg-white", // 店舗名列
    //noColumn: "text-center min-w-[50px] bg-white hover:bg-gray-200", // No列
    //areaColumn: "text-center min-w-[100px] bg-white hover:bg-gray-200", // エリア列
    //storeNumberColumn: "text-center min-w-[100px] bg-white hover:bg-gray-200", // 店番列
    othersColumn: "text-center", // 中央ぞろえ
    dateColumn: "sticky left-0 z-10 text-center min-w-[70px] bg-white  px-0", // 日付列
  };

  // データー行
  const renderTableCell = (content: string | number, className = "", colSpan: number = 1) => {
    const isNegative = typeof content === 'string' && content.includes('-');
    const cellStyle = isNegative ? 'text-red-500' : 'text-gray-900';

    return (
      <td className={`px-1 py-1 text-sm font-medium-mono ${cellStyle} border ${className}`} colSpan={colSpan} style={{ whiteSpace: 'nowrap' }}>
        {content}
      </td>
    );
  };

  // ヘッダーのスタイル
  const headerClassName = (additionalClasses = "") =>
    `px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-300 border border-gray-200 ${additionalClasses}`;

  // 通常ヘッダー
  const renderTableHeader = (content: string, additionalClasses = "", colSpan: number = 1) => (
    <th className={headerClassName(additionalClasses)} colSpan={colSpan} style={{ whiteSpace: 'nowrap' }}>
      {content}
    </th>
  );

  // ソートアイコン付きヘッダー
  const renderTableHeaderWithSort = (
    content: string,
    sortKey: string,
    currentSortKey: string,
    sortDirection: "asc" | "desc",
    handleSort: (key: string) => void,
    additionalClasses = "",
    colSpan: number = 1
  ) => (
    <th className={headerClassName(additionalClasses)} colSpan={colSpan} style={{ whiteSpace: 'nowrap' }}>
      <div className="flex items-center justify-between">
        {content}
        <div>
          <IconButton size="small" onClick={() => handleSort(sortKey)}>
            {currentSortKey === sortKey && sortDirection === "asc" ? (
              <ArrowUpwardIcon fontSize="inherit" />
            ) : (
              <ArrowDownwardIcon fontSize="inherit" />
            )}
          </IconButton>
        </div>
      </div>
    </th>
  );

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
                  <div className="flex flex-col md:flex-row md:items-center md:justify-start mb-4">
                    <h2 className="text-base font-bold mb-2 md:mb-0 md:mr-2">
                      対象期間
                    </h2>
                    <div className="text-sm text-left md:text-right md:ml-auto">
                      {" "}
                      {/* spanをラップして右寄せ */}
                      <span className="text-gray-600">
                        ※直営の締めデータは翌日の
                        <span className="whitespace-nowrap bg-gray-100 ml-1 mr-1 px-1 py-1 rounded" style={{ color: '#000000' }}>
                          12 : 33
                        </span>
                        に反映されます
                      </span>
                    </div>
                  </div>
                  <div className="mb-3 md:mt-3">
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale={dayjsAdapter.locale}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex w-full gap-2 lg:gap-4 items-center">
                          <CustomDatePicker
                            label="抽出対象"
                            value={date1}
                            onChange={setDate1}
                            minDate={null} // ここを追加
                            maxDate={dayjs()}
                            dataTestId="date-picker-1"
                          />
                          <p>～</p>
                          <CustomDatePicker
                            label=""
                            value={date2}
                            onChange={setDate2}
                            minDate={date1}
                            maxDate={dayjs()}
                            dataTestId="date-picker-2"
                          />
                        </div>
                        <div className="flex justify-between">
                          <CustomButton onClick={() => handleDateChange(setDate1, date1, -1, 'month')}>前月</CustomButton>
                          <CustomButton onClick={() => handleDateChange(setDate1, date1, 1, 'month')}>翌月</CustomButton>
                          <CustomButton onClick={() => handleDateChange(setDate2, date2, -1, 'month')}>前月</CustomButton>
                          <CustomButton onClick={() => handleDateChange(setDate2, date2, 1, 'month')}>翌月</CustomButton>
                        </div>
                        {compareCheck && (
                          <>
                            <hr style={{ border: '1px dotted #ccc', margin: '5px 0' }} />
                            <div className="flex w-full gap-2 lg:gap-4 items-center">
                              <CustomDatePicker
                                label="比較対象"
                                value={date3}
                                onChange={setDate3}
                                minDate={null}
                                maxDate={dayjs()}
                                dataTestId="date-picker-3"
                              />
                              <p>～</p>
                              <CustomDatePicker
                                label=""
                                value={date4}
                                onChange={setDate4}
                                minDate={date3}
                                maxDate={dayjs()}
                                dataTestId="date-picker-4"
                              />
                            </div>
                            <div className="flex justify-between">
                              <CustomButton onClick={() => handleDateChange(setDate3, date3, -1, 'month')}>前月</CustomButton>
                              <CustomButton onClick={() => handleDateChange(setDate3, date3, 1, 'month')}>翌月</CustomButton>
                              <CustomButton onClick={() => handleDateChange(setDate4, date4, -1, 'month')}>前月</CustomButton>
                              <CustomButton onClick={() => handleDateChange(setDate4, date4, 1, 'month')}>翌月</CustomButton>
                            </div>
                          </>
                        )}

                        <div className="">
                          <Tooltip arrow title="抽出日付と比較する期間を設定できます">
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
                          </Tooltip>
                        </div>

                        <hr style={{ border: '1px solid #ccc', margin: '5px 0' }} />
                        <div className="">
                          <FormControl component="fieldset">
                            <FormLabel component="legend" style={{ fontSize: "0.875rem" }}>集計タイプ</FormLabel>
                            <RadioGroup
                              value={dailyCheck}
                              onChange={handleDailyCheckChange}
                              className="flex flex-row gap-3"
                            >
                              <Tooltip arrow title="店舗ごとにまとめて集計">
                                <FormControlLabel
                                  value="店舗別"
                                  control={<Radio sx={{ "& .MuiSvgIcon-root": { fontSize: 18 }, p: "6px" }} />}
                                  label="店舗別"
                                  sx={{ "& .MuiFormControlLabel-label": { fontSize: 14 } }}
                                />
                              </Tooltip>
                              <Tooltip arrow title="指定日分を日ごとにまとめて集計">
                                <FormControlLabel
                                  value="日別"
                                  control={<Radio sx={{ "& .MuiSvgIcon-root": { fontSize: 18 }, p: "6px" }} />}
                                  label="日別"
                                  sx={{ "& .MuiFormControlLabel-label": { fontSize: 14 } }}
                                />
                              </Tooltip>
                              <Tooltip arrow title="曜日ごとにまとめて集計">
                                <FormControlLabel
                                  value="曜日別"
                                  control={<Radio sx={{ "& .MuiSvgIcon-root": { fontSize: 18 }, p: "6px" }} />}
                                  label="曜日別"
                                  sx={{ "& .MuiFormControlLabel-label": { fontSize: 14 } }}
                                />
                              </Tooltip>
                            </RadioGroup>
                          </FormControl>
                        </div>
                      </div>
                    </LocalizationProvider>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-3/12 lg:w-2/12">
                <div className="bg-white border rounded-lg p-2 px-4 py-2 h-full">
                  <h2 className="text-base font-bold mb-2 md:mb-1">対象店舗</h2>
                  <div className="mb-3 md:mt-3">
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
                                  .filter((store) =>
                                    selected.includes(store.id)
                                  )
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
                                <MenuItem
                                  onClick={handleMenuItemClick}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: "100%",
                                    cursor: "pointer",
                                  }}
                                >
                                  <Checkbox
                                    checked={allSelected}
                                    onChange={toggleAllStores}
                                    onClick={(e) => e.stopPropagation()} // チェックボックス自体のクリックイベントも伝播を停止
                                  />
                                  <ListItemText primary="全選択/全解除" />
                                </MenuItem>
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
                                    borderBottom:
                                      "1px solid rgba(0, 0, 0, 0.12)",
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
                                    borderBottom:
                                      "1px solid rgba(0, 0, 0, 0.12)",
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    padding: "4px",
                                  }}
                                >
                                  <MenuItem
                                    onClick={handleMenuItemClick}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      width: "100%",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <Checkbox
                                      checked={allSelected}
                                      onChange={toggleAllStores}
                                      onClick={(e) => e.stopPropagation()} // チェックボックス自体のクリックイベントも伝播を停止
                                    />
                                    <ListItemText primary="全選択/全解除" />
                                  </MenuItem>
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
              </div>
              <div className="md:w-5/12 lg:w-4/12">
                <div className="bg-white border rounded-lg p-2 px-4 py-2 h-full min-w-32">
                  <div className="flex justify-between items-center mb-1 md:mt-1">
                    <h2 className="text-base font-bold mb-2 md:mb-1">
                      選択店舗
                    </h2>
                    {/* <Button
                      size="small"
                      variant="contained"
                      className="bg-blue-500 hover:bg-blue-800 text-white"
                      onClick={selectAllStores}
                    >
                      {selectedStores.length > 0 ? "全店舗解除" : "全店舗選択"}
                    </Button> */}
                  </div>
                  <div className="mb-2 md:mt-2">
                    <div className="max-h-80 overflow-y-auto">
                      {" "}
                      {/* 最大高さとスクロールを追加 */}
                      <div className="text-sm text-gray-700">
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-auto">
                <div className="bg-white border rounded-lg p-2 px-4 py-2 h-full w-full md:w-auto">
                  <h2 className="text-base font-bold mb-2 md:mb-1">表示設定</h2>
                  <div className="flex flex-col gap-4">
                    <CustomRadioGroup
                      label="---区分---"
                      value={typeValue}
                      onChange={handleTypeChange}
                      options={[
                        { value: "全て", label: "全て" },
                        { value: "直営ランセカンド", label: "直営＋ランセカンド" },
                        { value: "直営", label: "直営のみ" },
                        { value: "FC", label: "FCのみ" },
                        { value: "ランセカンド", label: "ランセカンドのみ" },
                      ]}
                    />
                    <CustomRadioGroup
                      label="---エリア---"
                      value={locationValue}
                      onChange={handleLocationChange}
                      options={[
                        { value: "全て", label: "全て" },
                        { value: "駅前", label: "駅前" },
                        { value: "郊外", label: "郊外" },
                      ]}
                    />
                    <CustomRadioGroup
                      label="---閉店店舗を---"
                      value={closedStoreValue}
                      onChange={handleClosedStoreChange}
                      options={[
                        { value: true, label: "含める" },
                        { value: false, label: "含めない" },
                      ]}
                    />
                    <CustomRadioGroup
                      label="---税抜売上にその他売上を---"
                      value={salesInclusionValue}
                      onChange={handleSalesInclusionChange}
                      options={[
                        { value: true, label: "含める" },
                        { value: false, label: "含めない" },
                      ]}
                    />
                    <CustomRadioGroup
                      label="---委託販売を---"
                      value={consignmentSales}
                      onChange={consignmentSalesInclusionChange}
                      options={[
                        { value: true, label: "含める" },
                        { value: false, label: "含めない" },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-wrap gap-2 justify-between">
              <div className="flex flex-col md:flex-row gap-4 ml-auto w-full md:w-auto justify-end">
                <Button
                  variant="contained"
                  className="bg-blue-500 hover:bg-blue-800 text-white whitespace-nowrap"
                  onClick={() => setOpenSaveModal(true)}
                  style={{ minWidth: "120px", padding: "8px 16px", fontSize: "0.875rem", height: "40px" }} // ボタンの最小幅とパディングを設定
                >
                  条件登録
                </Button>
                <FormControl fullWidth sx={{ minWidth: { xs: "100%", md: "200px" } }}>
                  <InputLabel
                    sx={{
                      fontSize: "0.875rem"
                    }}>条件を選択</InputLabel>
                  <Select
                    value={selectedCondition}
                    onChange={handleConditionChange}
                    label="条件を選択"
                    renderValue={(selected) => selected} // 選択された値のみを表示
                    sx={{
                      height: "40px", // 他のボタンと同じ高さに設定
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {conditionList.length === 0 ? (
                      <MenuItem value="">
                        条件がありません
                      </MenuItem>
                    ) : (
                      conditionList.map((condition) => (
                        <MenuItem key={condition.conditionName} value={condition.conditionName}>
                          {condition.conditionName}
                          <Tooltip arrow title="削除" placement="right">
                            <IconButton
                              edge="end"
                              aria-label="remove"
                              size="small"
                              sx={{ marginLeft: "auto" }}
                              onClick={(event) => {
                                event.stopPropagation(); // イベントの伝播を停止
                                handleDeleteCondition(condition.conditionName);
                              }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  className={`bg-${isDlLoading ? "blue-800" : "blue-500"} hover:bg-blue-800 text-white whitespace-nowrap`}
                  startIcon={<DownloadIcon className="md:inline hidden" />}
                  onClick={async () => {
                    try {
                      const data = await fetchAndTransformData(API_ENDPOINTS.download);
                      downloadCSV(data, 'data.csv'); // デコードしてCSVファイルをダウンロード
                    } catch (error) {
                      console.error("Error downloading data:", error);
                      setModalType("error");
                      setErrorMessage(error.message || "データのダウンロードに失敗しました");
                      setOpenErrorModal(true);
                    }
                  }}
                  style={{ minWidth: "120px", padding: "8px 16px", fontSize: "0.875rem", height: "40px" }} // ボタンの最小幅とパディングを設定
                >
                  {isDlLoading ? "ダウンロード中..." : "ダウンロード"}
                </Button>
                <Button
                  variant="contained"
                  className={`bg-${isLoading ? "blue-800" : "blue-500"} hover:bg-blue-800 text-white whitespace-nowrap`}
                  startIcon={<SearchIcon className="md:inline hidden" />}
                  onClick={() =>
                    fetchAndTransformData(
                      dailyCheck === "日別"
                        ? API_ENDPOINTS.display_by_date
                        : dailyCheck === "曜日別"
                          ? API_ENDPOINTS.display_by_dotw
                          : API_ENDPOINTS.display_by_store
                    )
                  }
                  style={{ minWidth: "120px", padding: "8px 16px", fontSize: "0.875rem", height: "40px" }} // ボタンの最小幅とパディングを設定
                >
                  {isLoading ? "集計中..." : "集計実行"}
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto rounded-lg border-gray-300 shadow-sm overflow-y-auto h-[400px]">
              <table className="min-w-full divide-y divide-x divide-gray-300 table-auto" style={{ tableLayout: "auto" }}>
                <thead className="bg-gray-50 sticky top-0 z-30">
                  <tr>
                    {storesData.storeData.length > 0 && (storesData.storeData[0].storeDate || storesData.storeData[0].week) ? (
                      renderTableHeader("店舗情報", `sticky left-0 z-20 border-r-2 border-r-gray-400`, 1)
                    ) : (
                      <>
                        {renderTableHeader("", "", 1)}
                        {renderTableHeader("店舗情報", `sticky left-0 z-20 ${headerFixedColumnStyles.firstColumn}`, 1)}
                        {renderTableHeader("", "border-r-2 border-r-gray-400", 2)}
                      </>
                    )}
                    {renderTableHeader("税抜売上", "border-r-2 border-r-gray-400", compareCheck ? 4 : 1)}
                    {renderTableHeader("利用者", "border-r-2 border-r-gray-400", compareCheck ? 4 : 1)}
                    {renderTableHeader("客単価", "border-r-2 border-r-gray-400", compareCheck ? 4 : 1)}
                    {renderTableHeader("新規", "border-r-2 border-r-gray-400", compareCheck ? 4 : 1)}
                    {renderTableHeader("新規率", "border-r-2 border-r-gray-400", compareCheck ? 2 : 1)}
                    {renderTableHeader("その他売上", "border-r-2 border-r-gray-400", compareCheck ? 4 : 1)}
                    {renderTableHeader("委託販売", "border-r-2 border-r-gray-400", compareCheck ? 4 : 1)}
                  </tr>
                  <tr>
                    {storesData.storeData.length > 0 && (storesData.storeData[0].storeDate || storesData.storeData[0].week) ? (
                      renderTableHeader(
                        storesData.storeData[0].storeDate ? "日付" : "曜日",
                        `sticky left-0 z-20 border-r-2 border-r-gray-400 ${headerFixedColumnStyles.dateColumn}`
                      )
                    ) : (
                      <>
                        {renderTableHeader("No", `${headerFixedColumnStyles.noColumn}`)}
                        {renderTableHeader("店舗名", `sticky left-0 z-20 ${headerFixedColumnStyles.firstColumn}`)}
                        {renderTableHeader("エリア", `${headerFixedColumnStyles.areaColumn}`)}
                        {renderTableHeaderWithSort("店番", "storeNumber", sortKey, sortDirection, handleSort, `border-r-2 border-r-gray-400 ${headerFixedColumnStyles.storeNumberColumn}`)}
                      </>
                    )}
                    {renderTableHeaderWithSort("対象期間", "netSalesA", sortKey, sortDirection, handleSort, !compareCheck ? "border-r-2 border-r-gray-400" : "")}
                    {compareCheck && (
                      <>
                        {renderTableHeaderWithSort("比較期間", "netSalesB", sortKey, sortDirection, handleSort)}
                        {renderTableHeaderWithSort("差異", "netSalesChange", sortKey, sortDirection, handleSort)}
                        {renderTableHeaderWithSort("比率", "netSalesRatio", sortKey, sortDirection, handleSort, "border-r-2 border-r-gray-400")}
                      </>
                    )}
                    {renderTableHeaderWithSort("対象期間", "usersA", sortKey, sortDirection, handleSort, !compareCheck ? "border-r-2 border-r-gray-400" : "")}
                    {compareCheck && (
                      <>
                        {renderTableHeaderWithSort("比較期間", "usersB", sortKey, sortDirection, handleSort)}
                        {renderTableHeaderWithSort("差異", "usersChange", sortKey, sortDirection, handleSort)}
                        {renderTableHeaderWithSort("比率", "usersRatio", sortKey, sortDirection, handleSort, "border-r-2 border-r-gray-400")}
                      </>
                    )}
                    {renderTableHeaderWithSort("対象期間", "avgPriceA", sortKey, sortDirection, handleSort, !compareCheck ? "border-r-2 border-r-gray-400" : "")}
                    {compareCheck && (
                      <>
                        {renderTableHeaderWithSort("比較期間", "avgPriceB", sortKey, sortDirection, handleSort)}
                        {renderTableHeaderWithSort("差異", "avgPriceChange", sortKey, sortDirection, handleSort)}
                        {renderTableHeaderWithSort("比率", "avgPriceRatio", sortKey, sortDirection, handleSort, "border-r-2 border-r-gray-400")}
                      </>
                    )}
                    {renderTableHeaderWithSort("対象期間", "newUsersA", sortKey, sortDirection, handleSort, !compareCheck ? "border-r-2 border-r-gray-400" : "")}
                    {compareCheck && (
                      <>
                        {renderTableHeaderWithSort("比較期間", "newUsersB", sortKey, sortDirection, handleSort)}
                        {renderTableHeaderWithSort("差異", "newUsersChange", sortKey, sortDirection, handleSort)}
                        {renderTableHeaderWithSort("比率", "newUsersRatio", sortKey, sortDirection, handleSort, "border-r-2 border-r-gray-400")}
                      </>
                    )}
                    {renderTableHeaderWithSort("対象期間", "newUsersRateA", sortKey, sortDirection, handleSort, !compareCheck ? "border-r-2 border-r-gray-400" : "")}
                    {compareCheck && renderTableHeaderWithSort("比較期間", "newUsersRateB", sortKey, sortDirection, handleSort, "border-r-2 border-r-gray-400")}
                    {renderTableHeaderWithSort("対象期間", "otherSalesA", sortKey, sortDirection, handleSort, !compareCheck ? "border-r-2 border-r-gray-400" : "")}
                    {compareCheck && (
                      <>
                        {renderTableHeaderWithSort("比較期間", "otherSalesB", sortKey, sortDirection, handleSort)}
                        {renderTableHeaderWithSort("差異", "otherSalesChange", sortKey, sortDirection, handleSort)}
                        {renderTableHeaderWithSort("比率", "otherSalesRatio", sortKey, sortDirection, handleSort, "border-r-2 border-r-gray-400")}
                      </>
                    )}
                    {renderTableHeaderWithSort("対象期間", "consignmentSalesA", sortKey, sortDirection, handleSort, !compareCheck ? "border-r-2 border-r-gray-400" : "")}
                    {compareCheck && (
                      <>
                        {renderTableHeaderWithSort("比較期間", "consignmentSalesB", sortKey, sortDirection, handleSort)}
                        {renderTableHeaderWithSort("差異", "consignmentSalesChange", sortKey, sortDirection, handleSort)}
                        {renderTableHeaderWithSort("比率", "consignmentSalesRatio", sortKey, sortDirection, handleSort, "border-r-2 border-r-gray-400")}
                      </>
                    )}
                  </tr>
                  <tr>
                    {storesData.storeData.length > 0 && (storesData.storeData[0].storeDate || storesData.storeData[0].week) ? (
                      renderTableHeader("合計", `sticky left-0 z-20 border-r-2 border-r-gray-400 ${headerFixedColumnStyles.firstColumn}`)
                    ) : (
                      <>
                        {renderTableHeader("", `${headerFixedColumnStyles.noColumn}`)}
                        {renderTableHeader(storesData.totalData.storeName.toLocaleString(), `sticky left-0 z-20  ${headerFixedColumnStyles.firstColumn}`)}
                        {renderTableHeader("", `${headerFixedColumnStyles.firstColumn}`)}
                        {renderTableHeader(storesData.totalData.storeNumber.toLocaleString(), `border-r-2 border-r-gray-400`)}
                      </>
                    )}
                    {renderTableHeader(storesData.totalData.netSalesA.toLocaleString(), `text-right ${!compareCheck ? "border-r-2 border-r-gray-400" : ""}`, 1)}
                    {compareCheck && (
                      <>
                        {renderTableHeader(storesData.totalData.netSalesB.toLocaleString(), "text-right")}
                        {renderTableHeader(storesData.totalData.netSalesChange.toLocaleString(), "text-right")}
                        {renderTableHeader(storesData.totalData.netSalesRatio.toLocaleString(), "text-right border-r-2 border-r-gray-400")}
                      </>
                    )}
                    {renderTableHeader(storesData.totalData.usersA.toLocaleString(), `text-right ${!compareCheck ? "border-r-2 border-r-gray-400" : ""}`, 1)}
                    {compareCheck && (
                      <>
                        {renderTableHeader(storesData.totalData.usersB.toLocaleString(), "text-right")}
                        {renderTableHeader(storesData.totalData.usersChange.toLocaleString(), "text-right")}
                        {renderTableHeader(storesData.totalData.usersRatio.toLocaleString(), "text-right border-r-2 border-r-gray-400")}
                      </>
                    )}
                    {renderTableHeader(storesData.totalData.avgPriceA.toLocaleString(), `text-right ${!compareCheck ? "border-r-2 border-r-gray-400" : ""}`, 1)}
                    {compareCheck && (
                      <>
                        {renderTableHeader(storesData.totalData.avgPriceB.toLocaleString(), "text-right")}
                        {renderTableHeader(storesData.totalData.avgPriceChange.toLocaleString(), "text-right")}
                        {renderTableHeader(storesData.totalData.avgPriceRatio.toLocaleString(), "text-right border-r-2 border-r-gray-400")}
                      </>
                    )}
                    {renderTableHeader(storesData.totalData.newUsersA.toLocaleString(), `text-right ${!compareCheck ? "border-r-2 border-r-gray-400" : ""}`, 1)}
                    {compareCheck && (
                      <>
                        {renderTableHeader(storesData.totalData.newUsersB.toLocaleString(), "text-right")}
                        {renderTableHeader(storesData.totalData.newUsersChange.toLocaleString(), "text-right")}
                        {renderTableHeader(storesData.totalData.newUsersRatio.toLocaleString(), "text-right border-r-2 border-r-gray-400")}
                      </>
                    )}
                    {renderTableHeader(storesData.totalData.newUsersRateA.toLocaleString(), `text-right ${!compareCheck ? "border-r-2 border-r-gray-400" : ""}`, 1)}
                    {compareCheck && renderTableHeader(storesData.totalData.newUsersRateB.toLocaleString(), "text-right border-r-2 border-r-gray-400")}
                    {renderTableHeader(storesData.totalData.otherSalesA.toLocaleString(), `text-right ${!compareCheck ? "border-r-2 border-r-gray-400" : ""}`, 1)}
                    {compareCheck && (
                      <>
                        {renderTableHeader(storesData.totalData.otherSalesB.toLocaleString(), "text-right")}
                        {renderTableHeader(storesData.totalData.otherSalesChange.toLocaleString(), "text-right")}
                        {renderTableHeader(storesData.totalData.otherSalesRatio.toLocaleString(), "text-right border-r-2 border-r-gray-400")}
                      </>
                    )}
                    {renderTableHeader(storesData.totalData.consignmentSalesA.toLocaleString(), `text-right ${!compareCheck ? "border-r-2 border-r-gray-400" : ""}`, 1)}
                    {compareCheck && (
                      <>
                        {renderTableHeader(storesData.totalData.consignmentSalesB.toLocaleString(), "text-right")}
                        {renderTableHeader(storesData.totalData.consignmentSalesChange.toLocaleString(), "text-right")}
                        {renderTableHeader(storesData.totalData.consignmentSalesRatio.toLocaleString(), "text-right border-r-2 border-r-gray-400")}
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sortedStoresData.map((store, index) => (
                    <tr key={`${store.storeNumber}-${index}`}>
                      {storesData.storeData.length > 0 && (storesData.storeData[0].storeDate || storesData.storeData[0].week) ? (
                        renderTableCell(store.storeDate || store.week, `border-r-2 border-r-gray-400 ${dataFixedColumnStyles.dateColumn}`)
                      ) : (
                        <>
                          {renderTableCell(index + 1, `${dataFixedColumnStyles.othersColumn}`)}
                          {renderTableCell(store.storeName, `${dataFixedColumnStyles.firstColumn}`)}
                          {renderTableCell(store.area, `${dataFixedColumnStyles.othersColumn}`)}
                          {renderTableCell(store.storeNumber, `border-r-2 border-r-gray-400 ${dataFixedColumnStyles.othersColumn}`)}
                        </>
                      )}
                      {renderTableCell(store.netSalesA.toLocaleString(), `text-right ${!compareCheck ? "border-r-2 border-r-gray-400" : ""}`, 1)}
                      {compareCheck && (
                        <>
                          {renderTableCell(store.netSalesB.toLocaleString(), "text-right")}
                          {renderTableCell(store.netSalesChange.toLocaleString(), "text-right")}
                          {renderTableCell(store.netSalesRatio.toLocaleString(), "text-right border-r-2 border-r-gray-400")}
                        </>
                      )}
                      {renderTableCell(store.usersA.toLocaleString(), `text-right ${!compareCheck ? "border-r-2 border-r-gray-400" : ""}`, 1)}
                      {compareCheck && (
                        <>
                          {renderTableCell(store.usersB.toLocaleString(), "text-right")}
                          {renderTableCell(store.usersChange.toLocaleString(), "text-right")}
                          {renderTableCell(store.usersRatio.toLocaleString(), "text-right border-r-2 border-r-gray-400")}
                        </>
                      )}
                      {renderTableCell(store.avgPriceA.toLocaleString(), `text-right ${!compareCheck ? "border-r-2 border-r-gray-400" : ""}`, 1)}
                      {compareCheck && (
                        <>
                          {renderTableCell(store.avgPriceB.toLocaleString(), "text-right")}
                          {renderTableCell(store.avgPriceChange.toLocaleString(), "text-right")}
                          {renderTableCell(store.avgPriceRatio.toLocaleString(), "text-right border-r-2 border-r-gray-400")}
                        </>
                      )}
                      {renderTableCell(store.newUsersA.toLocaleString(), `text-right ${!compareCheck ? "border-r-2 border-r-gray-400" : ""}`, 1)}
                      {compareCheck && (
                        <>
                          {renderTableCell(store.newUsersB.toLocaleString(), "text-right")}
                          {renderTableCell(store.newUsersChange.toLocaleString(), "text-right")}
                          {renderTableCell(store.newUsersRatio.toLocaleString(), "text-right border-r-2 border-r-gray-400")}
                        </>
                      )}
                      {renderTableCell(store.newUsersRateA.toLocaleString(), `text-right ${!compareCheck ? "border-r-2 border-r-gray-400" : ""}`, 1)}
                      {compareCheck && renderTableCell(store.newUsersRateB.toLocaleString(), "text-right border-r-2 border-r-gray-400")}
                      {renderTableCell(store.otherSalesA.toLocaleString(), `text-right ${!compareCheck ? "border-r-2 border-r-gray-400" : ""}`, 1)}
                      {compareCheck && (
                        <>
                          {renderTableCell(store.otherSalesB.toLocaleString(), "text-right")}
                          {renderTableCell(store.otherSalesChange.toLocaleString(), "text-right")}
                          {renderTableCell(store.otherSalesRatio.toLocaleString(), "text-right border-r-2 border-r-gray-400")}
                        </>
                      )}
                      {renderTableCell(store.consignmentSalesA.toLocaleString(), `text-right ${!compareCheck ? "border-r-2 border-r-gray-400" : ""}`, 1)}
                      {compareCheck && (
                        <>
                          {renderTableCell(store.consignmentSalesB.toLocaleString(), "text-right")}
                          {renderTableCell(store.consignmentSalesChange.toLocaleString(), "text-right")}
                          {renderTableCell(store.consignmentSalesRatio.toLocaleString(), "text-right border-r-2 border-r-gray-400")}
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div >

        </div >
      </Layout >
      <Dialog
        open={openSaveModal} onClose={handleCloseSaveModal} aria-labelledby="save-condition-dialog-title"
        maxWidth="xs" // ここでダイアログの最大幅を設定
        fullWidth // ここでダイアログを全幅に設定
      >
        <DialogTitle id="save-condition-dialog-title">
          条件を保存
          <IconButton
            aria-label="close"
            onClick={handleCloseSaveModal}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            条件名を入力してください。
          </Typography>
          <TextField
            label="条件名"
            value={conditionName}
            onChange={handleConditionNameChange}
            error={Boolean(conditionError)}
            helperText={`${conditionName.length}/10`}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSaveModal} variant="outlined">
            キャンセル
          </Button>
          <Button onClick={handleSaveCondition} variant="contained" color="primary" startIcon={<SaveIcon />} disabled={Boolean(conditionError) || !conditionName}>
            保存
          </Button>
        </DialogActions>
      </Dialog>
      <ErrorModal
        open={openErrorModal}
        onClose={handleCloseErrorModal}
        modalType={modalType}
        errorMessage={errorMessage}
      />
    </>
  );
};

export default IndexPage;
