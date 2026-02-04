export function createEnvironment(): void {
  if (self.MonacoEnvironment) {
    return;
  }

  self.MonacoEnvironment = {
    getWorkerUrl(_, label) {
      let url: URL;

      switch (label) {
        case 'json': {
          url = new URL(
            'monaco-editor/esm/vs/language/json/json.worker.js',
            import.meta.url
          );
          break;
        }

        case 'css':
        case 'scss':
        case 'less': {
          url = new URL(
            'monaco-editor/esm/vs/language/css/css.worker.js',
            import.meta.url
          );
          break;
        }

        case 'html':
        case 'handlebars':
        case 'razor': {
          url = new URL(
            'monaco-editor/esm/vs/language/html/html.worker.js',
            import.meta.url
          );
          break;
        }

        case 'typescript':
        case 'javascript': {
          url = new URL(
            'monaco-editor/esm/vs/language/typescript/ts.worker.js',
            import.meta.url
          );
          break;
        }

        default: {
          url = new URL(
            'monaco-editor/esm/vs/editor/editor.worker.js',
            import.meta.url
          );
          break;
        }
      }

      return url.href;
    }
  };
}