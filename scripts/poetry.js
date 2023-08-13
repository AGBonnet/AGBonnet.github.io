const poemContainer = document.getElementsByClassName('poetry-container')[0];
const words = document.getElementsByClassName('word');
const poetryButtons = document.querySelector('.poetry-buttons');
const memoryPalaceButton = document.getElementById('memory-palace-button');
const fauneButton = document.getElementById('faune-aux-jumelles-button');
const poemContent = document.getElementById('poem');
let prevScrollPos = 0;
const timeFade = 3;
let poemDisplayed = false;
let embeddings; 
let timerId = null; 
const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

let buttonClicked = false;
const headerMenu = document.querySelector('.header-menu');
const headerThreshold = 100;
let headerMenuHidden = false;

// Function to hide the header menu
function hideHeaderMenu() {
    headerMenu.classList.add('hidden');
    headerMenuHidden = true;
}
  
// Function to show the header menu
function showHeaderMenu() {
    headerMenu.classList.remove('hidden');
    headerMenuHidden = false;
}


function handleMouseMove(event) {
    const mouseY = event.clientY;
    if (buttonClicked) {
      if (mouseY <= headerThreshold && headerMenuHidden) {
        showHeaderMenu();
      } else if (mouseY > headerThreshold && !headerMenuHidden) {
        hideHeaderMenu();
      }
    }
  }

  
function loadPoemContent(url) {
    prevScrollPos = 0; 
    poemContainer.scrollTop = 0; 
    fetch(url)
        .then(response => response.text())
        .then(data => {
        poemContent.innerHTML = data;
        })
        .catch(error => {
        console.error('Error loading poem content:', error);
        });
}

function showPoem() {
    fetch('../embeddings.json')
    .then((response) => response.json())
    .then((data) => {
        embeddings = data;
        setAvailableWords(); // Set the initial "available" words

        // add events listeners for all title words
        const titleWords = document.getElementsByClassName('title-word-interactive');
        for (let i = 0; i < titleWords.length; i++) {
            titleWords[i].addEventListener('click', function() {
                buttonClicked = true;
                if (!headerMenuHidden && !isMobileDevice) {
                    hideHeaderMenu();
                }
            });
            titleWords[i].addEventListener('click', showNextStanza);
        }
        document.addEventListener('scroll', setAvailableWords); 
    });
}

function clean(word) {
    return word.replace(/[^0-9a-z—-]/gi, '').toLowerCase();
}

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function dotProduct(a, b) {
    if (a.length !== b.length) {
      throw new Error('Array lengths must match');
    }
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result += a[i] * b[i];
    }
    return result;
}

// Function to compute the appearance times for words in the next stanza
function computeAppearanceTimes(root, words) {
    var rootEmbedding = embeddings[clean(root)];
    if ((rootEmbedding.slice(0, 50)).every((val, x, y) => val === 0)) {
        const randIdx = Math.floor(Math.random()*Object.keys(embeddings).length);
        root = Object.keys(embeddings)[randIdx];
        rootEmbedding = embeddings[clean(root)];
    }
    const similarities = {};
    unknown_words = [];
    for (let i = 0; i < words.length; i++) {
        const word = words[i].textContent;
        try {
            const wordEmbedding = embeddings[clean(word)];
            const similarity = dotProduct(rootEmbedding, wordEmbedding);
            similarities[word] = 1-Math.abs(similarity);
        }
        catch (error) {
            unknown_words.push(word);
        }
    }
    const max_sim = Math.max(...Object.values(similarities));
    const min_sim = Math.min(...Object.values(similarities));
    const times = {}
    for (let word in similarities) {
        times[word] = timeFade * (similarities[word] - min_sim) / (max_sim - min_sim);
    }
    const maxTime = Math.max(...Object.values(times));
    for (let i = 0; i < unknown_words.length; i++) {
        times[unknown_words[i]] = 0.75*maxTime;
    }
    return times;
}

// Event handler for showing the next stanza
function showNextStanza(event) {
    clearTimeout(timerId);

    var root = event.target.textContent;
    if (root.includes('-')) {
        root = root.split('-')[0];
    }
    root = clean(root);
    const availableWords = Array.from(document.getElementsByClassName('available'));
    const times = computeAppearanceTimes(root, availableWords);

    for (let word in times) {
        const time = times[word];
        timerId = setTimeout(function() {
            const elements = document.querySelectorAll(`#${clean(word)}`);

            elements.forEach(element => {
                if (element.classList.contains('available')) {
                    element.classList.add('visible');
                    element.classList.remove('available');
                }
            })
            poemDisplayed = true;
        }, 1000*time);
    }
}

// Function to determine "available" words based on the visible area of the window
function setAvailableWords() {
    const words = document.getElementsByClassName('word');
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        word.id = clean(word.textContent); 

        /* Set all words whose bottom is above the window's bottom as available */
        const rect = word.getBoundingClientRect();
        const isWithin = rect.bottom <= window.innerHeight;
    
        if (isWithin && !word.classList.contains('visible') && !word.classList.contains('title-word')) {
            word.classList.add('available');
            word.addEventListener('click', setAvailableWords);
            word.addEventListener('click', showNextStanza);
        } 
    }
}

// Throttle function based on timestamps
function throttle(func, delay) {
    let lastCallTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        if (currentTime - lastCallTime >= delay) {
            func.apply(this, args);
            lastCallTime = currentTime;
        }
    };
}

// Debounce function to limit the frequency of event handling
function debounce(callback, delay) {
    let timerId;
    return function (...args) {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        callback.apply(this, args);
      }, delay);
    };
  }
  
// Updated scroll event handler using throttle
const throttledScrollHandler = throttle(function () {
    const windowHeight = window.innerHeight;
    const scrollThreshold = 0.2 * windowHeight;
    const bannerThreshold = 0.1 * windowHeight;

    // If poem is not displayed and user scrolls past threshold, show banner
    if (poemContainer.scrollTop > scrollThreshold && !poemDisplayed) {
        banner.classList.add('show');
    } else {
        banner.classList.remove('show');
    }

    // If user scrolls past banner threshold, hide poetry buttons (decrease opacity)
    if (poemContainer.scrollTop > bannerThreshold && poemContent.innerHTML.trim()) {
        poetryButtons.style.opacity = 0;
    } else {
        poetryButtons.style.opacity = 1;
    }

    /* If poem is displayed, and the user scrolls past the last displayed stanza, 
    choose a random root word from displayed words and show the next words */
    if (poemDisplayed) {
        const visibleWords = Array.from(document.getElementsByClassName('visible'));
        let visibleBottoms = visibleWords.map(word => word.getBoundingClientRect().bottom);
        const max_visible_bottom = Math.max(...visibleBottoms);
        const isPast = max_visible_bottom < 0.1 * windowHeight;

        if (isPast) {
            const visibleWordsFiltered = visibleWords.filter(word => word.textContent.length > 3);
            const randIdx = Math.floor(Math.random()*visibleWordsFiltered.length);
            const randWord = visibleWordsFiltered[randIdx];
            randWord.dispatchEvent(new Event('click'));
        }
    }
}, 100);

document.addEventListener('DOMContentLoaded', function () {
    memoryPalaceButton.classList.add('active'); 
    loadPoemContent('poems/palace.html'); 

    poemContainer.addEventListener('scroll', throttledScrollHandler);

    if (!isMobileDevice) {
        window.addEventListener('mousemove', debounce(handleMouseMove, 10));
      }

    memoryPalaceButton.addEventListener('click', () => {
        loadPoemContent('poems/palace.html');
        memoryPalaceButton.classList.add('active');
        fauneButton.classList.remove('active');
        poemDisplayed = false;
        showPoem();
    });

    fauneButton.addEventListener('click', () => {
        loadPoemContent('poems/faune.html');
        fauneButton.classList.add('active');
        memoryPalaceButton.classList.remove('active');
        showPoem();
        poemDisplayed = true;
    });
    showPoem();
});