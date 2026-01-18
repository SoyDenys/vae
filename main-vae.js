document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById('teamGrid');

    items.forEach(item => {
        const link = document.createElement('a');
        // link.href = `#${item.name.replace(/\s+/g, '')}`;
        link.className = 'link-card';
        link.setAttribute('onclick', `searchPage('${item.name.replace(/\s+/g, '')}')`);

        const member = document.createElement('div');
        member.className = 'team-member glass';

        const avatar = document.createElement('div');
        avatar.className = 'team-avatar';
        avatar.textContent = item.emoji;

        const title = document.createElement('h3');
        title.className = 'text-tarnsform-h3';
        title.textContent = item.name;

        member.appendChild(avatar);
        member.appendChild(title);
        link.appendChild(member);
        container.appendChild(link);
    });

});

// чтобы не было ошибки, если showPage ещё не написан

let category;

function searchPage(categoryName) {
    let page = document.getElementById(categoryName);

    // Ищем раздел с такими данными
    category = items.find(item =>  `${item.name.replace(/\s+/g, '')}` === categoryName);

    if (!category) {
        console.error("Категория не найдена:", categoryName);
        return;
    }

    // Если страница уже существует → просто показать её
    if (page) {
        showPage(categoryName);
        return;
    }

    let buttonsPlay = 0;

    // <a class="cta-button" onclick="nuwGame('${categoryName}')"><img src="img/ico/Escribir.png" class="ico-jugar">ESCRIBIR</a>

    category.words.forEach(wordObj => {if(wordObj.audio){ buttonsPlay = buttonsPlay + 1; }});
    // --- Создаём страницу ---
    page = document.createElement("div");
    page.id = categoryName;
    page.className = "page";

    page.innerHTML = `
        <div class="container">
            <div class="content-wrapper">
                <section class="team-section hero glass section-menu">
                    <h2>${category.name.toUpperCase()}</h2>
                    <a class="cta-button" onclick="nuwGame('${categoryName}')"><img src="img/ico/Pruebas.png" class="ico-jugar">PRUEBAS</a>
                    ${buttonsPlay >= 3 ? `<a class="cta-button" onclick="startEscuchar()"><img src="img/ico/Escuchar.png" class="ico-jugar">ESCUCHAR</a>` : ``}
                </section>
                    <div class="team-grid" id="${categoryName}-grid"></div>
                
            </div>
        </div>
    `;

    document.body.appendChild(page);

    // --- Заполняем блоки слов ---
    const grid = document.getElementById(`${categoryName}-grid`);


    category.words.forEach(wordObj => {
        const card = document.createElement("a");
        card.classList.toggle('cursor-none', !wordObj.audio);
        if(wordObj.audio){
            card.addEventListener('click', () => { playAudio(wordObj.audio)});
        }
        
        // card.className = "team-member glass";

        card.innerHTML = `
            <div class="team-member glass">
            <img class="img-palabras" src="${wordObj.img}">
            <h3 class="el-palabra">${wordObj.word}</h3>
            ${wordObj.transcript ? `<h4 class="transcript">${wordObj.transcript}</h4>` : ``}</div>`;

        grid.appendChild(card);
    });

    // Теперь можно показывать страницу
    showPage(categoryName);
}


// GAME

var wordRight = "";

function getRandomWord(categoryName) {
    


    if (!category || !category.words?.length) {
        console.error("Категория пуста или не найдена:", categoryName);
        return null;
    }

    const filteredWords = category.words.filter(
        item => item.word !== wordRight.word
    );

    if (filteredWords.length === 0) {
        console.warn("Нет слов, отличных от wordRight");
        return null;
    }

    const randIndex = Math.floor(Math.random() * filteredWords.length);
    return filteredWords[randIndex];
}



var wordOne;
var wordTwo;

let gameTema;

const buttons = [
  document.getElementById('btn1'),
  document.getElementById('btn2'),
  document.getElementById('btn3')
];

function secondWord(categoryName, comand){
    let wordSecond = getRandomWord(categoryName).word;
    if (comand == '1'){
        if (wordSecond != wordRight.word){
            wordOne = wordSecond;
            secondWord(categoryName, "2");
        }
        else{
            secondWord(categoryName, "1");
        }
    }
    else if(comand == '2'){
        if (wordSecond != wordRight.word && wordSecond != wordOne){
            wordTwo = wordSecond;
        }
        else{
            secondWord(categoryName, "2");
        }
    }
}

function gameRandomWord(categoryName){
    let randomWord = getRandomWord(categoryName)
    wordRight = randomWord;
    document.getElementById('imgJugar').src = randomWord.img;

    secondWord(categoryName, "1");

    let values = [wordRight.word, wordOne, wordTwo];
    
    // перемешиваем значения
    shuffle(values);

    // распределяем
    buttons.forEach((btn, i) => {btn.textContent = values[i];});
}

let audioYes = new Audio('audio/sí.ogg');
let audioNo = new Audio('audio/no.mp3');

// перемешиваем массив Фишер–Йетс алгоритмом
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


// навешиваем обработчики
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("wrong") || btn.classList.contains("correct")){return;}
    // проверяем содержимое кнопки
    if (btn.textContent === wordRight.word) {
      document.getElementById('btn-next').classList.remove("none");
      btn.classList.add("correct");   // если правильно
        audioYes.currentTime = 0;
        audioYes.play();
        if (wordRight.audio){
            let timeOutAudio = wordRight.audio;
            setTimeout(() => {
                    let wordAudio = new Audio(timeOutAudio);
                    wordAudio.currentTime = 0;
                    wordAudio.play(); 
            }, 500);
        };
        
      buttons.forEach(btn => {
        if (btn.textContent != wordRight.word){btn.classList.add("none");}});
    } else {
      btn.classList.add("wrong");     // если неправильно (опционально)
      audioNo.currentTime = 0;
      audioNo.play();
    }
  });
});

document.getElementById('btn-next').addEventListener("click", () => {
    document.getElementById('btn-next').classList.add("none");
    buttons.forEach(btn => {btn.classList.remove("wrong", "correct", "none");});
    gameRandomWord(gameTema);
});

function clianPruebas(){
    document.getElementById('btn-next').classList.add("none");
    buttons.forEach(btn => {btn.classList.remove("wrong", "correct", "none");});
}


function nuwGame (tema){
    gameTema = tema;
    clianPruebas();
    gameRandomWord(gameTema);
    showPage('game');
}

function startEscuchar (){
    clianEscuchar();
    showPage('escuchar');
    escucharPalabras(category.name);
    
}

function playAudio(path){
    let audioPath = new Audio(path);
    audioPath.currentTime = 0;
    audioPath.play();
}

let revolver = false;
let pausa = false;

function escucharMenuBatton(comand){
    if (comand.id == "pausa"){
        document.getElementById(comand.id).classList.add("none");
        document.getElementById("reproducir").classList.remove("none");
        pausa = true;

    } else if (comand.id == "reproducir"){
        document.getElementById(comand.id).classList.add("none");
        document.getElementById("pausa").classList.remove("none");
        pausa = false;
        escucharPalabras(category.name);

    } else if (comand.id == "no-revolver"){
        document.getElementById(comand.id).classList.add("none");
        document.getElementById("revolver").classList.remove("none");

        revolver = true;   // ➡️ обычный порядок
        toggleRevolver();

    } else if (comand.id == "revolver"){
        document.getElementById(comand.id).classList.add("none");
        document.getElementById("no-revolver").classList.remove("none");

        revolver = false;    // 🔀 случайный порядок
        toggleRevolver();
    }
}


let escucharIndex = 0;
let escucharOrder = [];
let escucharTimeout = null;
let escucharCategory = null;
let escucharCurrentWordIndex = null; // индекс слова в category.words


function detenerEscuchar() {
    if (escucharTimeout) {
        clearTimeout(escucharTimeout);
        escucharTimeout = null;
    }
}


function reconstruirOrden(words, currentIndex, random) {
    let order = words.map((_, i) => i);

    if (random) {
        order = order.filter(i => i !== currentIndex);
        shuffle(order);
        order.unshift(currentIndex);
    }

    return order;
}


// function toggleRevolver() {
//     if (!escucharCategory || escucharCurrentWordIndex === null) return;

//     // пересобираем порядок с учётом режима
//     escucharOrder = reconstruirOrden(
//         escucharCategory.words,
//         escucharCurrentWordIndex,
//         revolver
//     );

//     // находим позицию текущего слова в новом порядке
//     let pos = escucharOrder.indexOf(escucharCurrentWordIndex);

//     // 🔑 Чтобы не повторять текущее слово, идём на следующий
//     escucharIndex = (pos + 1) % escucharOrder.length;
// }


function toggleRevolver() {
    if (!escucharCategory || escucharCurrentWordIndex === null) return;

    // ⛔ ОЧЕНЬ ВАЖНО
    detenerEscuchar();

    escucharOrder = reconstruirOrden(
        escucharCategory.words,
        escucharCurrentWordIndex,
        revolver
    );

    const pos = escucharOrder.indexOf(escucharCurrentWordIndex);
    escucharIndex = (pos + 1) % escucharOrder.length;

    // ▶️ запускаем дальше вручную
    escucharPalabras(category.name);
}

let lastPlayedIndex = null;


function escucharPalabras(categoryName) {
    // режим "escuchar" должен быть активен
    if (!document.getElementById("escuchar")?.classList.contains("active")) {
        detenerEscuchar();
        return;
    }

    // если уже запущено — не запускаем повторно
    if (escucharTimeout) return;

    // инициализация категории
    if (!escucharCategory || escucharCategory.name !== categoryName) {
        escucharCategory = items.find(item => item.name === categoryName);

        if (!escucharCategory || !escucharCategory.words?.length) {
            console.error("Категория не найдена:", categoryName);
            return;
        }

        escucharCurrentWordIndex = 0;
        escucharIndex = 0;
        escucharOrder = reconstruirOrden(
            escucharCategory.words,
            escucharCurrentWordIndex,
            revolver
        );
    }

    function playNext() {
        // режим выключен
        if (!document.getElementById("escuchar")?.classList.contains("active")) {
            detenerEscuchar();
            return;
        }

        // пауза
        if (pausa) {
            escucharTimeout = null;
            return;
        }

        let wordIndex = escucharOrder[escucharIndex];
        escucharCurrentWordIndex = wordIndex;

        // ⛔ защита от повтора того же слова
        if (wordIndex === lastPlayedIndex) {
            escucharIndex = (escucharIndex + 1) % escucharOrder.length;
            wordIndex = escucharOrder[escucharIndex];
        }

        lastPlayedIndex = wordIndex;
        escucharCurrentWordIndex = wordIndex;

        const wordObj = escucharCategory.words[wordIndex];

        // ⬇️ ОСТАВЛЕНО ТОЧНО КАК ТЫ ПРОСИЛ
        if (wordObj.img) {
            document.getElementById('img-escuchar').src = wordObj.img;
        }

        if (wordObj.word) {
            document.getElementById('text-escuchar').textContent = wordObj.word;
        }

        let delay = 2000;

        if (wordObj.audio) {
            const audio = new Audio(wordObj.audio);
            audio.onloadedmetadata = () => {
                delay = (audio.duration * 1000) + 1000;
            };
            audio.play().catch(() => {});
        }

        escucharIndex++;

        // зацикливание
        if (escucharIndex >= escucharOrder.length) {
            escucharIndex = 0;
            escucharOrder = reconstruirOrden(
                escucharCategory.words,
                escucharCurrentWordIndex,
                revolver
            );
        }

        escucharTimeout = setTimeout(() => {
            escucharTimeout = null;
            playNext();
        }, delay);
    }

    playNext();
}


function clianEscuchar(){
    revolver = false;
    pausa = false;
    document.getElementById("pausa").classList.remove("none");
    document.getElementById("no-revolver").classList.remove("none");
    document.getElementById("reproducir").classList.add("none");
    document.getElementById("revolver").classList.add("none");

}