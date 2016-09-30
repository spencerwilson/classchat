// background page has two options: sendToActiveTab and getCurrentUrl

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // forwards requests to and returns the resulting response from the active tab
        // listens for message of the form {message: "sendToActiveTab", arg: <message-to-send-active tab>}
        if (request.message == "sendToActiveTab") {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, request.arg, function(response) {
                    sendResponse({courseId: response.courseId});
                });
            });

            return true;   // keep message channel open to be able to call sendResponse asynchronously in a callback
        }

        // enables content scripts to know their own environment's URL
        else if (request == "getCurrentUrl") {
            sendResponse({url: sender.tab.url});
        }
    }
);

// message flow:
// kiwi needs id -> messages "getCourseId" to same page's content script, receiving courseId
// vendor pages listen for above messages