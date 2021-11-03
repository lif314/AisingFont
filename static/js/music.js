/**
 * 点击播放按钮，从后台获取数据
 */

var source = null;
var audioBuffer = null;
/**
 * The AudioContext was not allowed to start. 
 * It must be resumed (or created) after a user gesture on the page.
 */
const context = new AudioContext();

var base64ToBuffer = function(buffer) {
    var binary = window.atob(buffer);
    var buffer = new ArrayBuffer(binary.length);
    var bytes = new Uint8Array(buffer);
    for (var i = 0; i < buffer.byteLength; i++) {
        bytes[i] = binary.charCodeAt(i) & 0xFF;
    }
    return buffer;
};

// 初始化音频
function initSound(base64String) {
    // 转为buffer

    var audioFromString = base64ToBuffer(base64String);
    context.decodeAudioData(audioFromString, function(buffer) {
        // audioBuffer is global to reuse the decoded audio later.
        audioBuffer = buffer;
        // var buttons = document.querySelectorAll('button');
        // buttons[0].disabled = false;
        // buttons[1].disabled = false;
    }, function(e) {
        console.log('Error decoding file', e);
    });
}

// 停止播放
function stopSound() {
    if (source) {
        source.stop(0);
    }
}

// 播放
function playSound() {
    // source is global so we can call .stop() later.
    source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = false;
    source.connect(context.destination);
    source.start(0); // Play immediately.
    document.onkeydown = function(event) {
        if (event.keyCode == 13) {
            source.stop(0);
        }
    }
}


document.getElementById("btn_play").onclick = function() {
    // 向后台发送请求，播放音乐
    var requestOptions = {
        method: 'POST',
        redirect: 'follow'
    };

    const type = "happiness";

    fetch("http://localhost:8080/music?type=happiness", requestOptions)
        .then(response => response.text())
        .then(result => {
            // console.log(result); // result是mp3的base编码
            initSound(result);
            playSound();
            // alert("music!");

        })
        .catch(error => console.log('error', error));
}


/**
 * 点击停止按钮，停止播放
 */
document.getElementById("btn_stop").onclick = function() {
    stopSound();
}


// Converts an ArrayBuffer to base64, by converting to string 
// and then using window.btoa' to base64. 
// var bufferToBase64 = function(buffer) {
//     var bytes = new Uint8Array(buffer);
//     var len = buffer.byteLength;
//     var binary = "";
//     for (var i = 0; i < len; i++) {
//         binary += String.fromCharCode(bytes[i]);
//     }
//     return window.btoa(binary);
// };

// https://codepen.io/xewl/pen/NjyRJx
// var base64ToBuffer = function(buffer) {
//     var binary = window.atob(buffer);
//     var buffer = new ArrayBuffer(binary.length);
//     var bytes = new Uint8Array(buffer);
//     for (var i = 0; i < buffer.byteLength; i++) {
//         bytes[i] = binary.charCodeAt(i) & 0xFF;
//     }
//     return buffer;
// };

// function stopSound() {
//     if (source) {
//         source.stop(0);
//     }
// }

// function playSound() {
//     // source is global so we can call .stop() later.
//     source = context.createBufferSource();
//     source.buffer = audioBuffer;
//     source.loop = false;
//     source.connect(context.destination);
//     source.start(0); // Play immediately.
// }

// function initSound(arrayBuffer) {
//     var base64String = bufferToBase64(arrayBuffer);
//     var audioFromString = base64ToBuffer(base64String);
//     document.getElementById("encodedResult").value = base64String;
//     context.decodeAudioData(audioFromString, function(buffer) {
//         // audioBuffer is global to reuse the decoded audio later.
//         audioBuffer = buffer;
//         var buttons = document.querySelectorAll('button');
//         buttons[0].disabled = false;
//         buttons[1].disabled = false;
//     }, function(e) {
//         console.log('Error decoding file', e);
//     });
// }

// // User selects file, read it as an ArrayBuffer and pass to the API.
// var fileInput = document.querySelector('input[type="file"]');
// fileInput.addEventListener('change', function(e) {
//     var reader = new FileReader();
//     reader.onload = function(e) {
//         initSound(this.result);
//     };
//     reader.readAsArrayBuffer(this.files[0]);
// }, false);
// // Load file from a URL as an ArrayBuffer.
// // Example: loading via xhr2: loadSoundFile('sounds/test.mp3');
// function loadSoundFile(url) {
//     var xhr = new XMLHttpRequest();
//     xhr.open('GET', url, true);
//     xhr.responseType = 'arraybuffer';
//     xhr.onload = function(e) {
//         initSound(this.response); // this.response is an ArrayBuffer.
//     };
//     xhr.send();
// }