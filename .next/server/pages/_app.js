/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./contexts/MobileContext.js":
/*!***********************************!*\
  !*** ./contexts/MobileContext.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   MobileProvider: () => (/* binding */ MobileProvider),\n/* harmony export */   useMobile: () => (/* binding */ useMobile)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst MobileContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(false);\nconst useMobile = ()=>(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(MobileContext);\nconst MobileProvider = ({ children })=>{\n    const [isMobile, setIsMobile] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"MobileProvider.useEffect\": ()=>{\n            const checkIfMobile = {\n                \"MobileProvider.useEffect.checkIfMobile\": ()=>{\n                    setIsMobile(window.innerWidth < 768);\n                }\n            }[\"MobileProvider.useEffect.checkIfMobile\"];\n            checkIfMobile();\n            window.addEventListener('resize', checkIfMobile);\n            return ({\n                \"MobileProvider.useEffect\": ()=>{\n                    window.removeEventListener('resize', checkIfMobile);\n                }\n            })[\"MobileProvider.useEffect\"];\n        }\n    }[\"MobileProvider.useEffect\"], []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(MobileContext.Provider, {\n        value: isMobile,\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\WorkSpace\\\\uriage-sokuhou-webapp\\\\contexts\\\\MobileContext.js\",\n        lineNumber: 23,\n        columnNumber: 9\n    }, undefined);\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb250ZXh0cy9Nb2JpbGVDb250ZXh0LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBOEU7QUFFOUUsTUFBTUssOEJBQWdCSixvREFBYUEsQ0FBQztBQUU3QixNQUFNSyxZQUFZLElBQU1KLGlEQUFVQSxDQUFDRyxlQUFlO0FBRWxELE1BQU1FLGlCQUFpQixDQUFDLEVBQUVDLFFBQVEsRUFBRTtJQUMxQyxNQUFNLENBQUNDLFVBQVVDLFlBQVksR0FBR1AsK0NBQVFBLENBQUM7SUFFekNDLGdEQUFTQTtvQ0FBQztZQUNULE1BQU1POzBEQUFnQjtvQkFDckJELFlBQVlFLE9BQU9DLFVBQVUsR0FBRztnQkFDakM7O1lBRUFGO1lBQ0FDLE9BQU9FLGdCQUFnQixDQUFDLFVBQVVIO1lBRWxDOzRDQUFPO29CQUNOQyxPQUFPRyxtQkFBbUIsQ0FBQyxVQUFVSjtnQkFDdEM7O1FBQ0Q7bUNBQUcsRUFBRTtJQUVMLHFCQUFPLDhEQUFDTixjQUFjVyxRQUFRO1FBQUNDLE9BQU9SO2tCQUFXRDs7Ozs7O0FBQ2xELEVBQUUiLCJzb3VyY2VzIjpbIkM6XFxXb3JrU3BhY2VcXHVyaWFnZS1zb2t1aG91LXdlYmFwcFxcY29udGV4dHNcXE1vYmlsZUNvbnRleHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IGNyZWF0ZUNvbnRleHQsIHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XHJcblxyXG5jb25zdCBNb2JpbGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dChmYWxzZSk7XHJcblxyXG5leHBvcnQgY29uc3QgdXNlTW9iaWxlID0gKCkgPT4gdXNlQ29udGV4dChNb2JpbGVDb250ZXh0KTtcclxuXHJcbmV4cG9ydCBjb25zdCBNb2JpbGVQcm92aWRlciA9ICh7IGNoaWxkcmVuIH0pID0+IHtcclxuXHRjb25zdCBbaXNNb2JpbGUsIHNldElzTW9iaWxlXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuXHJcblx0dXNlRWZmZWN0KCgpID0+IHtcclxuXHRcdGNvbnN0IGNoZWNrSWZNb2JpbGUgPSAoKSA9PiB7XHJcblx0XHRcdHNldElzTW9iaWxlKHdpbmRvdy5pbm5lcldpZHRoIDwgNzY4KTtcclxuXHRcdH07XHJcblxyXG5cdFx0Y2hlY2tJZk1vYmlsZSgpO1xyXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGNoZWNrSWZNb2JpbGUpO1xyXG5cclxuXHRcdHJldHVybiAoKSA9PiB7XHJcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBjaGVja0lmTW9iaWxlKTtcclxuXHRcdH07XHJcblx0fSwgW10pO1xyXG5cclxuXHRyZXR1cm4gPE1vYmlsZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e2lzTW9iaWxlfT57Y2hpbGRyZW59PC9Nb2JpbGVDb250ZXh0LlByb3ZpZGVyPjtcclxufTtcclxuIl0sIm5hbWVzIjpbIlJlYWN0IiwiY3JlYXRlQ29udGV4dCIsInVzZUNvbnRleHQiLCJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsIk1vYmlsZUNvbnRleHQiLCJ1c2VNb2JpbGUiLCJNb2JpbGVQcm92aWRlciIsImNoaWxkcmVuIiwiaXNNb2JpbGUiLCJzZXRJc01vYmlsZSIsImNoZWNrSWZNb2JpbGUiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJQcm92aWRlciIsInZhbHVlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./contexts/MobileContext.js\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ MyApp)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_global_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/styles/global.css */ \"./styles/global.css\");\n/* harmony import */ var _styles_global_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_global_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @mui/material/styles */ \"./node_modules/@mui/material/node/styles/index.js\");\n/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_mui_material_styles__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _theme__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../theme */ \"./theme.js\");\n/* harmony import */ var _contexts_MobileContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../contexts/MobileContext */ \"./contexts/MobileContext.js\");\n\n\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_contexts_MobileContext__WEBPACK_IMPORTED_MODULE_3__.MobileProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_mui_material_styles__WEBPACK_IMPORTED_MODULE_4__.ThemeProvider, {\n            theme: _theme__WEBPACK_IMPORTED_MODULE_2__[\"default\"],\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"C:\\\\WorkSpace\\\\uriage-sokuhou-webapp\\\\pages\\\\_app.tsx\",\n                lineNumber: 10,\n                columnNumber: 5\n            }, this)\n        }, void 0, false, {\n            fileName: \"C:\\\\WorkSpace\\\\uriage-sokuhou-webapp\\\\pages\\\\_app.tsx\",\n            lineNumber: 9,\n            columnNumber: 4\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\WorkSpace\\\\uriage-sokuhou-webapp\\\\pages\\\\_app.tsx\",\n        lineNumber: 8,\n        columnNumber: 3\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQTZCO0FBQ3dCO0FBQ3hCO0FBQzhCO0FBRTVDLFNBQVNHLE1BQU0sRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQUU7SUFDckQscUJBQ0MsOERBQUNILG1FQUFjQTtrQkFDZCw0RUFBQ0YsK0RBQWFBO1lBQUNDLE9BQU9BLDhDQUFLQTtzQkFDMUIsNEVBQUNHO2dCQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJNUIiLCJzb3VyY2VzIjpbIkM6XFxXb3JrU3BhY2VcXHVyaWFnZS1zb2t1aG91LXdlYmFwcFxccGFnZXNcXF9hcHAudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnQC9zdHlsZXMvZ2xvYmFsLmNzcyc7XHJcbmltcG9ydCB7IFRoZW1lUHJvdmlkZXIgfSBmcm9tICdAbXVpL21hdGVyaWFsL3N0eWxlcyc7XHJcbmltcG9ydCB0aGVtZSBmcm9tICcuLi90aGVtZSc7XHJcbmltcG9ydCB7IE1vYmlsZVByb3ZpZGVyIH0gZnJvbSAnLi4vY29udGV4dHMvTW9iaWxlQ29udGV4dCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNeUFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcclxuXHRyZXR1cm4gKFxyXG5cdFx0PE1vYmlsZVByb3ZpZGVyPlxyXG5cdFx0XHQ8VGhlbWVQcm92aWRlciB0aGVtZT17dGhlbWV9PlxyXG5cdFx0XHRcdDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cclxuXHRcdFx0PC9UaGVtZVByb3ZpZGVyPlxyXG5cdFx0PC9Nb2JpbGVQcm92aWRlcj5cclxuXHQpO1xyXG59Il0sIm5hbWVzIjpbIlRoZW1lUHJvdmlkZXIiLCJ0aGVtZSIsIk1vYmlsZVByb3ZpZGVyIiwiTXlBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./theme.js":
/*!******************!*\
  !*** ./theme.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @mui/material/styles */ \"./node_modules/@mui/material/node/styles/index.js\");\n/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_mui_material_styles__WEBPACK_IMPORTED_MODULE_0__);\n\nconst theme = (0,_mui_material_styles__WEBPACK_IMPORTED_MODULE_0__.createTheme)({\n    palette: {\n        primary: {\n            // main: '#e6e0e0',\n            main: '#38bbcd'\n        },\n        secondary: {\n            main: '#db6273'\n        }\n    },\n    typography: {\n        fontSize: 14\n    }\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (theme);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi90aGVtZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBbUQ7QUFFbkQsTUFBTUMsUUFBUUQsaUVBQVdBLENBQUM7SUFDekJFLFNBQVM7UUFDUkMsU0FBUztZQUNSLG1CQUFtQjtZQUNuQkMsTUFBTTtRQUNQO1FBQ0FDLFdBQVc7WUFDVkQsTUFBTTtRQUNQO0lBQ0Q7SUFDQUUsWUFBWTtRQUNYQyxVQUFVO0lBQ1g7QUFDRDtBQUVBLGlFQUFlTixLQUFLQSxFQUFDIiwic291cmNlcyI6WyJDOlxcV29ya1NwYWNlXFx1cmlhZ2Utc29rdWhvdS13ZWJhcHBcXHRoZW1lLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZVRoZW1lIH0gZnJvbSAnQG11aS9tYXRlcmlhbC9zdHlsZXMnO1xyXG5cclxuY29uc3QgdGhlbWUgPSBjcmVhdGVUaGVtZSh7XHJcblx0cGFsZXR0ZToge1xyXG5cdFx0cHJpbWFyeToge1xyXG5cdFx0XHQvLyBtYWluOiAnI2U2ZTBlMCcsXHJcblx0XHRcdG1haW46ICcjMzhiYmNkJyxcclxuXHRcdH0sXHJcblx0XHRzZWNvbmRhcnk6IHtcclxuXHRcdFx0bWFpbjogJyNkYjYyNzMnLFxyXG5cdFx0fSxcclxuXHR9LFxyXG5cdHR5cG9ncmFwaHk6IHtcclxuXHRcdGZvbnRTaXplOiAxNCxcclxuXHR9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHRoZW1lO1xyXG4iXSwibmFtZXMiOlsiY3JlYXRlVGhlbWUiLCJ0aGVtZSIsInBhbGV0dGUiLCJwcmltYXJ5IiwibWFpbiIsInNlY29uZGFyeSIsInR5cG9ncmFwaHkiLCJmb250U2l6ZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./theme.js\n");

/***/ }),

/***/ "./styles/global.css":
/*!***************************!*\
  !*** ./styles/global.css ***!
  \***************************/
/***/ (() => {



/***/ }),

/***/ "@mui/system":
/*!******************************!*\
  !*** external "@mui/system" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("@mui/system");

/***/ }),

/***/ "@mui/system/InitColorSchemeScript":
/*!****************************************************!*\
  !*** external "@mui/system/InitColorSchemeScript" ***!
  \****************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@mui/system/InitColorSchemeScript");

/***/ }),

/***/ "@mui/system/colorManipulator":
/*!***********************************************!*\
  !*** external "@mui/system/colorManipulator" ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@mui/system/colorManipulator");

/***/ }),

/***/ "@mui/system/createStyled":
/*!*******************************************!*\
  !*** external "@mui/system/createStyled" ***!
  \*******************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@mui/system/createStyled");

/***/ }),

/***/ "@mui/system/createTheme":
/*!******************************************!*\
  !*** external "@mui/system/createTheme" ***!
  \******************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@mui/system/createTheme");

/***/ }),

/***/ "@mui/system/styleFunctionSx":
/*!**********************************************!*\
  !*** external "@mui/system/styleFunctionSx" ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@mui/system/styleFunctionSx");

/***/ }),

/***/ "@mui/system/useThemeProps":
/*!********************************************!*\
  !*** external "@mui/system/useThemeProps" ***!
  \********************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@mui/system/useThemeProps");

/***/ }),

/***/ "@mui/utils/deepmerge":
/*!***************************************!*\
  !*** external "@mui/utils/deepmerge" ***!
  \***************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@mui/utils/deepmerge");

/***/ }),

/***/ "@mui/utils/formatMuiErrorMessage":
/*!***************************************************!*\
  !*** external "@mui/utils/formatMuiErrorMessage" ***!
  \***************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@mui/utils/formatMuiErrorMessage");

/***/ }),

/***/ "@mui/utils/generateUtilityClass":
/*!**************************************************!*\
  !*** external "@mui/utils/generateUtilityClass" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@mui/utils/generateUtilityClass");

/***/ }),

/***/ "prop-types":
/*!*****************************!*\
  !*** external "prop-types" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = require("prop-types");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/@mui","vendor-chunks/@babel"], () => (__webpack_exec__("./pages/_app.tsx")));
module.exports = __webpack_exports__;

})();