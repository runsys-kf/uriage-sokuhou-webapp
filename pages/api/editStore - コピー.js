import { BlobServiceClient } from '@azure/storage-blob';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { BaseNo, Class, Area, Owner, Status } = req.body;

    // 受信データをログに出力
    console.log("Received data:", JSON.stringify(req.body, null, 2));

    if (!BaseNo || !Class || !Area || !Owner || !Status) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Azure Storageの接続情報
        const sasToken = 'sp=raw&st=2024-12-20T05:54:55Z&se=2027-12-20T13:54:55Z&spr=https&sv=2022-11-02&sr=b&sig=DwRAlBLnaMxtNxaGOL35wg06PP7Kr0behdO%2F8XOSN78%3D';
        const blobServiceClient = new BlobServiceClient(`https://urisokustorage.blob.core.windows.net?${sasToken}`);
        //const blobServiceClient = new BlobServiceClient(`https://urisokustorage.blob.core.windows.net`);
        const containerClient = blobServiceClient.getContainerClient('azure-webjobs-hosts');
        const blobClient = containerClient.getBlobClient('store_list.json');

        // 接続確認のためのログ出力
        console.log("Connecting to Azure Storage Blob...");

        // JSONデータを取得
        const downloadBlockBlobResponse = await blobClient.download(0);
        const downloaded = await streamToString(downloadBlockBlobResponse.readableStreamBody);
        const storeList = JSON.parse(downloaded);

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
        console.log("updatedData:", updatedData);
        const blockBlobClient = containerClient.getBlockBlobClient('store_list.json');
        await blockBlobClient.upload(updatedData, Buffer.byteLength(updatedData), {
            blobHTTPHeaders: { blobContentType: 'application/json' }
        });

        res.status(200).json({ message: 'Store updated successfully' });
    } catch (error) {
        console.error('Error updating store:', error.message);
        res.status(500).json({ error: 'Failed to update store', details: error.message });
    }
}

// ヘルパー関数: ストリームを文字列に変換
async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on('data', (data) => {
            chunks.push(data.toString());
        });
        readableStream.on('end', () => {
            resolve(chunks.join(''));
        });
        readableStream.on('error', reject);
    });
}