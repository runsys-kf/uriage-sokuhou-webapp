/**
 * 店舗データ取得
 */

//Blobをインポート
import { StorageSharedKeyCredential, generateBlobSASQueryParameters, SASProtocol } from '@azure/storage-blob';

//アカウント名キー名を取得
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
const blobNameAggregation = process.env.AZURE_STORAGE_BLOB_NAME_SL;

//SASトークン生成関数
const generateSasToken = () => {

    let sharedKeyCredential;

    //認証情報をオブジェクト化
    try {
        sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
    } catch (error) {
        console.error("認証情報の取得に失敗しました:", error.message);
        throw error;
    }

    //有効期限の設定
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 60);

    //SASトークンのオプション設定
    const sasOptions = {
        containerName: containerName,  //コンテナ名
        blobName: blobNameAggregation,//BLOB名
        permissions: 'r',                 // 読み取り、書き込み、削除、追加、作成の権限をトークンに付与（リストを入れるとエラーになる）
        expiresOn: expiryDate,                 //トークンの有効期限
        protocol: SASProtocol.Https,           //プロトコル
    };

    //SASトークン生成
    return generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
}

export default async function handler(req, res) {
    try {
        //Azure Storageの接続情報 トークン、URL
        const sasToken = generateSasToken();
        const blobUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobNameAggregation}?${sasToken}`;
        const response = await fetch(blobUrl);
        const contentType = response.headers.get('content-type');

        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Received non-JSON response:', text);
            return res.status(500).json({ error: 'Received non-JSON response', details: text });
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching store list:', error);
        res.status(500).json({ error: 'Failed to fetch store list.', details: error.message });
    }
}