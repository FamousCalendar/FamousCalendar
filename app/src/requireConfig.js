/*globals require*/
require.config({
    shim: {

    },
    paths: {
        famous: '../lib/famous',
        requirejs: '../lib/requirejs/require',
        almond: '../lib/almond/almond',
        fastclick: '../lib/fastclick/lib/fastclick'
    },
    packages: [

    ]
});
require(['main']);
