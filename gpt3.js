
//listen for forwarded message from content (arriving thru background)
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.id === "forwardingToGPT3") {
    console.log(request.data)
    sendResponse({final:"gpt3 received message from content"})
    // You should call getCompletion here if you want to get the completion based on the request.data
    // like this:
    getCompletion(request.data).then((resolve, reject) => {
        // resolve is an array with the first element being a boolean indicating success or failure
        // and the second element being the completion returned by OpenAI api
        if (resolve[0]) {
            sendResponse({ final: resolve[1] });
        } else {
            sendResponse({ final: "Error" });
        }
    })
    // I'm not sure if you want to get the completion value here, or how you are sending the final
    // back to background.js, but this should correctly call the api and handle the response.
    // I can't test bc I don't have an api key.
  }
})

// EDIT: request from 'express' is different than the request object in 
// the chrome.runtime.onMessage listener(function(request, ...)) function.
// const prompt = request.data; // REMOVE THIS

// EDIT: before, you had an anonymous async function that executed automatically 
// when the file was loaded. I created getCompletion, an async function that
// you can call when yoou need to get a completion for the prompt.
async function getCompletion(prompt) {
    console.log(prompt);
    const url = 'https://api.openai.com/v1/engines/davinci/completions';
    const params = {
      "prompt": prompt,
      "max_tokens": 30,
      "temperature": 0.7,
      "frequency_penalty": 0.5
    };
    const headers = {
        'Content-Type': 'application/json', // added this to support fetch
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    };
  
    try {
        // I would recommend using fetch here instead of 3rd party libraries just for simplicity.
        // OLD: const response = await got.post(url, { json: params, headers: headers }).json();
        // read more here: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        const res = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(params)
        });
        const response = await res.json();
        console.log(response);
        // TODO: you should check to make sure 'choices' exists in the response, error responses have the 'error' key
        output = `${prompt}${response.choices[0].text}`;
        console.log(output);
        return [true, output];
    } catch (err) {
        console.log(err);
        return [false, null];
    }
}

//test sending dynamic text to popup.html
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.id === "requesting simplified text") {
    sendResponse({data:"this is a test" })
    console.log("forwarded text to popup.js")
  }
})

//try saving output to local storage then accessing thru popup.html