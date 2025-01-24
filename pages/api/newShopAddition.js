/**
 * 店舗データ追加
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


//リクエストハンドラ関数の定義　この関数はAPIエンドポイントとして動作し、リクエストを処理します。
export default async function handler(req, res) {
    // POSTでない場合はエラー
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // リクエストボディからデータ取得
    const { BaseNo, BaseName, Class, Area, Prefecture, District, BaseName2, Owner, Status } = req.body;

    // 必要データが取得できたか確認
    if (!BaseNo || !BaseName || !Class || !Area || !Prefecture || !District || !BaseName2 || !Owner || !Status) {
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
        const storeList = await response.json();// JSONデータを取得

        // 同じ店舗番号、店舗名、略名が存在するかチェック
        const isBaseNoExists = storeList.some(store => store.BaseNo === BaseNo);
        const isBaseNameExists = storeList.some(store => store.BaseName === BaseName);
        const isBaseName2Exists = storeList.some(store => store.BaseName2 === BaseName2);

        if (isBaseNoExists) {
            await leaseClient.releaseLease();
            return res.status(400).json({ error: `店舗番号【 ${BaseNo} 】はすでに使われています` });
        }
        if (isBaseNameExists) {
            await leaseClient.releaseLease();
            return res.status(400).json({ error: `店舗名【 ${BaseName} 】はすでに使われています` });
        }
        if (isBaseName2Exists) {
            await leaseClient.releaseLease();
            return res.status(400).json({ error: `略名【 ${BaseName2} 】はすでに使われています` });
        }

        // 新しい店舗情報を追加
        storeList.push({ BaseNo, BaseName, Class, Area, Prefecture, District, BaseName2, Owner, Status });


        // JSONをアップロード
        const updatedData = JSON.stringify(storeList, null, 2);//オブジェクトをjson形式の文字列に変換　null: 変換処理にカスタム関数を適用しない（既定の動作）。　2: 出力結果のインデントサイズ（可読性のためにJSON文字列にインデントを追加）。
        console.log("updatedData：" + updatedData);
        const uploadResponse = await fetch(blobUrl, {
            method: 'PUT',//データを上書き
            headers: {
                'Content-Type': 'application/json',//bodyのデータはjson形式
                'x-ms-blob-type': 'BlockBlob',//BlockBlobを使用
                'x-ms-lease-id': leaseId, // 取得したリースIDを設定
            },
            body: updatedData,
        });

        //失敗時のエラー
        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error('Failed to upload updated data:', errorText);
            await leaseClient.releaseLease();
            return res.status(500).json({ error: 'Failed to upload updated data', details: errorText });
        }

        // リースを解放
        await leaseClient.releaseLease();
        res.status(200).json({ message: 'Store added successfully' });
    } catch (error) {
        console.error('Error:', error.message);
        if (leaseId) {
            await leaseClient.releaseLease();
        }
        res.status(500).json({ error: '予期せぬエラーが発生しました', details: error.message });
    }
}