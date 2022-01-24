//request data from gpt3.js
chrome.runtime.sendMessage({id: "requesting simplified text"}, function(){
    //gpt3 responds w/ simplified text
    console.log(response.id)
    var textSimplified = response.id
})
//replace paragraph w/ id "test" with textSimplified
if (textSimplified){
    document.getElementById("test").innerHTML = textSimplified
}


