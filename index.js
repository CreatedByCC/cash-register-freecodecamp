function checkCashRegister(price, cash, cid) {
    const response =  { //the object to return
      status: "OPEN",
      change: [] 
    }
  
    let changeDue = parseFloat((cash - price).toFixed(2));  //calculate the change to be returned - remember to set 2 decimals for currency
    let sumCid = parseFloat(cid.reduce((a, b) => a + b[1], 0).toFixed(2));  //calculate the total cash in the cid
  
    const currency = [
      ["ONE HUNDRED", 100],
      ["TWENTY", 20],
      ["TEN", 10],
      ["FIVE", 5],
      ["ONE", 1],
      ["QUARTER", 0.25],
      ["DIME", 0.1],
      ["NICKEL", 0.05],
      ["PENNY", 0.01],
    ];
  
    if (sumCid < changeDue) {
      response.status = "INSUFFICIENT_FUNDS";
      response.change = [];     //return an ampty arr if there is not enough cash in the cid to pay the change
    }
    else if (sumCid === changeDue) {
      response.status = "CLOSED";
      response.change = cid;    //return the cid as that will contain all the cash to pay change
    } 
    else {      //if neither of the above conditions were met we need to determine how much change to return to the customer
      let finalChange = [];
      for (let i = 0; i < currency.length; i++) {   //loop the currency arr
        let currencyType = currency[i][0];
        let currencyValue = currency[i][1];
        let cidItemValue = cid.find(item => item[0] === currencyType)[1];   //this looks through the cid to check if the currency in the currency arr is also in cid and returns the cash value in cid
  
        if (changeDue > currencyValue && changeDue > cidItemValue) {    
          changeDue -= cidItemValue;    //as long as the change due is more we can just deduct it from the cash value in the cid
          finalChange.push([currencyType, cidItemValue]);   
        } 
        else if (changeDue > currencyValue && cidItemValue > changeDue) {   //when the change is less than the cid cash value we calculate how much to deduct from the cid
          let toPay = Math.floor((changeDue / currencyValue)) * currencyValue;      //calculate how much has to be paid for a specific cid cash value - remember to round this value!
          changeDue -= toPay;    
          changeDue = parseFloat(changeDue).toFixed(2) // if you dont round to 2 decimals you'll get less change for some currencies to be paid as change
          finalChange.push([currencyType, toPay]);
        }
        
        response.status = "OPEN";
        response.change = [...finalChange];
      }
      if (changeDue > 0) {
        response.status = "INSUFFICIENT_FUNDS";
        response.change = [];
      }
    } 
    console.log(response);
    return response; 
  
  }
  
  checkCashRegister(19.5, 20, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]);
  checkCashRegister(3.26, 100, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]);
  
  // console: { status: 'OPEN', change: [ [ 'QUARTER', 0.5 ] ] }
  // console: { status: 'OPEN', change: [ [ 'TWENTY', 60 ], [ 'TEN', 20 ], [ 'FIVE', 15 ], [ 'ONE', 1 ], [ 'QUARTER', 0.5 ], [ 'DIME', 0.2 ], [ 'PENNY', 0.04 ] ]}