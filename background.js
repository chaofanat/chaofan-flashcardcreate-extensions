


// 监听插件安装
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "createFlashcard",
        title: "Create Flashcard|创建闪卡",
        contexts: ["selection"]
    });

    //从loclalStorage中获取apiurl
    chrome.storage.local.get(['apibaseurl'], function(result) {
        if (result.apibaseurl) {
            return;
        } else {
            chrome.tabs.create({ url: 'config.html' });
        }
    });
    

});






chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "createFlashcard") {
        console.log("Selected text:", info.selectionText);

        // 获取当前窗口的位置和尺寸
        chrome.windows.getCurrent({ populate: true }, function(currentWindow) {
            const currentScreenWidth = currentWindow.width;
            const currentScreenHeight = currentWindow.height;

            // 计算新窗口的位置
            const leftPosition = (currentScreenWidth - 600) / 2; // 居中对齐
            const topPosition = (currentScreenHeight - 400) / 2; // 居中对齐

            // 创建弹窗
            chrome.windows.create({
                url: 'flashcardcreate.html',
                type: 'popup',
                width: 600,
                height: 500,
                left: leftPosition,
                top: topPosition
            }, function(window) {
                // 监听弹窗页面的加载状态
                chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
                    if (tabId === window.tabs[0].id && changeInfo.status === 'complete') {
                        // 页面加载完成后发送消息
                        chrome.tabs.sendMessage(tabId, { action: 'setSelectionText', text: info.selectionText }, function(response) {
                            if (chrome.runtime.lastError) {
                                console.error(chrome.runtime.lastError.message);
                            } else {
                                console.log('Message sent:', response);
                            }
                        });

                        // 移除监听器，避免多次发送消息
                        chrome.tabs.onUpdated.removeListener(arguments.callee);
                    }
                });
            });
        });
    }
});


