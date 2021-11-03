// 打开摄像头读取人脸头像
document.getElementById("camera").onclick = function() {
    // alert("open camera!");
    var video = document.getElementById("video");
    var canvas = document.getElementById("canvas");
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
            context.strokeRect(rect.x - 7, rect.y - 20, rect.width + 10, rect.height + 25);
            context.font = '11px Helvetica';
            context.fillStyle = "#fff";
            context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y - 10);
            context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y);
        });
    });

    var gui = new dat.GUI();
    gui.add(tracker, 'edgesDensity', 0.1, 0.5).step(0.01);
    gui.add(tracker, 'initialScale', 1.0, 10.0).step(0.1);
    gui.add(tracker, 'stepSize', 1, 5).step(0.1);

}

/*
 * 人脸登录
 *       [1] 读取人脸图像
 *       [2] 图像编码
 *       [3] 向后端发送人脸图像数据
 *       [4] 返回结果，登录
 */
document.getElementById("faceLogin").onclick = function() {
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

    var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    fetch("http://localhost:8080/faceLogin", requestOptions)
        .then(response => response.text())
        .then(result => {
            // alert(result);
            console.log(result);
            if (result == "SUCCESS") {
                window.location.href = "http://127.0.0.1:5503/AIsingFont/src/home.html"
            }
        })
        .catch(error => console.log('error', error));


}