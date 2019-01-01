'use strict';
const btn = document.querySelector('.btn');
const cardTable = document.querySelector('.game__container');
const backCardImg = `https://via.placeholder.com/160x195/30d9c4/ffffff/?text=ADALAB`;
let cardElement = document.querySelectorAll('.card__element');
let firstCard = '';
let firstCardClicked = '';

//LS: 1. generate key. 2. assign to a var getItem method plus create empty element;
const CARDS_LS_KEY = 'cards';
let cardsNumber = JSON.parse(localStorage.getItem(CARDS_LS_KEY)) || '';
//3. To set items, retrieve key and convert to string cardsNumbers. This especimen will be retrieved from handleAPI function, where the cardNumber is taken from inputs and then updated(set to LS);
function updateLS(){
  localStorage.setItem(CARDS_LS_KEY, JSON.stringify(cardsNumber));
}

//Retrieve last input checked. 1. select input by its value (defined at LS). 2. then check if checked = true. 3. init function when open window.


function getInputValue(){
  let inputValue = document.querySelector(`input[name="form__input"][value="${cardsNumber}"]`);
  inputValue.checked = true;
}
getInputValue();
//helpers handleAPI

const handleResponse = response => {
  if(!response.ok){
    throw response;
  }
  return response.json();
};

const dealCards = cards => {
  cardTable.innerHTML = '';
  for(let i = 0; i < cards.length; i++){
    const liCards = document.createElement('li');
    liCards.classList.add('card__element');
    const src = cards[i].image;
    const imgCard = document.createElement('img');
    imgCard.classList.add('front', 'hidden');
    imgCard.setAttribute('src', src);
    const idImg = cards[i].pair;
    imgCard.setAttribute('id', idImg);

    const imgCardBack = document.createElement('img');
    imgCardBack.classList.add('back');
    imgCardBack.setAttribute('src', `${backCardImg}`);
    liCards.appendChild(imgCard);
    liCards.appendChild(imgCardBack);
    cardTable.appendChild(liCards);
  }
  cardElement = document.querySelectorAll('.card__element');
  addEventListenerToList(cardElement);

};

//Get both images from event. Retrieve Nodelist with two elements. Go through them by [x] and toggle class;
function handleCards(event){
  const cardsSelected = event.currentTarget;
  const imgsFromLi = cardsSelected.querySelectorAll('img');
  toggleCards(imgsFromLi);
  checkCards(imgsFromLi);

}

function toggleCards(imgsArray) {
  imgsArray[0].classList.toggle('hidden');
  imgsArray[1].classList.toggle('hidden');
}


//create const function to set Timeout in checkCards
function delayCardsToggle(imgsArray) {
  toggleCards(imgsArray);
  toggleCards(firstCardClicked);
}


function checkCards(imgsArray) {
  const cardId = imgsArray[0].id;
  if (!firstCard) {
    firstCard = cardId;
    firstCardClicked = imgsArray;
  }
  else if (firstCard !== cardId){
    firstCard = '';
    // toggleCards(imgsArray);
    // toggleCards(firstCardClicked);
    const timeOutVar = setTimeout(delayCardsToggle(imgsArray), 2000);
    timeOutVar;
  }
  else {
    firstCard = '';
    firstCardClicked = '';
  }
}




//add event listener to elements of List
function addEventListenerToList(cardElement){
  for(const el of cardElement){
    el.addEventListener('click', handleCards);
  }
}


function handleAPI(){
  cardsNumber = document.querySelector('input[name="form__input"]:checked').value;
  updateLS();
  const API = `https://raw.githubusercontent.com/Adalab/cards-data/master/${cardsNumber}.json`;
  fetch(API)
    .then(handleResponse)
    .then(dealCards);
}



btn.addEventListener('click', handleAPI);
