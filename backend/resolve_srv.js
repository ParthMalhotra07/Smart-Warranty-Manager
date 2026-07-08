const dns = require('dns');
const util = require('util');
const resolveSrv = util.promisify(dns.resolveSrv);
const resolveTxt = util.promisify(dns.resolveTxt);

async function resolveAtlas(hostname) {
    try {
        const srvUrl = `_mongodb._tcp.${hostname}`;
        const srvRecords = await resolveSrv(srvUrl);
        const txtRecords = await resolveTxt(hostname);
        
        const hosts = srvRecords.map(record => `${record.name}:${record.port}`).join(',');
        
        let txtParams = '';
        if (txtRecords && txtRecords.length > 0) {
            txtParams = '&' + txtRecords.map(r => r.join('')).join('&');
        }

        console.log(`mongodb://yt:M9LFF5wIQwYBLeNL@${hosts}/project_2?ssl=true&replicaSet=atlas-xxxxxx-shard-0&authSource=admin&retryWrites=true&w=majority${txtParams}`);
    } catch (e) {
        console.error(e);
    }
}

resolveAtlas('backend.mgni3np.mongodb.net');
