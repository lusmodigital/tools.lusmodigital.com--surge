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
        },
        holder: 'editorjs',
        minHeight : 0
    }
);

editor.isReady
  .then(() => {
    document.getElementById('statusText').innerHTML = '<b>Status: </b>Editor.js sudah dapat digunakan!'
    /** Do anything you need after editor initialization */
  })
  .catch((reason) => {
    document.getElementById('statusText').innerHTML = `<b>Status: </b>Editor.js gagal dijalankan karena ${reason}!`
});