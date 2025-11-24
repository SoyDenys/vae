document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById('teamGrid');

    items.forEach(item => {
        const link = document.createElement('a');
        link.href = `#${item.name}`;
        link.className = 'link-card';
        link.setAttribute('onclick', `searchPage('${item.id}')`);

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
function showPage(x) {
    console.log("showPage:", x);
}

function searchPage(categoryName) {
    let page = document.getElementById(categoryName);

    // Ищем раздел с такими данными
    const category = items.find(item => item.id === categoryName);

    if (!category) {
        console.error("Категория не найдена:", categoryName);
        return;
    }

    // Если страница уже существует → просто показать её
    if (page) {
        showPage(categoryName);
        return;
    }

    // --- Создаём страницу ---
    page = document.createElement("div");
    page.id = categoryName;
    page.className = "page";

    page.innerHTML = `
        <div class="container">
            <div class="content-wrapper">
                <section class="team-section hero glass section-menu">
                    <h2>${category.name.toUpperCase()}</h2>
                    <a href="#juego" class="cta-button" onclick="nuwGame('${categoryName}')">Jugar</a>
                </section>
                    <div class="team-grid" id="${categoryName}-grid"></div>
                
            </div>
        </div>
    `;

    document.body.appendChild(page);

    // --- Заполняем блоки слов ---
    const grid = document.getElementById(`${categoryName}-grid`);

    category.words.forEach(wordObj => {
        const card = document.createElement("div");
        card.className = "team-member glass";

        card.innerHTML = `
            <img class="img-palabras" src="${wordObj.img}">
            <h3 class="el-palabra">${wordObj.word}</h3>
        `;

        grid.appendChild(card);
    });

    // Теперь можно показывать страницу
    showPage(categoryName);
}


// GAME

function getRandomWord(categoryName) {
    // находим категорию
    const category = items.find(item => item.id === categoryName);

    if (!category) {
        console.error("Такой категории нет:", categoryName);
        return null;
    }

    const list = category.words;

    if (!list || list.length === 0) {
        console.error("Нет слов в категории:", categoryName);
        return null;
    }

    // рандомный индекс
    const randIndex = Math.floor(Math.random() * list.length);

    // возвращаем объект { word: "...", img: "..." }
    return list[randIndex];
}

var wordRight;
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
        if (wordSecond != wordRight){
            wordOne = wordSecond;
            secondWord(categoryName, "2");
        }
        else{
            secondWord(categoryName, "1");
        }
    }
    else if(comand == '2'){
        if (wordSecond != wordRight && wordSecond != wordOne){
            wordTwo = wordSecond;
        }
        else{
            secondWord(categoryName, "2");
        }
    }
}

function gameRandomWord(categoryName){
    let randomWord = getRandomWord(categoryName)
    wordRight = randomWord.word;
    document.getElementById('imgJugar').src = randomWord.img;

    secondWord(categoryName, "1");

    let values = [wordRight, wordOne, wordTwo];

    console.log(values)
    
    // перемешиваем значения
    shuffle(values);

    // распределяем
    buttons.forEach((btn, i) => {btn.textContent = values[i];});

    
    console.log(wordRight)
}


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
    // проверяем содержимое кнопки
    if (btn.textContent === wordRight) {
      document.getElementById('btn-next').classList.remove("none");
      btn.classList.add("correct");   // если правильно
      buttons.forEach(btn => {
        if (btn.textContent != wordRight)
            btn.classList.add("none");
      });
    } else {
      btn.classList.add("wrong");     // если неправильно (опционально)
    }
  });
});


// function checkWord(checkbtn){
//     if (checkbtn.textContent == wordRight)
// }

document.getElementById('btn-next').addEventListener("click", () => {
    document.getElementById('btn-next').classList.add("none");
    buttons.forEach(btn => {btn.classList.remove("wrong", "correct", "none");});
    gameRandomWord(gameTema);
});


function nuwGame (tema){
    gameTema = tema;
    gameRandomWord(gameTema);
    showPage('game');
}
