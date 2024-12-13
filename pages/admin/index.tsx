import Layout from "@/components/Layout";
import React, { useState } from "react";
import { IconButton, Drawer, Button, List } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditIcon from "@mui/icons-material/Edit";
import { useMobile } from "../../contexts/MobileContext";
import { useRouter } from "next/router";
import Sidebar from "./../../components/SidebarButton";
import { fetchData } from "../api/apiService";

interface StoreInfo {
	id: string;
	storeNumber: string;
	storeName: string;
	category: string;
	area: string;
	owner: string;
}

const AdminPage = () => {
	const router = useRouter();

	const isMobile = useMobile();
	// const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	// const toggleSidebar = () => {
	//   setIsSidebarOpen(!isSidebarOpen);
	// };

	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [currentPage, setCurrentPage] = useState(1); //現在のメージ
	const itemsPerPage = 15; //データ表示件数

	//ファイル選択
	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFile(file);
		}
	};

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
				storeNumber: store.storeNumber,
				storeName: store.storeName,
				category: store.category,
				area: store.area,
				owner: store.owner,
			},
		});
	};

	//店舗データ
	const stores_info_sequential: StoreInfo[] = [
		{
			id: "1",
			storeNumber: "001",
			storeName: "店舗1",
			category: "FC",
			area: "駅前",
			owner: "オーナー1",
		},
		{
			id: "2",
			storeNumber: "002",
			storeName: "店舗2",
			category: "FC",
			area: "郊外",
			owner: "オーナー2",
		},
		{
			id: "3",
			storeNumber: "003",
			storeName: "店舗3",
			category: "FC",
			area: "郊外",
			owner: "オーナー3",
		},
		{
			id: "4",
			storeNumber: "004",
			storeName: "店舗4",
			category: "直営",
			area: "郊外",
			owner: "オーナー4",
		},
		{
			id: "5",
			storeNumber: "005",
			storeName: "店舗5",
			category: "FC",
			area: "駅前",
			owner: "オーナー5",
		},
		{
			id: "6",
			storeNumber: "006",
			storeName: "店舗6",
			category: "直営",
			area: "駅前",
			owner: "オーナー6",
		},
		{
			id: "7",
			storeNumber: "007",
			storeName: "店舗7",
			category: "直営",
			area: "郊外",
			owner: "オーナー7",
		},
		{
			id: "8",
			storeNumber: "008",
			storeName: "店舗8",
			category: "FC",
			area: "郊外",
			owner: "オーナー8",
		},
		{
			id: "9",
			storeNumber: "009",
			storeName: "店舗9",
			category: "直営",
			area: "郊外",
			owner: "オーナー9",
		},
		{
			id: "10",
			storeNumber: "010",
			storeName: "店舗10",
			category: "直営",
			area: "駅前",
			owner: "オーナー10",
		},
		{
			id: "11",
			storeNumber: "011",
			storeName: "店舗11",
			category: "FC",
			area: "駅前",
			owner: "オーナー11",
		},
		{
			id: "12",
			storeNumber: "012",
			storeName: "店舗12",
			category: "FC",
			area: "郊外",
			owner: "オーナー12",
		},
		{
			id: "13",
			storeNumber: "013",
			storeName: "店舗13",
			category: "FC",
			area: "駅前",
			owner: "オーナー13",
		},
		{
			id: "14",
			storeNumber: "014",
			storeName: "店舗14",
			category: "直営",
			area: "駅前",
			owner: "オーナー14",
		},
		{
			id: "15",
			storeNumber: "015",
			storeName: "店舗15",
			category: "直営",
			area: "郊外",
			owner: "オーナー15",
		},
		{
			id: "16",
			storeNumber: "016",
			storeName: "店舗16",
			category: "直営",
			area: "郊外",
			owner: "オーナー16",
		},
	];

	const indexOfLastItem = currentPage * itemsPerPage; //ページ最後のデータ番号
	const indexOfFirstItem = indexOfLastItem - itemsPerPage; //ページ最初のデータ番号
	const currentItems = stores_info_sequential.slice(
		indexOfFirstItem,
		indexOfLastItem
	); //店舗データ抜出

	//次のページ　現在ページ＋1
	const handleNextPage = () => {
		if (currentPage < Math.ceil(stores_info_sequential.length / itemsPerPage)) {
			setCurrentPage(currentPage + 1);
		}
	};

	//前のページ　現在ページ-1
	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	return (
		<>
			<Layout title="管理者システム | 売上速報">
				<div className="bg-gray-50 min-h-screen">
					<div className="flex">
						<Sidebar
							isMobile={isMobile}
						/>

						{/* メインコンテンツ */}
						<div className="md:flex-1 w-full pb-20">
							{/* コンテンツ */}
							<div className="p-2 md:p-4 w-full md:mt-0 mt-14">
								<h2 className="text-xl font-bold mb-4">
									管理者システム - 権限一覧
								</h2>
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
										<thead className="bg-gray-50">
											<tr>
												<th className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-200">
													ID
												</th>
												<th className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-200">
													店舗番号
												</th>
												<th className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-200">
													店舗名
												</th>
												<th className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-200">
													区分
												</th>
												<th className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-200">
													エリア
												</th>
												<th className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-200">
													オーナー
												</th>
												<th className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-200">
													管理
												</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-x divide-gray-200">
											{currentItems.map((store: StoreInfo) => (
												<tr key={store.id}>
													<td className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-200">
														{store.id}
													</td>
													<td className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-200">
														{store.storeNumber}
													</td>
													<td className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-200">
														{store.storeName}
													</td>
													<td className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-200">
														{store.category}
													</td>
													<td className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-200">
														{store.area}
													</td>
													<td className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-200">
														{store.owner}
													</td>
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
