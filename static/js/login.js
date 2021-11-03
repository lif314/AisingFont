  // 登录
  document.getElementById("login").onclick = function() {

      // window.location.href = "http://127.0.0.1:5503/AIsingFont/src/home.html";

      const name = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      // var data = new FormData();
      // data.append("name", name + "");
      // data.append("password", password + "");
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "http://127.0.0.1:8080/login?name=" + name + "&password=" + password);
      xhr.send();

      xhr.addEventListener("readystatechange", function() {
          if (this.status >= 200 && this.status < 300) {
              if (this.readyState === 4) {
                  console.log(this.responseText);
                  if (this.responseText != "FAILED") {
                      // alert("register success!");
                      window.location.href = "http://127.0.0.1:5503/AIsingFont/src/home.html";
                  } else {
                      alert("账号信息错误，请重新登录！！");
                  }
              }
          } else {
              alert("网络连接错误！！")
          }
      });

  }

  // 跳转到注册页面
  document.getElementById("toregister").onclick = function() {
      window.location.href = "http://127.0.0.1:5503/AIsingFont/src/register.html";
  }

  // 跳转到人脸登录界面
  document.getElementById("tofaceLogin").onclick = function() {
      window.location.href = "http://127.0.0.1:5503/AIsingFont/src/faceLogin.html";
  }