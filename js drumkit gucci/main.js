document.body.addEventListener('keypress', onKeyPress)

document.querySelector('#Kanał1Rec')
    .addEventListener('click', NagrajKanał1)

document.querySelector('#Kanał2Rec')
    .addEventListener('click', NagrajKanał2)

document.querySelector('#Kanał3Rec')
    .addEventListener('click', NagrajKanał3)

document.querySelector('#Kanał4Rec')
    .addEventListener('click', NagrajKanał4)

document.querySelector('#Kanał1Play')
    .addEventListener('click', OdtwórzKanał1)

document.querySelector('#Kanał2Play')
    .addEventListener('click', OdtwórzKanał2)

document.querySelector('#Kanał3Play')
    .addEventListener('click', OdtwórzKanał3)

document.querySelector('#Kanał4Play')
    .addEventListener('click', OdtwórzKanał4)

let Kanał1Start, Kanał2Start, Kanał3Start, Kanał4Start



const Kanał1 = []
const Kanał2 = []
const Kanał3 = []
const Kanał4 = []

let AktywnyKanał = -1;

const sounds = {
    KeyA: "#boom",
    KeyS: "#clap",
    KeyD: "#hihat",
    KeyF: "#kick",
    KeyG: "#openhat",
    KeyH: "#ride",
    KeyJ: "#snare",
    KeyK: "#tink",
    KeyL: "#tom",
    KeyV: "#violin"
}

function onKeyPress50zł(e) {
    OdtwórzDźwięk(sounds[e.code]);
    if (AktywnyKanał === -1) {
        return;
    }


    if (AktywnyKanał === 0) {
        const time = Date.now() - Kanał1Start;
        const sound = {
            sound: e.code,
            time: time
        }
        Kanał1.push(sound)
    }

    if (AktywnyKanał === 1) {
        const time = Date.now() - Kanał2Start;
        const sound = {
            sound: e.code,
            time: time
        }
        Kanał2.push(sound)
    }

    if (AktywnyKanał === 2) {
        const time = Date.now() - Kanał3Start;
        const sound = {
            sound: e.code,
            time: time
        }
        Kanał3.push(sound)
    }

    if (AktywnyKanał === 3) {
        const time = Date.now() - Kanał4Start;
        const sound = {
            sound: e.code,
            time: time
        }
        Kanał4.push(sound)
    }

}

function ZakończNagrywanie() {
    AktywnyKanał = -1;
}

function OdtwórzKanał1() {
    ZakończNagrywanie();
    Kanał1.forEach((el) => {
        setTimeout(() => {
            OdtwórzDźwięk(sounds[el.sound])
        }, el.time);
    })
}

function OdtwórzKanał2() {
    ZakończNagrywanie();
    Kanał2.forEach((el) => {
        setTimeout(() => {
            OdtwórzDźwięk(sounds[el.sound])
        }, el.time);
    })
}

function OdtwórzKanał3() {
    ZakończNagrywanie();
    Kanał3.forEach((el) => {
        setTimeout(() => {
            OdtwórzDźwięk(sounds[el.sound])
        }, el.time);
    })
}

function OdtwórzKanał4() {
    ZakończNagrywanie();
    Kanał4.forEach((el) => {
        setTimeout(() => {
            OdtwórzDźwięk(sounds[el.sound])
        }, el.time);
    })
}

function OdtwórzDźwięk(id) {
    const audioTag = document.querySelector(id)
    audioTag.currentTime = 0
    audioTag.play()

}

function NagrajKanał1() {
    Kanał1Start = Date.now()
    AktywnyKanał = 0;
}

function NagrajKanał2() {
    Kanał2Start = Date.now()
    AktywnyKanał = 1;
}

function NagrajKanał3() {
    Kanał3Start = Date.now()
    AktywnyKanał = 2;
}

function NagrajKanał4() {
    Kanał4Start = Date.now()
    AktywnyKanał = 3;
}