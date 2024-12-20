export default async function handler(req, res) {
    try {
        console.log("あ");
        //トークンとURL
        const sasToken = 'sp=raw&st=2024-12-20T05:54:55Z&se=2027-12-20T13:54:55Z&spr=https&sv=2022-11-02&sr=b&sig=DwRAlBLnaMxtNxaGOL35wg06PP7Kr0behdO%2F8XOSN78%3D'
        const url = `https://urisokustorage.blob.core.windows.net/azure-webjobs-hosts/store_list.json?${sasToken}`;
        const response = await fetch(url);
        const contentType = response.headers.get('content-type');
        

        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Received non-JSON response:', text);
            throw new Error('Received non-JSON response');
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching store list:', error);
        res.status(500).json({ error: 'Failed to fetch store list.' });
    }
}