let network;
let contract_address;
let connection;
let mainAccount;
let accounts;
let Accounttype = "0";
let windows = {}
let contractAddress = "0x85d3446869dAcb8e05c9b4A01A9da799EAF83987";
let abi = [{
  "constant": true,
  "inputs": [],
  "name": "name",
  "outputs": [{
    "name": "",
    "type": "string"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "spender",
    "type": "address"
  }, {
    "name": "value",
    "type": "uint256"
  }],
  "name": "approve",
  "outputs": [{
    "name": "",
    "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "_From",
    "type": "address"
  }, {
    "name": "_contributors",
    "type": "address[]"
  }, {
    "name": "_balances",
    "type": "uint256[]"
  }],
  "name": "multisendToken",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "_amount",
    "type": "uint256"
  }],
  "name": "withDraw",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "totalSupply",
  "outputs": [{
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "erc20token",
  "outputs": [{
    "name": "",
    "type": "address"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "from",
    "type": "address"
  }, {
    "name": "to",
    "type": "address"
  }, {
    "name": "value",
    "type": "uint256"
  }],
  "name": "transferFrom",
  "outputs": [{
    "name": "",
    "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "decimals",
  "outputs": [{
    "name": "",
    "type": "uint8"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "spender",
    "type": "address"
  }, {
    "name": "addedValue",
    "type": "uint256"
  }],
  "name": "increaseAllowance",
  "outputs": [{
    "name": "",
    "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "value",
    "type": "uint256"
  }],
  "name": "burn",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "name": "_address",
    "type": "address"
  }],
  "name": "register",
  "outputs": [{
    "name": "",
    "type": "address"
  }],
  "payable": false,
  "stateMutability": "pure",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "_contributors",
    "type": "address[]"
  }, {
    "name": "_balances",
    "type": "uint256[]"
  }],
  "name": "sendMultiBnb",
  "outputs": [],
  "payable": true,
  "stateMutability": "payable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "name": "owner",
    "type": "address"
  }],
  "name": "balanceOf",
  "outputs": [{
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "from",
    "type": "address"
  }, {
    "name": "value",
    "type": "uint256"
  }],
  "name": "burnFrom",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "owner",
  "outputs": [{
    "name": "",
    "type": "address"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "symbol",
  "outputs": [{
    "name": "",
    "type": "string"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "spender",
    "type": "address"
  }, {
    "name": "subtractedValue",
    "type": "uint256"
  }],
  "name": "decreaseAllowance",
  "outputs": [{
    "name": "",
    "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [],
  "name": "buy",
  "outputs": [],
  "payable": true,
  "stateMutability": "payable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "to",
    "type": "address"
  }, {
    "name": "value",
    "type": "uint256"
  }],
  "name": "transfer",
  "outputs": [{
    "name": "",
    "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "_amount",
    "type": "uint256"
  }],
  "name": "getTokens",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "name": "owner",
    "type": "address"
  }, {
    "name": "spender",
    "type": "address"
  }],
  "name": "allowance",
  "outputs": [{
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "_token",
    "type": "uint256"
  }],
  "name": "sell",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "newOwner",
    "type": "address"
  }],
  "name": "transferOwnership",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "constructor"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "name": "total",
    "type": "uint256"
  }, {
    "indexed": false,
    "name": "tokenAddress",
    "type": "address"
  }],
  "name": "Multisended",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "name": "from",
    "type": "address"
  }, {
    "indexed": true,
    "name": "to",
    "type": "address"
  }, {
    "indexed": false,
    "name": "value",
    "type": "uint256"
  }],
  "name": "Transfer",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "name": "owner",
    "type": "address"
  }, {
    "indexed": true,
    "name": "spender",
    "type": "address"
  }, {
    "indexed": false,
    "name": "value",
    "type": "uint256"
  }],
  "name": "Approval",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "name": "previousOwner",
    "type": "address"
  }, {
    "indexed": false,
    "name": "newOwner",
    "type": "address"
  }],
  "name": "OwnershipTransferred",
  "type": "event"
}]



window.setInterval(async function () {
  if (typeof window.ethereum !== undefined) {
    windows.ethereum = window.ethereum
  }
}, 500);





window.addEventListener("load", () => {
  interval = setInterval(async function checkConnection() {
    try {
      let isConnected = false;
      if (windows.ethereum) {
        window.web3 = new Web3(windows.ethereum);
        await windows.ethereum.enable();

        isConnected = true;
      } else {
        isConnected = false;
        connection = "Plz install metamask!";
        jQuery("#metamaskConnection").text(connection);


      }
    } catch (error) {

    }
    try {
      let accounts = await getAccounts();
      getBalanceOfAccount();
      console.log("length===>" + accounts.length);
      console.log("length===>" + accounts);
      console.log("length===>" + accounts[0]);
      if (accounts.length > 0) {
        connection = "Metamask is unlocked";
        jQuery("#metamaskConnection").text(connection);
        window.web3.eth.getChainId((err, netId) => {
          console.log("networkId==>", netId);
          switch (netId.toString()) {
            case "1":
              console.log("This is mainnet");
              jQuery("#network").text("This is mainnet");
              Accounttype = "1";
              network = "mainnet";
              break;
            case "2":
              console.log("This is the deprecated Morden test network.");
              jQuery("#network").text(
                "This is the deprecated Morden test network."
              );
              break;
            case "3":
              console.log("This is the ropsten test network.");
              jQuery("#network").text("This is the ropsten test network.");
              network = "ropsten";
              break;
            case "4":
              console.log("This is the Rinkeby test network.");
              jQuery("#network").text("This is the Rinkeby test network.");
              network = "Rinkeby";
              break;
            case "42":
              console.log("This is the Kovan test network.");
              jQuery("#network").text("This is the Kovan test network.");
              network = "Kovan";
              break;
            case "97":
              console.log("This is the BNB test network.");
              jQuery("#network").text("This is the BNB test network.");
              network = "BNBTestnet";
              break;
            case "57":
              console.log("This is the BNB main network.");
              jQuery("#network").text("This is the BNB main network.");
              network = "BNBMain";
              break;
            default:
              console.log("This is an unknown network.");
              jQuery("#network").text("This is the unknown test network.");
          }
        });

      } else {
        connection = "Metamask is locked";
        jQuery("#metamaskConnection").text(connection);
      }
    } catch (error) {
      console.log("Error while checking locked account");
    }
    console.log("web3333===>", await window.web3);
  }, 1000);
});

function isLocked() {
  window.web3.eth.getAccounts(function (err, accounts) {
    if (err != null) {
      console.log(err);
      jQuery("#lock").text(err);
    } else if (accounts.length === 0) {
      console.log("MetaMask is locked");
      jQuery("#lock").text("MetaMask is locked.");
    } else {
      console.log("MetaMask is unlocked");
      jQuery("#lock").text("MetaMask is unlocked.");
    }
  });
}

function getBalanceOfAccount() {
  console.log("length===>" + mainAccount);
  window.web3.eth.getBalance(accounts[0], (err, wei) => {
    myBalance = web3.utils.fromWei(wei, 'ether')
    console.log("Balance===>", myBalance);
    $("#getBalance").text("Account Balance:" + myBalance + " " + "BNB");
  })
}
const getAccounts = async () => {
  try {
    const web3 = new Web3(windows.ethereum)
    accounts = await web3.eth.getAccounts();
    jQuery("#account").text("Account:" + accounts[0]);
    console.log(accounts);
    return accounts;
  } catch (error) {
    console.log("Error while fetching acounts: ", error);
    return null;
  }
};





async function Withdraw() {
  try {
    let amount = jQuery("#WithdrawAmount").val();
    amount = amount * 100000000;

    let contract = new web3.eth.Contract(abi, contractAddress);
    return new Promise(async (resolve, reject) => {
      contract.methods.withDraw(amount).send({
        from: accounts[0]
      }).on("transactionHash", async (hash) => {
        console.log("transactionHash: ", hash);
        jQuery("#withDrawId").text("Hash:" + hash);
      });;
    })

  } catch (error) {
    alert(error)
  }
}

async function buy() {

  let amount = jQuery("#buyingAmount").val();

  //amount = amount * 100000000;
  let contract = new web3.eth.Contract(abi, contractAddress);
  return new Promise(async (resolve, reject) => {
    contract.methods.buy().send({
      value: web3.utils.toWei(amount),
      from: accounts[0]
    }).on("transactionHash", async (hash) => {
      console.log("transactionHash: ", hash);
      jQuery("#buyamount").text("Hash:" + hash);
    });;
  })
}

async function sell() {

  let amount = jQuery("#sellingAmount").val();

  //amount = amount * 1000000;
  let contract = new web3.eth.Contract(abi, contractAddress);
  return new Promise(async (resolve, reject) => {
    contract.methods.sell(amount).send({
      from: accounts[0]
    }).on("transactionHash", async (hash) => {
      console.log("transactionHash: ", hash);
      jQuery("#sellamount").text("Hash:" + hash);
    });;
  })
}



async function register() {

  let add = jQuery("#userAdddress").val();
  let contract = new web3.eth.Contract(abi, contractAddress);
  return new Promise(async (resolve, reject) => {

    let data = await contract.methods.register(add).call();
    console.log("data", data);
    jQuery("#RegisterAddress").text("RegisterAddress:" + data);
  })
}

async function balanceOf() {

  let add = jQuery("#_UserAdddress").val();
  let contract = new web3.eth.Contract(abi, contractAddress);
  return new Promise(async (resolve, reject) => {

    let data = await contract.methods.balanceOf(add).call();
    console.log("data", data);
    data = data / 1000000;
    jQuery("#_getbalance").text("Token:" + data);
  })
}