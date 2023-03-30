const editor = new EditorJS({
        onReady: () => {
            new Undo({ editor });
            new DragDrop(editor);
        },
        logLevel: 'ERROR',
        tools: {
            header: Header,
            image: SimpleImage,
            paragraph: {
                class: Paragraph,
                inlineToolbar: true,
            },
            list: {
                class: List,
                inlineToolbar: true,
                config: {
                  defaultStyle: 'unordered'
                }
            },
            olist: {
                class: List,
                inlineToolbar: true,
                config: {
                  defaultStyle: 'ordered'
                }
            },
            markdownParser: MDParser,
            markdownImporter: MDImporter,
        },
        holder: 'editorjs',
        minHeight : 0
    }
);

editor.isReady
  .then(() => {
    document.getElementById('statusText').innerHTML = '<b>Status: </b>Editor.js sudah dapat digunakan!'
  })
  .catch((reason) => {
    document.getElementById('statusText').innerHTML = `<b>Status: </b>Editor.js gagal dijalankan karena ${reason}!`
});

const editorFetch = new EditorJS({
        onReady: () => {
            new Undo({ editor });
            new DragDrop(editor);
        },
        logLevel: 'ERROR',
        tools: {
            header: Header,
            image: SimpleImage,
            paragraph: {
                class: Paragraph,
                inlineToolbar: true,
            },
            list: {
                class: List,
                inlineToolbar: true,
                config: {
                  defaultStyle: 'unordered'
                }
            },
            olist: {
                class: List,
                inlineToolbar: true,
                config: {
                  defaultStyle: 'ordered'
                }
            },
            markdownParser: MDParser,
            markdownImporter: MDImporter,
        },
        holder: 'editorjs_fetch',
        minHeight : 0
    }
);

editorFetch.isReady
  .then(() => {
    document.getElementById('statusTextFetch').innerHTML = '<b>Status: </b>Editor.js sudah dapat digunakan!'
  })
  .catch((reason) => {
    document.getElementById('statusTextFetch').innerHTML = `<b>Status: </b>Editor.js gagal dijalankan karena ${reason}!`
});

const editorHasil = new EditorJS({
    autofocuse: true,
    onReady: () => {
        new Undo({ editor });
        new DragDrop(editor);
    },
    logLevel: 'ERROR',
    tools: {
        header: Header,
        image: SimpleImage,
        paragraph: {
            class: Paragraph,
            inlineToolbar: true,
        },
        list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered'
            }
        },
        olist: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: 'ordered'
            }
        },
        markdownParser: MDParser,
        markdownImporter: MDImporter,
    },
    holder: 'editorjs_hasil',
    minHeight : 0
});

editorHasil.isReady
  .then(() => {
    document.getElementById('statusTextHasil').innerHTML = '<b>Status: </b>Editor.js sudah dapat digunakan!'
  })
  .catch((reason) => {
    document.getElementById('statusTextHasil').innerHTML = `<b>Status: </b>Editor.js gagal dijalankan karena ${reason}!`
});
