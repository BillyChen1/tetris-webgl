document.onkeypress = function(e) {
    var keyCode = e.key;
    var keys = {
        "w": "rotate",
        "a": "left",
        "s": "down",
        "d": "right"
    };
    if ( typeof keys[keyCode] != 'undefined') {
        keyPress(keys[keyCode]);
        render();
    }
}
