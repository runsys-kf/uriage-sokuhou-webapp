/**
 * 集計条件取得
 */

//Blobをインポート
import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, SASProtocol } from '@azure/storage-blob';

//アカウント名キー名を取得
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
const blobNameAggregation = process.env.AZURE_STORAGE_BLOB_NAME_AC;

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
//リクエストハンドラ関数定義
export default async function handler(req, res) {

    //POSTではない場合エラー
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    //リクエストボディからデータ取り出し
    const { userId } = req.body;

    //データが取得できてない場合エラー
    if (!userId) {
        return res.status(400).json({ error: 'リクエストデータが欠落しています' });
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

        //リース取得
        leaseClient = blobClient.getBlobLeaseClient();

        try {
            // Blobのプロパティを取得
            const properties = await blobClient.getProperties();

            //既にリースがある場合解放
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

        // リクエスト実行、リースIDを使用しアクセスしJSONデータを取得
        const response = await fetch(blobUrl, { headers: { 'x-ms-lease-id': leaseId } });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('BLOB コンテンツのダウンロードに失敗しました:', errorText);
            await leaseClient.releaseLease();
            return res.status(500).json({ error: 'BLOB コンテンツのダウンロードに失敗しました', details: errorText });
        }
        const conditionList = await response.json();// JSONデータを取得

        // ユーザーの条件リストが存在しない場合は空のリストを返す
        const userConditions = conditionList[userId] || [];

        await leaseClient.releaseLease();
        res.status(200).json({ conditions: userConditions });


    } catch (error) {

        console.error('Error:', error.message);
        if (leaseId) {
            await leaseClient.releaseLease();
        }
        res.status(500).json({ error: '予期せぬエラーが発生しました', details: error.message });

    }
}
