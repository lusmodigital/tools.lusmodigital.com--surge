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

function output(){
    editor.save().then((outputData) => {
        const jsonData = JSON.stringify(outputData)
        console.log(jsonData)
        for (var i = 0; i < outputData["blocks"].length; i++){
            var dataNya = outputData["blocks"][i]
            var tipe = dataNya["type"], data = dataNya["data"], level
            if (tipe == 'image') data = data["url"]
            else if (tipe == 'heading') data = data["text"], level = data["level"]
            else data = data["text"]
            console.log(tipe, "-", data)
        }
    }).catch((error) => {
        console.log('Error:', error);
    });
}

// editor.save().then((outputData) => {
//     console.log('Article data: ', outputData)
// }).catch((error) => {
//   console.log('Saving failed: ', error)
// });