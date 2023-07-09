const poemContainer = document.getElementsByClassName('poetry-container')[0];
const words = document.getElementsByClassName('word');
const poetryButtons = document.querySelector('.poetry-buttons');
const memoryPalaceButton = document.getElementById('memory-palace-button');
const fauneButton = document.getElementById('faune-aux-jumelles-button');
const poemContent = document.getElementById('poem');
let prevScrollPos = 0;
const timeFade = 5;
let poemDisplayed = false;
let embeddings; 

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
        const titleWords = document.getElementsByClassName('title-word');
        for (let i = 0; i < titleWords.length; i++) {
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
    const times = {};
    unknown_words = [];
    for (let i = 0; i < words.length; i++) {
        const word = words[i].textContent;
        try {
            const wordEmbedding = embeddings[clean(word)];
            const similarity = dotProduct(rootEmbedding, wordEmbedding);
            const delay = Math.exp(-1.5*(similarity-0.5))
            times[word] = delay;
        }
        catch (error) {
            unknown_words.push(word);
        }
    }
    // Normalize the times
    const max_time = Math.max(...Object.values(times));
    const min_time = Math.min(...Object.values(times));
    for (let i = 0; i < unknown_words.length; i++) {
        times[unknown_words[i]] = 0.75*max_time;
    }

    for (let word in times) {
        times[word] = timeFade * (0.3+times[word] - min_time) / max_time;
    }
    return times;
}

// Event handler for showing the next stanza
function showNextStanza(event) {
    var root = event.target.textContent;
    if (root.includes('-')) {
        root = root.split('-')[0];
    }
    root = clean(root);
    const availableWords = Array.from(document.getElementsByClassName('available'));
    const times = computeAppearanceTimes(root, availableWords);

    for (let word in times) {
        const time = times[word];
        setTimeout(function() {
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

        const rect = word.getBoundingClientRect();
        const isWithin = rect.top < window.innerHeight && rect.bottom >= 0;

        if (isWithin && !word.classList.contains('visible') && !word.classList.contains('title-word')) {
            word.classList.add('available');
            word.addEventListener('click', setAvailableWords);
            word.addEventListener('click', showNextStanza);
        } 
    }
}
document.addEventListener('DOMContentLoaded', function () {

    memoryPalaceButton.classList.add('active'); 
    loadPoemContent('poems/palace.html'); 

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
  
  // Updated scroll event handler using throttle
  const throttledScrollHandler = throttle(function () {
    const windowHeight = window.innerHeight;
    const scrollThreshold = 0.2 * windowHeight;
    const bannerThreshold = 0.15 * windowHeight;
  
    if (poemContainer.scrollTop > scrollThreshold && !poemDisplayed) {
      banner.classList.add('show');
    } else {
      banner.classList.remove('show');
    }
  
    if (poemContainer.scrollTop > bannerThreshold && poemContent.innerHTML.trim()) {
      poetryButtons.style.transform = 'translateY(-100%)';
    } else {
      poetryButtons.style.transform = 'translateY(0)';
    }
  }, 100);
  
  poemContainer.addEventListener('scroll', throttledScrollHandler);