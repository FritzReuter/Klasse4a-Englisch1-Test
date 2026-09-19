/*
 * ============================================================
 * Aktueller Index / All-Modus
 * ============================================================
 */

let currentWordIndex = 0;

let allHistory = [];

let allHistoryIndex = -1;


/*
 * ============================================================
 * Wörter oder Sätze bestimmen
 * ============================================================
 */

function getMode() {

  return document.querySelector(
    'input[name="mode"]:checked'
  ).value;

}


/*
 * ============================================================
 * Aktuelle Themen-Sammlung bestimmen
 * ============================================================
 */

function getCurrentTopics() {

  if (getMode() === "sentences") {
    return topicsSentences;
  }

  return topicsWords;

}


/*
 * ============================================================
 * Aktuelles Array bestimmen
 * ============================================================
 */

function getCurrentArray() {

  const topic =
    document.getElementById(
      "topicSelect"
    ).value;

  const currentTopics =
    getCurrentTopics();


  if (topic === "all") {

    return Object.values(
      currentTopics
    ).flat();

  }


  return currentTopics[topic] || [];

}


/*
 * ============================================================
 * Übersetzungsrichtung bestimmen
 * ============================================================
 */

function getDirection() {

  return document.querySelector(
    'input[name="direction"]:checked'
  ).value;

}


/*
 * ============================================================
 * Prüfen, ob das aktuelle Array Inhalte besitzt
 * ============================================================
 */

function hasCurrentEntries() {

  const currentArray =
    getCurrentArray();

  return currentArray.length > 0;

}


/*
 * ============================================================
 * Meldung bei leerem Themen-Array
 * ============================================================
 */

function showEmptyMessage() {

  const mode =
    getMode();

  document.getElementById(
    "songText"
  ).innerText =
    mode === "sentences"
      ? "Für dieses Thema sind noch keine Sätze vorhanden."
      : "Für dieses Thema sind noch keine Wörter vorhanden.";


  document.getElementById(
    "feedbackArea"
  ).innerText = "";

}


/*
 * ============================================================
 * Zufälligen Eintrag für All erzeugen
 * ============================================================
 */

function createRandomAllEntry() {

  const currentTopics =
    getCurrentTopics();


  const allWords =
    Object.values(
      currentTopics
    ).flat();


  if (allWords.length === 0) {

    return null;

  }


  const englishChecked =
    document.getElementById(
      "randomEnglish"
    ).checked;


  const germanChecked =
    document.getElementById(
      "randomGerman"
    ).checked;


  if (!englishChecked && !germanChecked) {

    return null;

  }


  const word =
    allWords[
      Math.floor(
        Math.random() * allWords.length
      )
    ];


  let language;


  if (englishChecked && germanChecked) {

    language =
      Math.random() < 0.5
        ? "en"
        : "de";

  } else if (englishChecked) {

    language = "en";

  } else {

    language = "de";

  }


  return {

    word: word,
    language: language

  };

}


/*
 * ============================================================
 * Zufälligen All-Eintrag zur Historie hinzufügen
 * ============================================================
 */

function addRandomAllEntry() {

  const entry =
    createRandomAllEntry();


  if (!entry) {

    const englishChecked =
      document.getElementById(
        "randomEnglish"
      ).checked;

    const germanChecked =
      document.getElementById(
        "randomGerman"
      ).checked;


    if (!englishChecked && !germanChecked) {

      document.getElementById(
        "songText"
      ).innerText =
        "Bitte Englisch und/oder Deutsch auswählen.";

    } else {

      showEmptyMessage();

    }


    document.getElementById(
      "feedbackArea"
    ).innerText = "";


    return false;

  }


  if (
    allHistoryIndex
    <
    allHistory.length - 1
  ) {

    allHistory =
      allHistory.slice(
        0,
        allHistoryIndex + 1
      );

  }


  allHistory.push(
    entry
  );


  allHistoryIndex =
    allHistory.length - 1;


  return true;

}


/*
 * ============================================================
 * Aktuellen Eintrag anzeigen
 * ============================================================
 */

function showCurrentWord() {

  const topic =
    document.getElementById(
      "topicSelect"
    ).value;


  /*
   * ALL
   */

  if (topic === "all") {

    if (allHistoryIndex < 0) {

      if (!addRandomAllEntry()) {

        return;

      }

    }


    const entry =
      allHistory[
        allHistoryIndex
      ];


    document.getElementById(
      "songText"
    ).innerText =
      entry.language === "en"
        ? entry.word.en
        : entry.word.de;


    return;

  }


  /*
   * Einzelnes Thema
   */

  const currentArray =
    getCurrentArray();


  if (currentArray.length === 0) {

    showEmptyMessage();

    return;

  }


  if (
    currentWordIndex
    >=
    currentArray.length
  ) {

    currentWordIndex = 0;

  }


  const word =
    currentArray[
      currentWordIndex
    ];


  document.getElementById(
    "songText"
  ).innerText =
    getDirection() === "en-de"
      ? word.en
      : word.de;

}


/*
 * ============================================================
 * Wörter / Sätze wechseln
 * ============================================================
 */

function changeMode() {

  currentWordIndex = 0;

  allHistory = [];

  allHistoryIndex = -1;


  document.getElementById(
    "feedbackArea"
  ).innerText = "";


  showCurrentWord();

}


/*
 * ============================================================
 * Thema wechseln
 * ============================================================
 */

function changeTopic() {

  currentWordIndex = 0;

  allHistory = [];

  allHistoryIndex = -1;


  const isAll =
    document.getElementById(
      "topicSelect"
    ).value === "all";


  document.getElementById(
    "allOptions"
  ).style.display =
    isAll
      ? "block"
      : "none";


  document.getElementById(
    "directionGroup"
  ).style.display =
    isAll
      ? "none"
      : "block";


  document.getElementById(
    "feedbackArea"
  ).innerText = "";


  showCurrentWord();

}


/*
 * ============================================================
 * All-Zufall nach Änderung einer Checkbox zurücksetzen
 * ============================================================
 */

function resetAllRandom() {

  allHistory = [];

  allHistoryIndex = -1;


  document.getElementById(
    "feedbackArea"
  ).innerText = "";


  showCurrentWord();

}


/*
 * ============================================================
 * Anzeige zurücksetzen
 * ============================================================
 */

function resetUI() {

  currentWordIndex = 0;


  document.getElementById(
    "feedbackArea"
  ).innerText = "";


  showCurrentWord();

}


/*
 * ============================================================
 * Nächster Eintrag
 * ============================================================
 */

function nextWord() {

  const topic =
    document.getElementById(
      "topicSelect"
    ).value;


  /*
   * ALL
   */

  if (topic === "all") {

    if (
      allHistoryIndex
      <
      allHistory.length - 1
    ) {

      allHistoryIndex++;

    } else {

      if (!addRandomAllEntry()) {

        return;

      }

    }


    showCurrentWord();


    document.getElementById(
      "feedbackArea"
    ).innerText = "";


    return;

  }


  /*
   * Einzelnes Thema
   */

  const currentArray =
    getCurrentArray();


  if (currentArray.length === 0) {

    showEmptyMessage();

    return;

  }


  currentWordIndex =
    (
      currentWordIndex + 1
    )
    %
    currentArray.length;


  showCurrentWord();


  document.getElementById(
    "feedbackArea"
  ).innerText = "";

}


/*
 * ============================================================
 * Vorheriger Eintrag
 * ============================================================
 */

function prevWord() {

  const topic =
    document.getElementById(
      "topicSelect"
    ).value;


  /*
   * ALL
   */

  if (topic === "all") {

    if (allHistoryIndex > 0) {

      allHistoryIndex--;

      showCurrentWord();

    }


    document.getElementById(
      "feedbackArea"
    ).innerText = "";


    return;

  }


  /*
   * Einzelnes Thema
   */

  const currentArray =
    getCurrentArray();


  if (currentArray.length === 0) {

    showEmptyMessage();

    return;

  }


  currentWordIndex =
    (
      currentWordIndex
      - 1
      + currentArray.length
    )
    %
    currentArray.length;


  showCurrentWord();


  document.getElementById(
    "feedbackArea"
  ).innerText = "";

}


/*
 * ============================================================
 * Übersetzung anzeigen
 * ============================================================
 */

function checkTranslation() {

  const topic =
    document.getElementById(
      "topicSelect"
    ).value;


  /*
   * ALL
   */

  if (topic === "all") {

    if (allHistoryIndex < 0) {

      return;

    }


    const entry =
      allHistory[
        allHistoryIndex
      ];


    document.getElementById(
      "feedbackArea"
    ).innerText =
      entry.language === "en"
        ? entry.word.de
        : entry.word.en;


    return;

  }


  /*
   * Einzelnes Thema
   */

  const currentArray =
    getCurrentArray();


  if (currentArray.length === 0) {

    showEmptyMessage();

    return;

  }


  const word =
    currentArray[
      currentWordIndex
    ];


  const direction =
    getDirection();


  document.getElementById(
    "feedbackArea"
  ).innerText =
    direction === "en-de"
      ? word.de
      : word.en;

}


/*
 * ============================================================
 * Gesamttabelle erzeugen
 * ============================================================
 */

function buildOverviewTable() {

  const table =
    document.getElementById(
      "overviewTable"
    );


  const topicSelect =
    document.getElementById(
      "topicSelect"
    );


  table.innerHTML = "";


  Array.from(
    topicSelect.options
  ).forEach(option => {

    const topicKey = option.value;


    if (topicKey === "all") {

      return;

    }


    const words =
      topicsWords[topicKey] || [];


    const sentences =
      topicsSentences[topicKey] || [];


    const entries = [
      ...words,
      ...sentences
    ];


    if (entries.length === 0) {

      return;

    }


    const topicRow =
      document.createElement(
        "tr"
      );


    topicRow.className =
      "topic-row";


    topicRow.innerHTML = `
      <th class="topic-name">${option.textContent}</th>
      <th class="language-head">Englisch</th>
      <th class="language-head">Deutsch</th>
    `;


    table.appendChild(
      topicRow
    );


    entries.forEach(entry => {

      const row =
        document.createElement(
          "tr"
        );


      const emptyCell =
        document.createElement(
          "td"
        );


      emptyCell.className =
        "empty-topic-cell";


      const englishCell =
        document.createElement(
          "td"
        );


      englishCell.textContent =
        entry.en;


      const germanCell =
        document.createElement(
          "td"
        );


      germanCell.textContent =
        entry.de;


      row.appendChild(
        emptyCell
      );


      row.appendChild(
        englishCell
      );


      row.appendChild(
        germanCell
      );


      table.appendChild(
        row
      );

    });

  });

}


/*
 * ============================================================
 * Zwischen Formular und Gesamttabelle wechseln
 * ============================================================
 */

function toggleView() {

  document.getElementById("settingsView").style.display = "none";
  document.getElementById("qrView").style.display = "none";

  const formView =
    document.getElementById(
      "formView"
    );

  const tableView =
    document.getElementById(
      "tableView"
    );

  const bottomActions =
    document.getElementById(
      "bottomActions"
    );

  const tableIsVisible =
    tableView.style.display ===
      "block";

  if (tableIsVisible) {

    tableView.style.display =
      "none";

    formView.style.display =
      "block";

    bottomActions.style.display =
      "flex";

  } else {

    buildOverviewTable();

    formView.style.display =
      "none";

    tableView.style.display =
      "block";

    bottomActions.style.display =
      "none";

  }

}


/*
 * ============================================================
 * QR-Code / Teilen
 * ============================================================
 */

const qrUrl =
  "https://fritzreuter.github.io/Klasse4a-Englisch1";

let qrCodeCreated = false;

function showQrCode() {

  document.getElementById("settingsView").style.display = "none";
  document.getElementById("formView").style.display = "none";
  document.getElementById("tableView").style.display = "none";
  document.getElementById("bottomActions").style.display = "none";
  document.getElementById("qrView").style.display = "flex";

  document.getElementById("qrUrlText").textContent = qrUrl;

  if (!qrCodeCreated) {

    new QRCode(
      document.getElementById("qrCode"),
      {
        text: qrUrl,
        width: 300,
        height: 300,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      }
    );

    qrCodeCreated = true;
  }
}

function showFormView() {

  document.getElementById("settingsView").style.display = "none";
  document.getElementById("qrView").style.display = "none";
  document.getElementById("tableView").style.display = "none";
  document.getElementById("formView").style.display = "block";
  document.getElementById("bottomActions").style.display = "flex";
}


/* Einstellungen / Dark Mode */
function showSettings() {
  document.getElementById("formView").style.display = "none";
  document.getElementById("tableView").style.display = "none";
  document.getElementById("qrView").style.display = "none";
  document.getElementById("bottomActions").style.display = "none";
  document.getElementById("settingsView").style.display = "block";
}

function setDarkMode(enabled) {
  document.body.classList.toggle("dark-mode", enabled);
  document.getElementById("darkModeToggle").checked = enabled;
  document.getElementById("themeLabel").textContent = enabled ? "Dunkel" : "Hell";
  localStorage.setItem("darkMode", enabled ? "dark" : "light");
}

function loadDarkMode() {
  setDarkMode(localStorage.getItem("darkMode") === "dark");
}


/*
 * ============================================================
 * Tastatur-Shortcuts – nur in der Formularansicht
 * ============================================================
 */

document.addEventListener("keydown", function(event) {

  const formView =
    document.getElementById(
      "formView"
    );


  if (formView.style.display === "none") {
    return;
  }


  if (event.key === "ArrowLeft") {

    event.preventDefault();
    prevWord();

  } else if (event.key === "ArrowRight") {

    event.preventDefault();
    nextWord();

  } else if (event.key === "ArrowDown") {

    event.preventDefault();
    checkTranslation();

  }

});


/*
 * ============================================================
 * Initialisieren
 * ============================================================
 */

loadDarkMode();
changeTopic();
