require('dotenv').config();
const http = require("https");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


const API_KEY = process.env.PAK_TEST


const verify_bank_details = async (req, res) => {
/*  var options = {
    "method": "GET",
    "hostname": "api.paystack.co",
    "port": null,
    "path": `/bank/resolve?account_number=${req.query.account_number}&bank_code=${req.query.bank_code}`,
    "headers": {
      "content-type": "application/json",
      "authorization": "Bearer "+API_KEY,
    }
  };*/
  let url = `https://api.paystack.co/bank/resolve?account_number=${req.query.account_number}&bank_code=${req.query.bank_code}`;
  fetch(url, {"method": "GET", "headers": {"content-type": "application/json", "authorization": "Bearer "+API_KEY, } })
      .then(response => response.body)
      .then(data => data.on('readable', () => {
        let chunk;
        while (null !== (chunk = data.read())) {
          res.json(JSON.parse(chunk))
        }
      }))
  .catch(err => {
    console.log(err)
    res.status(500).json({error: 'Something went wrong'})
  });

  // res.json(result)

  /*var request = http.request(options, function (response) {
    var chunks = [];

    response.on("data", function (chunk) {
      chunks.push(chunk);
    });

    response.on("end", function () {
      var body = Buffer.concat(chunks);
      body = JSON.parse(body)
      // console.log(body);
      res.json(body)
    });
  });
  request.end();*/
};

module.exports = verify_bank_details;