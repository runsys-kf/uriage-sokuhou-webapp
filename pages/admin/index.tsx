import Layout from "@/components/Layout";
import React, { useState, useEffect } from "react";
import { IconButton, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditIcon from "@mui/icons-material/Edit";
import { useMobile } from "../../contexts/MobileContext";
import { useRouter } from "next/router";
import Sidebar from "./../../components/SidebarButton";
import { fetchData } from "../api/apiService";
import { stores_info_sequential } from "../../__tests__/storesInfoMockData";

interface StoreInfo {
	id: string;
	BaseNo: string;
	BaseName: string;
	Class: string;
	Area: string;
	Owner: string;
}

const AdminPage = () => {
	const router = useRouter();
	const isMobile = useMobile();
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [currentPage, setCurrentPage] = useState(1); //現在のメージ
	const itemsPerPage = 20; //データ表示件数
	const [storesInfo, setStoresInfo] = useState<StoreInfo[]>([]);

	const columns = [
		{ key: "id", label: "ID" },
		{ key: "BaseNo", label: "店舗番号" },
		{ key: "BaseName", label: "店舗名" },
		{ key: "Class", label: "区分" },
		{ key: "Area", label: "エリア" },
		{ key: "Owner", label: "オーナー" },
	];

	// テーブルデータ取得
	useEffect(() => {
		const isTestMode = process.env.NODE_ENV === "development";
		if (isTestMode) {
			setStoresInfo(stores_info_sequential());
			return;
		}
		const fetchDataFromBackend = async () => {
			try {
				const data = await fetchData("display_by_store", {}, router);
				setStoresInfo(data);
			} catch (error) {
				console.error("データの取得に失敗しました:", error);
			}
		};

		fetchDataFromBackend();
	}, [router.query]);

	//インポート
	const handleImport = () => {
		if (selectedFile) {
			console.log(`ファイルをインポート中: ${selectedFile.name}`);
			const reader = new FileReader();
			reader.onload = (e) => {
				const content = e.target?.result;
				const contents = e.target?.result;
				console.log("ファイルの内容:", contents);
				// ここでファイルの内容を処理します
			};
			reader.readAsText(selectedFile);
		} else {
			console.log("ファイルが選択されていません");
		}
	};

	//編集画面へ
	const navigateToEditPage = (store: StoreInfo) => {
		router.push({
			pathname: "/admin/settings",
			query: {
				id: store.id,
				storeNumber: store.BaseNo,
				storeName: store.BaseName,
				category: store.Class,
				area: store.Area,
				owner: store.Owner,
			},
		});
	};

	const indexOfLastItem = currentPage * itemsPerPage; //ページ最後のデータ番号　現在のページ番号と最大表示数をかける
	const indexOfFirstItem = indexOfLastItem - itemsPerPage; //ページ最初のデータ番号　ページ最後のデータから最大ページ表示数を引く
	const currentItems = storesInfo.slice(indexOfFirstItem, indexOfLastItem);//slice()で最初と最後の番号を使い抜き出す

	//次のページ　現在ページ＋1
	const handleNextPage = () => {
		if (currentPage < Math.ceil(storesInfo.length / itemsPerPage)) {
			setCurrentPage(currentPage + 1);
		}
	};

	//前のページ　現在ページ-1
	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	// ログアウト処理を修正
	const handleLogout = async () => {
		try {
			//await fetchData(API_ENDPOINTS.logout, null, router);
			router.replace("/admin/admin_login"); // pushではなくreplaceを使用
		} catch (error) {
			console.error("Logout failed:", error);
			router.replace("/admin/admin_login");
		}
	};

	return (
		<>
			<Layout title="管理者システム | 売上速報">
				<div className="bg-gray-50 min-h-screen">
					<div className="flex">
						<Sidebar isMobile={isMobile} />

						{/* メインコンテンツ */}
						<div className="md:flex-1 w-full pb-20">
							{/* コンテンツ */}
							<div className="p-2 md:p-4 w-full md:mt-0 mt-14">
								<div className="flex justify-between items-center mb-4">
									<h2 className="text-xl font-bold mb-4">
										管理者システム - 権限一覧
									</h2>
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
								<div className="flex flex-wrap md:flex-row md-2 md:mb-4 gap-2 justify-end">
									<Button
										variant="outlined"
										className="px-2 md:px-4 py-2 font-bold text-blue-500 border-2 border-blue-500 hover:border-2 hover:bg-blue-500 hover:border-blue-500 hover:text-white"
										onClick={() => router.push("/admin/add_settings")}
									>
										新規店舗を追加
									</Button>
								</div>
								<div className="flex gap-4 items-center md:mr-4">
								</div>
								<div className="flex justify-between flex-col md:flex-row md-2 gap-2">
									<div className="flex items-center gap-8 ml-auto">
										<div className="flex items-center text-sm">
											<IconButton
												color="primary"
												component="span"
												onClick={handlePreviousPage}
											>
												<ChevronLeftIcon />
											</IconButton>
											<p>前ページ</p>
										</div>
										<div className="flex items-center text-sm">
											<p>次ページ</p>
											<IconButton
												color="primary"
												component="span"
												onClick={handleNextPage}
											>
												<ChevronRightIcon />
											</IconButton>
										</div>
									</div>
								</div>
								<div className="overflow-x-auto bg-white shadow-md rounded-lg">
									<table className="min-w-full divide-y divide-x divide-gray-200 border border-gray-300 rounded shadow-sm">
										<thead className="bg-gray-300">
											<tr>
												{columns.map((column) => (
													<th
														key={column.key}
														className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-200"
													>
														{column.label}
													</th>
												))}
												<th className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-200">
													管理
												</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-x divide-gray-200">
											{currentItems.map((store: StoreInfo) => (
												<tr key={store.id}>
													{columns.map((column) => (
														<td
															key={column.key}
															className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-200"
														>
															{store[column.key as keyof StoreInfo]}
														</td>
													))}
													<td className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-200 text-center">
														<IconButton
															color="primary"
															aria-label="edit"
															component="span"
															onClick={() => navigateToEditPage(store)} //編集画面へ
															sx={{ p: "0px" }}
														>
															<EditIcon sx={{ fontSize: 22 }} />
														</IconButton>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Layout>
		</>
	);
};

export default AdminPage;