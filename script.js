let messagesElement;
let messages = [];

window.onload = function() {
    console.log('Скрипты подключены');
    messagesElement = document.getElementById("messages");
    let submit = document.getElementById("submit");
    let textInput = document.getElementById("text");
    let smileButton = document.getElementById("smile-button");
    let smiles = document.getElementById("smiles");
    submit.onclick = function() {
        let text = textInput.value;
        if (text) {
            messages.push({
                text,
                author: 'me'
            });
            updateMessageList();
            robotAnswer(text);
            textInput.value = "";
            textInput.focus();
        }
    }
    textInput.onkeydown = function(event) {
        if (event.key === 'Enter') {
            submit.click();
        }
    }
    closeSmiles();
    smileButton.onclick = toggleSmiles;
    for (let i = 0; i < smiles.children.length; i++) {
        smiles.children[i].onclick = () => {
            textInput.value += smiles.children[i].innerText;
            closeSmiles();
        }
    }
}

const context = {
    // сюда будет сохраняться контекст беседы, факты
}

const scenario = [
    {include: "мое имя", useContext: (message) => {
        let name = message.split("мое имя")[1];
        context.clientName = name; // сохраняем имя клиента в контекст
        return "Хорошо, я запомню";
    }},
    {include: "как меня зовут", useContext: () => {
        if (context.clientName) { //достаем имя из контекста, если оно там есть
            return "Ваз зовут " + context.clientName; 
        } else {
            return "Я не знаю, вы еще не представились";
        }
    }},
    {include: "привет", answer: "И вам доброго дня! О чем поговорим?"},
    {include: "как дела", answer: "Зарплата хорошая. Маленькая, но хорошая."},
    {include: "как ты выглядишь", answer: "Вот моя фотка", image: "images/ava.jpg"},
    {include: "спой песенку", answer: "Пожалуйста", audio: "audio/music.mp3"},
    {include: "", answer: "К такому разговору меня жизнь не готовила"}
];

function robotAnswer(text) {
    setTimeout(() => {
        for (let s of scenario) {
            if (text.toLowerCase().includes(s.include)) {
                if (s.useContext) {
                    messages.push({
                        text: s.useContext(text),
                        author: "robot",
                        image: s.image,
                        audio: s.audio
                    });
                } else {
                    messages.push({
                        text: s.answer,
                        author: "robot",
                        image: s.image,
                        audio: s.audio
                    });
                }
                break;
            }
        }
        updateMessageList();
    }, 1000) // типа думает секунду
}

function updateMessageList() {
    messagesElement.innerText = "";
    messages.forEach(m => {
        if (m.author === "me") {
            let div = document.createElement("div");
            div.classList.add("message");
            div.innerHTML = m.text;
            messagesElement.appendChild(div);
        } else {
            let div = document.createElement("div");
            div.classList.add("message");
            div.classList.add("answer");
            if (m.image) {
                let img = new Image();
                img.src = m.image;
                img.classList.add("image");
                div.appendChild(img);
            }
            if (m.audio) {
                let audio = document.createElement("audio");
                audio.src = m.audio;
                audio.setAttribute("controls", "");
                div.appendChild(audio);
            }
            if (m.text) {
                let span = document.createElement("span");
                span.innerText = m.text;
                div.appendChild(span);
            }
            messagesElement.appendChild(div);
        }
    });
    updateScroll();
}


function updateScroll(){
    var element = document.getElementById("messages");
    element.scrollTop = element.scrollHeight;
}

function toggleSmiles() {
    if (document.getElementById("smiles").style.display === "none") {
        document.getElementById("smiles").style.display = "flex";
    } else {
        document.getElementById("smiles").style.display = "none";
    }
    
}

function closeSmiles() {
    document.getElementById("smiles").style.display = "none";
}