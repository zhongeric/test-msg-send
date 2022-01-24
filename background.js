
function tellContentToGo(){
    console.log("context menu clicked")
    chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {id: "contextMenuClicked"}, function(response){
            console.log(response.copy)
        })
    })
}

//create context menu
chrome.contextMenus.create({
    title: "Simplify",
    id: "contextMenu",
    contexts: ["all"],
});

chrome.contextMenus.onClicked.addListener(tellContentToGo);


//receiving message from content
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.id === "textFromContent") {
        var textToForward = request.data
        console.log(textToForward)
        sendResponse({ answer: "background copy, forwarding to gpt3" })
        //forwarding message to GPT3
        chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {id:"forwardingToGPT3", data:textToForward}, function(response){
                console.log(response.final)
            })
        })
    }
})