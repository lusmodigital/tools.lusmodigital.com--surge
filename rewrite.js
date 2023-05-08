let data_split = [], htmlElement = [];
let paragraphs_object = [], totalToken = 0, totalKalimat = 0;
const data_instructions = [
    'tulis ulang dengan mengubah struktur kalimat di atas tanpa merubah maknanya',
    'tulis ulang dengan mengubah struktur kalimat di atas',
    'tulis ulang kalimat yang ada dimulai dengan kata ditengah tanpa merubah makna',
    'tulis ulang paragraf ini secara unik dan lebih lengkap',
    'Tambahkan instruksi kustom'
]
const LOADING = $("#loading-overlay");
LOADING.hide();

$("#model-open-ai").val('gpt-3.5-turbo');
$.each(data_instructions, function (i, item) {
    $('#instruction-open-ai').append($('<option>', { 
        value: item,
        text : item 
    }));
});

$('#instruction-open-ai').on('change', function() {
    if (this.value === 'Tambahkan instruksi kustom') {
      const newInput = '<input class="form-control" type="text" id="instruction-open-ai" value="">';
      $('#instruction-container').html(newInput);
    }
  });

const modelOpenAiWidth = $('#model-open-ai').outerWidth();
$('#instruction-open-ai').parent().css('width', modelOpenAiWidth);

$("#btnClearArticle").click(function () {
    editor.clear()
    alert("Berhasil mengosongkan artikel!")
})

$("#btnProcessSplit").click(function () {
    editor.save().then((outputData) => {
        const jsonData = JSON.stringify(outputData)
        console.log(jsonData)
        var articleText = ''
        for (var i = 0; i < outputData["blocks"].length; i++){
            var dataNya = outputData["blocks"][i]
            var tipe = dataNya["type"], data = dataNya["data"], level = data;
            if (tipe == 'image') data = data["url"], articleText += '<img src="'+data+'"/>\n'
            else if (tipe == 'header') level = data["level"], data = data["text"], articleText += '<h'+level+'> '+data+'</h'+level+'>\n'
            else if (tipe == 'list') 
            {
                var dataList = data["items"];
                for (var j = 0; j < dataList.length; j++)
                {
                    articleText += '- '+dataList[j]+'\n';
                    console.log("list ke-",j,dataList[j]);
                }
            }
            else data = data["text"], articleText += '<p>'+data+'</p>\n'
            console.log(tipe, "-", data)
        }
        let answer = window.confirm("Continue to Split this Article?");
        if (!answer) {
            console.log('Cancelled');
            return;
        } else {
            let paragraphs = articleText.split(/\r?\n/);

            paragraphs_object = [];
            console.log("paragraphs")
            console.log(paragraphs)
            paragraphs.forEach((paragraph_item, paragraph_index) => {
                if (paragraph_item === '') return; 
                    
                let paragraph = paragraph_item;
                let sentences = paragraph.split(/\.\s|\?\s/);

                let sentences_object = [];
                sentences.forEach((sentence_item, sentence_index) => {
                    sentences_object.push({
                        "sentence_index": sentence_index,
                        "sentence_item": sentence_item,
                        "length_of_other_sentences": 0,
                        "other_sentences": [],
                        "other_sentence_ids": [],
                    });
                });

                paragraphs_object.push({
                    "paragraph_index": paragraph_index,
                    "paragraph_item": paragraph_item,
                    "other_paragraphs": [],
                    "other_paragraph_ids": [],
                    "length_of_other_paragraphs": 0,
                    "length_of_sentences": sentences.length,
                    "sentences_object": sentences_object,
                    "sentences": sentences,
                });
                totalKalimatParagrafAkhir = sentences.length;
            });
            showDataSplit();
        }
    }).catch((error) => {
        console.log('Error:', error);
    });
});

$("#btnProcessSplitParagraph").click(function () {
    editor.save().then((outputData) => {
        const jsonData = JSON.stringify(outputData)
        console.log(jsonData)
        var articleText = ''
        for (var i = 0; i < outputData["blocks"].length; i++){
            var dataNya = outputData["blocks"][i]
            var tipe = dataNya["type"], data = dataNya["data"], level = data;
            console.log("data")
            console.log(data)
            if (tipe == 'image') data = data["url"], articleText += '[img] '+data+'\n'
            else if (tipe == 'header') level = data["level"], data = data["text"], articleText += '<h'+level+'>'+data+'</h'+level+'>\n'
            else if (tipe == 'list') 
            {
                var dataList = data["items"];
                for (var j = 0; j < dataList.length; j++)
                {
                    articleText += '- '+dataList[j]+'\n';
                    console.log("list ke-",j,dataList[j]);
                }
            }
            else data = data["text"], articleText += '<p>'+data+'</p>\n'
            console.log(tipe, "-", data)
        }
        let answer = window.confirm("Continue to Split this Article?");
        if (!answer) {
            console.log('Cancelled');
            return;
        } else {
            let paragraphs = articleText.split(/\r?\n/);

            paragraphs_object = [];
            paragraphs.forEach((paragraph_item, paragraph_index) => {
                if (paragraph_item === '') return; 
                    
                let paragraph = removeAnchorTags(paragraph_item);
                console.log("paragraph_item")
                console.log(paragraph)
                let sentences = paragraph.split(/\.\s|\?\s/);

                let sentences_object = [];
                sentences.forEach((sentence_item, sentence_index) => {
                    sentences_object.push({
                        "sentence_index": sentence_index,
                        "sentence_item": sentence_item,
                        "length_of_other_sentences": 0,
                        "other_sentences": [],
                        "other_sentence_ids": [],
                    });
                });

                paragraphs_object.push({
                    "paragraph_index": paragraph_index,
                    "paragraph_item": paragraph,
                    "other_paragraphs": [],
                    "other_paragraph_ids": [],
                    "length_of_other_paragraphs": 0,
                    "length_of_sentences": sentences.length,
                    "sentences_object": sentences_object,
                    "sentences": sentences,
                });
                totalKalimatParagrafAkhir = sentences.length;
            });
            showParagraphSplit();
        }
    }).catch((error) => {
        console.log('Error:', error);
    });
});


$("#btnGenerateOne").click(function () {
    let resultHtml = '', renderHtml = '', totalKalimat = 0;
    paragraphs_object.forEach((paragraph, paragraph_index) => {
        paragraph.sentences_object.forEach((sentence, sentence_index) => {
            console.log(htmlElement)
            let dataType = htmlElement[totalKalimat++], openTag, closeTag;
            if (dataType === 'p') openTag = "<p>", closeTag = "</p>"
            if (dataType === 'img') openTag = '<img src="', closeTag = '" alt="" width="NaN" height="NaN"></img>'
            if (dataType[0] === 'h') openTag = "<"+dataType+">", closeTag = "</"+dataType+">"
            if (dataType[0] != 'h' && dataType != 'img') 
                resultHtml += sentence.length_of_other_sentences > 0 ? openTag + '{' : openTag;
            if (dataType[0] != 'h' && dataType != 'img') 
                renderHtml += sentence.length_of_other_sentences > 0 ? openTag + '{' : openTag;
            if (dataType[0] == 'h' || dataType == 'img') resultHtml += openTag;
            if (dataType[0] == 'h' || dataType == 'img') renderHtml += openTag;

            if (dataType === 'p') 
                resultHtml += sentence.sentence_item,
                renderHtml += sentence.sentence_item;
            if (dataType === 'img') 
                resultHtml += sentence.sentence_item.slice(6),
                renderHtml += sentence.sentence_item.slice(6);
            if (dataType[0] === 'h') 
                resultHtml += sentence.sentence_item.slice(5),
                renderHtml += sentence.sentence_item.slice(5);

            if (sentence.length_of_other_sentences > 0)
                sentence.other_sentences.forEach((other_sentence_item, other_sentence_index) => {
                    if (dataType === 'p') resultHtml += "|" + other_sentence_item;
                    if (dataType === 'p') renderHtml += "|" + other_sentence_item;
                });

            if (dataType[0] != 'h' && dataType != 'img') 
                resultHtml += sentence.length_of_other_sentences > 0 ? '} ' + closeTag : '' + closeTag,
                renderHtml += sentence.length_of_other_sentences > 0 ? '} ' + closeTag : '' + closeTag;
            else resultHtml += closeTag, renderHtml += closeTag;
        });
        resultHtml += '&#10;&#10;';
        renderHtml += '&#10;&#10;';
    });
    console.log(resultHtml, renderHtml);
    editorHasil.blocks.renderFromHTML(renderHtml)
    $("#textareaConvertSplitResult").html(resultHtml);
});

$("#btnGenerateTwo").click(function () {
    console.log("cliked");

    var text = $('#textareaConvertSplitResult').val();

    var matches, options, random;

    var regEx = new RegExp(/{([^{}]+?)}/);
    while ((matches = regEx.exec(text)) !== null) {
        options = matches[1].split("|");
        random = Math.floor(Math.random() * options.length);
        console.log("====== " + options);

        // var isVariable = options[random].indexOf("###");
        var isVariable = 1;

        var selectedVariable = "";
        if (isVariable >= 0) {
            // var variable = options[random].substring(0, isVariable);
            var variable = options;
            console.log("===== variable " + variable);

            // var arrayKota = $('#variable_name').val();
            var arrayKota = $('input[name=variable_name]');
            var inputs = document.getElementsByClassName('variable_name'),
                names = [].map.call(inputs, function (input) {
                    return input.value;
                }).join(',');

            console.log("===== names " + names);

            names = names.split(",");

            // console.log("===== arrayKota " + arrayKota);
            function checkVariable(name) {
                return variable == name;
            }
            console.log("===== arrayKota.findIndex(variable) " + names.findIndex(checkVariable));

            if (names.findIndex(checkVariable) >= 0) {
                selectedVariable = $("#variable_selected_" + names.findIndex(checkVariable) + " :selected").text();
                console.log("====== selectedVariable text " + selectedVariable);
            }
        }

        if (selectedVariable == "") {

            text = text.replace(matches[0], options[random]);
        } else {
            console.log("====== kudune ke replace " + selectedVariable);
            console.log("====== kudune ke replace matches[0]" + matches[0]);
            text = text.replace(matches[0], selectedVariable);
        }
    }
    $("#textareaFinalResult").val(text);
});

$('#btnAdd').click(function (e) {
    var nextTab = $('#tabs li').size()+1;
  
    // create the tab
    $('<li><a href="#tab'+nextTab+'" data-toggle="tab">Tab '+nextTab+'</a></li>').appendTo('#tabs');
    
    // create the tab content
    $('<div class="tab-pane" id="tab'+nextTab+'">tab' +nextTab+' content</div>').appendTo('.tab-content');
    
    // make the new tab active
    $('#tabs a:last').tab('show');
});

function showDataSplit() {
    paragraphs_object.forEach((paragraph, paragraph_index) => {
        let result = '';
        result += `<div class="p-2 mt-5" id="containerPerParagraph" style="width:320px; height: auto; background-color:${paragraph_index % 2 == 0 ? '#bcf4ff' : '#dbdbdb'}">
        <center><h6>Paragraph ${paragraph_index+1}</h6></center><hr>`;

        paragraph.sentences.forEach((sentence, sentence_index) => {
            let withDot = (paragraph.length_of_sentences-1) > sentence_index ? '.' : '';

            result += `<div class="section-sentence-horizontal" id="section-sentence-horizontal-${paragraph_index}-${sentence_index}">`;
            result += `<div class="mt-2 p-2 sentence-item" style="background-color:#dbdbdb">
                    <a>Kalimat ${sentence_index+1}</a>
                    <textarea class="form-control" name="paragraph[]" rows="3">${sentence}${withDot}</textarea>
                    <center>
                    <button class="btn btn-sm btn-info" onclick="AddOpenAIText('${paragraph_index}','${sentence_index}')">Add</button>
                    <button class="btn btn-sm btn-danger" onclick="DeleteHorizontalSentence('${paragraph_index}','${sentence_index}')">Delete</button>
                    </center>
                </div> `;
            result += `</div>`;

        });
        result += `</div>`;

        $('#containerSplitPerArticle').append(result);
    });
}

function showParagraphSplit() {
    paragraphs_object.forEach((paragraph, paragraph_index) => {
        let result = '';
        result += `<div class="p-2 mt-5" id="containerPerParagraph" style="width:320px; height: auto; background-color:${paragraph_index % 2 == 0 ? '#bcf4ff' : '#dbdbdb'}">
        <center><h6>Paragraph ${paragraph_index+1}</h6></center><hr>`;
        result += `<div class="section-sentence-horizontal" id="section-sentence-horizontal-paragraph-${paragraph_index}">`;
        result += `<div class="mt-2 p-2 sentence-item" style="background-color:#dbdbdb">
                <a>Isi Paragraf</a>
                <textarea class="form-control" name="paragraph" rows="3">${paragraph.paragraph_item}</textarea>
                <center>
                    <button class="btn btn-sm btn-info" onclick="AddOpenAITextParagraph('${paragraph_index}')">Add</button>
                    <button class="btn btn-sm btn-danger" onclick="DeleteHorizontalSentenceParagraph('${paragraph_index}')">Delete</button>
                </center>
            </div> `;
        result += `</div>`;
        result += `</div>`;

        $('#containerSplitPerArticle').append(result);
    });
}

function showOtherSentences(paragraph_index, sentence_index) {
    const selected_sentence = paragraphs_object[paragraph_index].sentences_object[sentence_index];
    console.log(selected_sentence);

    let result = '';
    selected_sentence.other_sentences.forEach((other_sentence, other_sentence_index) => {
        result += `<div class="mt-2 p-2 sentence-item" style="background-color:#dbdbdb">
                <a>Kalimat ${sentence_index+1}</a>
                <textarea class="form-control" name="paragraph[]" rows="3">${other_sentence.trim()}</textarea> 
            </div> `;
        result += `</div>`;

    });
    result += `</div>`;

    $(`#section-sentence-horizontal-${paragraph_index}-${sentence_index}`).append(result);
}


$("#generate-input-open-ai").click(function () {
    paragraphs_object.forEach( (paragraph, paragraph_index) => {
        paragraph.sentences_object.forEach( (sentence, sentence_index) => {
            if (sentence["sentence_item"].slice(0, 2) != '<h')
                AddOpenAIText(paragraph_index, sentence_index, true);
            else AddOpenAITextHeader(paragraph_index, sentence_index, true);
        });
    });
});

$("#generate-paragraph-open-ai").click(function () {
    paragraphs_object.forEach( (paragraph, paragraph_index) => {
        if (paragraph.paragraph_item.slice(0, 2) != '<h')
            AddOpenAIParagraph(paragraph_index, true);
        else AddOpenAIParagraphHeader(paragraph_index, true);
    });
});

function deleteVerticalOtherSentences(other_sentence_vertical_index) {
    paragraphs_object.forEach( (paragraph, paragraph_index) => {
        paragraph.sentences_object.forEach( (sentence, sentence_index) => {
            $(`#open-ai-div-${paragraph_index}-${sentence_index}-${other_sentence_vertical_index}`).remove();
            DeleteTextOpenAI(paragraph_index,sentence_index, other_sentence_vertical_index);
        });
    });
    
    $(`btn-generate-vertical-other-sentence-${other_sentence_vertical_index}`).remove();
    $(`#btn-delete-vertical-other-sentence-${other_sentence_vertical_index}`).remove();
} 

function deleteVerticalOtherParagraphs(other_paragraph_vertical_index) {
    paragraphs_object.forEach( (paragraph, paragraph_index) => {
        $(`#open-ai-div-paragraph-${paragraph_index}-${other_sentence_vertical_index}`).remove();
        DeleteParagraphOpenAI(paragraph_index, other_sentence_vertical_index);
    });
    
    $(`btn-generate-vertical-other-paragraph-${other_paragraph_vertical_index}`).remove();
    $(`#btn-delete-vertical-other-paragraph-${other_paragraph_vertical_index}`).remove();
} 

function generateOpenAiVerticalOtherSentences(other_sentence_vertical_index) {
    let totalKalimat = 0
    paragraphs_object.forEach( (paragraph, paragraph_index) => {
        paragraph.sentences_object.forEach( (sentence, sentence_index) => {
            console.log("kam", sentence_index)
            if (sentence["sentence_item"].slice(0, 5) != '[img]' && sentence["sentence_item"].slice(0, 2) != '<h')
            {
                console.log(totalKalimat, htmlElement)
                if (!htmlElement[totalKalimat]) htmlElement.splice(totalKalimat++, 0, 'p')
                GenerateOpenAI(paragraph_index,sentence_index, other_sentence_vertical_index);
            }
            else if(sentence["sentence_item"].slice(0, 2) == '<h') 
            {
                console.log(totalKalimat, htmlElement)
                if (!htmlElement[totalKalimat]) htmlElement.splice(totalKalimat++, 0, sentence["sentence_item"].slice(1, 3))
                paragraphs_object[paragraph_index].sentences_object[sentence_index].other_sentences[other_sentence_vertical_index] = paragraphs_object[paragraph_index].sentences[sentence_index],
                $(`#open-ai-text-${paragraph_index}-${sentence_index}-${other_sentence_vertical_index}`).val(paragraphs_object[paragraph_index].sentences[sentence_index]);
            }
            else if(sentence["sentence_item"].slice(0, 5) == '[img]')
            {
                console.log(totalKalimat, htmlElement)
                if (!htmlElement[totalKalimat]) htmlElement.splice(totalKalimat++, 0, 'img')
            }
        });
    });
    
} 

function generateOpenAiVerticalOtherParagraphs(other_paragraph_vertical_index) {
    let totalKalimat = 0
    paragraphs_object.forEach( (paragraph, paragraph_index) => {
        if (paragraph.paragraph_item.slice(0, 5) != '[img]' && paragraph.paragraph_item.slice(0, 2) != '<h')
        {
            console.log(totalKalimat, htmlElement)
            if (!htmlElement[totalKalimat]) htmlElement.splice(totalKalimat++, 0, 'p')
            GenerateOpenAIParagraph(paragraph_index, other_paragraph_vertical_index);
        }
        else if(paragraph.paragraph_item.slice(0, 2) == '<h') 
        {
            console.log(totalKalimat, htmlElement)
            if (!htmlElement[totalKalimat]) htmlElement.splice(totalKalimat++, 0, paragraph.paragraph_item.slice(1, 3))
            paragraphs_object[paragraph_index].other_paragraphs[other_paragraph_vertical_index] = paragraphs_object[paragraph_index].paragraph_item,
            $(`#open-ai-paragraph-${paragraph_index}-${other_paragraph_vertical_index}`).val(paragraphs_object[paragraph_index].paragraph_item);
        }
        else if(paragraph.paragraph_item.slice(0, 2) == '- ') 
        {
            console.log(totalKalimat, htmlElement)
            if (!htmlElement[totalKalimat]) htmlElement.splice(totalKalimat++, 0, paragraph.paragraph_item.slice(1, 3))
            paragraphs_object[paragraph_index].other_paragraphs[other_paragraph_vertical_index] = paragraphs_object[paragraph_index].paragraph_item,
            $(`#open-ai-paragraph-${paragraph_index}-${other_paragraph_vertical_index}`).val(paragraphs_object[paragraph_index].paragraph_item);
        }
        else if(paragraph.paragraph_item.slice(0, 5) == '[img]')
        {
            console.log(totalKalimat, htmlElement)
            if (!htmlElement[totalKalimat]) htmlElement.splice(totalKalimat++, 0, 'img')
        }
    });
    
}

function GetDataCORSBypass(urlArtikel) {
    try {
        $.getJSON('http://api.allorigins.win/get?url='+encodeURIComponent(urlArtikel)+'&callback=?', function (data) {
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(data.contents, 'text/html');
            console.log(htmlDoc)
            var test_res = htmlDoc.querySelector("div#main-content");
            if (!test_res)
                test_res = htmlDoc.querySelector("div.entry-content");
            if (!test_res)
                test_res = htmlDoc.querySelector("div.text");
            if (!test_res)
                test_res = htmlDoc.querySelector("div.post-content");
            var scrapeHTML = test_res.innerHTML;
            editor.blocks.renderFromHTML(scrapeHTML)
        });
        $('#modalTunggu').modal('show');
        console.log("Sedang memproses fetch dengan bypass policy CORS server URL yang diberikan. Proses ini berlangsung sekitar 30 detik - 1 menit.")
    } catch(err) {
        // console.log(err);
        alert("Error! Pastikan url benar dan konten dalam page berbasis Wordpress Article!")
    }
}

function checkAccessControlAllowOrigin(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('HEAD', url, false);
  try {
    xhr.send();
  } catch (e) {
    console.log('AccessControlAllowOrigin tidak diizinkan!');
  }
  let check = false;
  try {
    if (xhr.getAllResponseHeaders() != '') check = true;
    if (xhr.getAllResponseHeaders().indexOf("Access-Control-Allow-Origin") >= 0)
        check = true;
    console.log("check")
    console.log('"'+xhr.getAllResponseHeaders()+'"')
  } catch (e) {console.log(e)}
  console.log(check)
  return check;
}

function GetData()  {
    const xhr = new XMLHttpRequest;
    let urlArtikel = $("#url-artikel").val();
    let cek = checkAccessControlAllowOrigin(urlArtikel);
    if (cek) {
        xhr.open("GET", urlArtikel);
        xhr.responseType = 'document';
        xhr.onload = () => {
            if (xhr.readyState === xhr.DONE && xhr.status === 200) {
                try {
                    var XMLResult = xhr.responseXML;
                    console.log(XMLResult);
                    var test_res = XMLResult.querySelector("div#main-content");
                    if (!test_res)
                        test_res = XMLResult.querySelector("div.entry-content");
                    if (!test_res)
                        test_res = XMLResult.querySelector("div.text");
                    if (!test_res)
                        test_res = XMLResult.querySelector("div.post-content");
                    var scrapeHTML = test_res.innerHTML;
                    console.log(scrapeHTML)
                    editor.blocks.renderFromHTML(scrapeHTML)
                } catch(err) {
                    try {
                        GetDataCORSBypass(urlArtikel)
                    } catch(err) {
                        // console.log(err)
                        alert("Error! Pastikan url benar dan konten dalam page berbasis Wordpress Article!")
                    }
                }
            }
        };

        xhr.send();
    } else {
        GetDataCORSBypass(urlArtikel)
    }
}

function removeAnchorTags(text) {
  const div = document.createElement('div');
  div.innerHTML = text;
  const anchors = div.getElementsByTagName('a');
  
  for (let i = anchors.length - 1; i >= 0; i--) {
    const anchor = anchors[i];
    const content = document.createTextNode(anchor.textContent);
    anchor.parentNode.replaceChild(content, anchor);
  }

  return div.innerHTML;
}

function removeHtmlTags(text) {
  const div = document.createElement("div");
  div.innerHTML = text;
  return div.textContent || div.innerText || "";
}
  
document.querySelector("#getDataBtn").addEventListener('click', GetData);

function download(current_index) {
    var element = document.createElement('a');
    var text = document.getElementById('artikel-'+current_index).value;
    if (text != null && text && "\0" && text != "")
    {
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', 'artikel-'+(current_index+1)+'.txt');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
    else alert("Artikel spin ke-"+(current_index+1)+" belum ter-generate, mohon klik 'Generate Artikel' di atas terlebih dahulu!")
}
function download(current_index) {
    var element = document.createElement('a');
    var text = document.getElementById('artikel-'+current_index).value;
    if (text != null && text && "\0" && text != "")
    {
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', 'artikel-'+(current_index+1)+'.txt');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
    else alert("Artikel spin ke-"+(current_index+1)+" belum ter-generate, mohon klik 'Generate Artikel' di atas terlebih dahulu!")
}

function exportHTML() {
    var element = document.createElement('a');
    var text = document.getElementById('textareaConvertSplitResult').value;
    if (text != null && text && "\0" && text != "")
    {
        element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', 'artikel.html');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
    else alert("Artikel spin dalam bentuk HTML belum ter-generate, mohon klik 'Export HTML' di bawah terlebih dahulu!")
}

function AddOpenAIText(paragraph_index, sentence_index, is_mass_generate = false) {
    let current_index = paragraphs_object[paragraph_index].sentences_object[sentence_index].length_of_other_sentences;
    console.log(paragraphs_object);
    let massDeleteButton = '', massGenerateArticle = '';
    if (is_mass_generate && paragraph_index==0 && sentence_index==0) {
        massDeleteButton =`
            <button class="btn btn-sm btn-success" id="btn-generate-vertical-other-sentence-${current_index}" onclick="generateOpenAiVerticalOtherSentences('${current_index}')">Generate All Open AI</button>
            <button class="btn btn-sm btn-danger" id="btn-delete-vertical-other-sentence-${current_index}" onclick="deleteVerticalOtherSentences('${current_index}')">Close All</button>
            <br>
        `;
    }
    console.log("test: masuk di " + current_index + " - " + paragraph_index);

    if (is_mass_generate && sentence_index==totalKalimatParagrafAkhir-1 && paragraph_index==paragraphs_object.length-1) {
        console.log("masuk di " + current_index + " - " + paragraph_index);
        massGenerateArticle =`
            <center>
                <br>
                <button class="btn btn-md btn-warning" id="btn-generate-vertical-other-sentence-${current_index}" onclick="GenerateArticleColumn('${current_index}')">Generate HTML</button>
                <br><br>
                <b>Hasil Artikel ke-${current_index+1}</b>
                <textarea class="form-control" name="artikel-${current_index}" rows="10" id="artikel-${current_index}"></textarea> 
                <button class="btn btn-md btn-primary mt-2" onclick="download(${current_index})">Download Article</button>
                <button class="btn btn-md btn-primary mt-1" onclick="copyArticle(${current_index})">Copy to Clipboard</button>
            </center>
        `;
    }

    paragraphs_object[paragraph_index].sentences_object[sentence_index].length_of_other_sentences = current_index+1;
    paragraphs_object[paragraph_index].sentences_object[sentence_index].other_sentences.push('');
    paragraphs_object[paragraph_index].sentences_object[sentence_index].other_sentence_ids.push(current_index);
    result = `<div class="mt-2 p-2 sentence-item" style="background-color:#dbdbdb" id="open-ai-div-${paragraph_index}-${sentence_index}-${current_index}">
        ${massDeleteButton}
        <a>Kalimat ${sentence_index+1}</a>
        <textarea class="form-control" name="paragraph[]" rows="3" id="open-ai-text-${paragraph_index}-${sentence_index}-${current_index}" onchange="updateOtherSentence('${paragraph_index}','${sentence_index}', '${current_index}')"></textarea> 
        <center>
            <button class="btn btn-sm btn-success" onclick="GenerateOpenAI('${paragraph_index}','${sentence_index}', '${current_index}')">Generate Open AI</button>
            <button class="btn btn-sm btn-danger" onclick="DeleteTextOpenAI('${paragraph_index}','${sentence_index}', '${current_index}')">Close</button>
            <div style="display: flex; justify-content: center; align-items: center;">
                <a style="margin: 0;">Total Tokens</a>
                <div style="position: relative;">
                    <textarea class="form-control ml-1" style="resize:none; overflow: hidden; width: 100px; height: 30px; padding-top: 3px;" disabled id="open-ai-tokens-${paragraph_index}-${sentence_index}-${current_index}" onchange="updateOtherSentence('${paragraph_index}','${sentence_index}', '${current_index}')"></textarea>
                </div>
            </div>
        </center>
        ${massGenerateArticle}
    </div> `;

    $(`#section-sentence-horizontal-${paragraph_index}-${sentence_index}`).append(removeAnchorTags(result));
}

function AddOpenAIParagraph(paragraph_index, is_mass_generate = false) {
    let current_index = paragraphs_object[paragraph_index].length_of_other_paragraphs;
    console.log(paragraphs_object);
    let massDeleteButton = '', massGenerateArticle = '';
    if (is_mass_generate && paragraph_index==0) {
        massDeleteButton =`
            <button class="btn btn-sm btn-success" id="btn-generate-vertical-other-paragraph-${paragraph_index}" onclick="generateOpenAiVerticalOtherParagraphs('${current_index}')">Generate All Open AI</button>
            <button class="btn btn-sm btn-danger" id="btn-delete-vertical-other-paragraph-${paragraph_index}" onclick="deleteVerticalOtherParagraphs('${paragraph_index}')">Close All</button>
            <br>
        `;
    }
    console.log("test: masuk di " + paragraph_index);

    if (is_mass_generate && paragraph_index==paragraphs_object.length-1) {
        console.log("masuk di " + current_index + " - " + paragraph_index);
        massGenerateArticle =`
            <center>
                <br>
                <button class="btn btn-md btn-warning" id="btn-generate-vertical-other-paragraph-${current_index}" onclick="GenerateArticleColumnParagraph('${current_index}')">Generate HTML</button>
                <button class="btn btn-md btn-warning mt-1" id="btn-generate-vertical-other-paragraph-${current_index}" onclick="GenerateArticleColumnParagraphPlain('${current_index}')">Generate Plain Text</button>
                <br><br>
                <b>Hasil Artikel ke-${current_index+1}</b>
                <textarea class="form-control" name="artikel-${current_index}" rows="10" id="artikel-${current_index}"></textarea> 
                <button class="btn btn-md btn-primary mt-2" onclick="download(${current_index})">Download Article</button>
                <button class="btn btn-md btn-primary mt-1" onclick="copyArticle(${current_index})">Copy to Clipboard</button>
            </center>
        `;
    }
    paragraphs_object[paragraph_index].length_of_other_paragraphs = current_index+1;
    paragraphs_object[paragraph_index].other_paragraphs.push('');
    paragraphs_object[paragraph_index].other_paragraph_ids.push(current_index);
    result = `<div class="mt-2 p-2 sentence-item" style="background-color:#dbdbdb" id="open-ai-div-paragraph-${paragraph_index}-${current_index}">
        ${massDeleteButton}
        <a>Paragraf ${paragraph_index+1}</a>
        <textarea class="form-control" name="paragraph" rows="3" id="open-ai-paragraph-${paragraph_index}-${current_index}" onchange="updateOtherParagraph('${paragraph_index}','${current_index}')"></textarea> 
        <center>
            <button class="btn btn-sm btn-success" onclick="GenerateOpenAIParagraph('${paragraph_index}','${current_index}')">Generate Open AI</button>
            <button class="btn btn-sm btn-danger" onclick="DeleteParagraphOpenAI'${paragraph_index}', '${current_index}')">Close</button>
            <div style="display: flex; justify-content: center; align-items: center;">
                <a style="margin: 0;">Total Tokens</a>
                <div style="position: relative;">
                    <textarea class="form-control ml-1" style="resize:none; overflow: hidden; width: 100px; height: 30px; padding-top: 3px;" disabled id="open-ai-tokens-paragraph-${paragraph_index}-${current_index}" onchange="updateOtherParagraph('${paragraph_index}','${current_index}')"></textarea>
                </div>
            </div>
        </center>
        ${massGenerateArticle}
    </div> `;

    $(`#section-sentence-horizontal-paragraph-${paragraph_index}`).append(removeAnchorTags(result));
}

function AddOpenAITextHeader(paragraph_index, sentence_index, is_mass_generate = false) {
    let current_index = paragraphs_object[paragraph_index].sentences_object[sentence_index].length_of_other_sentences;
    console.log(paragraphs_object);
    let massDeleteButton = '', massGenerateArticle = '';
    if (is_mass_generate && paragraph_index==0 && sentence_index==0) {
        massDeleteButton =`
            <button class="btn btn-sm btn-success" id="btn-generate-vertical-other-sentence-${current_index}" onclick="generateOpenAiVerticalOtherSentences('${current_index}')">Generate All Open AI</button>
            <button class="btn btn-sm btn-danger" id="btn-delete-vertical-other-sentence-${current_index}" onclick="deleteVerticalOtherSentences('${current_index}')">Close All</button>
            <br>
        `;
    }
    console.log("test: masuk di " + current_index + " - " + paragraph_index);

    if (is_mass_generate && sentence_index==totalKalimatParagrafAkhir-1 && paragraph_index==paragraphs_object.length-1) {
        console.log("masuk di " + current_index + " - " + paragraph_index);
        massGenerateArticle =`
            <center>
                <br>
                <button class="btn btn-md btn-warning" id="btn-generate-vertical-other-sentence-${current_index}" onclick="GenerateArticleColumn('${current_index}')">Generate HTML</button>
                <button class="btn btn-md btn-warning mt-1" id="btn-generate-vertical-other-paragraph-${current_index}" onclick="GenerateArticleColumnParagraphPlain('${current_index}')">Generate Plain Text</button>
                <br><br>
                <b>Hasil Artikel ke-${current_index+1}</b>
                <textarea disabled class="form-control" name="artikel-${current_index}" rows="10" id="artikel-${current_index}"></textarea> 
                <button class="btn btn-md btn-primary mt-2" onclick="download(${current_index})">Download Article</button>
                <button class="btn btn-md btn-primary mt-1" onclick="copyArticle(${current_index})">Copy to Clipboard</button>
                </center>
        `;
    }

    paragraphs_object[paragraph_index].sentences_object[sentence_index].length_of_other_sentences = current_index+1;
    paragraphs_object[paragraph_index].sentences_object[sentence_index].other_sentences.push('');
    paragraphs_object[paragraph_index].sentences_object[sentence_index].other_sentence_ids.push(current_index);
    result = `<div class="mt-2 p-2 sentence-item" style="background-color:#dbdbdb" id="open-ai-div-${paragraph_index}-${sentence_index}-${current_index}">
        ${massDeleteButton}
        <a>Kalimat ${sentence_index+1}</a>
        <textarea disabled class="form-control" name="paragraph[]" rows="3" id="open-ai-text-${paragraph_index}-${sentence_index}-${current_index}" onchange="updateOtherSentence('${paragraph_index}','${sentence_index}', '${current_index}')"></textarea> 
        <center>
            <button class="btn btn-sm btn-success" onclick="GenerateOpenAI('${paragraph_index}','${sentence_index}', '${current_index}')">Generate Open AI</button>
            <button class="btn btn-sm btn-danger" onclick="DeleteTextOpenAI('${paragraph_index}','${sentence_index}', '${current_index}')">Close</button>
            <div style="display: flex; justify-content: center; align-items: center;">
                <a style="margin: 0;">Total Tokens</a>
                <div style="position: relative;">
                    <textarea disabled class="form-control ml-1" style="resize:none; overflow: hidden; width: 100px; height: 30px; padding-top: 3px;" disabled id="open-ai-tokens-${paragraph_index}-${sentence_index}-${current_index}" onchange="updateOtherSentence('${paragraph_index}','${sentence_index}', '${current_index}')"></textarea>
                </div>
            </div>
        </center>
        ${massGenerateArticle}
    </div> `;

    $(`#section-sentence-horizontal-${paragraph_index}-${sentence_index}`).append(removeAnchorTags(result));
}

function AddOpenAIParagraphHeader(paragraph_index, is_mass_generate = false) {
    let current_index = paragraphs_object[paragraph_index].length_of_other_paragraphs;
    console.log(paragraphs_object);
    let massDeleteButton = '', massGenerateArticle = '';
    if (is_mass_generate && paragraph_index==0) {
        massDeleteButton =`
            <button class="btn btn-sm btn-success" id="btn-generate-vertical-other-paragraph-${paragraph_index}" onclick="generateOpenAiVerticalOtherParagraphs('${current_index}')">Generate All Open AI</button>
            <button class="btn btn-sm btn-danger" id="btn-delete-vertical-other-paragraph-${paragraph_index}" onclick="deleteVerticalOtherParagraphs('${paragraph_index}')">Close All</button>
            <br>
        `;
    }
    console.log("test: masuk di " + paragraph_index);

    if (is_mass_generate && paragraph_index==paragraphs_object.length-1) {
        console.log("masuk di " + current_index + " - " + paragraph_index);
        massGenerateArticle =`
            <center>
                <br>
                <button class="btn btn-md btn-warning" id="btn-generate-vertical-other-paragraph-${current_index}" onclick="GenerateArticleColumnParagraph('${current_index}')">Generate HTML</button>
                <button class="btn btn-md btn-warning" id="btn-generate-vertical-other-paragraph-${current_index}" onclick="GenerateArticleColumnParagraphPlain('${current_index}')">Generate Plain Text</button>
                <br><br>
                <b>Hasil Artikel ke-${current_index+1}</b>
                <textarea disabled class="form-control" name="artikel-${current_index}" rows="10" id="artikel-${current_index}"></textarea> 
                <button class="btn btn-md btn-primary mt-2" onclick="download(${current_index})">Download Article</button>
                <button class="btn btn-md btn-primary mt-1" onclick="copyArticle(${current_index})">Copy to Clipboard</button>
            </center>
        `;
    }
    paragraphs_object[paragraph_index].length_of_other_paragraphs = current_index+1;
    paragraphs_object[paragraph_index].other_paragraphs.push('');
    paragraphs_object[paragraph_index].other_paragraph_ids.push(current_index);
    result = `<div class="mt-2 p-2 sentence-item" style="background-color:#dbdbdb" id="open-ai-div-paragraph-${paragraph_index}-${current_index}">
        ${massDeleteButton}
        <a>Paragraf ${paragraph_index+1}</a>
        <textarea disabled class="form-control" name="paragraph" rows="3" id="open-ai-paragraph-${paragraph_index}-${current_index}" onchange="updateOtherParagraph('${paragraph_index}','${current_index}')"></textarea> 
        <center>
            <button class="btn btn-sm btn-success" onclick="GenerateOpenAIParagraph('${paragraph_index}','${current_index}')">Generate Open AI</button>
            <button class="btn btn-sm btn-danger" onclick="DeleteParagraphOpenAI'${paragraph_index}', '${current_index}')">Close</button>
            <div style="display: flex; justify-content: center; align-items: center;">
                <a style="margin: 0;">Total Tokens</a>
                <div style="position: relative;">
                    <textarea disabled class="form-control ml-1" style="resize:none; overflow: hidden; width: 100px; height: 30px; padding-top: 3px;" disabled id="open-ai-tokens-paragraph-${paragraph_index}-${current_index}" onchange="updateOtherParagraph('${paragraph_index}','${current_index}')"></textarea>
                </div>
            </div>
        </center>
        ${massGenerateArticle}
    </div> `;

    $(`#section-sentence-horizontal-paragraph-${paragraph_index}`).append(removeAnchorTags(result));
}

function copyArticle($current_index) {
  // Get the text from the textarea
  var text = $('#artikel-'+$current_index).val();

  // Create a temporary textarea element to hold the text
  var temp = $('<textarea>');
  $('body').append(temp);
  temp.val(text).select();

  // Copy the text to the clipboard
  document.execCommand('copy');

  // Remove the temporary element
  temp.remove();

  // Show a success message
  alert('Berhasil melakukan copy artikel ke clipboard!');
}

function DeleteHorizontalSentence(paragraph_index, sentence_index) {
    $(`#section-sentence-horizontal-${paragraph_index}-${sentence_index}`).remove();
}

function DeleteHorizontalParagraph(paragraph_index) {
    $(`#section-sentence-horizontal-paragraph-${paragraph_index}`).remove();
}

function updateSentence() {}

function updateOtherSentence(paragraph_index, sentence_index, current_index) {
    let text =  $(`#open-ai-text-${paragraph_index}-${sentence_index}-${current_index}`).val();
    paragraphs_object[paragraph_index].sentences_object[sentence_index].other_sentences[current_index] = text;
}

function updateOtherParagraph(paragraph_index, current_index) {
    let text =  $(`#open-ai-paragraph-${paragraph_index}-${current_index}`).val();
    paragraphs_object[paragraph_index].other_paragraphs[current_index] = text;
}

function DeleteTextOpenAI(paragraph_index, sentence_index, current_index) {
    $(`#open-ai-div-${paragraph_index}-${sentence_index}-${current_index}`).remove();

    let index = paragraphs_object[paragraph_index].sentences_object[sentence_index].other_sentence_ids.findIndex(item => item == current_index);
    
    paragraphs_object[paragraph_index].sentences_object[sentence_index].other_sentences.splice(index, 1);
    paragraphs_object[paragraph_index].sentences_object[sentence_index].other_sentence_ids.splice(index, 1);
    paragraphs_object[paragraph_index].sentences_object[sentence_index].length_of_other_sentences = paragraphs_object[paragraph_index].sentences_object[sentence_index].other_sentences.length;
}

function DeleteParagraphOpenAI(paragraph_index, current_index) {
    $(`#open-ai-div-paragraph-${paragraph_index}-${current_index}`).remove();

    let index = paragraphs_object[paragraph_index].sentences_object[sentence_index].other_sentence_ids.findIndex(item => item == current_index);
    
    paragraphs_object[paragraph_index].sentences_object[sentence_index].other_sentences.splice(index, 1);
    paragraphs_object[paragraph_index].sentences_object[sentence_index].other_sentence_ids.splice(index, 1);
    paragraphs_object[paragraph_index].sentences_object[sentence_index].length_of_other_sentences = paragraphs_object[paragraph_index].sentences_object[sentence_index].other_sentences.length;
}

function GenerateArticleColumn(current_index) {
    let resultHtml = '';
    paragraphs_object.forEach((paragraph, paragraph_index) => {
        paragraph.sentences_object.forEach((sentence, sentence_index) => {
            console.log(sentence);
            resultHtml += sentence.other_sentences[current_index] + " "
        });
        resultHtml += '&#10;&#10;';
    });
    console.log(resultHtml);
    $("#artikel-"+current_index).html(resultHtml);
}

function GenerateArticleColumnParagraph(current_index) {
    let resultHtml = '';
    paragraphs_object.forEach((paragraph, paragraph_index) => {
        resultHtml += paragraph.other_paragraphs[current_index] + '&#10;&#10;';
    });
    console.log(resultHtml);
    $("#artikel-"+current_index).html(resultHtml);
}

function GenerateArticleColumnParagraphPlain(current_index) {
    let resultHtml = '';
    paragraphs_object.forEach((paragraph, paragraph_index) => {
        resultHtml += paragraph.other_paragraphs[current_index] + '&#10;&#10;';
    });
    console.log(removeHtmlTags(resultHtml));
    $("#artikel-"+current_index).html(removeHtmlTags(resultHtml));
}

function GenerateOpenAI(paragraph_index, sentence_index, current_index) {
    let instruction = $("#instruction-open-ai").val();
    let kalimat =  paragraphs_object[paragraph_index].sentences[sentence_index];
    let keyword =  $(`#open-ai-text-${paragraph_index}-${sentence_index}-${current_index}`).val();

    let apiKey = $("#api-key").val();
    LOADING.show();
    var url = "https://api.openai.com/v1/chat/completions";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer "+apiKey);

    xhr.onreadystatechange = function () {
        LOADING.hide();
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.response);

            let response = JSON.parse(xhr.response);
            if(response.choices.length < 1 ) {
                alert('Tidak ada hasil');
            }

            let result = response.choices[0].message.content.trim();
            if(!result.match(/\.$/)) {
                result = result + '.';
            }

            let tokens = response.usage.total_tokens;

            paragraphs_object[paragraph_index].sentences_object[sentence_index].other_sentences[current_index] = result;
            $(`#open-ai-text-${paragraph_index}-${sentence_index}-${current_index}`).val(result);

            totalToken += tokens;
            console.log("Total Token Updated to: ", totalToken);
            $(`#open-ai-tokens-${paragraph_index}-${sentence_index}-${current_index}`).val(tokens);

            const TOKEN_PRICE_USD = 0.002; // Harga API dalam USD per 1K token
            const TOKENS_PER_K = 1000; // Jumlah token per K

            // Menghitung biaya berdasarkan jumlah token yang digunakan
            function tokenToRupiah(numTokens) {
            const numK = numTokens / TOKENS_PER_K; // Konversi ke ribuan (K)
            const costUSD = numK * TOKEN_PRICE_USD; // Biaya dalam USD
            const costIDR = costUSD * 15500; // Konversi ke IDR (asumsi kurs 15500)
            return costIDR;
            }

            $("#total-tokens").text("Total token yang terpakai: " + totalToken);
            $("#total-tokens-to-rupiah").text("Harga yang dikeluarkan: Rp" + tokenToRupiah(totalToken).toFixed(2));
        }
    };

    let modelOpenAi = $("#model-open-ai").val();

    // var data = `{
    //     "model": "${modelOpenAi}",
    //     "input": "${kalimat}",
    //     "instruction": "${instruction} ${keyword}"
    // }`;

    let data = `{
        "model": "${modelOpenAi}",
        "messages": [{"role": "user", "content": "${instruction} ${kalimat}"}]
    }`;

    xhr.send(data);
}

function GenerateOpenAIParagraph(paragraph_index, current_index) {
    let instruction = $("#instruction-open-ai").val();
    let paragraf =  paragraphs_object[paragraph_index].paragraph_item;

    let apiKey = $("#api-key").val();
    LOADING.show();
    var url = "https://api.openai.com/v1/chat/completions";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer "+apiKey);

    xhr.onreadystatechange = function () {
        LOADING.hide();
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.response);

            let response = JSON.parse(xhr.response);
            if(response.choices.length < 1 ) {
                alert('Tidak ada hasil');
            }

            let result = response.choices[0].message.content.trim();
            if(!result.match(/\.$/)) {
                result = result + '.';
            }

            let tokens = response.usage.total_tokens;

            paragraphs_object[paragraph_index].other_paragraphs[current_index] = '<p>'+result+'</p>';
            $(`#open-ai-paragraph-${paragraph_index}-${current_index}`).val('<p>'+result+'</p>');

            totalToken += tokens;
            console.log("Total Token Updated to: ", totalToken);
            $(`#open-ai-tokens-paragraph-${paragraph_index}-${current_index}`).val(tokens);

            const TOKEN_PRICE_USD = 0.002; // Harga API dalam USD per 1K token
            const TOKENS_PER_K = 1000; // Jumlah token per K

            // Menghitung biaya berdasarkan jumlah token yang digunakan
            function tokenToRupiah(numTokens) {
                const numK = numTokens / TOKENS_PER_K; // Konversi ke ribuan (K)
                const costUSD = numK * TOKEN_PRICE_USD; // Biaya dalam USD
                const costIDR = costUSD * 15500; // Konversi ke IDR (asumsi kurs 15500)
                return costIDR;
            }

            $("#total-tokens").text("Total token yang terpakai: " + totalToken);
            $("#total-tokens-to-rupiah").text("Harga yang dikeluarkan: Rp" + tokenToRupiah(totalToken).toFixed(2));
        }
    };

    let modelOpenAi = $("#model-open-ai").val();

    let data = `{
        "model": "${modelOpenAi}",
        "messages": [{"role": "user", "content": "${instruction} ${paragraf}"}]
    }`;

    xhr.send(data);
}

function updateVariableList(idx) {
    var data = $('#variable_content_' + idx).val().split(/\r?\n/);

    console.log(data);

    var select = document.getElementById('variable_selected_' + idx);
    $('#variable_selected_' + idx).empty();

    for (var i = 0; i < data.length; i++) {
        var opt = document.createElement('option');
        opt.value = data[i];
        opt.innerHTML = data[i];
        select.appendChild(opt);
    }
}

var indexNewVariable = 0;
$("#addNewVariable").click(function () {
    indexNewVariable++;

    var input = `<div id="variableContentList` + indexNewVariable + `">
            <br>
            <input type="text" placeholder="Nama Variable" name="variable_name[]" class="variable_name">
            <textarea rows="5" placeholder="isine opo" id="variable_content_` + indexNewVariable + `" name="variable_content_` + indexNewVariable + `"
                onchange="updateVariableList(` + indexNewVariable + `)"></textarea>
            <br>
            <select multiple id="variable_selected_` + indexNewVariable + `"></select>
        </div>
        `;

    $("#variableContent").append(input);
});


$("#addNewVariableContent").click(function () {
    var input = `<div>
                <br>
                <input type="text" placeholder="Nama Variable" name="variable_name[]">
                <br>
                <textarea rows="4" placeholder="Isi variabel, pisah dengan enter"
                    name="content_name[]"></textarea>
            </div>`;

    $("#variableContentList").append(input);
});
