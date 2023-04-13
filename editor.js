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
const editorHasilAkhir = new EditorJS({
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
    holder: 'editorjs_hasil_akhir',
    minHeight : 0
});

editorHasilAkhir.isReady
  .then(() => {
    document.getElementById('statusTextHasilAkhir').innerHTML = '<b>Status: </b>Editor.js sudah dapat digunakan!'
  })
  .catch((reason) => {
    document.getElementById('statusTextHasilAkhir').innerHTML = `<b>Status: </b>Editor.js gagal dijalankan karena ${reason}!`
});
