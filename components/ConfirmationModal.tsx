import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  inputData: {
    storeNumber: string;
    storeName: string;
    abbreviation?: string;
    category: string;
    area: string;
    owners: string[];
    region?: string;
    prefecture?: string;
    openClose: string;
  };
  title: string,
  message: string,
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  inputData,
  title = "タイトル",
  message = "メッセージ",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <ul className="confirmation-list">
          <li><span className="label">店舗番号:</span> {inputData.storeNumber}</li>
          <li><span className="label">店舗名:</span> {inputData.storeName}</li>
          <li><span className="label">略名:</span> {inputData.abbreviation}</li>
          <li><span className="label">区分:</span> {inputData.category}</li>
          <li><span className="label">エリア:</span> {inputData.area}</li>
          <li><span className="label">地区:</span> {inputData.region}</li>
          <li><span className="label">都道府県:</span> {inputData.prefecture}</li>
          <li><span className="label">オーナー名:</span> {inputData.owners.join(", ")}</li>
          <li><span className="label">開店・閉店:</span> {inputData.openClose}</li>
        </ul>
        <br/>
        <p>{message}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          いいえ
        </Button>
        <Button onClick={onConfirm} variant="contained" color="primary">
          はい
        </Button>
      </DialogActions>
      <style jsx>{`
        .confirmation-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .confirmation-list li {
          display: flex;
          justify-content: flex-start;
          padding: 4px 0;
        }

        .confirmation-list .label {
          width: 100px; /* ラベルの幅を固定 */
          font-weight: bold;
        }
      `}</style>
    </Dialog>
  );
};

export default ConfirmationModal;