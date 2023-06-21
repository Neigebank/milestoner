var ex = ExpantaNum

function startPlayer() {
    return {
        currencies: {
            points: {
                amount: new ex("0"), // How many points.
                base: new ex("1"),   // Base points gain.
                mult: new ex("1"),   // Multiplies points gain.
                pps: new ex("0"),    // Points per second.
                total: new ex("0"),
                best: new ex("0"),
            },
        },

        mainUpg: {
            bght: new ex("0"),
            bcst: new ex("10"),
            cost: new ex("10"),

            milestones: { // Every milestone has a required level, interval (every how many levels), amount, effect, type, operator
                1: {
                    desc: "After level 1, add 0.15 to point production every level.",
                    type: 1,
                    reqlevel: new ex("1"),
                    interval: new ex("1"),
                    unlocked: false,
                    op: "+",
                    effect: new ex("0"),
                    amt: new ex("0"),
                },

                2: {
                    desc: "After level 3, add 0.35 to point production every 2 levels.",
                    type: 1,
                    reqlevel: new ex("3"),
                    interval: new ex("2"),
                    unlocked: false,
                    op: "+",
                    effect: new ex("0"),
                    amt: new ex("0"),
                },

                3: {
                    desc: "After level 5, multiply Milestone 1's power by &times1.2 every 3 levels.",
                    type: 2,
                    reqlevel: new ex("5"),
                    interval: new ex("3"),
                    unlocked: false,
                    op: "&times",
                    effect: new ex("1"),
                    amt: new ex("0"),
                },

                4: {
                    desc: "After level 10, multiply overall point generation by &times1.15 every 5 levels.",
                    type: 2,
                    reqlevel: new ex("10"),
                    interval: new ex("5"),
                    unlocked: false,
                    op: "&times",
                    effect: new ex("1"),
                    amt: new ex("0")
                },

                5: {
                    desc: "After level 15, add 2 to point production every 3 levels.",
                    type: 1,
                    reqlevel: new ex("15"),
                    interval: new ex("4"),
                    unlocked: false,
                    op: "+",
                    effect: new ex("0"),
                    amt: new ex("0"),
                },
                
                shown: [],
            }
        },

        stats: {
            timeplayed: 0, // In seconds.
        },

        autosaving: true,
    }
}

var notPlayer = { // Stuff that doesn't change when you export/import, or load and save.
    tabs: {main: true, options: false, stats: false}, // This is the tab visibility array, from left to right on the page (the first one is the main, the second is the options, etc.).
}

var starterPlayer = startPlayer()

var lastUpdate = Date.now()

function init() {
    if (localStorage.player != undefined) {
        player = JSON.parse(localStorage.player)
    } else {
        player = starterPlayer
    }

    for (let i = 1; i < Object.keys(player.mainUpg.milestones).length; i++) {
        let m = player.mainUpg.milestones[i]
        document.getElementById("mscontain").innerHTML += `<div id="m${i}" style='display: inline-block'><div id=minfo${i} class="milestone mt${m.type} mttc${m.type}"><div class="mtitle" id="m${i}title"></div><div class="mdesc" id="m${i}desc"></div><br id="m${i}br"><div class="meff" id="m${i}eff"></div><div class="mamt" id="m${i}amt"></div><div class="mtype" id="m${i}type"></div></div></div></div>`
        document.getElementById("m" + i + "title").innerHTML = `Reach level ${new ex(m.reqlevel)} to unlock this milestone.`
        document.getElementById("m" + i + "br").style.display = "none"
        document.getElementById("m" + i).style.display = "none"
    } 
}

function buyMUpg() {
    if (ex.gte(player.currencies.points.amount, player.mainUpg.cost)) {
        player.currencies.points.amount = ex.sub(player.currencies.points.amount, player.mainUpg.cost)
        player.mainUpg.bght = ex.add(player.mainUpg.bght, 1)
        player.mainUpg.amnt = ex.add(player.mainUpg.bght, 1)
    }
}

function changeTab(tab) {
    if (!notPlayer.tabs[tab]) {
        Object.keys(notPlayer.tabs).forEach(v => notPlayer.tabs[v] = false)
        notPlayer.tabs[tab] = true 
    }
}

function format(n) {
    a = n.array
    if (a[0][1] < 1000) {
        return n.toFixed(2)
    } else {
        return Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
}

function formattime(a) {
    return Math.floor(a).toFixed(0)
}

function pointGen() {
    let p = new ex(player.currencies.points.base)
    let ea = [] // Effect array.
    for (let i = 1; i < Object.keys(player.mainUpg.milestones).length; i++) {
        ea.push(player.mainUpg.milestones[i].effect)
    }
    p = p.add(ea[4])
    p = p.add(ea[0])
    p = p.add(ea[1])
    p = p.mul(ea[3])
    return p
}

function increment(d) {
    player.currencies.points.amount = new ex(player.currencies.points.amount).add(pointGen().mul(d))
    player.currencies.points.total = new ex(player.currencies.points.total).add(pointGen().mul(d))
}

function dm(n) { // !! USE OBJECT.ASSIGN TO MAKE FUTURE-PROOF
    if (n === 1) {
        var exp = window.btoa(JSON.stringify(player))
        const el = document.createElement("textarea");
        el.value = str;
        document.body.appendChild(el);
        el.select();
        el.setSelectionRange(0, 99999);
        document.execCommand("copy");
        document.body.removeChild(el);
        const alert = document.createElement("p")
        alert.innerText = "\nExported!"
        alert.classList.add("cent")
        document.body.children.main.children.optionsTab.appendChild(alert)
        setTimeout(function() {
            alert.remove()
        }, 1000)
    } else {
        player = Object.assign(starterPlayer, JSON.parse(atob(document.getElementById("importbox").value)))
        const alert = document.createElement("p")
        alert.innerText = "\nImported!"
        alert.classList.add("cent")
        document.body.children.main.children.optionsTab.appendChild(alert)
        setTimeout(function() {
            alert.remove()
        }, 1000)
    }
}

function save(auto = false) {
    if (auto) {
        if (player.autosaving == true) {
            localStorage.setItem('player', JSON.stringify(player))
        }
    } else {
        localStorage.setItem('player', JSON.stringify(player))
    }
}

function saveToggle() {
    player.autosaving = (player.autosaving) ? false : true
}

function hardReset() {
    if (confirm("Despite there not being much to reset, you are about to hard reset the game. Press OK to confirm.")) {
        if (localStorage.player != undefined) {
            localStorage.removeItem('player')
        }

        location.reload()
    }
}

function update() {
    player.currencies.points.mult = ex.add(player.mainUpg.bght, 1)
    player.mainUpg.cost = ex.add(player.mainUpg.bcst, new ex(player.mainUpg.bght).mul(1.5)).mul(ex.pow(1.1, player.mainUpg.bght))

    for (let i = 1; i < Object.keys(player.mainUpg.milestones).length; i++) {
        let m = player.mainUpg.milestones[i]
        if (!m.unlocked) {document.getElementById("minfo" + i).classList.add("mslocked")} else {document.getElementById("minfo" + i).classList.remove("mslocked")}
        if (ex.gte(player.mainUpg.bght, m.reqlevel)) {
            if (!m.unlocked) {m.unlocked = true; player.mainUpg.milestones.shown.push(i)}
            m.amt = ex.floor(new ex(player.mainUpg.bght).sub(m.reqlevel).div(m.interval)).add(1) 
        }
    }

    if (player.mainUpg.milestones.shown.length != 0) {
        for (let i = 1; i <= Math.max(...player.mainUpg.milestones.shown); i++) {
            m = player.mainUpg.milestones[i]
            document.getElementById("m" + i + "title").innerHTML = `Milestone ${i}`
            document.getElementById("m" + i + "desc").innerHTML = `${m.desc}<br/>`
            document.getElementById("m" + i + "eff").innerHTML = `Currently: ${m.op}${format(new ex(m.effect))}`
            document.getElementById("m" + i + "amt").innerHTML = `You have gotten this milestone ${(m.amt.eq(1) ? " once." : m.amt + " times.")}`
            document.getElementById("m" + i + "br").style.display = "" 
            switch (m.type) {
                case 1: {document.getElementById("m" + i + "type").innerHTML = "INCREMENTER"; break}
                case 2: {document.getElementById("m" + i + "type").innerHTML = "MULTIPLIER"; break}
                default: {document.getElementById("m" + i + "type").innerHTML = "ERROR_NO_TYPE"}
            }
        }
    }

    for (let i = 1; i < ((player.mainUpg.milestones.shown.length != 0) ? Math.min(Math.max(...player.mainUpg.milestones.shown) + 3, Object.keys(player.mainUpg.milestones).length) : 3); i++) {
        document.getElementById("m" + i).style.display = "flex"
    }


    // List of all the milestone effects and their formulas.
    player.mainUpg.milestones[3].effect = ex.pow(1.2, player.mainUpg.milestones[3].amt)
    player.mainUpg.milestones[4].effect = ex.pow(1.15, player.mainUpg.milestones[4].amt)
    player.mainUpg.milestones[1].effect = ex.mul(player.mainUpg.milestones[1].amt, 0.15).mul(player.mainUpg.milestones[3].effect)
    player.mainUpg.milestones[2].effect = ex.mul(player.mainUpg.milestones[2].amt, 0.35)
    player.mainUpg.milestones[5].effect = ex.mul(player.mainUpg.milestones[5].amt, 2)
    
    if (ex.gt(player.currencies.points.amount, player.currencies.points.best)) player.currencies.points.best = player.currencies.points.amount
    
    if (ex.gte(player.currencies.points.amount, player.mainUpg.cost)) {document.getElementById("upgradeButton").classList.remove("ulocked"); document.getElementById("upgradeButton").classList.add("uunlocked")} else {document.getElementById("upgradeButton").classList.add("ulocked"); document.getElementById("upgradeButton").classList.remove("uunlocked")}
    document.getElementById("upgLvl").innerHTML = new ex(player.mainUpg.bght)
    document.getElementById("upgNLvl").innerHTML = new ex(player.mainUpg.bght).add(1)
    document.getElementById("upgCst").innerHTML = format(player.mainUpg.cost)
    document.getElementById('points').innerHTML = format(player.currencies.points.amount)
    document.getElementById('pps').innerHTML = format(pointGen())
    document.getElementById('atpoints').innerHTML = format(player.currencies.points.total)
    document.getElementById('bestpoints').innerHTML = format(new ex(player.currencies.points.best))
    document.getElementById('timeplayed').innerHTML = formattime(player.stats.timeplayed)
    for (const a in notPlayer.tabs) {
        document.getElementById(a + "Tab").style.display = (notPlayer.tabs[a]) ? "revert" : "none"
    }

    document.getElementById('saveToggle').innerHTML = (player.autosaving) ? "ON → OFF" : "OFF → ON"

    player.stats.timeplayed += 1/20
}

init()

window.setInterval(function() {
    let diff = (Date.now() - lastUpdate) / 1000

    increment(diff)
    update()

    lastUpdate = Date.now()
}, 1000/20)

window.setInterval(save, 60000, true)