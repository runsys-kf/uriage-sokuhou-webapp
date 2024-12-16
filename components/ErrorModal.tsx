/**
 * メッセージダイアログ
*/
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoIcon from "@mui/icons-material/Info";

interface ErrorModalProps {
  open: boolean;
  onClose: () => void;
  modalType: "error" | "info";
  errorMessage: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  open,
  onClose,
  modalType,
  errorMessage,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="modal-dialog-title"
      aria-describedby="modal-dialog-description"
    >
      <DialogTitle
        id="error-dialog-title"
        className="flex items-center gap-2"
      >
        {modalType === "error" ? (
          <ErrorOutlineIcon className="text-red-500" />
        ) : (
          <InfoIcon className="text-blue-500" />
        )}
        <span>{modalType === "error" ? "エラー" : "お知らせ"}</span>
      </DialogTitle>
      <DialogContent>
        <p className="text-gray-700">{errorMessage}</p>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant="contained"
          className="bg-blue-500 hover:bg-blue-800"
        >
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorModal;