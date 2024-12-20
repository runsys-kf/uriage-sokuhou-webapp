import { BlobServiceClient } from '@azure/storage-blob';

export default async function handler(req, res) {
    console.log("い");
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    console.log("う");
    const { BaseNo, Class, Area, Owner, Status } = req.body;
    console.log("え");

    // 受信データをログに出力
    console.log("Received data:", JSON.stringify(req.body, null, 2));
    console.log("お");
    if (!BaseNo || !Class || !Area || !Owner || !Status) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    console.log("か");
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
        try {
            const leaseClient = blobClient.getBlobLeaseClient();
            leaseId = await leaseClient.acquireLease(60); // 60秒間のリースを取得
        } catch (leaseError) {
            if (leaseError.details && leaseError.details.errorCode === 'LeaseAlreadyPresent') {
                console.log('既存のリースが存在します。リースIDを取得します。');
                const leaseClient = blobClient.getBlobLeaseClient();
                leaseId = leaseClient.leaseId;
            } else {
                throw leaseError;
            }
        }

        // JSONデータを取得
        const response = await fetch(blobUrl);
        const contentType = response.headers.get('content-type');

        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Received non-JSON response:', text);
            throw new Error('Received non-JSON response');
        }

        const storeList = await response.json();

        // データ取得確認のためのログ出力
        console.log("Downloaded data:", JSON.stringify(storeList, null, 2));

        // 店舗情報を更新
        const storeIndex = storeList.findIndex(store => store.BaseNo === BaseNo);
        if (storeIndex === -1) {
            return res.status(404).json({ error: 'Store not found' });
        }

        storeList[storeIndex].Class = Class;
        storeList[storeIndex].Area = Area;
        storeList[storeIndex].Owner = Owner;
        storeList[storeIndex].Status = Status;

        // 更新されたJSONデータをアップロード
        const updatedData = JSON.stringify(storeList, null, 2);
        //console.log("updatedData:", updatedData);

        const uploadResponse = await fetch(blobUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-ms-blob-type': 'BlockBlob',
                'x-ms-lease-id': leaseId // リースIDを指定
            },
            body: updatedData
        });
        console.log("き");
        if (!uploadResponse.ok) {
            const text = await uploadResponse.text();
            console.error('Failed to upload updated data:', text);
            throw new Error('Failed to upload updated data');
        }
        console.log("く");
        res.status(200).json({ message: 'Store updated successfully' });

        // リースを解放
        const leaseClient = blobClient.getBlobLeaseClient(leaseId);
        await leaseClient.releaseLease();
    } catch (error) {
        console.error('Error updating store:', error.message);
        res.status(500).json({ error: 'Failed to update store', details: error.message });
    }
}