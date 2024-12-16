import Layout from "@/components/Layout";
import React, { useState } from "react";
import { IconButton, Drawer, Button, List } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditIcon from "@mui/icons-material/Edit";
import { useMobile } from "../../contexts/MobileContext";
import { useRouter } from "next/router";
import Sidebar from "./../../components/SidebarButton";

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
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

  return (
    <>
      <Layout title="ログ | 売上速報">
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
                  管理者システム - ログ
                </h2>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AdminPage;
