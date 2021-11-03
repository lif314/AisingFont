// 基于准备好的dom，初始化echarts实例
// var myChart = echarts.init(document.getElementById('main'));
/**
 * 情绪识别
 * 当点击[analysis]按钮时，读取当前图像，并传给EmorionController
 * 进行情绪分析后返回数据
 */

// 打开摄像头，读取人脸图像
document.getElementById("camera").onclick =

    function() {
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
    grid: {
        containLabel: true
    },
    visualMap: {
        orient: 'horizontal',
        left: 'center',
        min: 0,
        max: 100,
        text: ['High Score', 'Low Score'],
        // Map the score column to color
        dimension: 1,
        inRange: {
            color: ['#65B581', '#FFCE34', '#FD665F']
        }
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
        // itemStyle: {
        //     color: function(param) {
        //         return emotionColors[param.value[3]];
        //     }
        // },
        data: [12, 34, 45, 56, 95, 7, 52]
    }]
}

;
// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);
// }
// );
document.getElementById("analysis").onclick =

    function() {
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
        formdata.append("faceBase64",
            "" + faceBase);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
        fetch("http://127.0.0.1:8080/emotion",
            requestOptions).then(response => response.text()).then(result => {
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
            EmotionList = ['surprise',
                'happiness',
                'neutral',
                'sadness',
                'disgust',
                'anger',
                'fear'
            ];
            EmotionValue = [emotion.surprise,
                emotion.happiness,
                emotion.neutral,
                emotion.sadness,
                emotion.disgust,
                emotion.anger,
                emotion.fear
            ];
            myChart.hideLoading(); //隐藏加载动画
            myChart.setOption({
                title: {
                    text: '情绪分析'
                },
                tooltip: {},
                legend: {
                    data: 'score(%)'
                },
                grid: {
                    containLabel: true
                },
                visualMap: {
                    orient: 'horizontal',
                    left: 'center',
                    min: 0,
                    max: 100,
                    text: ['High Score', 'Low Score'],
                    // Map the score column to color
                    dimension: 1,
                    inRange: {
                        color: ['#65B581', '#FFCE34', '#FD665F']
                    }
                },
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
        }).catch(error => {
            console.log('error', error);
            //请求失败时执行该函数
            alert("图表请求数据失败!");
            myChart.hideLoading();
        });
    }