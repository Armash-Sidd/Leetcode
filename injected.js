/**
 * LeetCode AutoSync - Main World Script
 * Runs in the page MAIN world to access window.monaco directly.
 */
(function() {
  function getMonacoCode() {
    try {
      if (window.monaco && window.monaco.editor && typeof window.monaco.editor.getModels === 'function') {
        var models = window.monaco.editor.getModels();
        if (models && models.length > 0) {
          return models[0].getValue();
        }
      }
    } catch (e) {}
    return null;
  }

  // Listen for extraction requests from content script
  document.addEventListener('LEETCODE_AUTOSYNC_EXTRACT', function() {
    var code = getMonacoCode();
    if (code !== null && code !== undefined) {
      document.documentElement.setAttribute('data-monaco-code', code);
    } else {
      document.documentElement.removeAttribute('data-monaco-code');
    }
  });
})();
