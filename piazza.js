// add list item to the Piazza navbar
var addLi = function (liText) {
    var navBar = document.getElementsByClassName("navbar-nav")[0];
    var newLi = navBar.children[1].cloneNode(true);     // clone Q&A <li> as template for new <li>
    newLi.style = navBar.children[1].style;
    newLi.style.display = "list-item";
    $(newLi).removeClass(newLi.className.split(/\s+/)[1] + " active");  // removes Q&A's unique class, and active class
    newLi.children[0].textContent = liText;
    navBar.insertBefore(newLi, navBar.children[2]);     // insert between Q&A and Resources
    return newLi;
};

// insert chat div into DOM, as previous sibling of main div
var insertChat = function() {
    var chatDiv = document.createElement("div");
    chatDiv.innerHTML = CHAT_FRAME;
    chatDiv.setAttribute("id", CHAT_FRAME_ID + '-div');
    chatDiv.style.display = "none";   // hide it, initially
    var mainDiv = getMainDiv();
    mainDiv.parentNode.insertBefore(chatDiv, mainDiv);
    return chatDiv;
};

// show regular main div, hide chat div
// can't overwrite main because Piazza cries and breaks if you do that
var showMainDiv = function() {
    var mainDiv = getMainDiv();
    document.getElementById(CHAT_FRAME_ID + '-div').style.display = "none";
    mainDiv.style.display = "block";
};

// show chat div, hide main div
// can't overwrite main because Piazza cries and breaks if you do that
var showChatDiv = function() {
    var mainDiv = getMainDiv();
    mainDiv.style.display = "none";
    document.getElementById(CHAT_FRAME_ID + '-div').style.display = "block";
};

// add listeners to nav buttons that set the corresponding div for display
var addNavListeners = function() {
    var navButtons = document.getElementsByClassName("navbar-nav")[0].children;
    for (var i = 1; i < navButtons.length; i++) {
        navButtons[i].addEventListener("click", makeNavListener(navButtons[i]));
    }
};

// make an individual nav button's listener
var makeNavListener = function(el) {
    return function() {
        makeActive(el);
        if (el.textContent == CHAT_LIST_TEXT) {
            showChatDiv();
        }
        else {
            showMainDiv();
        }
        el.firstElementChild.blur();    // remove focus from anchor, else they stay highlighted
    };
};

var addCourseDropdownListeners = function() {
    $('#my_classes').on('click', 'li', function() {
        makeActive(document.querySelector('.top_bar_qa'));  // switch back to Q&A tab
        document.getElementById(CHAT_FRAME_ID).src += '';  // reload Kiwi for new class
        showMainDiv();
    });
};

// get reference to Piazza page's main div
var getMainDiv = function() {
    return document.getElementById("page_main") || document.getElementById("PageWrapper");
};

// change active navbar item to the <li> pointed to by el
var makeActive = function(el) {
    var prevActive = $(".top_bar_tab.active");
    $(prevActive).removeClass("active");
    el.className += " active";
};

// implement common.js's getCourseId()
var getCourseId = function(callback) {
    getCurrentUrl(function(url) {
        // get the alphanumeric string near the end of the URL
        callback(url.slice(url.lastIndexOf('/') + 1).split('#')[0].split('?')[0]);
    });
};

// resource page still doesn't load
window.onload = function() {
    insertChat();
    addLi(CHAT_LIST_TEXT);
    addNavListeners();
    addCourseDropdownListeners();
};
