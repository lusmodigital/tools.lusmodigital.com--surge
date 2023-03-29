const editor = new EditorJS({
        onReady: () => {
            new Undo({ editor });
            new DragDrop(editor);
        },
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
        },
        holder: 'editorjs',
    }
);