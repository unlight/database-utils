var wru = require("wru");

// https://github.com/WebReflection/wru

wru.test([{
    name: "test #1",
    setup: function () {
        // setup before the test
    },
    test: function () {
        // async test example
        setTimeout(wru.async(function () {
            wru.assert("executed", true);
        }), 1000);
    },
    teardown: function () {
        // clean up after the test
    }
}, {
    name: "test #2",
    test: function () {
        // do other stuf here
    }
}]);