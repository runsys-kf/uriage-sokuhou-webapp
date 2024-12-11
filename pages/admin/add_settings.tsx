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
import { useMobile } from "../../contexts/MobileContext";
import { useRouter } from "next/router";
import Sidebar from "./../../components/SidebarButton";
import ErrorModal from "./../../components/ErrorModal";
import { fetchData, API_ENDPOINTS } from "../api/apiService";

const Settings = () => {
    const router = useRouter();
    const isMobile = useMobile();
    const [storeNumber, setStoreNumber] = useState(""); //店舗番号
    const [storeName, setStoreName] = useState(""); //店舗名
    const [category, setCategory] = useState("直営"); //区分
    const [area, setArea] = useState("駅前"); //エリア
    const [openClose, setOpenClose] = useState("開店"); //開店・閉店
    const [owners, setOwners] = useState<string[]>([]); //取得したオーナー名
    // const [selectedOwners, setSelectedOwners] = useState<string[]>([]);//選択されたオーナー名
    // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // エラーモーダルの状態
    const [openErrorModal, setOpenErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [modalType, setModalType] = useState<"error" | "info">("error");

    // エラーモーダルを閉じる関数
    const handleCloseErrorModal = () => {
        setOpenErrorModal(false);
    };

    // プルダウン
    const handleOwnersChange = (event: SelectChangeEvent<string[]>) => {
        console.log("owners" + owners);
        setOwners(event.target.value as string[]);
    };

    // 店舗番号の入力制限
    const handleStoreNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (/^\d{0,4}$/.test(value)) {
            setStoreNumber(value);
        }
    };

    // オーナー名　カンマで区切って配列に変換し、trimで両端の空白、filterで未入力を削除
    const handleOwnerInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const ownerArray = inputValue
            .split(",")
            .map((owner) => owner.trim())
            .filter((owner) => owner !== "");
        setOwners(ownerArray);
    };

    //送信データ
    const createRequestData = () => {
        return {
            BaseNo: storeNumber,     // 店舗番号
            BaseName: storeName,     // 店舗名
            BusinessType: category,  // 区分
            Area: area,              // エリア
            Owner: owners,           // オーナー名
        };
    }

    //追加ボタン（バックエンド送信　＆　画面遷移）
    const handleSubmit = async (endpoint) => {
        //未入力チェック
        let errorMessages = [];
        if (!storeNumber) {
            errorMessages.push("店舗番号");
        }
        if (!storeName) {
            errorMessages.push("店舗名");
        }
        if (owners.length === 0) {
            errorMessages.push("オーナー名");
        }

        if (errorMessages.length > 0) {
            setModalType("error");
            setErrorMessage(errorMessages.join("、")+" が未入力です。");
            setOpenErrorModal(true);
            return;
        }
        try {
            /** テスト環境用 */
            const isTestMode = process.env.NODE_ENV === "development"; //テスト環境か本番化フラグ
            if (isTestMode) {
                router.push("/admin");
                return;
            }

            /** 本番環境用 */
            const params = createRequestData();          //リクエストパラメータ作成
            await fetchData(endpoint, params, router);   //バックエンドに送信
            console.log("成功");
            router.push("/admin");
        } catch (error) {
            console.error("Error fetching data:", error);
            setModalType("error");
            setErrorMessage(error.message || "データの取得に失敗しました");
            setOpenErrorModal(true);
        }
    };

    //キャンセル
    const handleCancelClick = () => {
        router.push("/admin");
    };

    return (
        <>
            <Layout title="新規追加 | 売上速報">
                <div className="bg-gray-50 min-h-screen">
                    <div className="flex">
                        <Sidebar
                            isMobile={isMobile}
                        />
                        {/* メインコンテンツ */}
                        <div className="p-2 md:p-4 w-full md:mt-0 mt-14">
                            {/* コンテンツ */}
                            <div className="p-2 md:p-4 w-full">
                                <h2 className="text-xl font-bold mb-4">新規店舗を追加</h2>
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
                                                <FormControl
                                                    variant="outlined"
                                                    style={{ width: "300px" }}
                                                >
                                                    <TextField
                                                        id="storeNumber"
                                                        label="店舗番号"
                                                        variant="outlined"
                                                        className="w-50"
                                                        type="number"
                                                        inputProps={{ min: 0, max: 9999 }}
                                                        value={storeNumber}
                                                        onChange={handleStoreNumberChange}
                                                    />
                                                </FormControl>
                                            </div>
                                            {/* 店舗名 */}
                                            <div className="flex flex-wrap items-center gap-4">
                                                <label
                                                    htmlFor="storeName"
                                                    className="block text-gray-700 text-sm font-bold w-[70px]"
                                                >
                                                    店舗名
                                                </label>
                                                <FormControl
                                                    variant="outlined"
                                                    style={{ width: "300px" }}
                                                >
                                                    <TextField
                                                        id="storeName"
                                                        label="店舗名"
                                                        variant="outlined"
                                                        className="w-50"
                                                        onChange={(e) => setStoreName(e.target.value)}
                                                    />
                                                </FormControl>
                                            </div>

                                            {/* 区分 */}
                                            <div className="flex flex-wrap items-center gap-4">
                                                <label
                                                    htmlFor="category"
                                                    className="block text-gray-700 text-sm font-bold w-[70px]"
                                                >
                                                    区分
                                                </label>
                                                <FormControl
                                                    variant="outlined"
                                                    style={{ width: "300px" }}
                                                >
                                                    <InputLabel id="category">区分</InputLabel>
                                                    <Select
                                                        labelId="category"
                                                        id="category"
                                                        value={category}
                                                        onChange={(e) =>
                                                            setCategory(e.target.value as string)
                                                        }
                                                        label="category"
                                                    >
                                                        <MenuItem value="直営">直営</MenuItem>
                                                        <MenuItem value="FC">FC</MenuItem>
                                                        <MenuItem value="ランセカンド">ランセカンド</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </div>

                                            {/* エリア */}
                                            <div className="flex flex-wrap items-center gap-4">
                                                <label
                                                    htmlFor="area"
                                                    className="block text-gray-700 text-sm font-bold w-[70px]"
                                                >
                                                    エリア
                                                </label>
                                                <FormControl
                                                    variant="outlined"
                                                    style={{ width: "300px" }}
                                                >
                                                    <InputLabel id="area">エリア</InputLabel>
                                                    <Select
                                                        labelId="area"
                                                        id="area"
                                                        value={area}
                                                        onChange={(e) => setArea(e.target.value as string)}
                                                        label="area"
                                                    >
                                                        <MenuItem value="駅前">駅前</MenuItem>
                                                        <MenuItem value="郊外">郊外</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </div>

                                            {/* オーナー名 */}
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
                                                    <TextField
                                                        id="ownerName"
                                                        variant="outlined"
                                                        className="w-50"
                                                        label="オーナー名"
                                                        onChange={handleOwnerInput}
                                                    />
                                                </FormControl>
                                                <div className="text-gray-500 text-sm">※複数入力時はカンマ（,）で区切って入力してください。</div>
                                            </div>
                                            {/* 開店・閉店 */}
                                            <div className="flex flex-wrap items-center gap-4">
                                                <label
                                                    htmlFor="openClose"
                                                    className="block text-gray-700 text-sm font-bold w-[70px]"
                                                >
                                                    開店・閉店
                                                </label>
                                                <FormControl
                                                    variant="outlined"
                                                    style={{ width: "300px" }}
                                                >
                                                    <InputLabel id="openClose">開店・閉店</InputLabel>
                                                    <Select
                                                        labelId="openClose"
                                                        id="openClose"
                                                        value={openClose}
                                                        onChange={(e) => setOpenClose(e.target.value as string)}
                                                        label="openClose"
                                                    >
                                                        <MenuItem value="開店">開店</MenuItem>
                                                        <MenuItem value="閉店">閉店</MenuItem>
                                                    </Select>
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
                                            onClick={() => handleSubmit(API_ENDPOINTS.new_shop_addition)}
                                        >
                                            追加
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
            <ErrorModal
                open={openErrorModal}
                onClose={handleCloseErrorModal}
                modalType={modalType}
                errorMessage={errorMessage}
            />
        </>
    );
};

export default Settings;
