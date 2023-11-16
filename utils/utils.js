

async function getChainId() {
    let chainId;
    try {
        chainId = await globalWeb3.eth.getChainId()
    } catch (error) {
        console.log("getChainId", String(error));
        await new Promise((resolve) => setTimeout(resolve, 1000));
        chainId = await getChainId()
    }

    return chainId
}



async function sendTransactionAwit(web3, txObj) {
    try {
        return await web3.eth.sendTransaction(txObj);
    } catch (error) {
        console.log("sendTransactionAwit", String(error));
        if (String(error).indexOf("CONNECTION ERROR") != -1) {
            console.log("CONNECTION ERROR");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return await sendTransactionAwit(web3, txObj)
        } else if (String(error).indexOf("nonce too low") != -1) {
            throw ("ERROR:nonce too low" + "nonce:" + txObj?.nonce)
        }
    }
}
async function sendTransactionSync(web3, txObj) {
    web3.eth.sendTransaction(txObj).catch(async error => {
        console.log("sendTransactionSync", txObj?.from, String(error));
        if (String(error).indexOf("CONNECTION ERROR") != -1) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            sendTransactionSync(web3, txObj)
        } else if (String(error).indexOf("nonce too low") != -1) {
            throw ("ERROR:nonce too low" + "nonce:" + txObj?.nonce)
        } else {
            // await new Promise((resolve) => setTimeout(resolve, 1000));
            // sendTransactionSync(web3, txObj)
        }
    });
}

const $SetResuslt = (content) => {

}
function addRes(params) {

    G_res.innerHTML = G_res.innerHTML + params + '\n =======================\n'
}
function restRes(params) {
    G_res.innerHTML = ''
}


//获取前用户用key还是用钱包
const currentIsUserUseKey = () => {
    return $get("keys").length >= 64
}




function $set(p1, p2) {
    let t = document.getElementById(p1);
    t.value = p2
}
function $get(p1) {
    let t = document.getElementById(p1);
    return t.value
}
function getKeys() {
    const keys = $get("keys")
    return keys
}



function setGasPrice(value) {
    const keys = $set("gasPrice", value)
    return keys
}
function setMaxGasPrice(value) {
    const keys = $set("maxGasPrice", value)
    return keys
}
function setMinGasPrice(value) {
    const keys = $set("minGasPrice", value)
    return keys
}
function getGasPrice() {
    const keys = $get("gasPrice")
    return keys
}
function getMaxGasPrice() {
    const keys = $get("maxGasPrice")
    return keys
}
function getMinGasPrice() {
    const keys = $get("minGasPrice")
    return keys
}
function getTo() {
    const keys = $get("to")
    return keys
}
function getDta() {
    const keys = $get("data")
    return keys
}

function geFee() {
    const keys = $get("fee")
    return keys
}


function set(key, value) {
    localStorage.setItem(key, value);
}
function get(key) {
    return localStorage.getItem(key);
}
function del(key) {
    localStorage.setItem(key, "");
}