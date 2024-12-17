import React from "react";
import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import {
    Select,
    MenuItem,
    Button,
    FormControl,
    InputLabel,
    SelectChangeEvent,
    TextField,
} from "@mui/material";
import { useMobile } from "../../contexts/MobileContext";
import { useRouter } from "next/router";
import Sidebar from "./../../components/SidebarButton";
import ConfirmationModal from "./../../components/ConfirmationModal";
import ErrorModal from "./../../components/ErrorModal";
import { fetchData, API_ENDPOINTS } from "../api/apiService";
import { prefectures } from "../../data/prefecturesData";

const Settings = () => {
    const router = useRouter();
    const isMobile = useMobile();
    const [storeNumber, setStoreNumber] = useState(""); //店舗番号
    const [storeName, setStoreName] = useState(""); //店舗名
    const [abbreviation, setAbbreviation] = useState("");//略名
    const [category, setCategory] = useState(""); //区分
    const [area, setArea] = useState(""); //エリア
    const [region, setRegion] = useState(""); //地方名
    const [prefecture, setPrefecture] = useState(""); //都道府県
    const [owners, setOwners] = useState<string[]>([]); //取得したオーナー名
    const [ownersInput, setOwnersInput] = useState(""); // オーナー名の入力値
    const [openClose, setOpenClose] = useState(""); //開店・閉店
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [errors, setErrors] = useState({
        storeNumber: "",
        storeName: "",
        abbreviation: "",
        category: "",
        area: "",
        region: "",
        prefecture: "",
        owners: "",
        openClose: "",
    });
    const [openErrorModal, setOpenErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [modalType, setModalType] = useState<"error" | "info">("error");
    const [filteredPrefectures, setFilteredPrefectures] = useState<string[]>([]);

    const uniqueRegions = Array.from(new Set(prefectures.map(p => p.region)));//地区
    const prefectureList = prefectures.map(p => p.prefecture);//都道府県

    const handleOwnersChange = (event: SelectChangeEvent<string[]>) => {
        setOwners(event.target.value as string[]);
    };
    useEffect(() => {
        if (region) {
            const filtered = prefectures
                .filter(p => p.region === region)
                .map(p => p.prefecture);
            setFilteredPrefectures(filtered);
        } else {
            setFilteredPrefectures([]);
        }
    }, [region]);

    const handleStoreNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (/^\d{0,4}$/.test(value)) {
            setStoreNumber(value);
        }
    };

    const handleOwnerInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setOwnersInput(inputValue);
        const ownerArray = inputValue
            .split(",")
            .map((owner) => owner.trim())
            .filter((owner) => owner !== "");
        setOwners(ownerArray);
    };

    const validateFields = () => {
        const newErrors = {
            storeNumber: storeNumber ? "" : "店舗番号が未入力です。",
            storeName: storeName ? "" : "店舗名が未入力です。",
            abbreviation: abbreviation ? "" : "略名が未入力です。",
            category: category ? "" : "区分が未入力です。",
            area: area ? "" : "エリアが未入力です。",
            region: region ? "" : "地区が未入力です。",
            prefecture: prefecture ? "" : "都道府県が未入力です。",
            owners: owners.length > 0 ? "" : "オーナー名が未入力です。",
            openClose: openClose ? "" : "開店・閉店が未入力です。",
        };
        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === "");
    };

    const handleSubmit = () => {
        if (validateFields()) {
            setOpenConfirmationModal(true);
        }
    };

    const handleConfirm = async () => {
        setOpenConfirmationModal(false);
        try {
            const isTestMode = process.env.NODE_ENV === "development";
            if (isTestMode) {
                router.push("/admin");
                return;
            }

            const params = {
                BaseNo: storeNumber,     //店舗番号
                BaseName: storeName,     //店舗名
                Class: category,         //区分
                Area: area,              //エリア
                Prefecture: prefecture,  //都道府県
                District: region,        //地区
                BaseName2: abbreviation, //略名
                Owner: owners,           //オーナー
                Status: openClose,       //ステータス
            };
            await fetchData(API_ENDPOINTS.new_shop_addition, params, router);
            router.push("/admin");
        } catch (error) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                submit: error.message || "データの取得に失敗しました",
            }));
            setErrorMessage(error.message || "データの取得に失敗しました");
            setOpenErrorModal(true);
        }
    };

    //キャンセルボタン
    const handleCancelClick = () => {
        router.push("/admin");
    };

    return (
        <>
            <Layout title="新規追加 | 売上速報">
                <div className="bg-gray-50 min-h-screen">
                    <div className="flex">
                        <Sidebar isMobile={isMobile} />
                        <div className="p-2 md:p-4 w-full md:mt-0 mt-14">
                            <div className="p-2 md:p-4 w-full">
                                <h2 className="text-xl font-bold mb-4">新規店舗を追加</h2>
                                <div className="flex flex-col md-2 md:mb-4 gap-4">
                                    <div className="border p-4 rounded-lg w-full">
                                        <div className="flex flex-col gap-4 mb-4">
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
                                                        error={!!errors.storeNumber}
                                                        helperText={errors.storeNumber}
                                                    />
                                                </FormControl>
                                            </div>
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
                                                        value={storeName}
                                                        onChange={(e) => setStoreName(e.target.value)}
                                                        error={!!errors.storeName}
                                                        helperText={errors.storeName}
                                                    />
                                                </FormControl>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4">
                                                <label
                                                    htmlFor="abbreviation"
                                                    className="block text-gray-700 text-sm font-bold w-[70px]"
                                                >
                                                    略名
                                                </label>
                                                <FormControl
                                                    variant="outlined"
                                                    style={{ width: "300px" }}
                                                >
                                                    <TextField
                                                        id="abbreviation"
                                                        label="略名"
                                                        variant="outlined"
                                                        className="w-50"
                                                        value={abbreviation}
                                                        onChange={(e) => setAbbreviation(e.target.value)}
                                                        error={!!errors.abbreviation}
                                                        helperText={errors.abbreviation}
                                                    />
                                                </FormControl>
                                            </div>
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
                                                        onChange={(e) => setCategory(e.target.value as string)}
                                                        label="category"
                                                        error={!!errors.category}
                                                    >
                                                        <MenuItem value="直営">直営</MenuItem>
                                                        <MenuItem value="FC">FC</MenuItem>
                                                        <MenuItem value="ランセカンド">ランセカンド</MenuItem>
                                                    </Select>
                                                    {errors.category && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                                                    )}
                                                </FormControl>
                                            </div>
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
                                                        error={!!errors.area}
                                                    >
                                                        <MenuItem value="駅前">駅前</MenuItem>
                                                        <MenuItem value="郊外">郊外</MenuItem>
                                                    </Select>
                                                    {errors.area && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.area}</p>
                                                    )}
                                                </FormControl>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4">
    <label
        htmlFor="region"
        className="block text-gray-700 text-sm font-bold w-[70px]"
    >
        地区
    </label>
    <FormControl
        variant="outlined"
        style={{ width: "300px" }}
    >
        <InputLabel id="region">地区</InputLabel>
        <Select
            labelId="region"
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value as string)}
            label="region"
            error={!!errors.region}
        >
            {uniqueRegions.map((region) => (
                <MenuItem key={region} value={region}>{region}</MenuItem>
            ))}
        </Select>
        {errors.region && (
            <p className="text-red-500 text-xs mt-1">{errors.region}</p>
        )}
    </FormControl>
</div>
<div className="flex flex-wrap items-center gap-4">
    <label
        htmlFor="prefecture"
        className="block text-gray-700 text-sm font-bold w-[70px]"
    >
        都道府県
    </label>
    <FormControl
        variant="outlined"
        style={{ width: "300px" }}
    >
        <InputLabel id="prefecture">都道府県</InputLabel>
        <Select
            labelId="prefecture"
            id="prefecture"
            value={prefecture}
            onChange={(e) => setPrefecture(e.target.value as string)}
            label="prefecture"
            error={!!errors.prefecture}
        >
            {filteredPrefectures.map((prefecture) => (
                <MenuItem key={prefecture} value={prefecture}>{prefecture}</MenuItem>
            ))}
        </Select>
        {errors.prefecture && (
            <p className="text-red-500 text-xs mt-1">{errors.prefecture}</p>
        )}
    </FormControl>
</div>
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
                                                        value={ownersInput}
                                                        onChange={handleOwnerInput}
                                                        error={!!errors.owners}
                                                        helperText={errors.owners}
                                                    />
                                                </FormControl>
                                                <div className="text-gray-500 text-sm">※複数入力時はカンマ（,）で区切って入力してください。</div>
                                            </div>
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
                                                        error={!!errors.openClose}
                                                    >
                                                        <MenuItem value="開店">開店</MenuItem>
                                                        <MenuItem value="閉店">閉店</MenuItem>
                                                    </Select>
                                                    {errors.openClose && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.openClose}</p>
                                                    )}
                                                </FormControl>
                                            </div>
                                        </div>
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
                onClose={() => setOpenErrorModal(false)}
                modalType={modalType}
                errorMessage={errorMessage}
            />
            <ConfirmationModal
                open={openConfirmationModal}
                onClose={() => setOpenConfirmationModal(false)}
                onConfirm={handleConfirm}
                inputData={{
                    storeNumber,
                    storeName,
                    abbreviation,
                    category,
                    area,
                    region,
                    prefecture,
                    owners,
                    openClose,
                }}
            />
        </>
    );
};

export default Settings;