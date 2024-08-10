// config.js
//先尝试从本地获取配置
chrome.storage.sync.get(['apibaseurl', 'username', 'password'], function(items) {
   
    if(items.apibaseurl && items.username && items.password){
        document.getElementById('apibaseurl').value = items.apibaseurl;
        document.getElementById('username').value= items.username;
        document.getElementById('password').value = items.password;
    }
    
})

document.getElementById('configForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // <form id="configForm">
    //     <!-- apibaseurl -->
    //     <label for="apibaseurl">API base地址:</label>
    //     <input type="text" id="apiUrl" name="apibaseurl">
    //     <!-- login username -->
    //     <label for="username">用户名:</label>
    //     <input type="text" id="username" name="username">
    //     </input>
    //     <!-- login password -->
    //     <label for="password">密码:</label>
    //     <input type="password" id="password" name="password">
    //     </input>
    //     <!-- flashcardcreateAPI -->
    //      <label for="flashcardcreateAPI">闪卡创建API:</label>
    //      <input type="text" id="flashcardcreateAPI" name="flashcardcreateAPI">
    //      </input>
    //     <!-- 闪卡集获取api -->
    //      <label for="flashcardsetAPI">闪卡集获取API:</label>
    //      <input type="text" id="flashcardsetAPI" name="flashcardsetAPI">
    //      </input>


    //     <button type="submit">保存配置</button>
    // </form>
    //表单内容提取
    var apibaseurl = document.getElementById('apibaseurl').value;
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    chrome.storage.sync.set({ apibaseurl: apibaseurl, username: username, password: password }, function() {
        alert('配置已保存');     
        //关闭页面
        window.close();
    });
});