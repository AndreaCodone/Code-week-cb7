const types = [
  {
    id: 1,
    name: "Taglio di capelli",
  },
  {
    id: 2,
    name: "Manicure",
  },
  {
    id: 3,
    name: "Altro",
  },
];

const cE = (element) => document.createElement(element);

const scrollToTopButton = document.getElementById("scrollToTopButton");

// Funzione per generare un numero casuale compreso tra min e max
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Funzione per ottenere il nome della tipologia di appuntamento in base all'ID
function getTypeName(typeId) {
  const type = types.find((type) => type.id === typeId);
  return type ? type.name : "N/A";
}

// Funzione per ordinare gli appuntamenti in base alla priorità
function sortAppointmentsByPriority(appointments) {
  return appointments.sort((a, b) => a.priority - b.priority);
}

// Funzione per separare gli appuntamenti per tipologia
function separateAppointmentsByType(appointments) {
  const separatedAppointments = {};

  appointments.forEach((appointment) => {
    const typeName = getTypeName(appointment.typeId);

    if (!separatedAppointments[typeName]) {
      separatedAppointments[typeName] = [];
    }

    separatedAppointments[typeName].push(appointment);
  });

  return separatedAppointments;
}

// Funzione per creare gli elementi HTML di un singolo appuntamento
function createAppointmentElement(appointment) {
  const appointmentContainer = cE("div");
  appointmentContainer.classList.add("appointment");
  appointmentContainer.setAttribute("id", `appointment-${appointment.id}`);

  const appointmentName = cE("h2");
  appointmentName.textContent = appointment.title;

  const appointmentPriority = cE("span");
  appointmentPriority.textContent = ` ` + `${appointment.priority}`;

  const appointmentType = cE("span");
  appointmentType.textContent = `${getTypeName(appointment.typeId)}`;

  appointmentContainer.addEventListener("click", function () {
    deleteAppointment(appointment.id);
    appointmentContainer.remove();
  });

  appointmentContainer.append(
    appointmentName,
    appointmentType,
    appointmentPriority
  );

  return appointmentContainer;
}

// Funzione per creare gli elementi HTML degli appuntamenti
function createAppointmentElements(appointments) {
  const appointmentContainer = cE("div");
  appointmentContainer.classList.add("appointment-block");

  appointments.forEach((appointment) => {
    const appointmentElement = createAppointmentElement(appointment);
    appointmentContainer.appendChild(appointmentElement);
  });

  return appointmentContainer;
}

function handleScrollSpy() {
  const scrollspyNav = document.querySelector("[data-scrollspy]");
  const sections = document.querySelectorAll(".scrollspy-section");

  const navLinks = scrollspyNav.querySelectorAll("a");

  // Rimuovi la classe attiva da tutti i link
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });

  // Determina la sezione corrente in base allo scroll
  let currentSection = null;
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (window.pageYOffset >= sectionTop - sectionHeight / 2) {
      currentSection = section;
    }
  });

  // Aggiungi la classe attiva al link corrispondente alla sezione corrente
  if (currentSection) {
    const currentLinkId = currentSection.getAttribute("id");
    const currentLink = scrollspyNav.querySelector(
      `a[href="#${currentLinkId}"]`
    );

    if (currentLink) {
      currentLink.classList.add("active");
    }
  }
}

// Funzione per caricare e gestire gli appuntamenti
function loadAppointments() {
  fetch("https://jsonplaceholder.typicode.com/todos")
    .then((response) => response.json())
    .then((data) => {
      const appointments = data.map((appointment) => ({
        ...appointment,
        priority: getRandomNumber(1, 4),
        typeId: getRandomNumber(1, 3),
      }));

      const sortedAppointments = sortAppointmentsByPriority(appointments);
      const separatedAppointments =
        separateAppointmentsByType(sortedAppointments);

      const appContainer = document.getElementById("app");

      for (const typeName in separatedAppointments) {
        const typeContainer = cE("div");
        const typeHeading = cE("h3");

        typeHeading.textContent = `${typeName}`;
        typeContainer.appendChild(typeHeading);

        const appointmentElements = createAppointmentElements(
          separatedAppointments[typeName]
        );
        typeContainer.appendChild(appointmentElements);

        appContainer.appendChild(typeContainer);
      }
    })
    .catch((error) => {
      console.error(
        "Si è verificato un errore durante il recupero degli appuntamenti:",
        error
      );
    });
}

function deleteAppointment(appointmentId) {
  const appointmentElement = document.getElementById(
    `appointment-${appointmentId}`
  );
  if (appointmentElement) {
    appointmentElement.remove();
  }
}

// Carica gli appuntamenti quando il documento HTML è pronto
document.addEventListener("DOMContentLoaded", loadAppointments);

window.addEventListener("scroll", function () {
  if (window.pageYOffset > 100) {
    scrollToTopButton.classList.add("show");
  } else {
    scrollToTopButton.classList.remove("show");
  }
});

// Scrolla verso l'alto quando il pulsante viene cliccato
scrollToTopButton.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Aggiungere scrollspy navbar
// modificare css
// aggiungere altre funzionalità
