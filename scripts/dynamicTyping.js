document.addEventListener('DOMContentLoaded', () => {
  const nameField = document.getElementById('naam');
  const emailField = document.getElementById('email');
  const messageField = document.getElementById('bericht');

  const names = ['Lola', 'Maya', 'Zola', 'Noura', 'Fay', 'Isolde', 'Raya', 'June', 'Soraya', 'Nina', 'Liv', 'Noor'];
  const emailSuffix = '@womance-mail.nl';
  const messages = [
    `Hoi Womance,\n\nIk zat net midden in een existentiële crisis over een cappuccino (havermelk, natuurlijk), toen ik ineens dacht: “Weet je wie dit begrijpt? De Womance.”\n\nDus hier ben ik. Met een verhaal. Of een vraag. Of misschien gewoon een schreeuw in de leegte die jullie vast wel kunnen vertalen naar een les of een spiegel. Laat maar weten hoe ik dit luxeprobleem kan indienen. 🫶`,
    `Hey Womance,\n\nEven eerlijk: ik zat in bad en begon spontaan te huilen. Geen idee waarom, behalve dat m’n hoofd te vol zat. En ik dacht—dit is een Womance moment. 🛁`,
    `Lieve Womance,\n\nWaarom voelt 'nee' zeggen nog steeds alsof ik iemand teleurstel? Misschien omdat ik mezelf nog steeds probeer te pleasen. Jullie begrijpen dit vast.`,
    `Hallo daar,\n\nMijn luxeprobleem van vandaag: te veel dromen, te weinig tijd. Hoe leren jullie kiezen zonder FOMO?`,
    `Womance babes,\n\nIk heb een situatie die zo dramatisch is dat zelfs m’n plant zich ervan afkeert. Mag ik het insturen als case voor de spiegel-les-serie? 🌱`,
    `Hoi,\n\nWat als ik niet weet wat ik voel? Alleen dat het veel is. Misschien is dat ook al iets waard.`,
    `Lieve mensen,\n\nM’n hoofd zegt 'gas geven' maar m’n lijf zegt 'pauze'. Wat zeggen jullie?`,
    `Womance,\n\nVroeg me af: bestaat er zoiets als een te groot hart? Want ik voel letterlijk alles, altijd. 😅`,
    `Hallo heldinnen,\n\nM’n grens stond ooit ergens. Nu vind ik 'm niet meer terug. Tips om jezelf weer terug te vinden?`,
    `Yo Womance,\n\nIedereen zegt 'je moet het loslaten'. Maar waar laat je iets los? In de cloud? Op de grond?`,
    `Womance,\n\nZit ik net lekker in m’n gevoel, komt m’n ex ineens terug in m’n DMs. Wat zou Betty doen?`,
    `Hi ladies,\n\nMijn luxeprobleem is: ik heb eindelijk rust... en nu weet ik niet wat ik met mezelf aan moet.`,
    `Womantis,\n\nEven snel: mag je ook trots zijn op kleine overwinningen als niemand ze ziet?`,
    `Lieve Womance,\n\nVandaag koos ik voor mezelf. En eerlijk? Het voelt ongemakkelijk goed.`
  ];

  let index = 0;
  let timeouts = [];
  let typingAborted = false;

  function setSafeTimeout(fn, delay) {
    const id = setTimeout(fn, delay);
    timeouts.push(id);
    return id;
  }

  function clearAllTimeouts() {
    timeouts.forEach(clearTimeout);
    timeouts = [];
  }

  function abortTyping() {
    typingAborted = true;
    clearAllTimeouts();
    nameField.value = '';
    emailField.value = '';
    messageField.value = '';
  }

  // Detecteer user interactie
  [nameField, emailField, messageField].forEach(field => {
    ['focus', 'keydown', 'input'].forEach(evt =>
      field.addEventListener(evt, () => {
        if (!typingAborted) {
          abortTyping();
        }
      })
    );
  });

  function typeText(element, text, delay = 35, done) {
    let i = 0;
    const step = () => {
      if (typingAborted) return;
      if (i < text.length) {
        element.value += text[i];
        autoResize(element);
        i++;
        setSafeTimeout(step, delay);
      } else {
        setSafeTimeout(done, 1000);
      }
    };
    step();
  }

  function deleteText(element, delay = 20, done) {
    const step = () => {
      if (typingAborted) return;
      if (element.value.length > 0) {
        element.value = element.value.slice(0, -1);
        autoResize(element);
        setSafeTimeout(step, delay);
      } else {
        setSafeTimeout(done, 500);
      }
    };
    step();
  }

  function startSequence() {
    const currentName = names[index % names.length];
    const currentEmail = currentName.toLowerCase() + emailSuffix;
    const currentMessage = messages[index % messages.length];

    typeText(nameField, currentName, 100, () => {
      typeText(emailField, currentEmail, 75, () => {
        typeText(messageField, currentMessage, 35, () => {
          setSafeTimeout(() => {
            deleteText(messageField, 15, () => {
              deleteText(emailField, 15, () => {
                deleteText(nameField, 15, () => {
                  if (!typingAborted) {
                    index++;
                    startSequence();
                  }
                });
              });
            });
          }, 2000);
        });
      });
    });
  }

  function autoResize(el) {
    if (el.tagName.toLowerCase() === 'textarea') {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  }

  startSequence();

  document.addEventListener('click', (e) => {
    const clickedInsideInput =
      nameField.contains(e.target) ||
      emailField.contains(e.target) ||
      messageField.contains(e.target);
  
    const allFieldsEmpty =
      nameField.value === '' &&
      emailField.value === '' &&
      messageField.value === '';
  
    if (!clickedInsideInput && typingAborted && allFieldsEmpty) {
      typingAborted = false;
      setTimeout(() => { startSequence(); }, 3000);
    }
  });
});
