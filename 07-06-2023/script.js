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

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getTypeName(typeId) {
  const type = types.find((type) => type.id === typeId);
  return type ? type.name : "N/A";
}

function sortAppointmentsByPriority(appointments) {
  return appointments.sort((a, b) => a.priority - b.priority);
}

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

function createAppointmentElement(appointment) {
  const appointmentContainer = cE("div");
  appointmentContainer.classList.add("appointment");
  appointmentContainer.setAttribute("id", `appointment-${appointment.id}`);

  const appointmentName = cE("h2");
  appointmentName.textContent = appointment.title;

  const appointmentPriority = cE("span");
  appointmentPriority.textContent = `${appointment.priority}`;

  const appointmentType = cE("span");
  appointmentType.textContent =
    ` ` + `-` + ` ${getTypeName(appointment.typeId)}`;

  // Icona per l'eliminazione dell'appuntamento
  const deleteIcon = cE("i");
  deleteIcon.classList.add("fas", "fa-times");
  deleteIcon.addEventListener("click", function (event) {
    event.stopPropagation(); // Evita la propagazione del click al contenitore dell'appuntamento
    deleteAppointment(appointment.id);
    appointmentContainer.remove();
  });

  // Icona per il completamento dell'appuntamento
  const completeIcon = cE("i");
  completeIcon.classList.add("fas", "fa-check");

  function completeAppointmentHandler() {
    if (appointmentContainer.classList.contains("completed")) {
      // Se l'appuntamento è già completato, rimuovi lo stile di completamento
      completeAppointment(appointment.id);
      appointmentContainer.classList.remove("completed");
    } else {
      // Altrimenti, contrassegna l'appuntamento come completato e applica lo stile di completamento
      completeAppointment(appointment.id);
      appointmentContainer.classList.add("completed");
    }
  }

  completeIcon.addEventListener("click", function (event) {
    event.stopPropagation(); // Evita la propagazione del click al contenitore dell'appuntamento
    completeAppointmentHandler();
  });

  appointmentContainer.append(
    appointmentName,
    appointmentPriority,
    appointmentType,
    deleteIcon,
    completeIcon
  );

  return appointmentContainer;
}

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
  const scrollspyNav = document.querySelector(".custom-nav");
  const sections = document.querySelectorAll(".scrollspy-section");

  const navLinks = scrollspyNav.querySelectorAll("a");

  navLinks.forEach((link) => {
    link.classList.remove("active");
  });

  let currentSection = null;
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (window.pageYOffset >= sectionTop - sectionHeight / 2) {
      currentSection = section;
    }
  });

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

function loadAppointments() {
  fetch("https://jsonplaceholder.typicode.com/todos/?_limit=15")
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
      const noAppointmentsMessage = document.getElementById(
        "noAppointmentsMessage"
      );

      if (Object.keys(separatedAppointments).length === 0) {
        noAppointmentsMessage.style.display = "block";
        appContainer.style.display = "none";
      } else {
        noAppointmentsMessage.style.display = "none";
        appContainer.style.display = "block";

        for (const typeName in separatedAppointments) {
          const typeContainer = cE("div");
          const typeHeading = cE("h3");

          typeHeading.textContent = typeName;
          typeContainer.appendChild(typeHeading);
          typeContainer.classList.add("scrollspy-section");

          const appointmentElements = createAppointmentElements(
            separatedAppointments[typeName]
          );
          typeContainer.appendChild(appointmentElements);

          appContainer.appendChild(typeContainer);
        }
      }
    })
    .catch((error) => {
      console.error(
        "Si è verificato un errore durante il recupero degli appuntamenti:",
        error
      );
    });
}

function saveDeletedAppointment(appointment) {
  const deletedAppointments =
    JSON.parse(sessionStorage.getItem("deletedAppointments")) || [];

  deletedAppointments.push(appointment.id);

  sessionStorage.setItem(
    "deletedAppointments",
    JSON.stringify(deletedAppointments)
  );
}

function deleteAppointment(appointmentId) {
  console.log(`Cancellazione appuntamento con ID: ${appointmentId}`);
  const appointment = {
    id: appointmentId,
    deletedAt: new Date().toISOString(),
  };
  saveDeletedAppointment(appointment);
}

function completeAppointment(appointmentId) {
  console.log(`Appuntamento completato con ID: ${appointmentId}`);
  // Aggiungi qui il codice per contrassegnare l'appuntamento come completato
}

document.addEventListener("DOMContentLoaded", function () {
  loadAppointments();

  const navItems = document.querySelectorAll(".custom-nav li");
  navItems.forEach(function (item) {
    item.addEventListener("click", function (event) {
      event.preventDefault();
      const href = item.querySelector("a").getAttribute("href");
      const targetId = href.replace("#", "");
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 100) {
      scrollToTopButton.classList.add("show");
    } else {
      scrollToTopButton.classList.remove("show");
    }
  });

  scrollToTopButton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", handleScrollSpy);
});
