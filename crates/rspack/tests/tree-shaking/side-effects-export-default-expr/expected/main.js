(self['webpackChunkwebpack'] = self['webpackChunkwebpack'] || []).push([["main"], {
"./app.js": function (module, exports, __webpack_require__) {
'use strict';
__webpack_require__.r(exports);
__webpack_require__.d(exports, {'b': function() { return b; }});

var __WEBPACK_DEFAULT_EXPORT__ = /* unused */undefined;
 const b = 1;
},
"./index.js": function (module, exports, __webpack_require__) {
'use strict';
__webpack_require__.r(exports);
/* harmony import */var _app__WEBPACK_IMPORTED_MODULE_0_ = __webpack_require__(/* ./app */"./app.js");

_app__WEBPACK_IMPORTED_MODULE_0_["b"];
},

},function(__webpack_require__) {
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId) }
var __webpack_exports__ = (__webpack_exec__("./index.js"));

}
]);