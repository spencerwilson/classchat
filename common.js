// data common to all content scripts

var CHAT_FRAME_ID = "irc-iframe";
var CHAT_LIST_TEXT = "Chat";
var CHAT_FRAME = "<iframe src=\"https://kiwiirc.com/client/irc.freenode.net/\" id=\"" + CHAT_FRAME_ID + "\" style=\"border:0; width:100%; height:100%;\"></iframe>";
var courseId;   // gets set by below event handler

// let content scripts fetch their current URL via messaging background.js
var getCurrentUrl = function(callback) {
    chrome.runtime.sendMessage("getCurrentUrl", function(response) {
        callback(response.url);
    });
};

// Every vendor (Piazza, BB, etc.) content script needs to listen for
// requests from the background page (content scripts can't message each other, so the
// background page is an intermediary) to get their courseId.
// Listen for a courseId request and fulfill it with getCourseId(), whose implementation
// varies from vendor to vendor
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        if (message == "getCourseId") {
            getCourseId(function(courseId) {
                sendResponse({courseId: courseId});
            });

            return true;  // keep message channel open to be able to call sendResponse asynchronously in a callback
        }
});
