import React from "react";
import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  IconButton,
  Drawer,
  Button,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
  List,
  TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useMobile } from "../../contexts/MobileContext";
import { useRouter } from "next/router";
import SidebarButton from "@/components/SidebarButton";

const Settings = () => {
  const router = useRouter();
  const isMobile = useMobile();
  const [storeNumber, setStoreNumber] = useState(""); //店舗番号
  const [category, setCategory] = useState(""); //区分
  const [area, setArea] = useState(""); //エリア
  const [owners, setOwners] = useState<string[]>([]); //取得したオーナー名
  // const [selectedOwners, setSelectedOwners] = useState<string[]>([]);//選択されたオーナー名
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // パラメーターを取得
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const storeNumberParam = params.get("storeNumber");
    const categoryParam = params.get("category");
    const areaParam = params.get("area");
    const ownerParam = params.get("owner");
    console.log("owners" + owners);
    if (storeNumberParam) {
      setStoreNumber(decodeURIComponent(storeNumberParam));
    }
    if (categoryParam) {
      setCategory(decodeURIComponent(categoryParam));
    }
    if (areaParam) {
      setArea(decodeURIComponent(areaParam));
    }
    if (ownerParam) {
      setOwners(decodeURIComponent(ownerParam).split(","));
    }
  }, [router.isReady, router.query]);

  // プルダウン
  const handleOwnersChange = (event: SelectChangeEvent<string[]>) => {
    console.log("owners" + owners);
    setOwners(event.target.value as string[]);
  };

  // テキストボックス
  const handleOwnerInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    // カンマで区切って配列に変換し、trimで両端の空白、filterで未入力を削除
    const ownerArray = inputValue
      .split(",")
      .map((owner) => owner.trim())
      .filter((owner) => owner !== "");
    setOwners(ownerArray);
  };

  //変更ボタン（バックエンド送信　＆　画面遷移）
  const handleSubmit = async () => {
    //画面遷移
    console.log(owners);
    router.push("/admin");
    try {
      //バックエンドのレスポンスを取得できるまで非同期で待機
      const response = await fetch("バックエンドURL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeNumber,
          category,
          area,
          owners,
        }),
      });
      if (!response.ok) {
        throw new Error("ネットワークの応答が正しくありません");
      }
      const data = await response.json();
      console.log("成功：", data);

      //画面遷移
      console.log("test");
      router.push("/admin");
    } catch (error) {
      console.error("エラー：", error);
    }
  };

  //キャンセル
  const handleCancelClick = () => {
    router.push("/admin");
  };

  //ダッシュボード画面へ遷移
  const handleDashboardClick = () => {
    router.push("/admin");
  };

  //ログ画面へ遷移
  const handleLogClick = () => {
    router.push("/admin/log");
  };

  //オーナーリスト
  const ownersList = [
    "オーナー1",
    "オーナー2",
    "オーナー3",
    "オーナー4",
    "オーナー5",
    "オーナー6",
    "オーナー7",
    "オーナー8",
    "オーナー9",
    "オーナー10",
    "オーナー11",
    "オーナー12",
    "オーナー13",
    "オーナー14",
    "オーナー15",
    "オーナー16",
    "オーナー17",
  ];

  return (
    <>
      <Layout title="権限編集 | 売上速報">
        <div className="bg-gray-50 min-h-screen flex">
          {/* スマホ表示時のDrawer */}
          {isMobile ? (
            <Drawer anchor="left" open={isSidebarOpen} onClose={toggleSidebar}>
              <div className="w-60">
                <h1 className="text-xl font-semibold p-4 bg-gray-500 text-white">
                  管理システム
                </h1>

                <List>
                  <SidebarButton
                    icon={<DashboardIcon />}
                    text="ダッシュボード"
                    onClick={handleDashboardClick}
                  />
                  <SidebarButton
                    icon={<ReceiptIcon />}
                    text="ログ"
                    onClick={handleLogClick}
                  />
                </List>
              </div>
            </Drawer>
          ) : (
            // PC表示時のサイドバー
            <div className="w-60 border-r-[1px] border-gray-400">
              <h1 className="text-xl font-semibold p-4 bg-gray-500 text-white">
                管理システム
              </h1>
              <List>
                <SidebarButton
                  icon={<DashboardIcon />}
                  text="ダッシュボード"
                  onClick={handleDashboardClick}
                />
                <SidebarButton
                  icon={<ReceiptIcon />}
                  text="ログ"
                  onClick={handleLogClick}
                />
              </List>
            </div>
          )}
          {/* メインコンテンツ */}
          <div className="md:flex-1 w-full pb-20">
            {/* ハンバーガーメニューアイコン */}
            {isMobile && (
              <div className="bg-gray-500">
                <button className="px-4 md:hidden" onClick={toggleSidebar}>
                  <div className="flex items-center">
                    <IconButton
                      edge="start"
                      color="primary"
                      aria-label="menu"
                      onClick={toggleSidebar}
                    >
                      <MenuIcon />
                    </IconButton>
                  </div>
                </button>
              </div>
            )}
            {/* コンテンツ */}
            <div className="p-2 md:p-4 w-full">
              <h2 className="text-xl font-bold mb-4">編集</h2>
              <div className="flex flex-col md-2 md:mb-4 gap-4">
                <div className="border p-4 rounded-lg w-full">
                  <div className="flex flex-col gap-4 mb-4">
                    {/* 店舗番号 */}
                    <div className="flex flex-wrap items-center gap-4">
                      <label
                        htmlFor="storeNumber"
                        className="block text-gray-700 text-sm font-bold w-[70px]"
                      >
                        店舗番号
                      </label>
                      <span className="text-lg font-semibold">
                        {storeNumber}
                      </span>
                      {/*<TextField id="storeNumber" variant="outlined" className="w-50" />*/}
                    </div>

                    {/* 区分 */}
                    <div className="flex flex-wrap items-center gap-4">
                      <label
                        htmlFor="category1"
                        className="block text-gray-700 text-sm font-bold w-[70px]"
                      >
                        区分
                      </label>
                      <FormControl
                        variant="outlined"
                        style={{ width: "300px" }}
                      >
                        <InputLabel id="category1">区分</InputLabel>
                        <Select
                          labelId="category1-label"
                          id="category1"
                          value={category}
                          onChange={(e) =>
                            setCategory(e.target.value as string)
                          }
                          label="分類1"
                        >
                          <MenuItem value="直営">直営</MenuItem>
                          <MenuItem value="FC">FC</MenuItem>
                        </Select>
                      </FormControl>
                      {/* <TextField
                        id="category1"
                        variant="outlined"
                        className="w-50"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      /> */}
                    </div>

                    {/* エリア */}
                    <div className="flex flex-wrap items-center gap-4">
                      <label
                        htmlFor="category2"
                        className="block text-gray-700 text-sm font-bold w-[70px]"
                      >
                        エリア
                      </label>
                      <FormControl
                        variant="outlined"
                        style={{ width: "300px" }}
                      >
                        <InputLabel id="category2-label">エリア</InputLabel>
                        <Select
                          labelId="category2-label"
                          id="category2"
                          value={area}
                          onChange={(e) => setArea(e.target.value as string)}
                          label="分類2"
                        >
                          <MenuItem value="駅前">駅前</MenuItem>
                          <MenuItem value="郊外">郊外</MenuItem>
                        </Select>
                      </FormControl>
                    </div>

                    {/* オーナー名(プルダウン) */}
                    <div className="flex flex-wrap items-center gap-4">
                      <label
                        htmlFor="ownerName"
                        className="block text-gray-700 text-sm font-bold w-[70px]"
                      >
                        オーナー名
                      </label>
                      <FormControl
                        variant="outlined"
                        style={{ width: "300px" }}
                      >
                        {/*<InputLabel id="owners-label">オーナー名</InputLabel>
                         <Select
                          labelId="owners-label"
                          id="ownerName"
                          multiple
                          value={owners}
                          onChange={handleOwnersChange}
                          label="オーナー名"
                          renderValue={(selected) => selected.join(", ")}
                        >
                          {ownersList.map((owner) => (
                            <MenuItem key={owner} value={owner}>
                              <Checkbox checked={owners.indexOf(owner) > -1} />
                              <ListItemText primary={owner} />
                            </MenuItem>
                          ))}
                        </Select> */}
                        <TextField
                          id="ownerName"
                          variant="outlined"
                          className="w-50"
                          onChange={handleOwnerInput}
                        />
                      </FormControl>
                    </div>
                  </div>

                  {/* キャンセルと変更ボタン */}
                </div>
                <div className="flex justify-end gap-4">
                  <Button
                    variant="outlined"
                    className="px-2 md:px-4 py-2 border-blue-500 text-blue-500 hover:text-blue-800 hover:border-blue-800"
                    onClick={handleCancelClick}
                  >
                    キャンセル
                  </Button>
                  <Button
                    variant="contained"
                    className="bg-blue-500 hover:bg-blue-800 text-white px-2 md:px-4 py-2"
                    onClick={handleSubmit}
                  >
                    変更
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Settings;
