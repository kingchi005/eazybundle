// const request = require("request");

// banklist file
const banks = [                                                                    
  { id: 1, name: 'Access Bank', bank_code: '044' },                  
  { id: 3, name: 'Access Bank (Diamond)', bank_code: '063' },        
  { id: 4, name: 'Ecobank Nigeria', bank_code: '050' },              
  { id: 6, name: 'Fidelity Bank', bank_code: '070' },                
  { id: 7, name: 'First Bank of Nigeria', bank_code: '011' },        
  { id: 9, name: 'Guaranty Trust Bank', bank_code: '058' },          
  { id: 11, name: 'Keystone Bank', bank_code: '082' },               
  { id: 67, name: 'Kuda Bank', bank_code: '50211' },                 
  { id: 169, name: 'PalmPay', bank_code: '999991' },                 
  { id: 14, name: 'Stanbic IBTC Bank', bank_code: '221' },           
  { id: 16, name: 'Sterling Bank', bank_code: '232' },               
  { id: 17, name: 'Union Bank of Nigeria', bank_code: '032' },       
  { id: 18, name: 'United Bank For Africa', bank_code: '033' },      
  { id: 19, name: 'Unity Bank', bank_code: '215' },                  
  { id: 20, name: 'Wema Bank', bank_code: '035' },                   
  { id: 21, name: 'Zenith Bank', bank_code: '057' }                  
]


//select bank code
const select_bank = bank => {
  let selected = {error: {message:`${bank} is currently unavailble`, type:'warning'}}
  for (var i = 0; i < banks.length; i++) {
    if (bank === banks[i].name) {
      selected = {
        name: banks[i].name
        ,id: banks[i].id
        ,bankcode: banks[i].bank_code
      }
    }
  }
  return selected;
};





module.exports = {select_bank, banks};