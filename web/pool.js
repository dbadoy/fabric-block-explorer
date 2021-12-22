function join() {
    var channelName = document.getElementById("channelName").value;

    var obj = {
        channelName: channelName
    }

    axios.post('http://YOURIP:5000/pool/', obj)
    .then(res => {
        console.log(res);
        channelList();
    })
    .catch(err => {
        alert(JSON.stringify(err));
    })
}

function channelList() {
    var area = document.getElementById("list");

    while (area.firstChild) {
        area.removeChild(area.lastChild);
    }
    
    axios.get('http://YOURIP:5000/pool/')
    .then(async(res) => {
        for await(chan of res.data.payload) {
            const bh = await axios.get('http://YOURIP:5000/block/blockHeight/' + chan);
            
            var tr = document.createElement('tr');

            var channel = document.createElement('td');
            var blockheight = document.createElement('td');
            var but = document.createElement('a');
    
            channel.innerHTML = chan;
            blockheight.innerHTML = bh.data.payload;

            but.setAttribute("href", "channel.html?" + chan);
            but.style.color = "white"
            but.innerHTML = "move";

            tr.appendChild(channel);
            tr.appendChild(blockheight);
            tr.appendChild(but);

            area.appendChild(tr);
        }
    })
    .catch(err => {
        console.log(err);
    })
}

