const https = require('https')
module.exports = {
    convert : async function(amount,fromCurrency,toCurrency){
        const apiKey = process.env.CURRENCY_APIKEY;
        fromCurrency = encodeURIComponent(fromCurrency);
        toCurrency = encodeURIComponent(toCurrency);
        const query = fromCurrency + '_' + toCurrency;
        const url = 'https://free.currconv.com/api/v7/convert?q=' + query + '&compact=ultra&apiKey=' + apiKey;
        return new Promise((resolve,reject)=>{
          https.get(url, function(res){
            var body = '';
      
            res.on('data', function(chunk){
                body += chunk;
            });
      
            res.on('end', function(){
                try {
                  var jsonObj = JSON.parse(body);
      
                  var val = jsonObj[query];
                  if (val) {
                    //var total = val * amount;
                    //resolve(Math.round(total * 100) / 100);
                    resolve(val)
                  } else {
                    var err = new Error("Value not found for " + query);
                    console.log(err);
                    reject(err);
                  }
                } catch(e) {
                  console.log("Parse error: ", e);
                  reject(e);
                }
            });
        }).on('error', function(e){
              console.log("Got an error: ", e);
              cb(e);
        });
        })
    }
}