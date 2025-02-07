/**
 * 店舗データ編集
 */

//Blobをインポート
import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, SASProtocol } from '@azure/storage-blob';

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
        permissions: 'rwdac',                 // 読み取り、書き込み、削除、追加、作成の権限をトークンに付与（リストを入れるとエラーになる）
        expiresOn: expiryDate,                 //トークンの有効期限
        protocol: SASProtocol.Https,           //プロトコル
    };

    //SASトークン生成
    return generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
}

export default async function handler(req, res) {
    //POSTでない場合はエラー
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    //リクエストボディからデータ取得
    const { BaseNo, Class, Area, Owner, Status } = req.body;

    //必要データが取得できたか確認
    if (!BaseNo || !Class || !Area || !Owner || !Status) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    let leaseId;
    let leaseClient;

    try {
        //Azure Storageの接続情報 トークン、URL
        const sasToken = generateSasToken();
        const blobUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobNameAggregation}?${sasToken}`;

        //Blobの　インスタンス作成　コンテナ取得　クライアント取得
        const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net?${sasToken}`);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobClient = containerClient.getBlobClient(blobNameAggregation);

        // Blobのリースを取得
        leaseClient = blobClient.getBlobLeaseClient();

        try {
            // Blobのプロパティを取得してリースの状態を確認
            const properties = await blobClient.getProperties();

            if (properties.leaseState === 'leased') {
                await leaseClient.breakLease();
                console.log("既存のリースを解放しました");
                await new Promise(resolve => setTimeout(resolve, 2000)); // 2秒待機
            }

            // 新しいリースを取得
            const leaseResponse = await leaseClient.acquireLease(60); // 60秒間のリースを取得
            leaseId = leaseResponse.leaseId;
        } catch (leaseError) {
            console.error('リースの取得に失敗しました:', leaseError.message);
            return res.status(500).json({ error: 'リースの取得に失敗しました', details: leaseError.message });
        }

        // JSONデータを取得
        const response = await fetch(blobUrl, { headers: { 'x-ms-lease-id': leaseId } });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('BLOB コンテンツのダウンロードに失敗しました:', errorText);
            await leaseClient.releaseLease();
            return res.status(500).json({ error: 'BLOB コンテンツのダウンロードに失敗しました', details: errorText });
        }
        const storeList = await response.json();

        // データを更新
        const storeIndex = storeList.findIndex(store => store.BaseNo === BaseNo);
        if (storeIndex === -1) {
            await leaseClient.releaseLease();
            return res.status(404).json({ error: 'ストアが見つかりません' });
        }
        storeList[storeIndex].Class = Class;
        storeList[storeIndex].Area = Area;
        storeList[storeIndex].Owner = Owner;
        storeList[storeIndex].Status = Status;

        // JSONをアップロード
        const updatedData = JSON.stringify(storeList, null, 2);
        const uploadResponse = await fetch(blobUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-ms-blob-type': 'BlockBlob',
                'x-ms-lease-id': leaseId, // 取得したリースIDを設定
            },
            body: updatedData,
        });

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error('更新データのアップロードに失敗しました:', errorText);
            await leaseClient.releaseLease();
            return res.status(500).json({ error: '更新データのアップロードに失敗しました', details: errorText });
        }

        // リースを解放
        await leaseClient.releaseLease();
        res.status(200).json({ message: 'ストアが正常に更新されました。' });
    } catch (error) {
        console.error('Error:', error.message);
        if (leaseId) {
            await leaseClient.releaseLease();
        }
        res.status(500).json({ error: 'ストアの更新に失敗しました', details: error.message });
    }
}