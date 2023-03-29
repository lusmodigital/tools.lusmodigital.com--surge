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

const editorHasil = new EditorJS({
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
        holder: 'editorjs_hasil',
        minHeight : 0
    }
);

editorHasil.isReady
  .then(() => {
    document.getElementById('statusTextHasil').innerHTML = '<b>Status: </b>Editor.js sudah dapat digunakan!'
    const str = `
    <figure class="wp-block-image aligncenter size-large"><img decoding="async" src="https://1.bp.blogspot.com/-BiZglPKP9AM/YOVJuQpyU8I/AAAAAAAANA0/7EWWsDbhZkgrz0jYa2O2gHhqbyGFPrvUwCLcBGAsYHQ/s488/Gazebo%2BBambu%2B%252828%2529.jpeg" alt="" width="NaN" height="NaN"></figure>
    <h2>JASA DESAIN &amp; JASA PEMBUATAN SAUNG (GAZEBO) DI Balangan, Kalimantan Selatan</h2>
    <p>Jika Anda ingin membangun Saung (Gazebo) di Balangan, Kalimantan Selatan namun bingung bagaimana caranya, maka Saung.id adalah pilihan yang tepat untuk Anda. Tidak hanya jasa layanan pembuatan Saung (Gazebo) yang kami sediakan, tetapi kami juga menawarkan Saung (Gazebo) yang sudah jadi dan siap digunakan di kota untuk Anda. Desain Saung (Gazebo) modern dari kayu seperti kayu glugu, bambu, kayu jati, dan lain sebagainya adalah karya kami dalam membuat Saung tersebut.</p>
    `
    editorHasil.blocks.renderFromHTML(str)
  })
  .catch((reason) => {
    document.getElementById('statusTextHasil').innerHTML = `<b>Status: </b>Editor.js gagal dijalankan karena ${reason}!`
});
