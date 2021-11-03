/**
 * 开启摄像头
 */
document.getElementById("btn_startMakeup").onclick = function() {
    // alert("makeup!");
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    var tracker = new tracking.ObjectTracker('face');
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);

    tracking.track('#video', tracker, { camera: true });

    tracker.on('track', function(event) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        event.data.forEach(function(rect) {
            context.strokeStyle = '#a64ceb';
            context.strokeRect(rect.x - 8, rect.y - 60, rect.width, rect.height);
            context.font = '8px Helvetica';
            context.fillStyle = "#fff";
            context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y - 40);
            context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y - 30);
        })
    });

    // var gui = new dat.GUI();
    // gui.add(tracker, 'edgesDensity', 0.1, 0.5).step(0.01);
    // gui.add(tracker, 'initialScale', 1.0, 10.0).step(0.1);
    // gui.add(tracker, 'stepSize', 1, 5).step(0.1);
}

/**
 * 将base64值转换为图片并显示在合适的位置上
 * @param base64 图片的base64编码
 * @param {*} imgNum 相框编号
 */
function Base64toImage(base64, imgNum) {
    // reset previous
    const canvas = document.getElementById("canvas" + imgNum);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    img.src = 'data:image/png;base64,' + base64;
}


/**
 * 向后端发送post请求
 * @param {*} type 口红类型
 * @param {*} imgNum 相框编号
 */
function postFecth(type, imgNum) {
    // alert("face login!");
    var video = document.getElementById("video");
    var canvas = document.getElementById("canvas");
    var userContext = canvas.getContext("2d");
    userContext.drawImage(video, 0, 0, canvas.width, canvas.height);
    // var userImgSrc = canvas.toDataURL("image/png"); // 截取第一帧
    var userImgSrc = canvas.toDataURL("image/png"); // 截取第一帧
    //拿到bash64格式的照片信息: 去除标签 --- data:image/png;base64,
    var faceBase = userImgSrc.split(",")[1];
    // alert(faceBase);

    var formdata = new FormData();
    formdata.append("faceBase64", "" + faceBase);
    formdata.append("type", type + "");

    var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    fetch("http://localhost:8080/makeup", requestOptions)
        .then(response => response.text())
        .then(result => {
            // alert(result);

            // {"request_id":"1634575252,99594905-1993-4383-b7c7-8ccd3138e89f","time_used":48,"makeup_image":"data:image/png;base64,....."
            /**
             * js解析json
             */
            // [1] 将json字符转换为json对象
            var jsonres = JSON.parse(result);
            // [2] 读取
            console.log(result);
            if (jsonres.error_message == "NO_FACE_FOUND") {
                alert("NO FACE FOUND, 请检查周围光线！！！")
            }

            var makeup_img = jsonres.makeup_image;


            Base64toImage(makeup_img, imgNum);

            //创建img容器
            // var img = new Image(width = 320, height = 240);
            // img.src = 'data:image/png;base64,' + makeup_img;
            // //给img容器引入base64的图片
            // document.getElementById("makeupImage2").appendChild(img);

            // 返回base64格式，可以直接转换
            // document.getElementById("ai" + imgNum).addEventListener = function() {
            //         document.getElementById("img" + imgNum).style.src = "data:image/png;base64," + makeup_img;
            //     }
            // if (result == "SUCCESS") {
            //     window.location.href = "http://127.0.0.1:5503/AIsingFont/src/home.html"
            // }
        })
        .catch(error => {
            var e = JSON.parse(error);
            // [2] 读取
            if (e.error_message == "NO_FACE_FOUND") {
                alert("NO FACE FOUND, 请检查周围光线！！！")
            }
            console.log('error', error);
        });
}

document.getElementById("ai1").onclick = function() {
    var type = "#CF2CB5";
    var img = "1";
    postFecth(type, img);
}

document.getElementById("ai2").onclick = function() {
    var type = "#C93C66";
    var img = "2";
    postFecth(type, img);

}

document.getElementById("ai3").onclick = function() {
    var type = "#C10532";
    var img = "3";
    postFecth(type, img);

}

document.getElementById("ai4").onclick = function() {
    var type = "#72122F";
    var img = "4";
    postFecth(type, img);

}

document.getElementById("ai5").onclick = function() {
    var type = "#135F89";
    var img = "5";
    postFecth(type, img);

}

document.getElementById("ai6").onclick = function() {
    var type = "#E06959";
    var img = "6";
    postFecth(type, img);
}