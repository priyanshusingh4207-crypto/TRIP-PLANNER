
/* ========================================
   TRIPMATE — TRIP PLANNER LOGIC
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
  const tripForm = document.getElementById("tripForm");
  const destinationInput = document.getElementById("destination");
  const startDateInput = document.getElementById("startDate");
  const durationInput = document.getElementById("duration");
  const travelersInput = document.getElementById("travelers");
  const budgetInput = document.getElementById("budget");
  const interestsInput = document.getElementById("interests");

  const resultsSection = document.getElementById("results");
  const tripSummary = document.getElementById("tripSummary");
  const itinerary = document.getElementById("itinerary");

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  // Set the current year in the footer.
  document.getElementById("year").textContent =
    new Date().getFullYear();

  // Use the local date instead of UTC to avoid timezone issues.
  function localDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const today = localDateString(new Date());

  startDateInput.min = today;
  startDateInput.value = today;

  // Mobile navigation.
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });

  // Clicking a destination card fills the planner form.
  document.querySelectorAll("[data-destination]").forEach((button) => {
    button.addEventListener("click", () => {
      destinationInput.value = button.dataset.destination;

      document.getElementById("planner").scrollIntoView({
        behavior: "smooth"
      });

      destinationInput.focus({ preventScroll: true });
    });
  });

  // Currency formatting.
  function formatMoney(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  }

  function formatDate(date) {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  function getBudgetDetails(level) {
    const budgets = {
      budget: {
        label: "Budget-friendly",
        daily: 1800
      },
      moderate: {
        label: "Mid-range",
        daily: 4500
      },
      luxury: {
        label: "Luxury",
        daily: 12000
      }
    };

    return budgets[level] || budgets.moderate;
  }

  // Starter activities by travel interest.
  // These are general suggestions, not live destination data.
  const activities = {
    mixed: [
      {
        morning: "Explore a local landmark",
        morningText: "Start early, explore the area, and take photos.",
        afternoon: "Discover the neighborhood",
        afternoonText: "Enjoy a local lunch and visit a popular attraction.",
        evening: "Sunset and local dining",
        eveningText: "Relax at a scenic spot and try regional food."
      },
      {
        morning: "Take a scenic morning walk",
        morningText: "Visit a park, waterfront, viewpoint, or quiet street.",
        afternoon: "Visit a cultural attraction",
        afternoonText: "Explore a museum, historic site, or local market.",
        evening: "Enjoy the local atmosphere",
        eveningText: "Explore the town center and find a memorable dinner."
      },
      {
        morning: "Discover a hidden gem",
        morningText: "Explore a less-crowded area and nearby sights.",
        afternoon: "Enjoy a local experience",
        afternoonText: "Try a food tour, craft workshop, or guided activity.",
        evening: "A relaxed final outing",
        eveningText: "Take a final walk and enjoy the evening views."
      }
    ],

    adventure: [
      {
        morning: "Head outdoors",
        morningText: "Choose a suitable trail, nature walk, or outdoor excursion.",
        afternoon: "Try an adventure activity",
        afternoonText: "Consider cycling, kayaking, or a guided outdoor activity.",
        evening: "Recover and recharge",
        eveningText: "Enjoy a hearty meal and rest after your day."
      },
      {
        morning: "Explore a nature trail",
        morningText: "Start early and bring water and suitable footwear.",
        afternoon: "Visit a natural viewpoint",
        afternoonText: "Explore a scenic area or book a guided excursion.",
        evening: "Enjoy the outdoors",
        eveningText: "Find a safe scenic spot and relax before dinner."
      }
    ],

    culture: [
      {
        morning: "Explore a historic landmark",
        morningText: "Learn about local history and architecture.",
        afternoon: "Visit a museum or heritage site",
        afternoonText: "Allow enough time for exhibits and guided tours.",
        evening: "Experience local traditions",
        eveningText: "Look for a cultural performance or historic district."
      },
      {
        morning: "Discover local architecture",
        morningText: "Walk through a historic neighborhood.",
        afternoon: "Explore art and craft",
        afternoonText: "Visit a gallery, artisan market, or cultural center.",
        evening: "Taste the regional cuisine",
        eveningText: "Choose a restaurant featuring local specialties."
      }
    ],

    food: [
      {
        morning: "Start with a local breakfast",
        morningText: "Try a traditional breakfast or visit a popular cafe.",
        afternoon: "Explore a food market",
        afternoonText: "Sample regional dishes and discover local ingredients.",
        evening: "Enjoy a food adventure",
        eveningText: "Choose a local restaurant or join a food tour."
      },
      {
        morning: "Visit a neighborhood cafe",
        morningText: "Enjoy coffee or tea and observe local life.",
        afternoon: "Try regional specialties",
        afternoonText: "Visit a market or consider a cooking class.",
        evening: "Dinner like a local",
        eveningText: "Explore local dining spots and try something new."
      }
    ],

    relaxation: [
      {
        morning: "Enjoy a slow morning",
        morningText: "Have breakfast without rushing and enjoy the scenery.",
        afternoon: "Spend time somewhere peaceful",
        afternoonText: "Visit a garden, beach, lake, or quiet scenic area.",
        evening: "Watch the sunset",
        eveningText: "Enjoy a relaxed dinner and a peaceful evening."
      },
      {
        morning: "Find a beautiful viewpoint",
        morningText: "Take an easy walk and enjoy the surroundings.",
        afternoon: "Take a leisurely break",
        afternoonText: "Relax at a cafe, spa, beach, or landscaped garden.",
        evening: "Enjoy a quiet evening",
        eveningText: "Try local food and leave plenty of time to unwind."
      }
    ]
  };

  // Create elements safely, without inserting user input as HTML.
  function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    if (text !== undefined) {
      element.textContent = text;
    }

    return element;
  }

  function addSummaryItem(label, value) {
    const item = createElement("div", "summary-item");
    item.append(
      createElement("span", "", label),
      createElement("strong", "", value)
    );

    tripSummary.appendChild(item);
  }

  function addActivity(card, time, title, description) {
    const activity = createElement("div", "activity");

    activity.append(
      createElement("strong", "", `${time} · ${title}`),
      createElement("p", "", description)
    );

    card.appendChild(activity);
  }

  function buildDayCard(dayNumber, date, plan, dailyCost) {
    const card = createElement("article", "day-card");

    card.append(
      createElement("div", "day-label", `DAY ${dayNumber}`),
      createElement("h3", "", formatDate(date))
    );

    addActivity(
      card,
      "MORNING",
      plan.morning,
      plan.morningText
    );

    addActivity(
      card,
      "AFTERNOON",
      plan.afternoon,
      plan.afternoonText
    );

    addActivity(
      card,
      "EVENING",
      plan.evening,
      plan.eveningText
    );

    card.appendChild(
      createElement(
        "div",
        "day-budget",
        `Estimated budget: ${formatMoney(dailyCost)} per person`
      )
    );

    return card;
  }

  function generateTrip(data) {
    const {
      destination,
      startDate,
      duration,
      travelers,
      budgetLevel,
      interest
    } = data;

    const budget = getBudgetDetails(budgetLevel);
    const dailyCost = budget.daily;
    const totalPerPerson = dailyCost * duration;
    const groupEstimate = totalPerPerson * travelers;

    // Update trip overview.
    tripSummary.replaceChildren();

    addSummaryItem("DESTINATION", destination);
    addSummaryItem(
      "TRAVEL DATES",
      `${formatDate(startDate)} · ${duration} days`
    );
    addSummaryItem(
      "TRAVELERS",
      `${travelers} ${travelers === 1 ? "person" : "people"}`
    );
    addSummaryItem("EST. GROUP BUDGET", formatMoney(groupEstimate));

    // Generate the day-by-day plan.
    itinerary.replaceChildren();

    const activityPlans = activities[interest] || activities.mixed;

    for (let index = 0; index < duration; index++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(dayDate.getDate() + index);

      const plan = activityPlans[index % activityPlans.length];

      itinerary.appendChild(
        buildDayCard(index + 1, dayDate, plan, dailyCost)
      );
    }

    // Show the results.
    resultsSection.hidden = false;

    resultsSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  // Handle the form submission.
  tripForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const destination = destinationInput.value.trim();

    if (!destination) {
      destinationInput.focus();
      return;
    }

    const selectedDate = startDateInput.value;
    const startDate = new Date(`${selectedDate}T12:00:00`);

    if (
      !selectedDate ||
      Number.isNaN(startDate.getTime()) ||
      selectedDate < today
    ) {
      alert("Please choose today or a future start date.");
      startDateInput.focus();
      return;
    }

    const duration = Number(durationInput.value);
    const travelers = Number(travelersInput.value);

    if (
      !Number.isInteger(duration) ||
      duration < 1 ||
      !Number.isInteger(travelers) ||
      travelers < 1
    ) {
      alert("Please select a valid trip duration and group size.");
      return;
    }

    generateTrip({
      destination,
      startDate,
      duration,
      travelers,
      budgetLevel: budgetInput.value,
      interest: interestsInput.value
    });
  });

  // Print the generated itinerary or save it as a PDF.
  document.getElementById("printButton").addEventListener("click", () => {
    window.print();
  });

  // Return to the form to change the trip details.
  document.getElementById("editTrip").addEventListener("click", () => {
    document.getElementById("planner").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    destinationInput.focus({ preventScroll: true });
  });
});
