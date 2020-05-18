const axios = require('axios')


export default class ZkbApi {
    constructor(url) {
        this.requestUrl = url
    }

    async makeRequest() {
        const reqConf = {
            method: 'get',
            url: this.requestUrl,
            //headers: { 'User-Agent': 'Stats page, https://hcstats.meeh.no' }
        }
        let res = await axios(reqConf)
        //console.log(res)
        return res.data
    }
    
}