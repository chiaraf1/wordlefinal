let palabraClave = "";  // Palabra fija que obtendremos de la API
let currentRow = 0;
let currentCol = 0;
let board = document.querySelectorAll('#tablero .fila');
let rows = Array.from(board);
let currentWord = [];

// Obtener los botones del teclado virtual
let keys = document.querySelectorAll('#teclado button');

async function obtenerPalabraClave() {
    try {
        const response = await fetch('https://clientes.api.greenborn.com.ar/public-random-word?c=1&l=5');
        const data = await response.json();

        // Comprobar si el array data existe y contiene al menos una palabra
        if (Array.isArray(data) && data.length > 0) {
            palabraClave = data[0].toUpperCase(); // Convertir a mayúsculas para el juego
            console.log("Palabra clave:", palabraClave); // Mostrar en consola para verificación
        } else {
            console.error("Formato de respuesta inesperado:", data);
            palabraClave = "MANGO"; // Fallback si la respuesta no es la esperada
        }
    } catch (error) {
        console.error("Error al obtener la palabra:", error);
        palabraClave = "MANGO"; // Fallback en caso de error
    }
}

// Llama a la función para obtener la palabra clave cuando cargue la página
obtenerPalabraClave();


// Llama a la función para obtener la palabra clave cuando cargue la página
obtenerPalabraClave();

keys.forEach(key => {
    key.addEventListener('click', function() {
        let letter = key.textContent.toUpperCase();

        if (letter === 'DEL') {
            deleteLetter();
        } else if (letter === 'ENTER') {
            submitWord();
        } else if (letter.match(/^[A-Z]$/)) {
            addLetter(letter);
        }
    });
});

// Función para añadir letras
function addLetter(letter) {
    if (currentCol < 5 && currentRow < 6) {
        let box = rows[currentRow].children[currentCol];
        box.textContent = letter;
        currentWord.push(letter);
        currentCol++;
    }
}

// Función para borrar la última letra
function deleteLetter() {
    if (currentCol > 0) {
        currentCol--;
        let box = rows[currentRow].children[currentCol];
        box.textContent = '';
        currentWord.pop();
    }
}

// Función para validar la palabra
function submitWord() {
    if (currentCol === 5) {
        let word = currentWord.join('');
        
        if (word === palabraClave) {
            alert("¡Felicidades! Adivinaste la palabra.");
        } else {
            checkWord(word);
        }

        if (currentRow < 5) {
            currentRow++;
            currentCol = 0;
            currentWord = [];
        } else {
            alert("Juego terminado. La palabra era " + palabraClave + ".");
        }
    } else {
        alert('Completa la palabra antes de presionar Enter.');
    }
}

// Función para verificar cada letra y cambiar color
function checkWord(word) {
    let correctWord = palabraClave.split('');

    for (let i = 0; i < 5; i++) {
        let box = rows[currentRow].children[i];
        let letter = word[i];

        if (correctWord[i] === letter) {
            box.style.backgroundColor = 'green'; // Letra correcta y en la posición correcta
        } else if (correctWord.includes(letter)) {
            box.style.backgroundColor = 'yellow'; // Letra correcta pero en la posición incorrecta
        } else {
            box.style.backgroundColor = 'gray'; // Letra incorrecta
        }
    }
}
