const editor = new EditorJS({
        onReady: () => {
            new Undo({ editor });
            new DragDrop(editor);
        },
        logLevel: 'ERROR',
        tools: {
            header: Header,
            image: SimpleImage,
            breakLine: {
              class: BreakLine,
              inlineToolbar: true,
              shortcut: 'CMD+SHIFT+ENTER',
            },
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
  autofocus: true,
  holder: 'editorjs_hasil', // Move 'holder' property inside the configuration object
  onReady: () => {
      new Undo({ editor: editorHasil }); // Update 'editor' to 'editorHasil'
      new DragDrop(editorHasil); // Update 'editor' to 'editorHasil'
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
  minHeight: 0
});


editorHasil.isReady
.then(() => {
    document.getElementById('statusTextHasil').innerHTML = '<b>Status: </b>Editor.js sudah dapat digunakan!'
})
.catch((reason) => {
    document.getElementById('statusTextHasil').innerHTML = `<b>Status: </b>Editor.js gagal dijalankan karena ${reason}!`
});

var num = 0;
var editor1, editor2, editor3;
function createEditorJS(namaHolder)
{
  if (num == 0)
  {
    editor1 = new EditorJS({
      onReady: () => {
          new Undo({ editor });
          new DragDrop(editor);
      },
      logLevel: 'ERROR',
      tools: {
          header: Header,
          image: SimpleImage,
          breakLine: {
            class: BreakLine,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+ENTER',
          },
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
      holder: namaHolder,
      minHeight : 0
    });
  }
  if (num == 1)
  {
    editor2 = new EditorJS({
      onReady: () => {
          new Undo({ editor });
          new DragDrop(editor);
      },
      logLevel: 'ERROR',
      tools: {
          header: Header,
          image: SimpleImage,
          breakLine: {
            class: BreakLine,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+ENTER',
          },
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
      holder: namaHolder,
      minHeight : 0
    });
  }
  if (num == 2)
  {
    editor3 = new EditorJS({
      onReady: () => {
          new Undo({ editor });
          new DragDrop(editor);
      },
      logLevel: 'ERROR',
      tools: {
          header: Header,
          image: SimpleImage,
          breakLine: {
            class: BreakLine,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+ENTER',
          },
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
      holder: namaHolder,
      minHeight : 0
    });
  }
  num++;
}