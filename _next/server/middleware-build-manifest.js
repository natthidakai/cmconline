self.__BUILD_MANIFEST = {
  "polyfillFiles": [
    "static/chunks/polyfills.js"
  ],
  "devFiles": [
    "static/chunks/react-refresh.js"
  ],
  "ampDevFiles": [],
  "lowPriorityFiles": [],
  "rootMainFiles": [],
  "pages": {
    "/": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/index.js"
    ],
    "/_app": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_app.js"
    ],
    "/_error": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_error.js"
    ],
    "/bookingstep": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/bookingstep.js"
    ],
    "/mybooking": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/mybooking.js"
    ],
    "/payment": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/payment.js"
    ],
    "/step/[step]": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/step/[step].js"
    ]
  },
  "ampFirstPages": []
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
"/static/" + process.env.__NEXT_BUILD_ID + "/_buildManifest.js",
,"/static/" + process.env.__NEXT_BUILD_ID + "/_ssgManifest.js",

];