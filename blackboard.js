var CHATBOX_TEMPLATE = '<div class="pageTitle clearfix"' +
    'id="pageTitleDiv"> <div class="pageTitleIcon" id="pageTitleBar" tabindex="0"> <img alt="" id="titleicon"' +
    'src= "/images/ci/sets/set01/editpage_on.gif"> <h1 id="pageTitleHeader" tabindex="-1">' +
    '<span id= "pageTitleText">Home Page</span></h1><span class="titleButtons" id="_titlebarExtraContent">' +
    '</span> </div> </div> <div class="container clearfix" id="containerdiv"></div>';

// get references to DOM of course page, and title/body of main div
var parsePage = function() {
    var DOM = window.frames.content.document;         // DOM of main iframe
    var list = DOM.getElementById("courseMenuPalette_contents");
    var container = DOM.getElementById("content");    // main viewing area

    return {
        "DOM": DOM,
        "list": list,
        "container": container
    };
};

var getClassTitle = function() {
    return parsePage().DOM.querySelector('.comboLink').textContent;
};

// implement common.js's getCourseId()
var getCourseId = function(callback) {
    var classTitle = getClassTitle().split(' ');
    var courseNum = (classTitle[0] + classTitle[1]).toLowerCase();
    getCurrentUrl(function(url) {
        // get second-level domain name (e.g., 'school' in 'http://bb.school.edu')
        // assumes the Blackboard deployment is hosted at on some .edu domain
        var schoolName = url.split('.edu')[0].substring(url.split('.edu')[0].lastIndexOf('.') + 1);
        callback(schoolName + '-' + courseNum);
    });
};

// inserts invisible div that is a title+chat div
var insertChat = function() {
    // use course Home Page as template (every course has one, I think)
    var chatBox = page.container.cloneNode(true);
    chatBox.innerHTML = CHATBOX_TEMPLATE;       // hardcoded template div, obtained from an empty main div
    $(chatBox).find("#pageTitleText")[0].innerText = CHAT_LIST_TEXT;  // set title of Chat box
    chatBox.style.display = "none";                                   // hide it, initially
    chatBox.lastElementChild.remove();                                // remove old contents of box

    var chatDiv = page.DOM.createElement("div");
    chatBox.appendChild(chatDiv);                                     // replace with div for iframe
    chatDiv.setAttribute("id", CHAT_FRAME_ID + "-div");
    chatDiv.innerHTML = CHAT_FRAME;
    chatDiv.style.height = "600px";

    page.container.parentNode.insertBefore(chatBox, page.container);
    return chatBox;
};

// add item to Course page list
var addLi = function(liText) {
    var newLi = page.list.firstElementChild.cloneNode(true);
    newLi.removeAttribute("id");    // don't want to keep the template li's id
    newLi.children[0].setAttribute("href", "#");
    newLi.children[0].children[0].setAttribute("title", liText);
    newLi.children[0].children[0].textContent = liText;
    page.list.appendChild(newLi);
    return newLi;
};


// BlackBoard course pages are mostly an iframe, so wait until
// everything's all loaded to run the JavaScript
document.getElementById("contentFrame").onload = function() {
  //if (document.readyState == "complete") {
    page = parsePage();
    var chatBox = insertChat();
    addLi(CHAT_LIST_TEXT).onclick = function() {
        page.container.style.display = "none";
        chatBox.style.display = "block";
        this.firstElementChild.blur();   // blur the <a>, otherwise it stays highlighted
    };
};
