let data_split = [];
let paragraphs_object = [];
const LOADING = $("#loading-overlay");
LOADING.hide();
$("#model-open-ai").val('text-davinci-edit-001');
$("#instruction-open-ai").val('tulis ulang dengan mengubah struktur kalimat di atas tanpa merubah maknanya, dimulai dengan kata');

$("#btnProcessSplit").click(function () {
    let answer = window.confirm("Continue For Split this Article ? ");
    if (!answer) {
        console.log('Cancelled');
        return;
    } else {

        let article = $('#textArticle').val();
        let paragraphs = article.split(/\r?\n/);

        paragraphs_object = [];
        paragraphs.forEach((paragraph_item, paragraph_index) => {
            if (paragraph_item === '') return; 
                
            let paragraph = paragraph_item;
            let sentences = paragraph.split('. ');

            let sentences_object = [];
            sentences.forEach((sentence_item, sentence_index) => {
                sentences_object.push({
                    "sentence_index": sentence_index,
                    "sentence_item": sentence_item,
                    "length_of_other_sentences": 0,
                    "other_sentences": [],
                });
            });

            paragraphs_object.push({
                "paragraph_index": paragraph_index,
                "paragraph_item": paragraph_item,
                "length_of_sentences": sentences.length,
                "sentences_object": sentences_object,
                "sentences": sentences,
            });
        });

        console.log(paragraphs_object);
        showDataSplit();
    }

});


$("#btnGenerateOne").click(function () {
    let resultHtml = '';
    paragraphs_object.forEach((paragraph, paragraph_index) => {
        paragraph.sentences_object.forEach((sentence, sentence_index) => {
            resultHtml += sentence.length_of_other_sentences > 0 ? '{' : '';

            resultHtml += sentence.sentence_item;

            console.log(sentence);

            if (sentence.length_of_other_sentences > 0)
                sentence.other_sentences.forEach((other_sentence_item, other_sentence_index) => {
                    resultHtml += "|" + other_sentence_item;
                });

            resultHtml += sentence.length_of_other_sentences > 0 ? '} ' : '';
        });
        resultHtml += '&#10;&#10;';
    });

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


function showDataSplit() {
    paragraphs_object.forEach((paragraph, paragraph_index) => {
        let result = '';
        result += `<div class="p-2 mt-5" id="containerPerParagraph" style="width:320px; height: auto; background-color:${paragraph_index % 2 == 0 ? '#bcf4ff' : '#dbdbdb'}">
        <center><h6>Paragraph ${paragraph_index+1}</h6></center><hr>`;

        paragraph.sentences.forEach((sentence, sentence_index) => {
            result += `<div class="section-sentence-horizontal" id="section-sentence-horizontal-${paragraph_index}-${sentence_index}">`;
            result += `<div class="mt-2 p-2 sentence-item" style="background-color:#dbdbdb">
                    <a>Kalimat ${sentence_index+1}</a>
                    <textarea class="form-control" name="paragraph[]" rows="3">${sentence}</textarea>
                    <center>
                        <button class="btn btn-sm btn-info" onclick="AddOpenAIText('${paragraph_index}','${sentence_index}')">Add</button>
                    </center>
                </div> `;
            result += `</div>`;

        });
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

function AddOpenAIText(paragraph_index, sentence_index) {
    let current_index = paragraphs_object[paragraph_index].sentences_object[sentence_index].length_of_other_sentences;
    paragraphs_object[paragraph_index].sentences_object[sentence_index].length_of_other_sentences = current_index+1;
    paragraphs_object[paragraph_index].sentences_object[sentence_index].other_sentences.push('');
    console.log(current_index);
    result = `<div class="mt-2 p-2 sentence-item" style="background-color:#dbdbdb" id="open-ai-div-${paragraph_index}-${sentence_index}-${current_index}">
        <a>Kalimat ${sentence_index+1}</a>
        <textarea class="form-control" name="paragraph[]" rows="3" id="open-ai-text-${paragraph_index}-${sentence_index}-${current_index}"></textarea> 
        <center>
            <button class="btn btn-sm btn-success" onclick="GenerateOpenAI('${paragraph_index}','${sentence_index}', '${current_index}')">Generate Open AI</button>
            <button class="btn btn-sm btn-danger" onclick="DeleteTextOpenAI('${paragraph_index}','${sentence_index}', '${current_index}')">Close</button>
        </center>
    </div> `;

    $(`#section-sentence-horizontal-${paragraph_index}-${sentence_index}`).append(result);
}

function DeleteTextOpenAI(paragraph_index, sentence_index, current_index) {
    $(`#open-ai-div-${paragraph_index}-${sentence_index}-${current_index}`).remove();
    console.log(paragraphs_object[paragraph_index].sentences_object[sentence_index].other_sentences);
    paragraphs_object[paragraph_index].sentences_object[sentence_index].other_sentences.splice(current_index, 1);
    paragraphs_object[paragraph_index].sentences_object[sentence_index].length_of_other_sentences = paragraphs_object[paragraph_index].sentences_object[sentence_index].other_sentences.length;
}

function GenerateOpenAI(paragraph_index, sentence_index, current_index) {
    let instruction = $("#instruction-open-ai").val();
    let kalimat =  paragraphs_object[paragraph_index].sentences[sentence_index];
    let keyword =  $(`#open-ai-text-${paragraph_index}-${sentence_index}-${current_index}`).val();

    let apiKey = $("#api-key").val();
    LOADING.show();
    var url = "https://api.openai.com/v1/edits";

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

            let result = response.choices[0].text;
            paragraphs_object[paragraph_index].sentences_object[sentence_index].other_sentences[current_index] = result;
            $(`#open-ai-text-${paragraph_index}-${sentence_index}-${current_index}`).val(result);

        }
    };

    let modelOpenAi = $("#model-open-ai").val();

    var data = `{
        "model": "${modelOpenAi}",
        "input": "${kalimat}",
        "instruction": "${instruction} ${keyword}"
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
