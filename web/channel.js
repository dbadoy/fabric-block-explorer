function getOrgs() {
    const chan = document.getElementById("channel").innerHTML;

    axios.get('http://YOURIP:5000/block/organization/' + chan)
    .then(res => {
        const area = document.getElementById("organization");
        for(const org of res.data.payload) {
            const np = document.createElement('p');
            np.innerHTML = org.id;

            area.appendChild(np);
        }
    })
    .catch(err => {
        alert(err);
    })

}

function getBlockHeight() {
    const chan = document.getElementById("channel").innerHTML;
    const bh = document.getElementById("blockheight");

    axios.get('http://YOURIP:5000/block/blockHeight/' + chan)
    .then(res => {
        bh.innerHTML = res.data.payload;
    })
    .catch(err => {
        alert(err);
    })
}

function getList() {
    var index = Number(document.getElementById("pagenum").value);
    var size = Number(document.getElementById("pageSize").value);

    const chan = document.getElementById("channel").innerHTML;
    const bh = Number(document.getElementById("blockheight").innerHTML);

    startblock = index;
    endBlock = startblock + (size -1);

    if(endBlock >= bh) { endBlock = bh; }

    axios.get('http://YOURIP:5000/block/blockByRange/' + chan + '/' + startblock + '/' + endBlock)
    .then(res => {
        const area = document.getElementById("list");
        while (area.firstChild) {
            area.removeChild(area.lastChild);
        }

        for(const block of res.data.payload) {
            var tr = document.createElement('tr');

            var bh = document.createElement('td');
            var txn = document.createElement('td');
            var timstamp = document.createElement('td');
            var datahash = document.createElement('td');

            bh.innerHTML = block.header.number;
            txn.innerHTML = block.data.data.length;
            timstamp.innerHTML = block.data.data[0].payload.header.channel_header.timestamp;
            datahash.innerHTML = block.header.data_hash;

            tr.appendChild(bh);
            tr.appendChild(txn);
            tr.appendChild(timstamp);
            tr.appendChild(datahash);

            area.appendChild(tr);
        }
    })
    .catch(err => {
        alert(err);
    })
}

function getblock() {
    const area = document.getElementById("result");

    const num = document.getElementById("blocknum").value;
    const chan = document.getElementById("channel").innerHTML;

    const option = document.getElementById("option").value;

    var obj = {
        option : Number(option)
    }

    console.log(obj);

    axios.get('http://YOURIP:5000/block/blockByNumber/' + chan + "/" + num, {params: {option : option}})
    .then(res => {

        while (area.firstChild) {
            area.removeChild(area.lastChild);
        }

        if(!res.data.payload.length) {
            var nd = document.createElement("div");
            var na = document.createElement("p");
            var hr = document.createElement("hr");

            na.innerHTML = JSON.stringify(res.data.payload);

            nd.appendChild(na);
            area.appendChild(nd);
            area.appendChild(hr);
        } else {
            for(const tx of res.data.payload) {
                var nd = document.createElement("div");
                var na = document.createElement("p");
                var hr = document.createElement("hr");

                na.innerHTML = JSON.stringify(tx);

                nd.appendChild(na);
                area.appendChild(nd);
                area.appendChild(hr);
            }
        }
    })
    .catch(err => {
        alert(err);
    })
}
