// XXX: JSXTransformer is not meant to work in web worker, that's
// why we have to make dummy document and window objects.
self.document = {
  getElementsByTagName: function () {
    return [];
  },
  createElement: function () {
    return {};
  }
};
self.window = {
  attachEvent: function() {}
};

importScripts("/res/jshint/dist/jshint.js")
importScripts("/res/react/JSXTransformer.js")

function transformer(harmony, code) {
  return self.window.JSXTransformer.transform(code, {harmony: harmony}).code;
}

self.onmessage = function (ev) {
  var jsCode,
      ret,
      req = ev.data;

  if (req.task === "lint") {
    jsCode = transformer(req.config['harmony'], req.code);
    JSHINT(jsCode, req.config);

    ret = JSHINT.data();
    ret.options = null;
    self.postMessage({ task: "lint", result: JSON.stringify(ret) })
  }
}
