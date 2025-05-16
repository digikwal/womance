document.addEventListener('DOMContentLoaded', () => {
  const nameField = document.getElementById('naam');
  const emailField = document.getElementById('email');
  const messageField = document.getElementById('bericht');

  const names = [
    'Lola', 'Maya', 'Zola', 'Noura', 'Fay', 'Isolde', 'Raya', 'June', 'Soraya', 'Nina', 'Liv', 'Noor',
    'Fabio', 'Dior', 'Sergio', 'Jean-Luc', 'Ricky', 'Orlando', 'Miguel', 'Gianni', 'Beau'
  ];
  const emailSuffix = [ '@gmail.com', '@outlook.com', '@yahoo.com', '@hotmail.com', '@icloud.com', '@aol.com',
    '@protonmail.com', '@mail.com', '@zoho.com', '@live.com', '@me.com', '@ziggo.nl', '@kpnmail.nl',
    '@xs4all.nl', '@telfort.nl', '@hetnet.nl', '@upcmail.nl', '@chello.nl', '@planet.nl', '@home.nl',
    '@student.uva.nl', '@student.tudelft.nl', '@hey.com', '@pm.me', '@fastmail.com', '@tutanota.com', '@hushmail.com'
  ];
  
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
    `Womance,\n\nZit ik net lekker in m’n gevoel, komt m’n ex ineens terug in m’n DMs. Wat zouden jullie doen?`,
    `Hi ladies,\n\nMijn luxeprobleem is: ik heb eindelijk rust... en nu weet ik niet wat ik met mezelf aan moet.`,
    `Womantis,\n\nEven snel: mag je ook trots zijn op kleine overwinningen als niemand ze ziet?`,
    `Lieve Womance,\n\nVandaag koos ik voor mezelf. En eerlijk? Het voelt ongemakkelijk goed.`,
    `Womance,\n\nIk stond in de rij bij de supermarkt met een doos eieren en een existential crisis. Hoe weet je of je breekbaar bent of gewoon mens?`,
    `Hi Womance,\n\nIk ghost mensen niet expres. Ik verdwaal gewoon in m’n eigen hoofd. Heb ik nu een les gemist of gewoon mezelf?`,
    `Lieve Ayisha & Betty,\n\nIedere keer dat ik mezelf durf te laten zien, krijg ik de neiging om me daarna meteen te verstoppen. Is dit groeien? Of gewoon eng?`,
    `Hey Womance,\n\nIk zit vast in een fase die ik ‘tussen alles’ noem. Niet meer wie ik was, nog niet wie ik wil zijn. Wat nu?`,
    `Yo,\n\nIs het een luxeprobleem als je je leven wil veranderen, maar ook je favoriete koffietentje niet wil opgeven? Asking for a friend (me).`,
    `Womance,\n\nWat doe je als je ineens beseft dat je al die tijd vooral sterk was... voor anderen?`,
    `Hoi Betty & Ayisha,\n\nElke keer dat ik 'mezelf wil zijn', komt m’n innerlijke people pleaser mee opdraven met een to-do lijst. Help.`,
    `Lieve vrouwen van vuur,\n\nWaarom voelt rust soms als falen? Alsof ik pas besta als ik iets bewijs. Kan dat ook anders?`,
    `Hi Womance,\n\nIk dacht dat ik over hem heen was. Tot ik zijn Spotify likes zag. Is dat een relaps of gewoon menselijk?`,
    `Womance,\n\nBen ik de enige die soms naar de lucht kijkt en denkt: “Oké universum, ik hoor je. Maar kan het ietsje zachter?”`,
    `Hey Womance,\n\nIk sta oog in oog met een lege to-do-lijst en voel me… verloren? Help me deze paradox te ontleden.`,
    `Lieve Ayisha & Betty,\n\nWaarom voelt zelfliefde soms als een ultramarathon zonder eindstreep? #ConfusedRunner`,
    `Hoi beauties,\n\nMijn hart is zo vol met liefde voor mezelf dat ik bijna geen ruimte meer heb voor anderen. Kan dat too much zijn?`,
    `Womance crew,\n\nElke keer dat iemand me een compliment geeft, krijg ik de kriebels. Hoe maak ik dat om?`,
    `Hello goddesses,\n\nIk heb een nieuwe hobby ontdekt en nu ben ik bang dat het m’n identiteit ondermijnt. Is dat chaotisch luxueus?`,
    `Lieve W’s,\n\nIk durf m’n mening niet te geven omdat ik bang ben m’n plek te verliezen. Wat zouden jullie zeggen?`,
    `Womance babes,\n\nIk plan m’n dag tot op de minuut, maar eindig altijd in chaos. Tips om die perfectionist in toom te houden?`,
    `Hoi power duo,\n\nIk ben soms jaloers op wie ik gisteren was. Hoe therapie ik m’n eigen mindset?`,
    `Womance,\n\nIk laad op van sociale momenten, maar daarna voel ik me compleet leeggezogen. Bestaan there reserves voor intro’s en extro’s?`,
    `Hello W-team,\n\nMag ik dankbaar zijn voor iets kleins terwijl m’n hoofd alleen maar drama ziet? Pls advise.`,
    `Hoi Womance,\n\nIk organiseer een klein tuinfeest voor mijn verjaardag en het lijkt me magisch als jullie langskomen voor een intieme performance of spoken word moment. Denk: zachte lichten, veel gevoel, en vrienden die luisteren.\n\nIk dacht aan een gage van €350, exclusief reiskosten. Laat vooral weten wat voor jullie werkt – we zorgen uiteraard voor wat te eten, drinken én plek op de gastlijst!`,
    `Hey Womance,\n\nVoor een houseparty met veel vrouwen, veel wijn en nog meer gevoelens zoeken we een act die binnenkomt. Jullie zijn het gesprek vóór het feestje. Willen jullie langskomen?\n\nBudget-wise dacht ik aan €350 + reiskosten. Uiteraard regelen we gastlijstplekken voor jullie crew (10 personen minimaal).`,
    `Lieve Womance,\n\nIk host een feest voor mijn zus die 30 wordt — en ze is fan van jullie. Zou het mogelijk zijn om iets kleins live te doen, misschien een spoken word set van 15-20 minuten?\n\nWe hebben €350 gereserveerd voor artiesten + reiskostenvergoeding. En natuurlijk: gastlijst love gegarandeerd!`,
    `Hi Womance,\n\nVoor een avond in een kleine club waar we female voices centraal zetten, zouden jullie perfect zijn als headliner of artist-in-between. Intiem, indringend, maar professioneel uitgevoerd.\n\nGagevoorstel: €650 excl. reiskosten. Rider & gastlijst (10–20 personen) zijn bespreekbaar. Laat weten wat jullie nodig hebben.`,
    `Geachte Womance,\n\nVoor ons jaarlijkse bedrijfsevent (ca. 150 personen) zijn we op zoek naar een impactvolle afsluiting. We denken aan 30 minuten muziek/woord dat raakt en inspireert. Jullie naam werd meteen genoemd.\n\nHet budget voor acts van jullie kaliber ligt rond de €950 ex. reiskosten. Technische ondersteuning kunnen wij verzorgen. Gastlijst tot 30 personen is mogelijk.`,
    `Hallo Betty & Ayisha,\n\nWe organiseren een non-profit event rond mentale gezondheid in onze wijk. Geen groot podium, maar een intiem moment voor echte woorden.\n\nBudget is beperkt: €350 inclusief vervoer. We hopen dat jullie willen bijdragen aan deze community. Gastlijst = flexibel, we maken ruimte.`,
    `Hi Womance,\n\nVoor een creatief festival in Rotterdam zoeken we een act die de grens tussen muziek en poëzie oprekt. Jullie stijl past perfect in het programma.\n\nOns standaard honorarium ligt op €950 excl. reiskosten. Rider inclusief 20 gastlijstplekken is geen probleem.`,
    `Yo Womance,\n\nIk host een queer huiskamerfestival en wil graag dat jullie langskomen. Geen podium, gewoon mensen op kussens en ogen vol verwachting.\n\nMijn voorstel: €350 + ov/benzinevergoeding. Jullie bepalen zelf wie er op de guestlist staat – tot 15 personen.`,
    `Womance crew,\n\nOnze stichting organiseert een avond voor jonge vrouwen over expressie, identiteit en groei. Zouden jullie een performance kunnen doen én eventueel kort in gesprek gaan met het publiek?\n\nWe kunnen €650 bieden excl. reiskosten, en er is plek voor jullie gasten (tot 20 op de lijst).`,
    `Hi ladies,\n\nVoor een zondagsfestival met muziek, talks en art installaties zoeken we nog 1 performance die écht binnenkomt. Jullie naam is al een paar keer gevallen.\n\nOns budget voor headline performances: vanaf €950 + reiskosten. Jullie rider (incl. 30 gasten) is welkom. Zien jullie dit zitten?`
  ];

  let shuffledNames = [];
  let shuffledSuffixes = [];
  let shuffledMessages = [];
  let currentIndex = 0;
  let timeouts = [];
  let typingAborted = false;

  function shuffleArray(arr) {
    const array = arr.slice();
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function resetShuffle() {
    shuffledNames = shuffleArray(names);
    shuffledSuffixes = shuffleArray(emailSuffix);
    shuffledMessages = shuffleArray(messages);
    currentIndex = 0;
  }

  function getNextSet() {
    if (currentIndex === 0 || currentIndex >= shuffledNames.length) {
      resetShuffle();
    }

    const name = shuffledNames[currentIndex];
    const suffix = shuffledSuffixes[currentIndex % shuffledSuffixes.length];
    const email = name.toLowerCase().replace(/[^a-z]/g, '') + suffix;
    const message = shuffledMessages[currentIndex % shuffledMessages.length];

    currentIndex++;
    return { name, email, message };
  }

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
    const { name, email, message } = getNextSet();

    typeText(nameField, name, 100, () => {
      typeText(emailField, email, 75, () => {
        typeText(messageField, message, 35, () => {
          setSafeTimeout(() => {
            deleteText(messageField, 15, () => {
              deleteText(emailField, 15, () => {
                deleteText(nameField, 15, () => {
                  if (!typingAborted) {
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

  resetShuffle();
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
