const data = chrome.storage.sync.get(['apibaseurl', 'username', 'password']);
data.then((data) => {
  //####################################################### 常量定义 ######################################################
  const baseurl = data.apibaseurl;
  const username = data.username;
  const password = data.password;
  const requestheaders = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-CN,zh;q=0.9",
  }




  var token = "";
  var refreshtoken = "";

  const gettokenurl = baseurl + "/api/v1/token/pair";
  const gettokenparam = {
    "username": username,
    "password": password,
  }

  const vaildtokenurl = baseurl + "/api/v1/token/verify"
  const vaildtokenparam = {
    "token": token,
  }


  const refreshurl = baseurl + "/api/v1/token/refresh"
  const refreshparam = {
    "refresh": refreshtoken,
  }

  const flashcardcreateAPI = "/api/v1/flashcard/Flashcard/"
  const flashcardsetAPI = "/api/v1/flashcard/FlashcardSet/list"



  // ###################################################### 身份认证 ######################################################
  async function gettoken(username, password) {
    console.log("gettoken");
    const res = await fetch(gettokenurl, {
      headers: requestheaders,
      method: "POST",
      body: JSON.stringify({ ...gettokenparam, username: username, password: password }),
    }).then((res) => res.json());
    console.log(res);
    token = res.access;
    refreshtoken = res.refresh;
    console.log(token);

    return res;
  }

  async function vaildtoken(token) {
    console.log("vaildtoken");
    const res = await fetch(vaildtokenurl, {
      headers: requestheaders,
      method: "POST",
      body: JSON.stringify({ ...vaildtokenparam, token: token }),
    }).then((res) => {
      if (res.ok) {
        return true;
      } else {
        return false;
      }
    });
    console.log(res);

    return res;
  }

  async function refreshauthtoken(refresh_token) {
    console.log("refresh");
    const res = await fetch(refreshurl, {
      headers: requestheaders,
      method: "POST",
      body: JSON.stringify({ ...refreshparam, refresh: refresh_token }),
    }).then((res) => res.json());
    console.log(res);
    token = res.access;
    refreshtoken = res.refresh;
    console.log(token);

    return { token: token, refresh_token: refreshtoken };
  }



  //######################################################## chaofanflashcard app api ######################################################
  //获取用户闪卡集数据api，返回值应是列表
  async function getFlashCardSetList(params = null) {
    let url = baseurl + flashcardsetAPI;
    let method = "GET";
    if (params != null) {
      url = url + "?" + new URLSearchParams(params).toString();
    }
    try {
      if (token != "" && refreshtoken != "") {
        //验证token
        if (await vaildtoken(token)) {
          //验证通过
          console.log("token验证通过");
          const res = await fetch(url, {
            headers: { ...requestheaders, 'Authorization': 'Bearer ' + token },
            method: method,
          }).then((res) => res.json());
          console.log(res);
          return res;
        } else {
          //重新获取token
          console.log("token验证失败,重新获取token");
          const res = await refreshauthtoken(refreshtoken);
          if (res.token != "") {
            //获取token成功
            console.log("获取token成功");
            const res = await fetch(url, {
              headers: { ...requestheaders, 'Authorization': 'Bearer ' + res.token },
              method: method,

            }).then((res) => res.json());
            console.log(res);
            return res;
          } else {
            console.log("二次获取token失败");
            //抛出异常
            throw new Error("获取token失败");
          }

        }
      } else {
        console.log("token为空,获取token");
        const newtoken = await gettoken(username, password)

        if (newtoken.access) {
          //获取token成功
          console.log("获取token成功");
          const res = await fetch(url, {
            headers: { ...requestheaders, 'Authorization': 'Bearer ' + newtoken.access },
            method: method,

          }).then((res) => res.json());
          console.log(res);
          return res;
        } else {
          console.log("获取token失败");
          throw new Error("获取token失败");
        }
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  //创建闪卡api
  async function createFlashCard(front_content, back_content, cardset_id) {
    let url = baseurl + flashcardcreateAPI;
    let method = "POST";
    try {
      if (token != "" && refreshtoken != "") {
        if (await vaildtoken(token)) {
          //验证通过
          console.log("token验证通过");
          const res = await fetch(url, {
            headers: { ...requestheaders, 'Authorization': 'Bearer ' + token, },
            method: method,
            body: JSON.stringify({
              "front_content": front_content,
              "back_content": back_content,
              "cardset_id": cardset_id
            })
          })
          if (res.ok) {
            alert("创建成功");
          }
        } else {
          console.log("token验证失败,重新获取token");
          const res = await refreshauthtoken(refreshtoken);
          if (res.token != "") {
            //获取token成功
            console.log("获取token成功");
            const res = await fetch(url, {
              headers: { ...requestheaders, 'Authorization': 'Bearer ' + res.token, },
              method: method,

              body: JSON.stringify({
                "front_content": front_content,
                "back_content": back_content,
                "cardset_id": cardset_id
              })
            })
            if (res.ok) {
              alert("创建成功");
            }
          } else {
            console.log("二次获取token失败");
            throw new Error("获取token失败");
          }
        }
      } else {
        console.log("token为空,获取token");
        const newtoken = await gettoken(username, password);
        if (newtoken.access) {
          //获取token成功
          console.log("获取token成功");
          const res = await fetch(url, {
            headers: { ...requestheaders, 'Authorization': 'Bearer ' + newtoken.access, },
            method: method,
            body: JSON.stringify({
              "front_content": front_content,
              "back_content": back_content,
              "cardset_id": cardset_id
            })
          })
          if (res.ok) {
            alert("创建成功");
          }
        } else {
          console.log("获取token失败");
          throw new Error("获取token失败");
        }
      }
    } catch (error) {
      console.log(error);
    }

  }


  //######################################################## 页面显示逻辑 ######################################################
  // 接收来自背景脚本的数据
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'setSelectionText') {
      document.getElementById('back_content').value = `${request.text}`;
    }
    sendResponse({ received: true });
    return true;
  });



  //获取闪卡集列表用于表单cardset_id选项提供
  setarrray = getFlashCardSetList().then(
    res => {
      document.getElementById("cardset_id").innerHTML = res.map(item => `<option value="${item.id}">${item.title}</option>`)
      return res;
    }
  );

  //创建闪卡并关闭窗口
  async function createAndClose(front_content, back_content, cardset_id) {
    await createFlashCard(front_content, back_content, cardset_id);
    window.close();

  }

  //监听表单提交按钮
  document.getElementById("createFlashCard").addEventListener("click", function () {
    //阻止表单提交
    event.preventDefault();
    //获取表单数据
    let front_content = document.getElementById("front_content").value;
    let back_content = document.getElementById("back_content").value;
    let cardset_id = document.getElementById("cardset_id").value;
    //创建闪卡
    createAndClose(front_content, back_content, cardset_id);


  })







});








