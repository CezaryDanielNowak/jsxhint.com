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

importScripts("/res/jshint/jshint.js")
importScripts("/res/react/JSXTransformer.js")

function transformer(config, code, extraErrors) {
  try {
    return self.window.JSXTransformer.transform(code, {harmony: config['harmony']}).code;
  } catch(err) {
    var wholeLine = code.split('\n')[err.lineNumber];
    if(config['showJSXErrors']) {
      extraErrors.push({
        a: undefined,
        b: undefined,
        c: undefined,
        character: err.index,
        code: "E015", //?
        d: undefined,
        evidence: wholeLine,
        id: "(error)",
        line: err.lineNumber,
        raw: err.message,
        reason: err.description,
        scope: "(main)",
      });
    }
    return code;
  }
}

self.onmessage = function (ev) {
  var jsCode,
      extraErrors = [],
      ret,
      req = ev.data;

  if (req.task === "lint") {
    jsCode = transformer(req.config, req.code, extraErrors);
    delete req.config.harmony;
    delete req.config.showJSXErrors;

    JSHINT(jsCode, req.config);
    ret = JSHINT.data();
    ret.options = null;
    if(extraErrors.length) {
      ret.errors = extraErrors.concat(ret.errors);
    }
    self.postMessage({ task: "lint", result: JSON.stringify(ret), jsCode: jsCode})
  }
}
