//Pricing system (File)
const superJaraApi = [
 {
    name: 'MTN SME'
    ,network: 1
    ,net: 'mtn'
    ,price_list: [
      { plan: '500MB for 30days #200', price: 200, planId: "6" },
      { plan: '1GB for 30days #350', price: 350, planId: "7" },
      { plan: '2GB for 30days #700', price: 700, planId: "8" },
      { plan: '3GB for 30days #1000', price: 1000, planId: "232" },
      { plan: '5GB for 30days #1700', price: 1700, planId: "11" },
      { plan: '10GB for 30days #2900', price: 2900, planId: "220" }
    ]
  }
 ,{
    name: 'MTN CORPERATE'
    ,network: 1
    ,net: 'mtn-special'
    ,price_list: [
      { plan: '500MB for 30days #200', price: 200, planId: "216" },
      { plan: '1GB for 30days #350', price: 350, planId: "217" },
      { plan: '2GB for 30days #700', price: 700, planId: "209" },
      { plan: '3GB for 30days #1050', price: 1050, planId: "210" },
      { plan: '4GB for 30days #1400', price: 1400, planId: "256" },
      { plan: '5GB for 30days #1700', price: 1700, planId: "211" },
      { plan: '6GB for 30days #1950', price: 1950, planId: "257" },
      { plan: '10GB for 30days #2900', price: 2900, planId: "43" }
    ]
  }
  ,{
    name: 'Glo Data'
    ,network: 2
    ,net: 'glo'
    ,price_list: [
      { plan: '1.05GB for 30days #450', price: 450, planId: "194" },
      { plan: '2.9GB for 30days #900', price: 900, planId: "195" },
      { plan: '4.1GB for 30days #1400', price: 1400, planId: "196" },
      { plan: '5.8GB for 30days #1800', price: 1800, planId: "197" },
      { plan: '7.7GB for 30days #2300', price: 2300, planId: "198" },
      { plan: '10GB for 30days #2700', price: 2700, planId: "199" }
    ]
  }
  ,{
    name: 'Airtel Data'
    ,network: 4
    ,net: 'airtel'
    ,price_list: [
      { plan: '100MB for 7days #50', price: 50, planId: "225" },
      { plan: '300MB for 7days #150', price: 150, planId: "226" },
      { plan: '500MB for 30days #250', price: 250, planId: "221" },
      { plan: '1GB for 30days #450', price: 450, planId: "222" },
      { plan: '2GB for 30days #900', price: 900, planId: "223" }
    ]
  }
  ,{
    name: '9mobie Data'
    ,network: 3
    ,net: '9mobile'
    ,price_list: [
      { plan: '1.5GB for 30days #1000', price: 1000, planId: "183" },
      { plan: '2GB for 30days #1180', price: 1180, planId: "184" },
      { plan: '3GB for 30days #1450', price: 1450, planId: "185" },
      { plan: '3.5GB for 30days #1900', price: 1900, planId: "186" },
      { plan: '11GB for 30days #3700', price: 3700, planId: "187" }
    ]
  }
]

const superJara = [
 {
   name: 'MTN SME',
   network: 1,
   net: 'mtn-sme',
   price_list: [
     { plan: '500MB for 30days #200', price: 200, planId: "242" },
     { plan: '1GB for 30days #350', price: 350, planId: "234" },
     { plan: '2GB for 30days #700', price: 700, planId: "235" },
     { plan: '3GB for 30days #1000', price: 1000, planId: "263" },
     { plan: '5GB for 30days #1600', price: 1600, planId: "237" },
     { plan: '10GB for 30days #3000', price: 3000, planId: "246" }
   ]
 }
 ,{
    name: 'MTN Corporate',
    network: 1,
    net: 'mtn-special',
    price_list: [
      { plan: '500MB for 30days #200', price: 200, planId: "49" },
      { plan: '1GB for 30days #350', price: 350, planId: "208" },
      { plan: '2GB for 30days #700', price: 700, planId: "209" },
      { plan: '3GB for 30days #1050', price: 1050, planId: "210" },
      { plan: '4GB for 30days #1400', price: 1400, planId: "264" },
      { plan: '5GB for 30days #1600', price: 1600, planId: "211" },
      { plan: '6GB for 30days #1950', price: 1950, planId: "265" },
      { plan: '10GB for 30days #3000', price: 3000, planId: "43" }
    ]
  }
  ,{
    name: 'Glo Data'
    ,network: 2
    ,net: 'glo'
    ,price_list: [
      { plan: '1.85GB for 30days #600', price: 600, planId: "194" },
      { plan: '3.9GB for 30days #1100', price: 1100, planId: "195" },
      { plan: '7.5GB for 30days #1400', price: 1400, planId: "196" },
      { plan: '10GB for 30days #2500', price: 2500, planId: "198" },
    ]
  }
  ,{
    name: 'Airtel Data'
    ,network: 4
    ,net: 'airtel'
    ,price_list: [
      { plan: '300MB for 7days #150', price: 150, planId: "258" },
      { plan: '500MB for 30days #200', price: 200, planId: "253" },
      { plan: '1GB for 30days #350', price: 350, planId: "254" },
      { plan: '2GB for 30days #700', price: 700, planId: "255" },
      { plan: '5GB for 30days #1800', price: 1800, planId: "255" }
    ]
  }
  ,{
    name: '9mobie Data'
    ,network: 3
    ,net: '9mobile'
    ,price_list: [
      { plan: '1.5GB for 30days #1000', price: 1000, planId: "183" },
      { plan: '2GB for 30days #1180', price: 1180, planId: "184" },
      { plan: '3GB for 30days #1450', price: 1450, planId: "185" },
      { plan: '4.5GB for 30days #1900', price: 1900, planId: "186" },
      { plan: '11GB for 30days #3700', price: 3700, planId: "187" }
    ]
  }
]






// airtime pricing
const airtime_prices = [
  {
    title: 'MTN Airtime'
    ,package: {
      name: 'MTN'
      ,network: 1
    }
  }
  ,{
    title: 'Glo Airtime'
    ,package: {
      name: 'Glo'
      ,network: 2
    }
  }
  ,{
    title: 'Airtel Airtime'
    ,package: {
      name: 'Airtel'
      ,network: 4
    }
  }
  ,{
    title: '9mobile Airtime'
    ,package: {
      name: '9mobile'
      ,network: 3
    }
  }
]

// function for select input form
const select_plan = (sel, plan) => {
  let network = '';
  // if (sel == 'MTN SME') {network = superJaraApi.mtn_sme }else if (sel == 'Glo Data') {network = superJaraApi.glo }else if (sel == 'Airtel Data') {network = superJaraApi.airtel }else if (sel == '9mobie Data') {network = superJaraApi._9mobile }else if (sel == 'MTN Special') {network = superJaraApi.mtn_special; }
  for (var i = 0; i < superJaraApi.length; i++) {
    if (sel == superJaraApi[i].name) {network = superJaraApi[i].price_list }
  }
  let selected = {error: {message:`${sel} ${plan} is currently unavailble`, type:'warning'}}
  for (var i = 0; i < network.length; i++) {
    if (plan == network[i].plan) {
      selected = {plan: network[i].plan, price:network[i].price, planId:network[i].planId}
    }
  }
  return selected
}
// let a = 'MTN SME'
// let b = '2GB for 30days #700'
// console.log(select_plan(a,b))
module.exports = {
  select_plan,
  superJara,
  airtime_prices,
}


let transaction_structure = {
  user_name: 'eazyb',
  Type: 'MTN SME',
  Description: '1GB for 30days 350',
  Amount: '50',
  Phone: '090909',
  PreviousBalance: '2000',
  NewBalance: '1650'
}


      // console.log(response.data);
        /*{  id: 2823557,
          ident: 'Data6b96ff5f2-ebf',
          customer_ref: null,
          network: 1,
          balance_before: '244.0',
          balance_after: '133.0',
          mobile_number: '09166203938',
          plan: 242,
          Status: 'failed',
          api_response: '',
          plan_network: 'MTN',
          plan_name: '500.0MB',
          plan_amount: '111.0',
          create_date: '2022-09-09T00:30:44.966289',
          Ported_number: true
        }
        {
          id: 2830567,
          ident: 'Data100289a91-54b',
          customer_ref: null,
          network: 1,
          balance_before: '244.0',
          balance_after: '24.0',
          mobile_number: '07035370828',
          plan: 234,
          Status: 'successful',
          api_response: '',
          plan_network: 'MTN',
          plan_name: '1.0GB',
          plan_amount: '220.0',
          create_date: '2022-09-09T20:48:17.327476',
          Ported_number: true
        }*/