function shugaStatus() {
    this.compile = new function() {
        this.monitor = (key, category) => {
            const req = new XMLHttpRequest();
            req.open("POST","https://api.uptimerobot.com/v2/getMonitors", true);
            req.setRequestHeader("Content-Type", "application/json");
            req.onload = () => {
                let resp = JSON.parse(req.responseText);
                let obj = resp.monitors[0];

                let ratio = obj.custom_uptime_ratio.split("-");
                let daily = ratio[0];
                let monthly = ratio[1];
                let annually = ratio[2];
                let status;
                let link;

                if(obj.status == 2) {
                    status = "Online";
                } else if(obj.status == 9) {
                    status = "Down";
                    ShugaStatus.state.isOffline++;
                } else if(obj.status == 8) {
                    status = "Intermittent";
                    ShugaStatus.state.isIntermittent++;
                } else {
                    status = "Unknown";
                }

                if(obj.url.indexOf("http") == -1) {
                    link = "https://" + obj.url;                
                } else {
                    link = obj.url;
                }

                let badge = "";
                if (obj.status == 9 || obj.status == 8) {
                    badge = `<span class="badge badge-secondary bg-${status.toLowerCase()}">!</span>`;
                } else if (obj.status != 2) {
                    badge = `<span class="badge badge-secondary">?</span>`;
                }

                ShugaStatus.state.update();
                let out = `<div class="monitor">
                        <h2>${badge} <a class="online-name hide-link" href="${link}" target="_blank" rel="noopener">${obj.friendly_name}</a> <div class="online-status text-${status.toLowerCase()} right">${status}</div></h2>
                        <div class="row online-details">
                            <div class="col-md-4">
                                <div class="progress-today-percent right">${Math.round(daily*100)/100}%</div>
                                <p>Today</p>
                                <div class="progress-out"><div style="width:${daily}%" class="progress-in online-today"></div></div>
                            </div>
                            <div class="col-md-4">
                                <div class="progress-today-percent right">${Math.round(monthly*100)/100}%</div>
                                <p>This Month</p>
                                <div class="progress-out"><div style="width:${monthly}%" class="progress-in online-today"></div></div>
                            </div>
                            <div class="col-md-4">
                                <div class="progress-today-percent right">${Math.round(annually*100)/100}%</div>
                                <p>This Year</p>
                                <div class="progress-out"><div style="width:${annually}%" class="progress-in online-today"></div></div>
                            </div>
                        </div>
                        <hr>
                    </div>`;
                document.querySelector(".entry-" + category.toLowerCase()).innerHTML += out;
            }
            let body = JSON.stringify({
                api_key: key,
                custom_uptime_ratios: "1-30-365"
            });
            req.send(body);

        }
        this.entry = (name) => {
            let out = `<div class="container category">
            <h1>${name}</h1>
                <div class="entry entry-${name.toLowerCase()}">
                </div>
            </div>`
            document.querySelector(".main").innerHTML += out;
        }
    }
    this.init = () => {
        for (cat in data) {
            ShugaStatus.compile.entry(cat);
            for (let i = 0; i < data[cat].length; i++) {                
                ShugaStatus.compile.monitor(data[cat][i], cat);
            }
        }
        ShugaStatus.news();
    }
    this.deinit = () => {
        let containers = document.querySelectorAll(".category:not(.news)");
        for (i = containers.length-1; i >= 0; i--) {
            containers[i].parentElement.removeChild(document.querySelectorAll(".category:not(.news)")[i]);
        }
    }
    this.refresh = () => {
        ShugaStatus.deinit();
        window.setTimeout(ShugaStatus.init, 1000);
    }
    this.state = new function() {
        this.isOffline = 0;
        this.isIntermittent = 0;
        this.update = () => {
            if (ShugaStatus.state.isOffline > 1) {
                document.getElementById("tldr").innerHTML = ShugaStatus.state.isOffline + " services are currently suffering down-time.";
                document.getElementById("tldr").className = "alert alert-danger";
            } else if (ShugaStatus.state.isIntermittent > 1) {
                document.getElementById("tldr").innerHTML = ShugaStatus.state.isIntermittent + " services are currently suffering some interruptions.";
                document.getElementById("tldr").className = "alert alert-warning";
            } else if (ShugaStatus.state.isOffline == 1) {
                document.getElementById("tldr").innerHTML = ShugaStatus.state.isOffline + " service is currently suffering down-time.";
                document.getElementById("tldr").className = "alert alert-danger";
            } else if (ShugaStatus.state.isIntermittent == 1) {
                document.getElementById("tldr").innerHTML = ShugaStatus.state.isIntermittent + " service is currently suffering some interruptions.";
                document.getElementById("tldr").className = "alert alert-warning";
            } else {
                document.getElementById("tldr").innerHTML = "All services are operational!";
                document.getElementById("tldr").className = "alert alert-success";
            }
        }
    }
    this.news = () => {
        const req = new XMLHttpRequest();
        req.open("GET", "updates.json", true);
        req.onload = () => {
            const news = document.querySelector(".news>.entry");
            resp = JSON.parse(req.responseText);
            news.innerHTML = "";
            let n = 0;
            for (i in resp) {
                let date = new Date(Number(resp[i].date)).toLocaleDateString();
                news.innerHTML += `<div class="news">
                    <b>${date}:</b> ${resp[i].body}
                </div>`
                n++;
            }
            if (n == 0) {
                news.innerHTML = `<div class="news news-empty">
                    There is no news to display!
                </div>`;
            }
        }
        req.send();
    }
    this.progress = () => {
        const el = document.querySelector(".progress-master");
        value = Number(el.getAttribute("timer"));
        value--;
        if (value <= 0) {
            ShugaStatus.refresh();
            value = 300;
        }
        el.setAttribute("timer", value);
        let seconds = Math.round(value%60);
        if (seconds < 10) {
            seconds = "0" + String(seconds);
        }
        el.innerHTML = "Refreshing in " + Math.floor(value/60) + ":" + seconds;
        document.querySelector(".progress-underlay").innerHTML = "Refreshing in " + Math.floor(value/60) + ":" + seconds;
        el.style.width = value/3 + "%";
    }
}

const ShugaStatus = new shugaStatus();

// Manipulate data here. Object with arrays of API tokens.
const data = {
    "My Category": ["m778874106-d364e78085e7c4a22ff7d38a", "m778959290-aec903f88269aa3621ba3ad5", "m778874126-2199efa94e371583fd42a7e7"],
    "Repos": ["m782032055-ca8a6afe19b12773f1a64afb", "m782032070-381a2752b20465d844ce5182", "m782032075-c1a488d7daf392a9d7bd475a", "m782032076-509c8f5e5ea7bc6958eabd62"]
}

document.body.addEventListener("load", ShugaStatus.init());
window.setInterval(ShugaStatus.progress, 1000);
