var ex = EdxpantaNum

var player = {
    currencies: {
        points: {
            amount: new ex("0"), // How many points.
            base: new ex("1"),   // Base points gain.
            mult: new ex("1"),   // Multiplies points gain.
            pps: new ex("0"),    // Points per second.
            total: new ex("0"),
            best: new ex("0"),
        },

        augmentation: { // Next update...
            amount: new ex("4"),

        }
    },

    mainUpg: {
        bght: new ex("0"),
        amnt: new ex("10"),
        bcst: new ex("10"),
        cost: new ex("10"),

        milestones: { // Every milestone has a required level, interval (every how many levels), amount, effect, type, operator
            1: {
                desc: "Add 0.15 to point production every level.",
                type: 1,
                reqlevel: new ex("1"),
                interval: new ex("1"),
                unlocked: false,
                op: "+",
                effect: new ex("0"),
                amt: new ex("0"),
            },

            2: {
                desc: "Add 0.35 to point production every 2 levels.",
                type: 1,
                reqlevel: new ex("3"),
                interval: new ex("2"),
                unlocked: false,
                op: "+",
                effect: new ex("0"),
                amt: new ex("0"),
            },

            3: {
                desc: "Mutliply the power of milestone 1 by &times1.25 every 3 levels.",
                type: 2,
                reqlevel: new ex("5"),
                interval: new ex("3"),
                unlocked: false,
                op: "&times",
                effect: new ex("1"),
                amt: new ex("0"),
            },

            4: {
                desc: "Multiply base point generation by &times1.35 every 5 levels.",
                type: 2,
                reqlevel: new ex("10"),
                interval: new ex("5"),
                unlocked: false,
                op: "&times",
                effect: new ex("1"),
                amt: new ex("0")
            },

            5: {
                desc: "Increase base point generation by 0.5 every 5 levels.",
                type: 1,
                reqlevel: new ex("15"),
                interval: new ex("7"),
                unlocked: false,
                op: "+",
                effect: new ex("0"),
                amt: new ex("0"),
            },
            
            shown: [],
        }
    },

    other: {
        tabs: {main: true, options: false, stats: false}, // This is the tab visibility array, from left to right on the page (the first one is the main, the second is the options, etc.).
    },

    stats: {
        augmentations: 0, // Amount of times you augmented. Not an ExpantaNum. Next update... (You can decide to change this to a value that isn't 0 to see what I'm working on. Just use "player.stats.aumgentations = 1" or something)
        timeplayed: 0, // In seconds.
    }
}

var lastUpdate = Date.now()

/* <div id="m1">
<div id="minfo1" class="milestone mt1">
<div class="mtitle" id="m1title"></div>
<div class="mdesc" id="m1desc"></div>
<br id="m1br">
<div class="meff" id="m1eff"></div>
<div class="mamt" id="m1amt"></div>
<div class="mtype" id="m1type"></div>
</div>
<div id="minv1" class="mileinv mt1">
<p id=>a</p>
</div>
</div> */

function init() {
    for (let i = 1; i < Object.keys(player.mainUpg.milestones).length; i++) {
        let m = player.mainUpg.milestones[i]
        document.getElementById("mscontain").innerHTML += `<div id="m${i}" style='display: inline-block'><div id=minfo${i} class="milestone mt${m.type} mttc${m.type}"><div class="mtitle" id="m${i}title"></div><div class="mdesc" id="m${i}desc"></div><br id="m${i}br"><div class="meff" id="m${i}eff"></div><div class="mamt" id="m${i}amt"></div><div class="mtype" id="m${i}type"></div></div><div id="minv${i}" class="mileinv mti"><p class="mttci" id="minv${i}desc"></p><p class="mttci" span="mtie${i}">+0.15 → <span class="emp"><b>+0.25</b></span></p><br><button class="invButton">Invest 4 AP.</button></div></div></div>`
        document.getElementById("m" + i + "title").innerHTML = `Reach level ${m.reqlevel} to unlock this milestone.`
        document.getElementById("minv" + i + "desc").innerHTML = "Unlock this milestone to invest."
        document.getElementById("m" + i + "br").style.display = "none"
        document.getElementById("m" + i).style.display = "none"
        document.getElementById("minv" + i).style.display = "none"
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
    if (!player.other.tabs[tab]) {
        Object.keys(player.other.tabs).forEach(v => player.other.tabs[v] = false)
        player.other.tabs[tab] = true 
    }
}

function format(n) {
    return new ex(n).toFixed(2)
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
    return p
}

function increment(d) {
    player.currencies.points.amount = new ex(player.currencies.points.amount).add(pointGen().mul(d))
    player.currencies.points.total = new ex(player.currencies.points.total).add(pointGen().mul(d))
}

function dm(n) {
    if (n === 1) {
        var exp = window.btoa(JSON.stringify(player))
        navigator.clipboard.writeText(exp).then(() => {
    })} else {
        player = JSON.parse(atob(document.getElementById("importbox").value))
    }
}

function update() {
    player.currencies.points.mult = ex.add(player.mainUpg.bght, 1)
    player.mainUpg.cost = ex.add(player.mainUpg.bcst, new ex(player.mainUpg.bght).mul(1.5)).mul(ex.pow(1.1, player.mainUpg.bght))

    for (let i = 1; i < Object.keys(player.mainUpg.milestones).length; i++) {
        let m = player.mainUpg.milestones[i]
        if (!m.unlocked) {document.getElementById("minfo" + i).classList.add("mslocked"); document.getElementById("minv" + i).classList.add("mslocked")} else {document.getElementById("minfo" + i).classList.remove("mslocked"); document.getElementById("minv" + i).classList.remove("mslocked")}
        if (ex.gte(player.mainUpg.bght, m.reqlevel)) {
            if (!m.unlocked) {m.unlocked = true; player.mainUpg.milestones.shown.push(i)}
            m.amt = ex.floor(new ex(player.mainUpg.bght).sub(m.reqlevel).div(m.interval)).add(1) 
        }

        document.getElementById("minv" + i).style.display = (player.stats.augmentations == 0) ? "none" : ""
    }

    if (player.mainUpg.milestones.shown.length != 0) {
        for (let i = 1; i <= Math.max(...player.mainUpg.milestones.shown); i++) {
            m = player.mainUpg.milestones[i]
            document.getElementById("m" + i + "title").innerHTML = `Milestone ${i}`
            document.getElementById("m" + i + "desc").innerHTML = `${m.desc}<br/>`
            document.getElementById("m" + i + "eff").innerHTML = `Currently: ${m.op}${format(m.effect)}`
            document.getElementById("m" + i + "amt").innerHTML = `You have gotten this milestone ${(m.amt.eq(1) ? " once." : m.amt + " times.")}`
            document.getElementById("m" + i + "br").style.display = "" 
            switch (m.type) {
                case 1: {document.getElementById("m" + i + "type").innerHTML = "INCREMENTER"; break}
                case 2: {document.getElementById("m" + i + "type").innerHTML = "MULTIPLICATOR"; break}
                default: {document.getElementById("m" + i + "type").innerHTML = "ERROR_NO_TYPE"}
            }
            document.getElementById("minv" + i + "desc").innerHTML = `Invest all your augmentation points (${player.currencies.augmentation.amount}) into this milestone.`  
        }
    }

    for (let i = 1; i < ((player.mainUpg.milestones.shown.length != 0) ? Math.min(Math.max(...player.mainUpg.milestones.shown) + 3, Object.keys(player.mainUpg.milestones).length) : 3); i++) {
        document.getElementById("m" + i).style.display = "flex"
    }


    // List of all the milestone effects and their formulas.
    player.mainUpg.milestones[3].effect = ex.pow(1.25, player.mainUpg.milestones[3].amt)
    player.mainUpg.milestones[4].effect = ex.pow(1.35, player.mainUpg.milestones[4].amt)
    player.mainUpg.milestones[1].effect = ex.mul(player.mainUpg.milestones[1].amt, 0.15).mul(player.mainUpg.milestones[3].effect)
    player.mainUpg.milestones[2].effect = ex.mul(player.mainUpg.milestones[2].amt, 0.35)
    player.mainUpg.milestones[5].effect = ex.mul(player.mainUpg.milestones[5].amt, player.mainUpg.milestones[4].effect)
    
    if (ex.gt(player.currencies.points.amount, player.currencies.points.best)) player.currencies.points.best = player.currencies.points.amount
    
    if (ex.gte(player.currencies.points.amount, player.mainUpg.cost)) {document.getElementById("upgradeButton").classList.remove("ulocked"); document.getElementById("upgradeButton").classList.add("uunlocked")} else {document.getElementById("upgradeButton").classList.add("ulocked"); document.getElementById("upgradeButton").classList.remove("uunlocked")}
    document.getElementById("upgLvl").innerHTML = new ex(player.mainUpg.bght)
    document.getElementById("upgCst").innerHTML = format(player.mainUpg.cost)
    document.getElementById('points').innerHTML = format(player.currencies.points.amount)
    document.getElementById('pps').innerHTML = format(pointGen())
    document.getElementById('atpoints').innerHTML = format(player.currencies.points.total)
    document.getElementById('bestpoints').innerHTML = format(player.currencies.points.best)
    document.getElementById('timeplayed').innerHTML = formattime(player.stats.timeplayed)
    for (const a in player.other.tabs) {
        document.getElementById(a + "Tab").style.display = (player.other.tabs[a]) ? "revert" : "none"
    }
    
    player.stats.timeplayed += 1/20
}

init()

window.setInterval(function() {
    let diff = (Date.now() - lastUpdate) / 1000

    increment(diff)
    update()

    lastUpdate = Date.now()
}, 1000/20)