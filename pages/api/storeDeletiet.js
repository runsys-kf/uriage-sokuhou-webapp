import { BlobServiceClient } from '@azure/storage-blob';

export default async function handler(req, res) {
    // POSTでない場合はエラー
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // リクエストボディからデータ取得
    const { BaseNo } = req.body;

    // 受信データをログに出力
    console.log("Received data:", JSON.stringify(req.body, null, 2));

    // 必要データが取得できたか確認
    if (!BaseNo) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Azure Storageの接続情報
        const sasToken = 'sp=raw&st=2024-12-20T05:54:55Z&se=2027-12-20T13:54:55Z&spr=https&sv=2022-11-02&sr=b&sig=DwRAlBLnaMxtNxaGOL35wg06PP7Kr0behdO%2F8XOSN78%3D';
        const blobUrl = `https://urisokustorage.blob.core.windows.net/azure-webjobs-hosts/store_list.json?${sasToken}`;

        // BlobServiceClientのインスタンスを作成
        const blobServiceClient = new BlobServiceClient(`https://urisokustorage.blob.core.windows.net?${sasToken}`);
        const containerClient = blobServiceClient.getContainerClient('azure-webjobs-hosts');
        const blobClient = containerClient.getBlobClient('store_list.json');

        // Blobのリースを取得
        let leaseId;
        const leaseClient = blobClient.getBlobLeaseClient();

        try {
            // Blobのプロパティを取得してリースの状態を確認
            const properties = await blobClient.getProperties();

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

        // JSONデータを取得
        const response = await fetch(blobUrl, { headers: { 'x-ms-lease-id': leaseId } });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('BLOB コンテンツのダウンロードに失敗しました:', errorText);
            return res.status(500).json({ error: 'BLOB コンテンツのダウンロードに失敗しました', details: errorText });
        }
        const storeList = await response.json();

        // データを更新
        const updatedStoreList = storeList.filter(store => store.BaseNo !== BaseNo);
        if (updatedStoreList.length === storeList.length) {
            return res.status(404).json({ error: 'ストアが見つかりません' });
        }

        // JSONをアップロード
        const updatedData = JSON.stringify(updatedStoreList, null, 2);
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
            console.error('Failed to upload updated data:', errorText);
            return res.status(500).json({ error: 'Failed to upload updated data', details: errorText });
        }

        console.log('Data updated successfully');

        // リースを解放
        await leaseClient.releaseLease();
        res.status(200).json({ message: 'Store deleted successfully' });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to delete store', details: error.message });
    }
}