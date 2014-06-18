var a,b;

define();

function a () {
    define({
        object: 'ganz tolles Modul'
    });
};

define(function () {});

define([], function (argument) {
    // body...
});

function b () {
    var define;
    // Don'f find me
    define();
};