var audio = new Audio();
audio.src = "./src/audio.mp3";
audio.controls = true;
audio.loop = true;
audio.autoplay = false;
//Guarda el archivo de audio en la variable audio
/* var audio = document.querySelector('.mp3player__audio'); */
var MEDIA_ELEMENT_NODES = new WeakMap();
var clicked = true;
var analyserElement = document.querySelector('.mp3player__analyzerrender');
var canvas, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height;

var segundos = 0, color = "#FFB800", reloj;

window.addEventListener("load", initMp3Player, false);

var buttonStart = document.querySelector('.mp3player__button');
var audioPlayer = document.querySelector('.mp3player__audiobox');
var container = document.querySelector('.mp3player__infocontainer');

buttonStart.addEventListener('click', function(){
    container.style.display = 'none';
    context.resume();
});

audioPlayer.addEventListener('mouseover', function(){
    audioPlayer.classList.remove('mp3player__audiobox--selected');
});

audio.addEventListener('play', function(){
    segundos = Math.trunc(audio.currentTime);
    tiempo();
});

audio.addEventListener('pause', function(){
    segundos = Math.trunc(audio.currentTime);
    detenerTiempo();
});

function initMp3Player() {

    if (context == undefined) {
        document.querySelector('.mp3player__audiobox').appendChild(audio);
    }

    if (context == undefined) {
        context = new AudioContext();
    }

    analyser = context.createAnalyser();
    canvas = analyserElement;

    ctx = canvas.getContext('2d');

    if (MEDIA_ELEMENT_NODES.has(audio) && clicked) {
        source = MEDIA_ELEMENT_NODES.get(audio);
        clicked = false;
    } else {
        source = context.createMediaElementSource(audio);
        MEDIA_ELEMENT_NODES.set(audio, source);
    }

    /* source = context.createMediaElementSource(audio); */
    source.connect(analyser);
    analyser.connect(context.destination);
    frameLooper();
}

function frameLooper() {
    window.requestAnimationFrame(frameLooper);

    fbc_array = new Uint8Array(analyser.frequencyBinCount);

    analyser.getByteFrequencyData(fbc_array);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    bars = 100;

    for (var i = 0; i - bars; i++) {
        bar_x = i * 3;
        bar_width = 2;
        bar_height = -(fbc_array[i] / 2);

        ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
    }
}
/* window.onload =  */

function tiempo() {

    reloj = setInterval(function(){
        if(segundos >= 0 && segundos <= 59){
            color = "#0A55C5";
            frameLooper();
        }
        if(segundos >= 60 && segundos <= 179){
            color = "#FFB800";
            frameLooper();
        }
        if(segundos >= 180 && segundos <= 239){
            color = "#0A55C5";
            frameLooper();
        }
        if(segundos >= 240 && segundos <= 359){
            color = "#FFB800";
            frameLooper();
        }
        if(segundos >= 360 && segundos <= 420){
            color = "#0A55C5";
            frameLooper();
        }
        segundos = Math.trunc(audio.currentTime);
        
    },1000);
}

function detenerTiempo(){
    clearInterval(reloj);
}
