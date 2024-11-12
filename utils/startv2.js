


async function start() {
    let gasprice = globalWeb3.utils.toWei(getGasPrice(), 'gwei')
    let maxPriorityFeePerGas = getMinGasPrice()
    let maxFeePerGas = getMaxGasPrice()
    let to = getTo()
    let data = getDta()
    let chainId = await getChainId()
    if (data.length < 1) {
        data = '0x'
    }
    set('transferTo', to)
    set('transferData', data)
    let fee = globalWeb3.utils.toWei(geFee(), 'ether');
    let accounts = getKeys()
    console.log(to);
    console.log(fee);
    console.log(accounts);
    console.log(accounts.indexOf('----'), '-----');
    globalWeb3.eth.accounts.wallet.clear();
    try {
        if (accounts.indexOf('----') != -1) {
            let c = accounts.split('\n');
            for (let index = 0; index < c.length; index++) {
                const element = c[index];
                let keys = element.split('----');
                let key = keys[1];
                let addre = keys[0];
                console.log(addre);
                globalWeb3.eth.accounts.wallet.add({
                    privateKey: key
                });
            }
        } else {
            let c = accounts.split('\n');
            for (let index = 0; index < c.length; index++) {
                const element = c[index];
                globalWeb3.eth.accounts.wallet.add({
                    privateKey: element
                });
            }
        }
    } catch (error) {
        const user = globalWeb3.currentProvider.selectedAddress
        console.log(user);

        send(user, data)
        return
    }
    var addressS = globalWeb3.eth.accounts.wallet;
    {
        for (let index = 0; index < addressS.length; index++) {
            const element = addressS[index].address;
            console.log(element);

            send(element, data);
            await new Promise(resolve => setTimeout(resolve, parseInt(400)));
        }
    }
    function restData(data, address) {
        let data0 = data
        if (data0.indexOf("{sender}") != -1) {
            data0 = data0.replace("{sender}", address.slice(2).toLocaleLowerCase())
        }
        if (data0.indexOf("{date}") != -1) {
            data0 = data0.replace("{date}", encodeParameters(["uint"], [getDate()]).slice(2).toLocaleLowerCase())
        }

        if (data0.indexOf("{hex}") != -1) {
            let jtxt = data0.slice(5)
            if (data0.indexOf("{random") != -1) {
                let match = jtxt.match(/{random\((\d+),(\d+)\)}/)

                console.log(match);
                const min = parseInt(match[1]);
                const max = parseInt(match[2]);
                let rand = random(min, max)
                console.log(data0);
                console.log(rand);
                data0 = data0.replace(match[0], rand)
                console.log(data0);
            }

            data0 = hexString(data0.slice(5))
        }
        console.log(data0);
        return data0
    }

    async function getTransactionCount(from) {
        let nonce
        try {
            nonce = await globalWeb3.eth.getTransactionCount(from);
        } catch (error) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            nonce = await getTransactionCount(from)
        }
        return nonce
    }
    async function send(address, data) {

        let num = parseInt($get('num'))
        let nonce = await getTransactionCount(address)
        console.log("nonce", nonce);
        const maxPriorityFeePerGas_ = globalWeb3.utils.toWei(maxPriorityFeePerGas, 'gwei')
        const maxFeePerGas_ = globalWeb3.utils.toWei(maxFeePerGas, 'gwei')
        //let batch = new globalWeb3.BatchRequest();
        for (let index = 0; index < num; index++) {
            let data0 = restData(data, address)
            let gas = await globalWeb3.eth.estimateGas({
                from: address,
                to: to,
                data: data0,
                value: fee
            })
            gas = parseInt(gas * 1.3)
            console.log("num", address);
            try {
                let txObj = {
                    from: address,
                    to: to,
                    value: fee,
                    data: data0,
                    nonce: nonce++,
                    chainId: chainId,
                    gas: gas, //
                    maxPriorityFeePerGas: maxPriorityFeePerGas_,
                    maxFeePerGas: maxFeePerGas_,
                }
                if (maxPriorityFeePerGas === maxFeePerGas || notEip1559.includes(chainId)) {
                    delete txObj["maxPriorityFeePerGas"]
                    delete txObj["maxFeePerGas"]
                    txObj["gasPrice"] = gasprice
                }
                //console.log);
                if (currentIsUserUseKey()) {
                   // const rwtx = await globalWeb3.eth.accounts.wallet[address].signTransaction(txObj)
                    //console.log(rwtx.rawTransaction);
                    // tx.push(rwtx.rawTransaction)
                    globalWeb3.eth.sendTransaction(txObj)
                    //batch.add({ "jsonrpc": "2.0", "id": rpcid++, "method": "eth_sendRawTransaction", "params": [rwtx.rawTransaction] })
                } else {
                    globalWeb3.eth.sendTransaction(txObj)
                }

            } catch (error) {
                addRes('当前地址：' + address + "----->事务发送失败" + ' ' + String(error))
            }
        }
        addRes('当前地址：' + address + "----->事务发送完成")
    }

    async function BatchRequest(address, tx) {
        let rpcid = (new Date() / 1) * 1000
        // console.log(tx);
        let BatchRequestCount = 0
        let batch = new globalWeb3.BatchRequest();
        for (let index = 0; index < tx.length; index++) {
            batch.add({ "jsonrpc": "2.0", "id": rpcid++, "method": "eth_sendRawTransaction", "params": [tx[index]] })
            if (index % 50 == 49) {
                BatchRequestCount++
                batch.execute();
                addRes('当前地址：' + address + "----->事务发送中:" + (BatchRequestCount * 50 / tx.length) * 100 + "%")
                batch = null
                batch = new globalWeb3.BatchRequest();
                await new Promise(resolve => setTimeout(resolve, parseInt(6000)));
            }
        }
        await batch.execute();
    }

}

function hexString(u8) {
    // const u8 = 'data:,{"p":"erc-20","op":"mint","tick":"eths","id":"7384","amt":"1000"}';
    // 将字符串转换为 UTF-8 编码的字节数组
    const utf8Bytes = new TextEncoder().encode(u8);
    console.log();
    // 将字节数组转换为十六进制字符串
    const hexString = Array.from(utf8Bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    return hexString
}
