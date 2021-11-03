/**
 * 登录处理
 */

/**
 * 打开摄像头：初步检测人脸
 */
document.getElementById("camera").onclick = function() {
    var video = document.getElementById("video");
    var canvas = document.getElementById("canvas");
    // alert("open camera!");
    var context = canvas.getContext('2d'); // 打开摄像头读取人脸头像
    var tracker = new tracking.ObjectTracker('face');
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);

    tracking.track('#video', tracker, { camera: true });

    tracker.on('track', function(event) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        event.data.forEach(function(rect) {
            context.strokeStyle = '#a64ceb';
            context.strokeRect(rect.x - 12, rect.y - 60, rect.width, rect.height);
            context.font = '11px Helvetica';
            context.fillStyle = "#fff";
            context.fillText('x: ' + rect.x + 'px', rect.x + rect.width - 16, rect.y - 70);
            context.fillText('y: ' + rect.y + 'px', rect.x + rect.width - 16, rect.y - 60);
        });
    });

    var gui = new dat.GUI();
    gui.add(tracker, 'edgesDensity', 0.1, 0.5).step(0.01);
    gui.add(tracker, 'initialScale', 1.0, 10.0).step(0.1);
    gui.add(tracker, 'stepSize', 1, 5).step(0.1);
}


/**
 * [1] 点击按钮时拿到登陆者面部信息
 * [2] 关闭摄像头
 * [3] 数据编码
 * [4] 发送后端
 */
document.getElementById("register").onclick = function() {

    // var getUserMedia =
    //     //浏览器兼容,表示在火狐、Google、IE等浏览器都可正常支持
    //     (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)
    //     //getUserMedia.call(要调用的对象，约束条件，调用成功的函数，调用失败的函数)
    // getUserMedia.call(navigator, { video: true, audio: false }, function(localMediaStream) {
    //     //获取摄像头捕捉的视频流
    //     video.srcObject = localMediaStream;
    // }, function(e) {
    //     console.log("获取摄像头失败！！")
    // });
    var video = document.getElementById("video");
    var canvas = document.getElementById("canvas");
    var userContext = canvas.getContext("2d");
    userContext.drawImage(video, 0, 0, canvas.width, canvas.height);
    // var userImgSrc = canvas.toDataURL("image/png"); // 截取第一帧
    var userImgSrc = canvas.toDataURL("image/png"); // 截取第一帧
    //拿到bash64格式的照片信息: 去除标签 --- data:image/png;base64,
    var faceBase = userImgSrc.split(",")[1];
    // alert(faceBase);

    const name = document.getElementById("username").value;
    const password = document.getElementById("password").value;


    var formdata = new FormData();
    formdata.append("name", "" + name);
    formdata.append("password", "" + password);
    formdata.append("faceBase64", "" + faceBase);

    var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    fetch("http://localhost:8080/register", requestOptions)
        .then(response => response.text())
        .then(result => {
            // alert(result);
            console.log(result);
            window.location.href = "http://127.0.0.1:5503/AIsingFont/src/login.html";
        })
        .catch(error => console.log('error', error));
}