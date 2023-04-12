(() => {
  // create control elements
  const listCards = document.querySelector('.list')
  const timerShow = document.querySelector('.timer-show');
  const inp = document.querySelector('.input');
  const setBtn = document.querySelector('.set-cards');
  const restartBtn = document.querySelector('.restart-btn');
  const repeatGame = document.querySelector('.repeat-game');
  const winner = document.querySelector('.winner');
  const loser = document.querySelector('.loser');

  //create supporting elements
  let getData = [];
  let timerIsActive = true;
  let cards = null;
  let interval = null;
  timerShow.textContent = 60;

  //this function defines the amount of cards, default amount = 4, 'let a' is necesary to renew array every time
  function setCards() {
    let inpVal = inp.value;
    let a = [];
    if ((inpVal > 0) && (inpVal <= 16) && (inpVal % 2 === 0)) {
      for (let i = 1; i <= inpVal / 2; i++) {
        a.push(String(i));
        a.push(String(i));
      }
    } else {
      a = ['1', '1', '2', '2'];
    }
    getData = a;
  }

  // shuffle function returns shuffled array
  function randomize() {
    const cardData = getData;
	  for(let i = cardData.length - 1; i > 0; i--){
	  	let j = Math.floor(Math.random() * (i + 1));
      [cardData[i], cardData[j]] = [cardData[j], cardData[i]];
	  }
    return cardData;
  }

  // set timer function. Timer starts when you choose a number of cards
  function startTimer() {
    clearInterval(interval)
    timerIsActive = true;
    interval = setInterval(timer, 1000);
    for (let card of cards) {
      card.addEventListener('click', (elem) => {
        checkCards(elem);
      })
    }
  }

  function timer() {
    if (timerShow.textContent > 0 && timerIsActive === true) {
      timerShow.textContent -= 1;
    }
  // lose condition (when time is over)
    else {
      clearInterval(interval);
      timerIsActive = false;
      timerShow.textContent = ':(';
      if(timerIsActive === false && timerShow.textContent === ':(') {
        restartBtn.classList.add('active-btn');
        repeatGame.classList.add('active-btn');
        loser.classList.add('animate__backInLeft', 'active-disp');
        for (let card of cards) {
          card.classList.remove('toggle-card', 'matched');
          card.style.pointerEvents = 'none';
        }
      }
    }
  }

  // create a card
  function cardGenerator() {
    setCards(); // define number of created cards
    const cardData = randomize();
    for (let i = 0; i < cardData.length; ++i) {
      const card = document.createElement('li');
      const face = document.createElement('div');
      const back = document.createElement('div');
      card.classList.add('card');
      face.classList.add('face');
      back.classList.add('back');
      listCards.append(card);
      card.append(face);
      card.append(back);
      card.setAttribute('name', (cardData[i])); // set name = back - matches up with back
      back.textContent = cardData[i]; //add info to the back = name - matches up with card name
    }
    if (cardData.length >= 2) {
      setBtn.disabled = true;
    }
    cards = document.querySelectorAll('.card');
    return cards;
  };

  //game logic
  function checkCards(e) {
    const clickedCard = e.target
    clickedCard.classList.add('flipped');
    const flippedCards = document.querySelectorAll('.flipped');

    //set additional const
    let clicable = true;
    let first = null;
    let second = null;

    flippedCards.forEach((card, index) => {
      if (clicable === true && !card.classList.contains('matched') && flippedCards.length === 2) card.classList.add('toggle-card');

      // you can't click other card when 2 card already clicked because of this condition
      if (first === null) first = index;
      else {
        if (index !== first) {
          second = index;
          clicable = false;
        }
      }

      //now what happens if names are matched or if they aren't
      if (first !== null && second !== null && first !== second) {
        const name1 = flippedCards[0].getAttribute('name');
        const name2 = flippedCards[1].getAttribute('name')
        if (name1 === name2 ) {
          flippedCards[0].classList.remove('flipped');
          flippedCards[1].classList.remove('flipped');
          console.log('matched');
          setTimeout(() => {
            flippedCards[0].classList.add('matched');
            flippedCards[1].classList.add('matched');
          }, 100);
            first = null;
            second = null;
            clicable = true;
        } else  {
          console.log('wrong!');
          flippedCards[0].classList.remove('flipped');
          flippedCards[1].classList.remove('flipped');
          setTimeout(() => {
            flippedCards[0].classList.remove('toggle-card');
            flippedCards[1].classList.remove('toggle-card');
          }, 500);
            first = null;
            second = null;
            clicable = true;
        }
      }
    })
  //win condition depends on 2 arrays and timer
    const matchedCards = document.querySelectorAll('.matched');
    const toggledCards = document.querySelectorAll('.toggle-card');
    if (matchedCards.length === getData.length - 2 &&
        toggledCards.length === getData.length &&
        timerShow.textContent !== ':('
        )
        {
        clearInterval(interval);
        timerShow.textContent = 60;
        setBtn.disabled = 'false';
        setTimeout(() => {
          winner.classList.add('animate__backInLeft', 'active-disp');
          restartBtn.classList.add('active-btn');
          repeatGame.classList.add('active-btn');
        }, 500);
        }
  } // end of the game logic

  // btn for restart game with a new amount of cards
  restartBtn.addEventListener('click', () => {
    const cardData = randomize();
    for (let i = 0; i < cardData.length; i++) {
      setTimeout(() => cards[i].remove(), 500)
    }
    setBtn.disabled = false;
    timerShow.textContent = 60;
    inp.value = '';
    inp.disabled = false;
    restartBtn.classList.remove('active-btn');
    repeatGame.classList.remove('active-btn');
    setTimeout(() => winner.classList.remove('active-disp', 'animate__backInLeft'), 500);
    setTimeout(() => loser.classList.remove('active-disp', 'animate__backInLeft'), 500);
  })

  // btn for repeat game without a timer with the same amount of cards
  repeatGame.addEventListener('click', () => {
    const cardData = randomize();
    const backs = document.querySelectorAll('.back');
    for (let i = 0; i < cardData.length; i++) {
      cards[i].classList.remove('toggle-card');
      cards[i].classList.remove('matched');
      setTimeout(() => backs[i].textContent = cardData[i], 1000);
      cards[i].setAttribute('name', (cardData[i]));
      cards[i].style.pointerEvents = 'all';
    }
    timerShow.innerHTML = '&#128579;';
    setBtn.disabled = true;
    inp.disabled = true;
    restartBtn.classList.remove('active-btn');
    repeatGame.classList.remove('active-btn');
    setTimeout(() => winner.classList.remove('active-disp', 'animate__backInLeft'), 500);
    setTimeout(() => loser.classList.remove('active-disp', 'animate__backInLeft'), 500);
  })

  document.addEventListener("DOMContentLoaded", () => {
    setBtn.addEventListener('click', cardGenerator);
    setBtn.addEventListener('click', startTimer);
  })
})();













