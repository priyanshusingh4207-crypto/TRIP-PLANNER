

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

  document.getElementById("year").textContent = new Date().getFullYear();

  function localDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const today = localDateString(new Date());
  startDateInput.min = today;
  startDateInput.value = today;

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

  document.querySelectorAll("[data-destination]").forEach((button) => {
    button.addEventListener("click", () => {
      destinationInput.value = button.dataset.destination;
      document.getElementById("planner").scrollIntoView({ behavior: "smooth" });
      destinationInput.focus({ preventScroll: true });
    });
  });

  /*
   * Destination database.
   * Every attraction has interest tags so the selected interest
   * changes which places are prioritized in the itinerary.
   * Amounts are illustrative estimates, not live prices.
   */
  const destinations = {
    delhi: {
      name: "Delhi", country: "India", currency: "INR", locale: "en-IN",
      budgets: { budget: 1800, moderate: 4500, luxury: 12000 },
      aliases: ["new delhi", "india", "ncr"],
      places: [
        ["Red Fort", "Explore the Mughal-era fort and its historic grounds.", ["culture"]],
        ["Jama Masjid and Old Delhi", "Walk through Old Delhi's historic lanes and architecture.", ["culture", "food"]],
        ["Chandni Chowk food walk", "Sample local street food; choose busy, hygienic vendors.", ["food", "culture"]],
        ["Humayun's Tomb", "Visit the garden tomb and admire Mughal architecture.", ["culture", "relaxation"]],
        ["India Gate and Central Vista", "Enjoy a walk around this landmark area.", ["relaxation", "culture"]],
        ["National Museum", "Explore collections covering India's art and history.", ["culture"]],
        ["Lodhi Garden", "Take a peaceful walk among gardens and historic tombs.", ["relaxation", "adventure"]],
        ["Qutub Minar", "See the celebrated minaret and surrounding archaeological complex.", ["culture"]],
        ["Dilli Haat", "Browse crafts and try regional Indian food stalls.", ["food", "culture"]],
        ["Akshardham area", "Explore the temple complex; check entry and security rules in advance.", ["culture"]],
        ["Hauz Khas Village", "Explore cafes, boutiques, and the nearby historic complex.", ["food", "relaxation"]],
        ["Sanjay Van nature walk", "Choose a daytime nature walk and follow marked paths.", ["adventure", "relaxation"]]
      ]
    },
    jaipur: {
      name: "Jaipur", country: "India", currency: "INR", locale: "en-IN",
      budgets: { budget: 1700, moderate: 4200, luxury: 11000 }, aliases: ["pink city"],
      places: [
        ["Amber Fort", "Explore the hilltop fort and its courtyards.", ["culture", "adventure"]],
        ["Hawa Mahal", "See Jaipur's famous honeycomb-style palace facade.", ["culture"]],
        ["City Palace", "Discover royal courtyards, museums, and architecture.", ["culture"]],
        ["Jantar Mantar", "Explore the historic astronomical instruments.", ["culture"]],
        ["Johari Bazaar", "Browse traditional jewelry and handicrafts.", ["food", "culture"]],
        ["Rajasthani thali experience", "Try regional dishes at a well-reviewed local restaurant.", ["food"]],
        ["Nahargarh Fort viewpoint", "Enjoy city views; plan transport for the hill route.", ["adventure", "relaxation"]],
        ["Albert Hall Museum", "Visit the museum for art, crafts, and historical collections.", ["culture"]],
        ["Patrika Gate", "Photograph the colorful decorated passageway.", ["culture", "relaxation"]],
        ["Bapu Bazaar", "Shop for textiles, souvenirs, and local crafts.", ["food", "culture"]],
        ["Panna Meena ka Kund", "See the geometric stepwell near Amber.", ["culture"]],
        ["Central Park Jaipur", "Take a relaxed walk in a large city park.", ["relaxation", "adventure"]]
      ]
    },
    mumbai: {
      name: "Mumbai", country: "India", currency: "INR", locale: "en-IN",
      budgets: { budget: 2200, moderate: 5500, luxury: 15000 }, aliases: ["bombay"],
      places: [
        ["Gateway of India", "Visit Mumbai's waterfront landmark.", ["culture", "relaxation"]],
        ["Chhatrapati Shivaji Maharaj Vastu Sangrahalaya", "Explore art and history collections.", ["culture"]],
        ["Colaba Causeway", "Browse shops and street stalls around Colaba.", ["food", "culture"]],
        ["Marine Drive", "Walk along the sea-facing promenade, especially near sunset.", ["relaxation"]],
        ["Elephanta Caves", "Take the ferry and explore the historic cave sculptures; check ferry times.", ["culture", "adventure"]],
        ["Mumbai street-food tasting", "Try local favorites from reputable stalls or eateries.", ["food"]],
        ["Bandra street art and cafes", "Explore murals, independent shops, and cafes.", ["food", "culture"]],
        ["Sanjay Gandhi National Park", "Enjoy green trails and nature; check access and timings.", ["adventure", "relaxation"]],
        ["Kala Ghoda district", "Explore galleries, architecture, and cultural spaces.", ["culture"]],
        ["Dadar flower market area", "Experience an early-morning local market scene.", ["culture", "food"]],
        ["Juhu Beach", "Take a beach walk and sample local snacks from established vendors.", ["relaxation", "food"]],
        ["Worli Sea Face", "Enjoy coastal views and a relaxed evening walk.", ["relaxation"]]
      ]
    },
    manali: {
      name: "Manali", country: "India", currency: "INR", locale: "en-IN",
      budgets: { budget: 2000, moderate: 5000, luxury: 13000 }, aliases: ["the mountains", "himachal", "manali india"],
      places: [
        ["Solang Valley", "Enjoy mountain scenery; book adventure activities with licensed operators.", ["adventure", "relaxation"]],
        ["Old Manali", "Walk through the village lanes and browse relaxed cafes.", ["food", "relaxation"]],
        ["Hadimba Devi Temple", "Visit the cedar-forest temple and its surroundings.", ["culture", "relaxation"]],
        ["Vashisht hot springs area", "Explore the village and check local bathing-facility rules.", ["relaxation", "culture"]],
        ["Beas River viewpoints", "Enjoy riverside scenery from safe, permitted spots.", ["relaxation", "adventure"]],
        ["Naggar Castle", "Visit the historic castle and nearby village area.", ["culture"]],
        ["Himalayan nature walk", "Choose a marked trail suitable for the season and your fitness.", ["adventure"]],
        ["Mall Road", "Browse shops and try Himachali food at local restaurants.", ["food", "culture"]],
        ["Local Himachali meal", "Try regional dishes such as siddu at a reputable eatery.", ["food"]],
        ["Manu Temple area", "Explore the temple area and nearby mountain lanes.", ["culture", "adventure"]],
        ["Mountain photography stop", "Plan a daytime viewpoint stop and check road conditions.", ["relaxation", "adventure"]],
        ["Village and orchard walk", "Take a gentle walk where paths are open and accessible.", ["adventure", "relaxation"]]
      ]
    },
    newyork: {
      name: "New York", country: "United States", currency: "USD", locale: "en-US",
      budgets: { budget: 90, moderate: 220, luxury: 500 }, aliases: ["new york city", "nyc", "usa", "united states", "united states of america"],
      places: [
        ["Central Park", "Explore the park's walking paths and scenic corners.", ["relaxation", "adventure"]],
        ["The Metropolitan Museum of Art", "Explore major art collections; check ticket details before visiting.", ["culture"]],
        ["Times Square", "See the bright billboards and busy theater district.", ["culture", "food"]],
        ["Statue of Liberty and Ellis Island", "Book ferry tickets and allow time for security.", ["culture", "adventure"]],
        ["Brooklyn Bridge walk", "Walk across the bridge and enjoy skyline views.", ["adventure", "relaxation"]],
        ["Chelsea Market", "Sample food from a range of vendors.", ["food"]],
        ["9/11 Memorial area", "Visit the memorial respectfully and check museum hours.", ["culture"]],
        ["High Line", "Walk the elevated park and view the city from above street level.", ["relaxation", "adventure"]],
        ["Greenwich Village", "Explore historic streets, cafes, and music venues.", ["food", "culture"]],
        ["Museum of Modern Art", "Discover modern and contemporary art.", ["culture"]],
        ["Koreatown food stop", "Try Korean food in a well-reviewed restaurant.", ["food"]],
        ["Hudson River Park", "Enjoy a waterfront walk or bike ride.", ["relaxation", "adventure"]]
      ]
    },
    london: {
      name: "London", country: "United Kingdom", currency: "GBP", locale: "en-GB",
      budgets: { budget: 70, moderate: 160, luxury: 350 }, aliases: ["uk", "united kingdom", "england", "great britain"],
      places: [
        ["Tower of London", "Explore the historic fortress; reserve entry if needed.", ["culture"]],
        ["British Museum", "See collections spanning many world cultures.", ["culture"]],
        ["Westminster and Big Ben", "Walk around London's best-known parliamentary landmarks.", ["culture", "relaxation"]],
        ["Borough Market", "Try food from independent traders and bakeries.", ["food"]],
        ["Hyde Park", "Enjoy a walk or relaxed afternoon in the park.", ["relaxation", "adventure"]],
        ["South Bank walk", "Follow the Thames past cultural venues and riverside views.", ["relaxation", "culture"]],
        ["Covent Garden", "Explore street performers, shops, and cafes.", ["food", "culture"]],
        ["National Gallery", "View celebrated paintings in Trafalgar Square.", ["culture"]],
        ["Camden Market", "Browse alternative fashion, crafts, and international food.", ["food", "culture"]],
        ["St James's Park", "Take a scenic walk near royal landmarks.", ["relaxation"]],
        ["Shoreditch street art", "Discover murals and independent creative spaces.", ["culture", "adventure"]],
        ["Traditional afternoon tea", "Book a tea experience that fits your budget.", ["food", "relaxation"]]
      ]
    },
    paris: {
      name: "Paris", country: "France", currency: "EUR", locale: "fr-FR",
      budgets: { budget: 75, moderate: 170, luxury: 380 }, aliases: ["france"],
      places: [
        ["Eiffel Tower area", "Visit the landmark area and book tower access in advance if desired.", ["culture", "relaxation"]],
        ["Louvre Museum", "Plan a focused visit and reserve timed entry where required.", ["culture"]],
        ["Montmartre and Sacré-Cœur", "Explore hilltop streets and the basilica area.", ["culture", "adventure"]],
        ["Seine river walk", "Enjoy riverside views and historic bridges.", ["relaxation"]],
        ["French bakery breakfast", "Try a fresh pastry and coffee at a local boulangerie.", ["food"]],
        ["Musée d'Orsay", "Explore Impressionist and post-Impressionist art.", ["culture"]],
        ["Le Marais", "Browse historic lanes, boutiques, and cafes.", ["food", "culture"]],
        ["Luxembourg Gardens", "Relax in the gardens and enjoy the landscaped grounds.", ["relaxation"]],
        ["Latin Quarter", "Explore bookshops, historic streets, and casual restaurants.", ["food", "culture"]],
        ["French market lunch", "Sample cheeses, bread, and seasonal produce at a local market.", ["food"]],
        ["Arc de Triomphe area", "See the monument and city avenues; use designated crossings.", ["culture"]],
        ["Canal Saint-Martin", "Take a leisurely canal-side walk and visit independent cafes.", ["relaxation", "food"]]
      ]
    },
    tokyo: {
      name: "Tokyo", country: "Japan", currency: "JPY", locale: "ja-JP",
      budgets: { budget: 9000, moderate: 18000, luxury: 40000 }, aliases: ["japan"],
      places: [
        ["Senso-ji Temple in Asakusa", "Visit the temple and browse Nakamise shopping street.", ["culture"]],
        ["Shibuya Crossing", "See the famous crossing and explore nearby streets.", ["culture", "food"]],
        ["Meiji Jingu Shrine", "Walk through the forested approach to this Shinto shrine.", ["culture", "relaxation"]],
        ["Tsukiji Outer Market", "Sample Japanese breakfast and market snacks.", ["food"]],
        ["Shinjuku Gyoen", "Relax in a large garden; check seasonal opening information.", ["relaxation"]],
        ["Akihabara", "Explore electronics shops, games, and anime culture.", ["culture"]],
        ["Ueno Park and museums", "Combine park walks with a museum visit.", ["culture", "relaxation"]],
        ["Ramen or sushi meal", "Choose a well-reviewed local restaurant and explore regional styles.", ["food"]],
        ["Harajuku and Omotesando", "Explore youth fashion, design stores, and cafes.", ["food", "culture"]],
        ["Tokyo Skytree area", "Enjoy city views; check visibility and ticket availability.", ["relaxation", "culture"]],
        ["Imperial Palace East Gardens", "Walk through the public garden areas and historic grounds.", ["culture", "relaxation"]],
        ["Sumida riverside walk", "Enjoy a calmer walk with views of the city and river.", ["relaxation", "adventure"]]
      ]
    },
    kyoto: {
      name: "Kyoto", country: "Japan", currency: "JPY", locale: "ja-JP",
      budgets: { budget: 8500, moderate: 17000, luxury: 38000 }, aliases: ["kyoto japan"],
      places: [
        ["Fushimi Inari Taisha", "Walk through the famous red torii gates; go early for quieter paths.", ["culture", "adventure"]],
        ["Kiyomizu-dera", "Visit the hillside temple and historic streets nearby.", ["culture"]],
        ["Arashiyama Bamboo Grove", "Walk through the bamboo paths and nearby district.", ["relaxation", "adventure"]],
        ["Nishiki Market", "Sample Kyoto specialties and browse food stalls.", ["food"]],
        ["Gion historic district", "Explore traditional streets respectfully and follow photography rules.", ["culture"]],
        ["Ryoan-ji Zen garden", "Spend quiet time at the temple's famous rock garden.", ["relaxation", "culture"]],
        ["Philosopher's Path", "Take a scenic canal-side walk, especially in seasonal bloom.", ["relaxation", "adventure"]],
        ["Kyoto tea experience", "Book a tea ceremony or visit a traditional tea house.", ["food", "culture"]],
        ["Nijo Castle", "Explore the castle grounds and historic interiors.", ["culture"]],
        ["Pontocho dining lane", "Try Kyoto cuisine in a restaurant that suits your budget.", ["food"]],
        ["Heian Shrine garden", "Enjoy the shrine grounds and landscaped garden.", ["relaxation", "culture"]],
        ["Traditional craft workshop", "Try a local craft experience; book ahead when needed.", ["culture", "adventure"]]
      ]
    },
    bali: {
      name: "Bali", country: "Indonesia", currency: "IDR", locale: "id-ID",
      budgets: { budget: 500000, moderate: 1200000, luxury: 3000000 }, aliases: ["indonesia", "ubud", "canggu"],
      places: [
        ["Ubud Art Market", "Browse crafts, textiles, and locally made souvenirs.", ["culture"]],
        ["Tegallalang Rice Terraces", "Enjoy the landscape and follow marked paths.", ["adventure", "relaxation"]],
        ["Balinese cooking class", "Learn to prepare regional dishes with a local instructor.", ["food", "culture"]],
        ["Tirta Empul Temple", "Learn about temple traditions and follow visitor dress rules.", ["culture"]],
        ["Ubud Monkey Forest", "Visit the forest sanctuary and follow wildlife safety instructions.", ["adventure", "relaxation"]],
        ["Balinese warung meal", "Try local dishes such as nasi campur at a clean, well-reviewed warung.", ["food"]],
        ["Campuhan Ridge Walk", "Take a scenic walk and bring water for warm weather.", ["adventure", "relaxation"]],
        ["Sanur beach", "Enjoy a relaxed seaside walk and calm coastal scenery.", ["relaxation"]],
        ["Uluwatu Temple area", "See the cliffside temple; check sunset performance times.", ["culture", "relaxation"]],
        ["Balinese massage or spa", "Choose a reputable spa and check the service price first.", ["relaxation"]],
        ["Local coffee tasting", "Try Balinese coffee and learn about local growing traditions.", ["food", "culture"]],
        ["Waterfall visit", "Choose an accessible waterfall and follow safety signage.", ["adventure"]]
      ]
    },
    bangkok: {
      name: "Bangkok", country: "Thailand", currency: "THB", locale: "th-TH",
      budgets: { budget: 1200, moderate: 3000, luxury: 7000 }, aliases: ["thailand"],
      places: [
        ["Grand Palace area", "Visit the royal complex and follow its dress code.", ["culture"]],
        ["Wat Pho", "Explore the temple complex and reclining Buddha.", ["culture"]],
        ["Wat Arun", "Visit the riverside temple and enjoy views across the Chao Phraya.", ["culture", "relaxation"]],
        ["Chatuchak Weekend Market", "Browse food, crafts, and clothing; check which days it operates.", ["food", "culture"]],
        ["Chinatown food walk", "Sample Thai-Chinese dishes from established vendors.", ["food"]],
        ["Chao Phraya river ferry", "Use public river transport to see the city from the water.", ["adventure", "relaxation"]],
        ["Lumphini Park", "Enjoy a green break and walking paths in the city.", ["relaxation", "adventure"]],
        ["Thai cooking class", "Learn to prepare Thai dishes with a local instructor.", ["food", "culture"]],
        ["Jim Thompson House", "Explore traditional Thai architecture and art collections.", ["culture"]],
        ["Local Thai massage", "Choose a reputable provider and confirm the price beforehand.", ["relaxation"]],
        ["Bangkok canal-side neighborhood", "Explore a guided canal area tour and local life.", ["culture", "adventure"]],
        ["Thai dessert tasting", "Try regional sweets at a market or local cafe.", ["food"]]
      ]
    },
    singapore: {
      name: "Singapore", country: "Singapore", currency: "SGD", locale: "en-SG",
      budgets: { budget: 90, moderate: 220, luxury: 500 }, aliases: ["republic of singapore"],
      places: [
        ["Gardens by the Bay", "Explore the waterfront gardens; check conservatory ticket options.", ["relaxation", "culture"]],
        ["Marina Bay waterfront", "Walk around the bay and enjoy the skyline.", ["relaxation"]],
        ["Maxwell Food Centre", "Try local hawker dishes at this well-known food centre.", ["food"]],
        ["Chinatown heritage area", "Explore temples, heritage streets, and local shops.", ["culture", "food"]],
        ["Little India", "Discover colorful streets, shops, and South Asian food.", ["food", "culture"]],
        ["National Gallery Singapore", "Explore Southeast Asian art collections.", ["culture"]],
        ["Singapore Botanic Gardens", "Enjoy a walk through the UNESCO-listed gardens.", ["relaxation", "adventure"]],
        ["Sentosa coastal activities", "Choose a beach or activity that fits your budget.", ["adventure", "relaxation"]],
        ["Kampong Glam", "Explore Malay heritage, independent shops, and cafes.", ["culture", "food"]],
        ["Hawker centre food trail", "Try a few local dishes while keeping to your budget.", ["food"]],
        ["Southern Ridges walk", "Follow the walking paths and elevated bridges.", ["adventure", "relaxation"]],
        ["Jewel Changi area", "See the indoor waterfall and browse dining options.", ["relaxation", "food"]]
      ]
    },
    dubai: {
      name: "Dubai", country: "United Arab Emirates", currency: "AED", locale: "en-AE",
      budgets: { budget: 250, moderate: 600, luxury: 1500 }, aliases: ["uae", "united arab emirates"],
      places: [
        ["Al Fahidi Historical Neighbourhood", "Explore traditional architecture and cultural spaces.", ["culture"]],
        ["Dubai Creek abra ride", "Take a traditional boat crossing and explore the creek area.", ["culture", "adventure"]],
        ["Gold and Spice Souks", "Browse the historic markets and compare prices before buying.", ["culture", "food"]],
        ["Dubai Mall and Burj Khalifa area", "Explore the downtown area; reserve observation tickets if desired.", ["culture"]],
        ["Jumeirah public beach", "Enjoy the coast and views of the city's waterfront.", ["relaxation"]],
        ["Emirati food experience", "Try local dishes at a reputable Emirati restaurant.", ["food", "culture"]],
        ["Dubai Marina promenade", "Take a waterfront walk and explore cafes.", ["relaxation", "food"]],
        ["Desert conservation excursion", "Choose a licensed operator and follow desert safety guidance.", ["adventure"]],
        ["Museum of the Future area", "Check timed entry and explore the surrounding district.", ["culture"]],
        ["Alserkal Avenue", "Discover galleries and creative spaces.", ["culture"]],
        ["Palm Jumeirah viewpoint", "Enjoy coastal views from a permitted public viewpoint.", ["relaxation"]],
        ["Local breakfast cafe", "Try regional breakfast dishes and Arabic coffee.", ["food"]]
      ]
    },
    rome: {
      name: "Rome", country: "Italy", currency: "EUR", locale: "it-IT",
      budgets: { budget: 70, moderate: 160, luxury: 350 }, aliases: ["italy"],
      places: [
        ["Colosseum and Roman Forum", "Explore ancient Rome; timed tickets are strongly recommended.", ["culture"]],
        ["Pantheon area", "Visit the historic monument and surrounding piazzas.", ["culture"]],
        ["Trevi Fountain", "See the famous fountain and nearby historic streets.", ["culture", "relaxation"]],
        ["Trastevere food walk", "Try Roman dishes in a neighborhood trattoria.", ["food", "culture"]],
        ["Vatican Museums area", "Plan ahead for museum entry and dress requirements.", ["culture"]],
        ["Villa Borghese gardens", "Enjoy a park walk and scenic viewpoints.", ["relaxation", "adventure"]],
        ["Roman pizza tasting", "Try a local-style pizza at a well-reviewed pizzeria.", ["food"]],
        ["Piazza Navona", "Admire the square, fountains, and surrounding architecture.", ["culture", "relaxation"]],
        ["Campo de' Fiori market area", "Browse market stalls when operating and nearby food shops.", ["food", "culture"]],
        ["Appian Way walk", "Explore a historic route; check access and transport.", ["adventure", "culture"]],
        ["Gelato tasting", "Try gelato from a reputable artisan shop.", ["food"]],
        ["Aventine Hill viewpoint", "Enjoy a quieter walk and city views.", ["relaxation"]]
      ]
    },
    barcelona: {
      name: "Barcelona", country: "Spain", currency: "EUR", locale: "es-ES",
      budgets: { budget: 65, moderate: 145, luxury: 320 }, aliases: ["spain"],
      places: [
        ["Sagrada Família", "Explore Gaudí's basilica; book timed entry in advance.", ["culture"]],
        ["Park Güell", "See colorful architecture and city views; check ticketed areas.", ["culture", "relaxation"]],
        ["Gothic Quarter", "Walk the medieval lanes and historic squares.", ["culture", "adventure"]],
        ["La Boqueria market", "Try Catalan snacks and seasonal produce.", ["food"]],
        ["Barceloneta waterfront", "Enjoy the beach promenade and sea views.", ["relaxation", "adventure"]],
        ["Tapas evening", "Try several small dishes at a well-reviewed local bar.", ["food"]],
        ["Casa Batlló area", "Admire modernist architecture and nearby Passeig de Gràcia.", ["culture"]],
        ["Montjuïc gardens", "Explore gardens and viewpoints; check cable-car operation if relevant.", ["relaxation", "adventure"]],
        ["El Born district", "Browse galleries, independent shops, and cafes.", ["food", "culture"]],
        ["Catalan cooking experience", "Join a local food workshop or market-led cooking class.", ["food", "culture"]],
        ["Picasso Museum", "Explore the artist's work and connections to Barcelona.", ["culture"]],
        ["Ciutadella Park", "Take a relaxed walk through the city's central park.", ["relaxation"]]
      ]
    },
    amsterdam: {
      name: "Amsterdam", country: "Netherlands", currency: "EUR", locale: "nl-NL",
      budgets: { budget: 80, moderate: 180, luxury: 400 }, aliases: ["netherlands", "holland"],
      places: [
        ["Canal belt walk", "Walk along historic canals and bridges.", ["relaxation", "culture"]],
        ["Rijksmuseum", "Explore Dutch art and history; check timed-entry requirements.", ["culture"]],
        ["Anne Frank House area", "Learn about the history and book museum entry well in advance.", ["culture"]],
        ["Albert Cuyp Market", "Browse market stalls and try Dutch snacks.", ["food", "culture"]],
        ["Vondelpark", "Enjoy a walk, picnic, or relaxed afternoon outdoors.", ["relaxation", "adventure"]],
        ["Dutch pancake stop", "Try pancakes or stroopwafels at a local cafe.", ["food"]],
        ["Jordaan neighborhood", "Explore independent shops, galleries, and quiet canals.", ["culture", "relaxation"]],
        ["Van Gogh Museum", "Explore Van Gogh's work; reserve entry ahead of time.", ["culture"]],
        ["Bike ride on designated routes", "Rent a bike only if comfortable with local cycling rules.", ["adventure"]],
        ["Foodhallen", "Sample different dishes at an indoor food hall.", ["food"]],
        ["NDSM waterfront", "Explore creative spaces and industrial waterfront scenery.", ["culture", "adventure"]],
        ["Begijnhof courtyard", "Visit this quiet historic courtyard respectfully.", ["culture", "relaxation"]]
      ]
    },
    kathmandu: {
      name: "Kathmandu", country: "Nepal", currency: "NPR", locale: "en-NP",
      budgets: { budget: 3000, moderate: 7000, luxury: 18000 }, aliases: ["nepal"],
      places: [
        ["Swayambhunath Stupa", "Visit the hilltop Buddhist complex and city viewpoints.", ["culture", "adventure"]],
        ["Boudhanath Stupa", "Explore the large stupa and surrounding monasteries respectfully.", ["culture"]],
        ["Patan Durbar Square", "Discover traditional Newari architecture and courtyards.", ["culture"]],
        ["Thamel food walk", "Try Nepali dishes at a well-reviewed local restaurant.", ["food"]],
        ["Kathmandu Durbar Square", "Explore historic palaces and temples; check current access.", ["culture"]],
        ["Garden of Dreams", "Take a quiet break in this restored garden.", ["relaxation"]],
        ["Local momo tasting", "Try momo dumplings at a reputable local eatery.", ["food"]],
        ["Pashupatinath Temple area", "Observe local customs and visitor rules at the sacred site.", ["culture"]],
        ["Nagarkot day viewpoint", "Plan transport and check weather for Himalayan views.", ["adventure", "relaxation"]],
        ["Asan market", "Explore a lively traditional market and local ingredients.", ["food", "culture"]],
        ["Traditional craft workshop", "Learn about local crafts from a community-based provider.", ["culture", "adventure"]],
        ["Shivapuri foothills walk", "Choose a permitted trail and check conditions before setting out.", ["adventure", "relaxation"]]
      ]
    },
    seoul: {
      name: "Seoul", country: "South Korea", currency: "KRW", locale: "ko-KR",
      budgets: { budget: 70000, moderate: 160000, luxury: 350000 }, aliases: ["south korea", "korea"],
      places: [
        ["Gyeongbokgung Palace", "Explore the royal palace and check ceremony schedules.", ["culture"]],
        ["Bukchon Hanok Village", "Walk through traditional lanes while respecting residents' privacy.", ["culture", "relaxation"]],
        ["Gwangjang Market", "Try Korean market food and local specialties.", ["food"]],
        ["Myeongdong", "Browse shops and try Korean street-food snacks.", ["food", "culture"]],
        ["N Seoul Tower area", "Enjoy city views and check visibility before visiting.", ["relaxation", "adventure"]],
        ["Hongdae", "Explore youth culture, music, cafes, and independent shops.", ["food", "culture"]],
        ["Hangang riverside park", "Relax by the river or rent a bike where available.", ["relaxation", "adventure"]],
        ["Korean barbecue meal", "Choose a restaurant and check menu prices before ordering.", ["food"]],
        ["Insadong", "Browse traditional crafts, tea houses, and cultural shops.", ["culture", "food"]],
        ["Changdeokgung Palace", "Explore palace architecture and check garden tour availability.", ["culture"]],
        ["Bukhansan trail", "Choose a route suited to your fitness and check weather conditions.", ["adventure"]],
        ["Korean tea house", "Take a quiet break with traditional tea and sweets.", ["food", "relaxation"]]
      ]
    },
    lisbon: {
      name: "Lisbon", country: "Portugal", currency: "EUR", locale: "pt-PT",
      budgets: { budget: 55, moderate: 130, luxury: 280 }, aliases: ["portugal"],
      places: [
        ["Belém Tower area", "Explore the riverside monument and surrounding waterfront.", ["culture", "relaxation"]],
        ["Jerónimos Monastery", "Admire the historic monastery; check entry arrangements.", ["culture"]],
        ["Alfama lanes", "Wander the old neighborhood and enjoy viewpoints.", ["culture", "adventure"]],
        ["Pastel de nata tasting", "Try Portugal's famous custard tart at a local bakery.", ["food"]],
        ["Tram 28 route area", "See historic streets and check crowding before boarding.", ["culture"]],
        ["Time Out Market", "Sample Portuguese dishes from multiple food stalls.", ["food"]],
        ["Miradouro viewpoint walk", "Visit a public viewpoint for city and river views.", ["relaxation", "adventure"]],
        ["Chiado district", "Explore bookshops, cafes, and historic shopping streets.", ["food", "culture"]],
        ["Fado music evening", "Book a reputable venue for traditional Portuguese music.", ["culture", "relaxation"]],
        ["LX Factory", "Browse creative shops, design studios, and casual dining.", ["food", "culture"]],
        ["Cascais coastal day trip", "Check train times and enjoy a coastal walk.", ["adventure", "relaxation"]],
        ["Portuguese seafood meal", "Try a local seafood specialty at a well-reviewed restaurant.", ["food"]]
      ]
    },
    hanoi: {
      name: "Hanoi", country: "Vietnam", currency: "VND", locale: "vi-VN",
      budgets: { budget: 600000, moderate: 1400000, luxury: 3500000 }, aliases: ["vietnam"],
      places: [
        ["Old Quarter walk", "Explore the historic streets and local shops.", ["culture", "adventure"]],
        ["Hoan Kiem Lake", "Enjoy a walk around the central lake.", ["relaxation"]],
        ["Street-side pho breakfast", "Try pho at a busy, well-reviewed local eatery.", ["food"]],
        ["Temple of Literature", "Visit the historic temple dedicated to scholarship.", ["culture"]],
        ["Dong Xuan Market", "Browse local goods and food stalls.", ["food", "culture"]],
        ["Vietnamese coffee tasting", "Try egg coffee or another local coffee style.", ["food"]],
        ["Hoa Lo Prison historical site", "Learn about the site's history and exhibitions.", ["culture"]],
        ["Water puppet performance", "Book a traditional performance and check show times.", ["culture"]],
        ["West Lake cycle or walk", "Enjoy lakeside scenery and stop at local cafes.", ["adventure", "relaxation"]],
        ["Bun cha lunch", "Try the local grilled-pork-and-noodle dish at a reputable restaurant.", ["food"]],
        ["French Quarter architecture walk", "See colonial-era architecture and tree-lined streets.", ["culture", "relaxation"]],
        ["Vietnamese cooking class", "Learn to prepare local dishes with a local instructor.", ["food", "culture"]]
      ]
    }
  };

  const aliasesToKey = {};
  Object.entries(destinations).forEach(([key, destination]) => {
    aliasesToKey[normalize(destination.name)] = key;
    aliasesToKey[normalize(destination.country)] ??= key;
    destination.aliases.forEach((alias) => { aliasesToKey[normalize(alias)] = key; });
  });

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function findDestination(input) {
    const normalized = normalize(input);
    if (aliasesToKey[normalized]) return destinations[aliasesToKey[normalized]];

    // Accept input such as "Paris, France" or "Tokyo Japan".
    const parts = normalized.split(" ").filter(Boolean);
    for (let length = parts.length; length > 0; length--) {
      const candidate = parts.slice(0, length).join(" ");
      if (aliasesToKey[candidate]) return destinations[aliasesToKey[candidate]];
    }
    for (let start = 1; start < parts.length; start++) {
      const candidate = parts.slice(start).join(" ");
      if (aliasesToKey[candidate]) return destinations[aliasesToKey[candidate]];
    }
    return null;
  }

  function formatMoney(amount, destination) {
    return new Intl.NumberFormat(destination.locale, {
      style: "currency",
      currency: destination.currency,
      maximumFractionDigits: 0
    }).format(amount);
  }

  function formatDate(date) {
    return date.toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });
  }

  function getBudgetDetails(level, destination) {
    const labels = {
      budget: "Budget-friendly",
      moderate: "Mid-range",
      luxury: "Luxury"
    };
    return {
      label: labels[level] || labels.moderate,
      daily: destination.budgets[level] || destination.budgets.moderate
    };
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function addSummaryItem(label, value) {
    const item = createElement("div", "summary-item");
    item.append(createElement("span", "", label), createElement("strong", "", value));
    tripSummary.appendChild(item);
  }

  function addActivity(card, time, title, description) {
    const activity = createElement("div", "activity");
    activity.append(createElement("strong", "", `${time} · ${title}`), createElement("p", "", description));
    card.appendChild(activity);
  }

  function choosePlaces(destination, interest, duration) {
    const places = destination.places.map((place, index) => ({
      title: place[0], description: place[1], tags: place[2], originalIndex: index
    }));

    // Prioritize the selected interest while preserving destination variety.
    places.sort((a, b) => {
      const aScore = interest === "mixed" ? 0 : (a.tags.includes(interest) ? 2 : 0);
      const bScore = interest === "mixed" ? 0 : (b.tags.includes(interest) ? 2 : 0);
      return bScore - aScore || a.originalIndex - b.originalIndex;
    });

    const required = duration * 3;
    const selected = places.slice(0, Math.min(required, places.length));

    // For longer trips, add locally relevant suggestions instead of generic global plans.
    const extensions = [
      { title: `Explore another ${destination.name} neighborhood`, description: `Choose a nearby district, check local opening times, and allow time to explore at your own pace.`, tags: ["mixed", "culture", "food"] },
      { title: `Local food experience in ${destination.name}`, description: `Try a regional specialty at a well-reviewed local restaurant or market.`, tags: ["food", "culture"] },
      { title: `Relaxed local walk in ${destination.name}`, description: `Choose a public park, waterfront, or walkable area suited to the weather and your interests.`, tags: ["relaxation", "adventure"] },
      { title: `Discover local history in ${destination.name}`, description: `Look for a museum, heritage site, or guided local-history walk.`, tags: ["culture"] }
    ];

    let extensionIndex = 0;
    while (selected.length < required) {
      const extension = extensions.find((item, index) =>
        !selected.some((selectedPlace) => selectedPlace.title === item.title) &&
        (interest === "mixed" || item.tags.includes(interest))
      ) || extensions[extensionIndex % extensions.length];
      selected.push({ ...extension, originalIndex: places.length + extensionIndex });
      extensionIndex++;
    }
    return selected;
  }

  function buildDayCard(dayNumber, date, dayPlaces, dailyCost, destination) {
    const card = createElement("article", "day-card");
    card.append(createElement("div", "day-label", `DAY ${dayNumber}`), createElement("h3", "", formatDate(date)));
    const slots = ["MORNING", "AFTERNOON", "EVENING"];
    dayPlaces.forEach((place, index) => addActivity(card, slots[index], place.title, place.description));
    card.appendChild(createElement("div", "day-budget", `Estimated budget: ${formatMoney(dailyCost, destination)} per person`));
    return card;
  }

  function generateTrip(data, destinationData) {
    const { destination, startDate, duration, travelers, budgetLevel, interest } = data;
    const budget = getBudgetDetails(budgetLevel, destinationData);
    const dailyCost = budget.daily;
    const totalPerPerson = dailyCost * duration;
    const groupEstimate = totalPerPerson * travelers;

    tripSummary.replaceChildren();
    addSummaryItem("DESTINATION", `${destinationData.name}, ${destinationData.country}`);
    addSummaryItem("LOCAL CURRENCY", `${destinationData.currency} (${new Intl.NumberFormat(destinationData.locale, { style: "currency", currency: destinationData.currency, maximumFractionDigits: 0 }).format(0).replace(/[\d\s.,]/g, "") || destinationData.currency})`);
    addSummaryItem("TRAVEL DATES", `${formatDate(startDate)} · ${duration} days`);
    addSummaryItem("TRAVELERS", `${travelers} ${travelers === 1 ? "person" : "people"}`);
    addSummaryItem("TRAVEL STYLE", budget.label);
    addSummaryItem("EST. GROUP BUDGET", formatMoney(groupEstimate, destinationData));
    addSummaryItem("EST. PER PERSON", formatMoney(totalPerPerson, destinationData));

    itinerary.replaceChildren();
    const selectedPlaces = choosePlaces(destinationData, interest, duration);
    for (let index = 0; index < duration; index++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(dayDate.getDate() + index);
      const dayPlaces = selectedPlaces.slice(index * 3, index * 3 + 3);
      itinerary.appendChild(buildDayCard(index + 1, dayDate, dayPlaces, dailyCost, destinationData));
    }

    resultsSection.hidden = false;
    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  tripForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const destinationText = destinationInput.value.trim();
    if (!destinationText) {
      destinationInput.focus();
      return;
    }

    const destinationData = findDestination(destinationText);
    if (!destinationData) {
      alert("This destination is not in TripMate's offline database yet. Try one of these supported places: Delhi, Jaipur, Mumbai, Manali, New York, London, Paris, Tokyo, Kyoto, Bali, Bangkok, Singapore, Dubai, Rome, Barcelona, Amsterdam, Kathmandu, Seoul, Lisbon, or Hanoi. You can also enter a supported country, such as India, Japan, France, or Thailand.");
      destinationInput.focus();
      return;
    }

    const selectedDate = startDateInput.value;
    const startDate = new Date(`${selectedDate}T12:00:00`);
    if (!selectedDate || Number.isNaN(startDate.getTime()) || selectedDate < today) {
      alert("Please choose today or a future start date.");
      startDateInput.focus();
      return;
    }

    const duration = Number(durationInput.value);
    const travelers = Number(travelersInput.value);
    if (!Number.isInteger(duration) || duration < 1 || !Number.isInteger(travelers) || travelers < 1) {
      alert("Please select a valid trip duration and group size.");
      return;
    }

    generateTrip({
      destination: destinationText,
      startDate,
      duration,
      travelers,
      budgetLevel: budgetInput.value,
      interest: interestsInput.value
    }, destinationData);
  });

  document.getElementById("printButton").addEventListener("click", () => window.print());
  document.getElementById("editTrip").addEventListener("click", () => {
    document.getElementById("planner").scrollIntoView({ behavior: "smooth", block: "start" });
    destinationInput.focus({ preventScroll: true });
  });
});
