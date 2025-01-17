/**
 * 集計条件登録
 */

//Blobをインポート
import { BlobServiceClient } from '@azure/storage-blob';

//リクエストハンドラ関数定義
export default async function handler(req, res) {

    //POSTではない場合エラー
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    //リクエストボディからデータ取り出し
    const { conditionName, displayType, storeSelection, otherConditions, includeSales, includeClose, include_consign_sales } = req.body;

    //データが取得できてない場合エラー
    if (!conditionName || !displayType || !storeSelection || !otherConditions || !includeSales || !includeClose || !include_consign_sales) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        //Azure Storageの接続情報 トークン、URL
        const sasToken = 'sp=raw&st=2024-12-20T05:54:55Z&se=2027-12-20T13:54:55Z&spr=https&sv=2022-11-02&sr=b&sig=DwRAlBLnaMxtNxaGOL35wg06PP7Kr0behdO%2F8XOSN78%3D';
        const blobUrl = `https://urisokustorage.blob.core.windows.net/azure-webjobs-hosts/store_list.json?${sasToken}`;

        //Blobの　インスタンス作成　コンテナ取得　クライアント取得
        const blobServiceClient = new BlobServiceClient(`https://urisokustorage.blob.core.windows.net?${sasToken}`);
        const containerClient = blobServiceClient.getContainerClient('azure-webjobs-hosts');
        const blobClient = containerClient.getBlobClient('store_list.json');

        //リース取得
        let leaseId;
        const leaseClient = blobClient.getBlobLeaseClient();

        try {
            // Blobのプロパティを取得
            const properties = await blobClient.getProperties();

            //既にリースがある場合解放
            if (properties.leaseState === 'leased') {
                await leaseClient.breakLease();
                console.log("既存のリースを解放しました");
            }

            // 新しいリースを取得
            const leaseResponse = await leaseClient.acquireLease(60); // 60秒間のリースを取得
            leaseId = leaseResponse.leaseId;
            console.log("新しいリースID:", leaseId);
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

        //同じ条件名があるかチェック some：存在していればtrueを返す
        const isConditionNameExists = conditionList.some(condition => condition.conditionName === conditionName);

        if(isConditionNameExists) {
            await leaseClient.releaseLease();
            return res.status(400).json({ error: `条件名【 ${conditionName} 】はすでに使われています` });
        }

        //新しい条件を追加
        conditionList.push({ conditionName, displayType, storeSelection, otherConditions, includeSales, includeClose, include_consign_sales });
        console.log("conditionList" + conditionList);
   
        // JSONをアップロード
        const updatedData = JSON.stringify(storeList, null, 2);//オブジェクトをjson形式の文字列に変換　null: 変換処理にカスタム関数を適用しない（既定の動作）。　2: 出力結果のインデントサイズ（可読性のためにJSON文字列にインデントを追加）。
        console.log("updatedData：" + updatedData);
        const uploadResponse = await fetch(blobUrl, {
            method: 'PUT',//データを上書き（または新規作成）
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

    } catch (error) {

        console.error('Error:', error.message);
        if (leaseId) {
            await leaseClient.releaseLease();
        }
        res.status(500).json({ error: '予期せぬエラーが発生しました', details: error.message });

    }
}
