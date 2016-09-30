var CHANNEL_PREFIX = "classchat-";

// redact UI elements from login screen
var stripLogin = function() {
    $('.show_more, .have_pass, .fa-key').remove();
    $('tr.channel').css('display', 'none');
    $('#server_select_nick').focus(); // start cursor in nick input box
};

// ask background page to ask the active tab for the courseId, and return it to Kiwi
var getCourseId = function(callback) {
    chrome.runtime.sendMessage({message: "sendToActiveTab", arg: "getCourseId"}, function(response) {
        callback(response.courseId);
    });
};

// clean up login page, TODO auto populating nick with the one saved in storage
// and channel with #<prefix><courseId>
var loginTarget = document.querySelector('body');
var loginObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        // lazy check that catches page loading at a good time
        if (mutation.addedNodes.length > 2) {
            loginObserver.disconnect();  // we've detected the appearance of the login div, so retire this observer
            stripLogin();
            getCourseId(function(courseId) {
                document.getElementById('server_select_channel').value = '#' + CHANNEL_PREFIX + courseId;
            });

            // watch for the connecting status becoming 'ok'
            // tweak the 'Connecting..' message and get rid of 'i'
            var connectTarget = document.querySelector('.server_details > .status');
            var connectObserver = new MutationObserver(function(mutations) {
                mutations.forEach(function(mut) {
                    if (mut.type == 'attributes' &&
                        mut.attributeName == 'class' &&
                        mut.target.className.indexOf('ok') > -1) {

                        mut.target.innerText = 'Connecting...';  // add '.' and remove 'i' img
                    }
                });
            });
            var config = {attributes: true};
            connectObserver.observe(connectTarget, config);

            // listen for the hiding of the login status, signifying that the user has signed in
            // hand off to regular chat's MutationObserver
            $('.panel.applet').styleListener({
                styles: ['display'],
                changed: function(style, newValue, oldValue, element) {
                    if (style == 'display' && newValue == 'none') {
                        connectObserver.disconnect();
                        $('element-selector').styleListener('destroy');
                        startChatCleanup();
                    }
                }
            });
        }
    });
});
var config = {attributes: true, childList: true, characterData: true, subtree: true};
loginObserver.observe(loginTarget, config);


// clean up main chat window
var startChatCleanup = function() {
    var targetChat = document.getElementById('kiwi');
    var observerChat = new MutationObserver(function(mutations) {
        // UI widgets
        $('.panellist > .server, .toolbar > .app_tools, .toolbar > .topic, .channel_tools').remove();
        document.querySelector('.panellist span').innerText = 'General Chat';

        // redact server messages
        $('.msg.mode').remove();

        // you have no power here
        $('.if_op, .userbox > .info').remove();   // hide op options and 'info' option when clicking user
        $('li.o').removeClass('o'); // nick list: hide '@' in front of a user with op privileges
        $('.msg > .nick').each(function() {
            this.innerText = this.innerText.replace('@','');
        });

         // fix grammar (will throw an exception if chat page hasn't loaded yet)
        try {
            var userCount = document.querySelector('.memberlists .meta');
            if (userCount.innerText == '1 Users') {
                userCount.innerText = '1 User';
            }
        }
        catch (err) {
            // do nothing
        }
    });
    var config = { attributes: true, childList: true, characterData: true, subtree: true};
    observerChat.observe(targetChat, config);
};
