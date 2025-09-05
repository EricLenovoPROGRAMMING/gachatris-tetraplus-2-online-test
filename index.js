const ws = require("ws");
const http = require("http");
const fs = require("fs");

const rooms = {};//require("./rooms");

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        fs.readFile("public/index.html", (err, data) => {
            if (err) {
                res.writeHead(200, {
                    "Content-Type": "text/html"
                });
                res.end("EROR" + err);
                console.log(err);
                server.close();
            } else {
                res.writeHead(200, {
                    "Content-Type": "text/html"
                });
                res.end(data);

            }
        });

    }
    /*else if (req.url === "/app.js") {
        fs.readFile("public/app.js", (rerr, rdata) => {
                    if (rerr) {
                        res.writeHead(200, {
                            "Content-Type": "text/html"
                        });
                        res.end("EROR" + rerr);
                        console.log(rerr);
                        
                    } else {
                        res.writeHead(200, {
                            "Content-Type": "application/javascript"
                        });
                        res.end(rdata);

                    }
                });
    }/**/
})

const wss = new ws.Server({ server });

function broadcast(func) {
    for (let a in rooms) {
        func(rooms[a], a);
    }
}

wss.on("connection", (e) => {
    console.log("clientInformation. connect")
    //e.send(JSON.stringify(e) + "weoprwerjwseokrweoirjewoirjoewrjewjowejoweorewoir");
    e.on("message", (ee) => {
        //console.log(ee.toString());
        let json = JSON.parse(ee);
        if (json.type == "USER_REGISTER") {
            let idid = Math.random() * Number.MAX_SAFE_INTEGER;
            rooms[idid] = e;
            console.log(rooms[idid])
            e.send(JSON.stringify({
                        type: json.type,
                        data: idid,
            }));
        }
        if (json.type == "PLAY_SOUND_PLAYER") {
            
            broadcast((s,ind) => {
                
                if (ind != json.owner) {
                    s.send(JSON.stringify({
                        type: json.type,
                        data: json.data,
                    }));
                }
            });
        }
        if (json.type == "PLAYERDATA") {
            
            broadcast((s,ind) => {
                
                if (ind != json.owner) {
                    s.send(JSON.stringify({
                        type: json.type,
                        data: json.data,
                    }));
                }
            });
        }
        if (json.type == "DATA_FS_GET") {
            let base = "public/"
            fs.readFile(base + json.data.url,(err, dat) => {
                if (!err) {
                    //console.log(json);
                    e.send(JSON.stringify({
                        type: json.type,
                        id: json.data.id,
                        data: dat.toString("base64"),
                        mime: json.data.mime
                    }))
                }
            })
        }
    })
});

server.listen(12100, () => {
    console.log("Server Working");
})


