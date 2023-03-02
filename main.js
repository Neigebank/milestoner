var e = ExpantaNum

var player = {
    currencies: {
        points: {
            amount: new e(0), // How many points.
            base: new e(1),   // Base points gain.
            mult: new e(1),   // Multiplies points gain.
            pps: new e(0),    // Points per second.
        },

        augmentation: { // Next update...
            amount: new e(4),

        }
    },

    mainUpg: {
        bght: new e(4),
        amnt: new e(10),
        bcst: new e(10),
        cost: undefined,

        milestones: { // Every milestone has a required level, interval (every how many levels), amount, effect, type, operator
            1: {
                desc: "Add 0.15 to point production every level.",
                type: 1,
                reqlevel: new e(1),
                interval: new e(1),
                unlocked: false,
                op: "+",
                effect: new e(0),
                amt: new e(0),
            },

            2: {
                desc: "Add 0.25 to point production every 2 levels.",
                type: 1,
                reqlevel: new e(2),
                interval: new e(2),
                unlocked: false,
                op: "+",
                effect: new e(0),
                amt: new e(0),
            },

            3: {
                desc: "Mutliply the power of milestone 1 by &times1.3 every 5 levels.",
                type: 2,
                reqlevel: new e(5),
                interval: new e(5),
                unlocked: false,
                op: "&times",
                effect: new e(1),
                amt: new e(0),
            },

            4: {
                desc: "Multiply base point generation by &times1.6 every 10 levels.",
                type: 2,
                reqlevel: new e(10),
                interval: new e(10),
                unlocked: false,
                op: "&times",
                effect: new e(1),
                amt: new e(0)
            },

            5: {
                desc: "Increase base point generation by 1 every 5 levels.",
                type: 1,
                reqlevel: new e(15),
                interval: new e(5),
                unlocked: false,
                op: "+",
                effect: new e(0),
                amt: new e(0),
            },

            total: 5,
            shown: [],
        }
    },

    other: {
        started: true,
    },

    stats: {
        augmentations: 0, // Amount of times you augmented. Not an ExpantaNum. Next update... (You can decide to change this to a value that isn't 0 to see what I'm working on. Just use "player.stats.aumgentations = 1" or something)
    }
}

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
    for (let i = 1; i <= player.mainUpg.milestones.total; i++) {
        let m = player.mainUpg.milestones[i]
        document.getElementById("mscontain").innerHTML += `<div id="m${i}" style='display: inline-block'><div id=minfo${i} class="milestone mt${m.type}"><div class="mtitle" id="m${i}title"></div><div class="mdesc" id="m${i}desc"></div><br id="m${i}br"><div class="meff" id="m${i}eff"></div><div class="mamt" id="m${i}amt"></div><div class="mtype" id="m${i}type"></div></div><div id="minv${i}" class="mileinv mt${m.type}"><p id="minv${i}desc"></p><button>hi</button></div></div></div>`

        document.getElementById("m" + i + "title").innerHTML = `Reach level ${m.reqlevel} to unlock this milestone.`
        document.getElementById("minv" + i + "desc").innerHTML = "Unlock this milestone to invest."
        document.getElementById("m" + i + "br").style.display = "none"
        document.getElementById("m" + i).style.display = "none"
        document.getElementById("minv" + i).style.display = "none"
    } 
}

function start() {
    player.other.started = true
}

function buyMUpg() {
    if (e.gte(player.currencies.points.amount, player.mainUpg.cost)) {
        player.currencies.points.amount = player.currencies.points.amount.sub(player.mainUpg.cost)
        player.mainUpg.bght = player.mainUpg.bght.add(1)
        player.mainUpg.amnt = player.mainUpg.amnt.add(1)
    }
}

function format(n) {
    return n.toFixed(2)
}

function pointGen() {
    let p = player.currencies.points.base
    let ea = [] // Effect array.
    for (let i = 1; i <= player.mainUpg.milestones.total; i++) {
        ea.push(player.mainUpg.milestones[i].effect)
    }

    p = p.add(ea[4])
    p = p.mul(ea[3])
    p = p.add(ea[0])
    p = p.add(ea[1])
    return p
}

function increment() {
    if (player.other.started) player.currencies.points.amount = player.currencies.points.amount.add(pointGen().div(20))
}

function update() {
    player.currencies.points.mult = player.mainUpg.bght.add(1)
    player.mainUpg.cost = player.mainUpg.bcst.add(player.mainUpg.bght.mul(1.5)).mul(e.pow(1.1, player.mainUpg.bght))

    for (let i = 1; i <= player.mainUpg.milestones.total; i++) {
        let m = player.mainUpg.milestones[i]
        if (!m.unlocked) {document.getElementById("minfo" + i).classList.add("mslocked"); document.getElementById("minv" + i).classList.add("mslocked")} else {document.getElementById("minfo" + i).classList.remove("mslocked"); document.getElementById("minv" + i).classList.remove("mslocked")}
        if (e.gte(player.mainUpg.bght, m.reqlevel)) {
            if (!m.unlocked) {m.unlocked = true; player.mainUpg.milestones.shown.push(i)}
            m.amt = e.floor(player.mainUpg.bght.sub(m.reqlevel).div(m.interval)).add(1) 
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
            document.getElementById("m" + i + "type").innerHTML = m.type 
            document.getElementById("minv" + i + "desc").innerHTML = `Invest all your augmentation points (${player.currencies.augmentation.amount}) into this milestone.`  
        }
    }

    for (let i = 1; i <= ((player.mainUpg.milestones.shown.length != 0) ? Math.min(Math.max(...player.mainUpg.milestones.shown) + 3, player.mainUpg.milestones.total) : 3); i++) {
        document.getElementById("m" + i).style.display = "flex"
    }


    // List of all the milestone effects and their formulas.
    player.mainUpg.milestones[3].effect = e.pow(1.3, player.mainUpg.milestones[3].amt)
    player.mainUpg.milestones[4].effect = e.pow(1.6, player.mainUpg.milestones[4].amt)
    player.mainUpg.milestones[1].effect = player.mainUpg.milestones[1].amt.mul(0.15).times(player.mainUpg.milestones[3].effect)
    player.mainUpg.milestones[2].effect = player.mainUpg.milestones[2].amt.div(4)
    player.mainUpg.milestones[5].effect = player.mainUpg.milestones[5].amt
    
    
    if (e.gte(player.currencies.points.amount, player.mainUpg.cost)) {document.getElementById("upgradeButton").classList.remove("ulocked"); document.getElementById("upgradeButton").classList.add("uunlocked")} else {document.getElementById("upgradeButton").classList.add("ulocked"); document.getElementById("upgradeButton").classList.remove("uunlocked")}
    if (player.other.started) document.getElementById("startDiv").style.display = "none"
    if (player.other.started) document.getElementById("main").style.display = "revert";
    document.getElementById("upgLvl").innerHTML = player.mainUpg.bght
    document.getElementById("upgCst").innerHTML = format(player.mainUpg.cost)
    document.getElementById('points').innerHTML = format(player.currencies.points.amount)
    document.getElementById('pps').innerHTML = format(pointGen())
}

init()

window.setInterval(update, 1000/20)
window.setInterval(increment, 1000/20)