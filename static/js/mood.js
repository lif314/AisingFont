/**
 * 情绪识别服务
 */

// 基于准备好的dom，初始化echarts实例
// var myChart = echarts.init(document.getElementById('main'));
/**
 * 情绪识别
 * 当点击[analysis]按钮时，读取当前图像，并传给EmorionController
 * 进行情绪分析后返回数据
 */
// 打开摄像头，读取人脸图像
document.getElementById("camera").onclick = function() {
    // alert("open camera");

    var video = document.getElementById("video");
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');

    var tracker = new tracking.ObjectTracker('face');
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);

    tracking.track('#video', tracker, {
        camera: true
    });

    tracker.on('track', function(event) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        event.data.forEach(function(rect) {
            context.strokeStyle = '#a64ceb';
            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            context.font = '11px Helvetica';
            context.fillStyle = "#fff";
            context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
            context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
        });
    });

    // var gui = new dat.GUI();
    // gui.add(tracker, 'edgesDensity', 0.1, 0.5).step(0.01);
    // gui.add(tracker, 'initialScale', 1.0, 10.0).step(0.1);
    // gui.add(tracker, 'stepSize', 1, 5).step(0.1);
}



var myChart; //定义一个全局的图表变量，供后面动态加载时使用
// require.config({
//     paths: {
//         echarts: '../static/js/echart5.2.1' // //将dist文件夹和echarts.js放在同一目录下
//     }
// });
// require([
//         'echarts'
//     ],
// function(ec) {
myChart = echarts.init(document.getElementById('main'));
//下面的option可以为空{}，ajax动态添加数据时会加上相应的属性
//var option = {};
// 指定图表的配置项和数据
var option = {
    title: {
        text: '情绪分析'
    },
    tooltip: {},
    legend: {
        data: 'score(%)'
    },
    xAxis: {
        data: ['surprise', 'happiness', 'neutral', 'sadness', 'disgust', 'anger', 'fear']
    },
    yAxis: {
        max: '100',
    },
    series: [{
        name: 'score(%)',
        type: 'bar',
        data: [12, 34, 45, 56, 95, 7, 52]
    }]
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);
// }
// );

document.getElementById("analysis").onclick = function() {

    // 获取数据时显示加载状态图
    myChart.showLoading();
    var EmotionList = []; // X坐标值
    var EmotionValue = []; // Y坐标值

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

    fetch("http://127.0.0.1:8080/emotion", requestOptions)
        .then(response => response.text())
        .then(result => {
            // alert(result);
            // {"emotion":{"surprise":1.873,"happiness":0.053,"neutral":97.987,"sadness":0.004,"disgust":0.004,"anger":0.074,"fear":0.004}}
            emotion = JSON.parse(result.split(','));
            // surprise = emotion.surprise;
            // happiness = emotion.happiness;
            // neutral = emotion.neutral;
            // sadness = emotion.sadness;
            // disgust = emotion.disgust;
            // anger = emotion.anger;
            // fear = emotion.fear;
            EmotionList = ['surprise', 'happiness', 'neutral', 'sadness', 'disgust', 'anger', 'fear'];
            EmotionValue = [emotion.surprise, emotion.happiness, emotion.neutral, emotion.sadness, emotion.disgust, emotion.anger, emotion.fear];

            myChart.hideLoading(); //隐藏加载动画
            myChart.setOption({ //加载数据图表
                // legend: {
                //     // data: ['emotion', 'score']
                // },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: 'score(%)'
                },
                // toolbox: {
                //     show: true,
                //     feature: {
                //         mark: {
                //             show: true
                //         },
                //         dataView: {
                //             show: true,
                //             readOnly: false
                //         },
                //         magicType: {
                //             show: true,
                //             type: ['line', 'bar']
                //         },
                //         restore: {
                //             show: true
                //         },
                //         saveAsImage: {
                //             show: true
                //         }
                //     }
                // },
                // calculable: true,
                xAxis: {
                    data: EmotionList
                },
                yAxis: {}, //注意一定不能丢了这个，不然图表Y轴不显示
                series: [{
                    // 根据名字对应到相应的系列，并且要注明type
                    name: 'score',
                    type: 'bar',
                    data: EmotionValue
                }]
            });
        })
        .catch(error => {
            console.log('error', error);
            //请求失败时执行该函数
            alert("图表请求数据失败!");
            myChart.hideLoading();
        });
}



// 打开摄像头，读取人脸图像
// document.getElementById("camera").onclick = function() {
//     // alert("open camera");

//     var video = document.getElementById("video");
//     var canvas = document.getElementById("canvas");
//     var context = canvas.getContext('2d');

//     var tracker = new tracking.ObjectTracker('face');
//     tracker.setInitialScale(4);
//     tracker.setStepSize(2);
//     tracker.setEdgesDensity(0.1);

//     tracking.track('#video', tracker, { camera: true });

//     tracker.on('track', function(event) {
//         context.clearRect(0, 0, canvas.width, canvas.height);

//         event.data.forEach(function(rect) {
//             context.strokeStyle = '#a64ceb';
//             context.strokeRect(rect.x, rect.y, rect.width, rect.height);
//             context.font = '11px Helvetica';
//             context.fillStyle = "#fff";
//             context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
//             context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
//         });
//     });

//     var gui = new dat.GUI();
//     gui.add(tracker, 'edgesDensity', 0.1, 0.5).step(0.01);
//     gui.add(tracker, 'initialScale', 1.0, 10.0).step(0.1);
//     gui.add(tracker, 'stepSize', 1, 5).step(0.1);
// }


/**
 * 情绪识别
 * 当点击[analysis]按钮时，读取当前图像，并传给EmorionController
 * 进行情绪分析后返回数据
 */
// document.getElementById("analysis").onclick = function() {
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
//     var video = document.getElementById("video");
//     var canvas = document.getElementById("canvas");
//     var userContext = canvas.getContext("2d");
//     userContext.drawImage(video, 0, 0, canvas.width, canvas.height);
//     // var userImgSrc = canvas.toDataURL("image/png"); // 截取第一帧
//     var userImgSrc = canvas.toDataURL("image/png"); // 截取第一帧
//     //拿到bash64格式的照片信息: 去除标签 --- data:image/png;base64,
//     var faceBase = userImgSrc.split(",")[1];
//     // alert(faceBase);

//     var formdata = new FormData();
//     formdata.append("faceBase64", "" + faceBase);

//     var requestOptions = {
//         method: 'POST',
//         body: formdata,
//         redirect: 'follow'
//     };

//     var happy = document.getElementById("happy");
//     var calm = document.getElementById("calm");
//     var surpr = document.getElementById("surprise");
//     var sad = document.getElementById("sad");
//     var disgu = document.getElementById("disgust");
//     var ange = document.getElementById("anger")
//     var fea = document.getElementById("fear");


//     fetch("http://localhost:8080/emotion", requestOptions)
//         .then(response => response.text())
//         .then(result => {
//             // alert(result);
//             // {"emotion":{"surprise":1.873,"happiness":0.053,"neutral":97.987,"sadness":0.004,"disgust":0.004,"anger":0.074,"fear":0.004}}
//             emotion = JSON.parse(result.split(','));
//             surprise = emotion.surprise;
//             happiness = emotion.happiness;
//             neutral = emotion.neutral;
//             sadness = emotion.sadness;
//             disgust = emotion.disgust;
//             anger = emotion.anger;
//             fear = emotion.fear;
//             /*Number()数据类型转换，指定截取转换后的小数点后几位(四舍五入)*/
//             // happy.setAttribute("height", Number(happiness * 10).toFixed(0) + "%");
//             happy.style.height = `${(happiness * 1.6).toFixed(0)}px`; // Number(point*100).toFixed(1)
//             calm.style.height = `${Number(neutral * 1.6).toFixed(0)}px`;
//             // surpr.style.height = Number(surprise * 10).toFixed(1) + "%";
//             // sad.style.height = Number(sadness * 10).toFixed(0) + "%";
//             // disgu.style.height = Number(disgust * 10).toFixed(0) + "%";
//             // ange.style.height = Number(anger * 10).toFixed(0) + "%";
//             // fea.style.height = Number(fear * 10).toFixed(0) + "%";
//             console.log((Number(neutral) * 1.6).toFixed(1) + "px");
//             console.log(result);
//             // window.location.reload();

//         })
//         .catch(error => console.log('error', error));
// }