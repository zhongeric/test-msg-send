//listen for forwarded message from content (arriving thru background)
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.id === "forwardingToGPT3") {
    console.log(request.data)
    sendResponse({final:"gpt3 received message from content"})
  }
})

const { request, response } = require('express');
const got = require('got');
//prompt = selectedText
const prompt = request.data;

(async () => {
  const url = 'https://api.openai.com/v1/engines/davinci/completions';
  const params = {
    "prompt": prompt,
    "max_tokens": 30,
    "temperature": 0.7,
    "frequency_penalty": 0.5
  };
  const headers = {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
  };

  try {
    const response = await got.post(url, { json: params, headers: headers }).json();
    output = `${prompt}${response.choices[0].text}`;
    console.log(output);
  } catch (err) {
    console.log(err);
  }
})();

console.log(output)
//test sending dynamic text to popup.html
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.id === "requesting simplified text") {
    sendResponse({data:"this is a test" })
    console.log("forwarded text to popup.js")
  }
})

//try saving output to local storage then accessing thru popup.html