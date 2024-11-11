// 管理画面のメニューボタン共通管理
import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";

interface SidebarButtonProps {
    icon: React.ReactElement;
    text: string;
    onClick: () => void;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ icon, text, onClick }) => {
    return (
        <ListItem button onClick={onClick}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
        </ListItem>
    );
};

export default SidebarButton;