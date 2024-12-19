import React, { useState } from "react";
import {
  IconButton,
  Drawer,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { List } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/router";

interface SidebarProps {
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile }) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleDashboardClick = () => {
    router.push("/admin");
    setIsSidebarOpen(false); // メニューを閉じる
  };

  const handleLogClick = () => {
    router.push("/admin/log");
    setIsSidebarOpen(false); // メニューを閉じる
  };

  const menuContent = (
    <>
      <h1 className="text-xl font-semibold p-4 bg-gray-500 text-white">
        管理システム
      </h1>
      <List >
        <ListItem onClick={handleDashboardClick}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="ダッシュボード"></ListItemText>
        </ListItem>
      </List>
      <List>
        <ListItem onClick={handleLogClick}>
          <ListItemIcon>
            <ReceiptIcon />
          </ListItemIcon>
          <ListItemText primary="ログ"></ListItemText>
        </ListItem>
      </List>
    </>
  );

  return isMobile ? (
    <div className="w-full absolute top-0 left-0 right-0">
      <Drawer anchor="left" open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
        <div className="w-60">{menuContent}</div>
      </Drawer>
      <div className="w-full bg-gray-500">
        <div className="px-4 md:hidden">
          <div className="flex items-center h-14">
            <IconButton
              edge="start"
              color="primary"
              aria-label="menu"
              onClick={toggleSidebar}
            >
              <MenuIcon className="text-white" />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-60 border-r-[1px] border-gray-400">{menuContent}</div>
  );
};

export default Sidebar;