var rl = 450;
const corebase = 4500;
var corehp = 0;
const teamsizemod = [1,1.9,2.8,3.4,4,4.6,5.2,5.8]
var thumbnails = ["./img/dds.png", "./img/claws.png", "./img/tent.png", "./img/crapier.png", "./img/fang.png", "./img/bgs.png", "./img/dds.png", "./img/claws.png", "./img/sgs.png", "./img/partisan.png", "./img/voidwalker.png", "./img/bgs.png"]

//dds, claws, tent, crapier, fang, bgs
var weapnames = ["dds", "claws", "tent", "crapier", "fang", "bgs", "dds spec", "claw spec", "sgs", "partisan", "voidwalker", "bgs spec"]
var weapstr = [40,56,86,89,103,132,0,0,132,46,80,132]
var maxhits = [0,0,0,0,0,0,0,0,0,0,0]
//dds, claws
var spechits = [0,0]
var damagelog = []
calcmaxes();
calccorehp();
calchits();
function calcmaxes() {
    var avernic = document.querySelector('#avern');
    var weapstrmod = [0,8,0,0,0,8,0,0,8,0,0,8]
    var weapstylemod = [0,0,2,0,0,0,0,0,0,0,0,0]
    for (let w=0;w<weapstrmod.length;w++) {
        if (weapstrmod[w] == 8) {
            if (!avernic.checked) {
                weapstrmod[w] = 6;
            }
        }
    }
    var strlvl = parseInt(document.getElementById('istrlvl').value);
    var strbns = parseInt(document.getElementById('istrbns').value);
    for (let w=0;w<weapstr.length;w++) {
        var saltboost = Math.floor((strlvl * 0.16) + 11);
        var effstr = ((strlvl + saltboost) * 1.23) + (11 - weapstylemod[w]);
        maxhits[w] = Math.floor((0.5 + effstr) * (((strbns - weapstrmod[w]) + weapstr[w] + 64) / 640));
        if (w == 4) { //fang 85%
            maxhits[w] = Math.floor(maxhits[w] * 0.85);
        }
    }
    //dds spec
    maxhits[6] = Math.floor(maxhits[0] * 1.15) * 2;
    if ((maxhits[6] / 2) >= 49) {
        maxhits[6] = 49 * 2;
    }
    var csh = [0,0,0,0]
    csh[0] = maxhits[1] - 1;
    csh[1] = Math.floor(csh[0] / 2);
    csh[2] = Math.floor(csh[1] / 2);
    csh[3] = Math.floor(csh[2] + 1);
    maxhits[7] = csh[0] + csh[1] + csh[2] + csh[3];
    maxhits[8] = Math.floor(maxhits[8] * 1.1);
    maxhits[11] = Math.floor(maxhits[11] * 1.21);
    var maxstring = "";
    //maxstring += 'dds spec[<span class="c-red">' + maxhits[6] + '</span>] ' + 'claw spec[<span class="c-red">' + maxhits[7] + '</span>] ';
    for (let s=0;s<weapnames.length;s++) {
        maxstring += weapnames[s] + '[<span class="c-red">' + maxhits[s] + '</span>] ';
    }
    document.getElementById('mhlabel').innerHTML = maxstring;
    calchits();
}

function calccorehp() {
    rl = document.getElementById('ilvl').value;
    corehp = corebase + corebase * (rl / 1000);
    var teamsize = document.getElementById('tsize').value;
    if (parseInt(teamsize) > 1) {
        corehp = Math.floor(corehp * teamsizemod[teamsize - 1]);
    }
    calchits();
}

function addhit(idx) {
    //var entry = [idx, parseInt(maxhits[idx] * 5)]
    damagelog.push(idx);
    calchits();
}

function calchits() {
    document.getElementById('main').innerHTML = "";
    var out = "";
    var chp = corehp;
    var fcd = 0;
    let breakpoints = [];
    var dmgmult = document.getElementById('tsize').value;
    for (let c=0;c<damagelog.length;c++) {
        if (c == 0) {
            out += '<div class="corehead">- core 1 -</div>';
        }

        if (c == 6) {
            out += '<div class="corehead">- core 2 -</div>';
        }

        chp -= ((maxhits[damagelog[c]] * 5)) * dmgmult;
        var diff = Math.floor(chp - corehp === 0 ? 0 : 100 * Math.abs((chp - corehp) / corehp));
        if (diff > 100) {
            diff = 100;
        }

        if (c == 5) {
            breakpoints.push(diff);
            console.log(breakpoints[0]);
        }

        if (c == 14) {
            if (breakpoints[0] < 40) {
                out += '<div class="corehead">- core 3 -</div>';
            }
        }

        if (c == 16) {
            if (breakpoints[0] >= 40) {
                out += '<div class="corehead">- core 3 -</div>';
            }
        }

        console.log('c = ' + c);

        //breakpoints.push(diff);
        //console.log(c + " " + breakpoints[c]);
        //console.log(breakpoints);

        out += '<div class="c-core" onclick="removehit(' + c + ')"><div class="hpb">';
        out += '<div class="hpbi" style="width:' + diff + '%"></div>'
        out += '<div class="hpbl">' + chp + '/' + corehp + '[' + diff + '%]</div></div>';
        out += '<div class="dmg">' + (maxhits[damagelog[c]] * 5) * dmgmult + '</div>';
        out += '<img src="' + thumbnails[damagelog[c]] + '"/></div>';

        //if (breakpoints[5] < 40) {
        //    if (c == 13) {
        //        out += '<div class="corehead">- core 3 -</div>';
        //    }
        //} else if (breakpoints[5] >= 40) {
        //    if (c == 15) {
        //        out += '<div class="corehead">- core 3 -</div>';
        //    }
        //}



        //if (breakpoints[c - 1] >= 40) {
        //    if (c == 15) {
        //        out += '<div class="corehead">- core 3 -</div>';
        //    }
        //}
//
        //if (breakpoints[c - 1] >= 20 && breakpoints[c - 1] < 40) {
        //    if (c == 13) {
        //        out += '<div class="corehead">- core 3 -</div>';
        //    }
        //}


        //if (c == 5) {
        //    out += '<div class="corehead">- core 2 -</div>';
        //    fcd = diff;
        //}
//
        //if (fcd < 20) {
        //    if (c == 11) {
        //        out += '<div class="corehead">- core 3 -</div>';
        //    }
        //} else if (fcd < 40) {
        //    if (c == 13) {
        //        out += '<div class="corehead">- core 3 -</div>';
        //    }
        //} else if (fcd >= 40) {
        //    if (c == 15) {
        //        out += '<div class="corehead">- core 3 -</div>';
        //    }
        //}
    }
    document.getElementById('main').innerHTML = out;
}

function removehit(idx) {
    damagelog.splice(idx, 1);
    calchits();
}
function calc() {
    rl = document.getElementById('ilvl').value;
    document.getElementById('main').innerHTML = "";
    var chp = cbase + cbase * (rl / 1000);
    var mhp = cbase + cbase * (rl / 1000);

    //var rseq = document.getElementById('inseq').value;
    //for (let s=0;s<rseq.length;s++) {
    //    if (rseq[s] == "s") {
    //        sequence[s] = 0;
    //    } else if (rseq[s] == "f") {
    //        sequence[s] = 1;
    //    } else if (rseq[s] == "l") {
    //        sequence[s] = 2;
    //    }
    //}
    //maxhits[0] = document.getElementById('maxs').value * 2;
    //maxhits[1] = document.getElementById('maxf').value;
    //maxhits[2] = document.getElementById('maxl').value;
    //for (let i=0;i<sequence.length;i++) {
    //    var chit = maxhits[sequence[i]] * 5;
    //    chp -= maxhits[sequence[i]] * 5;
    //    var diff = Math.floor(chp - mhp === 0 ? 0 : 100 * Math.abs((chp - mhp) / mhp));
    //    if (diff > 100) {
    //        diff = 100;
    //    }
    //    console.log(diff);
    //    //console.log(chp);
    //    var hpb = '<div class="hpb"><div class="hpbi" style="width:' + diff + '%;"></div><div class="hpbl">' + chp + '/' + mhp +'</div></div>';
    //    var dmg = '<div class="dmg"><div class="dmgl"><img src="' + thumbnails[sequence[i]] + '"></img>' + chit + '</div></div>';
    //    document.getElementById('main').innerHTML += '<div class="row">' + hpb + dmg + '</div>';
    //}
    //console.log(cbase + cbase * (rl / 1000));
}