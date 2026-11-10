/* Forge Fitness Studio demo. Plain JS, no backend, no external API. */

"use strict";

/* ---------- Site data: single source of truth for classes, trainers, prices ---------- */
var CLASSES = [
  { name: "Strength Foundations", days: "Mon, Wed, Fri", time: "6:30 AM", coach: "Arjun Mehta", intensity: "Medium", spots: 8 },
  { name: "HIIT Blast", days: "Tue, Thu, Sat", time: "7:00 AM", coach: "Riya Sharma", intensity: "High", spots: 4 },
  { name: "Power Yoga", days: "Mon, Wed, Sat", time: "8:00 AM", coach: "Kabir Singh", intensity: "Low", spots: 12 },
  { name: "Boxing Basics", days: "Tue, Thu", time: "6:00 PM", coach: "Arjun Mehta", intensity: "High", spots: 3 },
  { name: "Spin Cycle", days: "Mon, Fri", time: "7:00 PM", coach: "Riya Sharma", intensity: "High", spots: 6 },
  { name: "Conditioning Circuit", days: "Wed, Sat", time: "5:30 PM", coach: "Neha Patel", intensity: "Medium", spots: 9 },
  { name: "Mobility and Core", days: "Sun", time: "9:00 AM", coach: "Kabir Singh", intensity: "Low", spots: 15 }
];

var TRAINERS = [
  { initials: "AM", name: "Arjun Mehta", role: "Head Coach, Strength", exp: "9 years experience", bio: "Former state level powerlifter. Builds strength programs for beginners and athletes, with a focus on safe technique." },
  { initials: "RS", name: "Riya Sharma", role: "HIIT and Spin Coach", exp: "6 years experience", bio: "Certified group fitness instructor. Runs high energy HIIT and spin sessions, and loves coaching first timers." },
  { initials: "KS", name: "Kabir Singh", role: "Yoga and Mobility Coach", exp: "8 years experience", bio: "RYT-500 yoga teacher. Leads power yoga and mobility work that keeps lifters flexible and injury free." },
  { initials: "NP", name: "Neha Patel", role: "Conditioning and Nutrition Coach", exp: "5 years experience", bio: "Sports nutrition certified. Runs conditioning circuits and builds practical vegetarian diet plans for members." }
];

var PLANS = {
  monthly:  { Monthly: 2500, Quarterly: 6500, Annual: 18000 },
  annual:   { Monthly: 2000, Quarterly: 5200, Annual: 14400 }
};
var PLAN_BILLED = {
  monthly: {
    Monthly: "Billed monthly. No lock-in.",
    Quarterly: "Works out to about Rs. 2,167 per month.",
    Annual: "Works out to Rs. 1,500 per month."
  },
  annual: {
    Monthly: "Billed annually at Rs. 24,000. Save 20 percent.",
    Quarterly: "Billed annually at Rs. 20,800. Save 20 percent.",
    Annual: "Billed annually at Rs. 14,400. Save 20 percent."
  }
};
var PLAN_PERIOD = { Monthly: "/month", Quarterly: "/3 months", Annual: "/year" };

function fmt(n) { return n.toLocaleString("en-IN"); }

/* ---------- Mobile menu ---------- */
var menuToggle = document.getElementById("menuToggle");
var mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", function () {
  var open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
});
mainNav.querySelectorAll("a").forEach(function (a) {
  a.addEventListener("click", function () {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

/* ---------- Classes ---------- */
function renderClasses() {
  var grid = document.getElementById("classGrid");
  grid.innerHTML = CLASSES.map(function (c) {
    var level = c.intensity.toLowerCase();
    var spotsClass = c.spots <= 4 ? "spots low" : "spots";
    var spotsText = c.spots <= 4 ? c.spots + " spots left, almost full" : c.spots + " spots left";
    return (
      '<article class="class-card">' +
        '<h3>' + c.name + ' <span class="intensity ' + level + '">' + c.intensity + '</span></h3>' +
        '<ul class="class-meta">' +
          '<li><strong>Days:</strong> ' + c.days + '</li>' +
          '<li><strong>Time:</strong> ' + c.time + '</li>' +
          '<li><strong>Coach:</strong> ' + c.coach + '</li>' +
        '</ul>' +
        '<p><span class="' + spotsClass + '">' + spotsText + '</span></p>' +
        '<a href="#booking" class="btn btn-ghost" data-book-class="' + c.name + '">Book this class</a>' +
      '</article>'
    );
  }).join("");

  grid.querySelectorAll("[data-book-class]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var select = document.getElementById("fClass");
      select.value = btn.getAttribute("data-book-class");
      clearError("errClass");
      select.classList.remove("invalid");
    });
  });
}

/* ---------- Trainers ---------- */
function renderTrainers() {
  var grid = document.getElementById("trainerGrid");
  grid.innerHTML = TRAINERS.map(function (t) {
    return (
      '<article class="trainer-card">' +
        '<div class="avatar" aria-hidden="true">' + t.initials + '</div>' +
        '<h3>' + t.name + '</h3>' +
        '<p class="trainer-role">' + t.role + '</p>' +
        '<p class="trainer-exp">' + t.exp + '</p>' +
        '<p>' + t.bio + '</p>' +
      '</article>'
    );
  }).join("");
}

/* ---------- Pricing toggle ---------- */
var billingMode = "monthly";
function applyBilling(mode) {
  billingMode = mode;
  document.getElementById("toggleMonthly").classList.toggle("active", mode === "monthly");
  document.getElementById("toggleAnnual").classList.toggle("active", mode === "annual");
  ["Monthly", "Quarterly", "Annual"].forEach(function (plan) {
    document.getElementById("price" + plan).textContent = fmt(PLANS[mode][plan]);
    document.getElementById("billed" + plan).textContent = PLAN_BILLED[mode][plan];
  });
}
document.getElementById("toggleMonthly").addEventListener("click", function () { applyBilling("monthly"); });
document.getElementById("toggleAnnual").addEventListener("click", function () { applyBilling("annual"); });

/* Plan buttons pre-fill the booking form */
document.querySelectorAll(".plan-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var plan = btn.getAttribute("data-plan");
    var msg = document.getElementById("fMessage");
    msg.value = "Interested in the " + plan + " plan (" +
      (billingMode === "annual" ? "annual billing" : "monthly billing") + ").";
  });
});

/* ---------- Booking form ---------- */
var classSelect = document.getElementById("fClass");
CLASSES.forEach(function (c) {
  var opt = document.createElement("option");
  opt.value = c.name;
  opt.textContent = c.name + " (" + c.days + ", " + c.time + ")";
  classSelect.appendChild(opt);
});
classSelect.insertAdjacentHTML("afterbegin", '<option value="">Select a class</option>');
classSelect.value = "";

function setError(id, input, message) {
  document.getElementById(id).textContent = message || "";
  if (input) input.classList.toggle("invalid", !!message);
}
function clearError(id) { document.getElementById(id).textContent = ""; }

document.getElementById("bookingForm").addEventListener("submit", function (e) {
  e.preventDefault();
  var name = document.getElementById("fName");
  var phone = document.getElementById("fPhone");
  var email = document.getElementById("fEmail");
  var day = document.getElementById("fDay");
  var time = document.getElementById("fTime");
  var valid = true;

  var nameOk = name.value.trim().length >= 2;
  setError("errName", name, nameOk ? "" : "Please enter your full name.");
  valid = valid && nameOk;

  var digits = phone.value.replace(/\D/g, "");
  var phoneOk = /^(91)?[6-9]\d{9}$/.test(digits);
  setError("errPhone", phone, phoneOk ? "" : "Enter a valid 10 digit Indian mobile number.");
  valid = valid && phoneOk;

  var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
  setError("errEmail", email, emailOk ? "" : "Enter a valid email address.");
  valid = valid && emailOk;

  var classOk = classSelect.value !== "";
  setError("errClass", classSelect, classOk ? "" : "Please pick a class.");
  valid = valid && classOk;

  var dayOk = day.value !== "";
  setError("errDay", day, dayOk ? "" : "Please pick a day.");
  valid = valid && dayOk;

  var timeOk = time.value !== "";
  setError("errTime", time, timeOk ? "" : "Please pick a time slot.");
  valid = valid && timeOk;

  if (!valid) return;

  var ref = "FORGE-" + Math.floor(1000 + Math.random() * 9000);
  document.getElementById("confirmationText").textContent =
    "Thanks " + name.value.trim() + ". Your trial for " + classSelect.value +
    " on " + day.value + " (" + time.value + ") is requested. We will call " +
    phone.value.trim() + " to confirm.";
  document.getElementById("confirmationRef").textContent = ref;
  var box = document.getElementById("confirmation");
  box.hidden = false;
  box.scrollIntoView({ behavior: "smooth", block: "center" });
  document.getElementById("bookingForm").querySelector('button[type="submit"]').textContent = "Request Sent";
});

/* ---------- FAQ accordion ---------- */
document.querySelectorAll(".faq-item").forEach(function (item) {
  var btn = item.querySelector(".faq-q");
  btn.addEventListener("click", function () {
    var isOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item.open").forEach(function (other) {
      other.classList.remove("open");
      other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
    });
    if (!isOpen) {
      item.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    }
  });
});

/* ---------- Rule-based demo chatbot (no API, no key, answers from site data) ---------- */
var chatPanel = document.getElementById("chatPanel");
var chatToggle = document.getElementById("chatToggle");
var chatMessages = document.getElementById("chatMessages");
var chatForm = document.getElementById("chatForm");
var chatInput = document.getElementById("chatInput");
var greeted = false;

function addMsg(text, who) {
  var div = document.createElement("div");
  div.className = "chat-msg " + who;
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function openChat() {
  chatPanel.hidden = false;
  chatToggle.setAttribute("aria-expanded", "true");
  if (!greeted) {
    greeted = true;
    addMsg("Hi, I am the Forge demo assistant. I can help with membership prices, class timings, trial bookings, trainers and the gym location. What would you like to know?", "bot");
  }
  chatInput.focus();
}
function closeChat() {
  chatPanel.hidden = true;
  chatToggle.setAttribute("aria-expanded", "false");
}
chatToggle.addEventListener("click", function () {
  if (chatPanel.hidden) openChat(); else closeChat();
});
document.getElementById("chatClose").addEventListener("click", closeChat);

function classListText() {
  return CLASSES.map(function (c) {
    return c.name + ": " + c.days + " at " + c.time + " with " + c.coach + ", " + c.spots + " spots left";
  }).join("\n");
}

function botReply(q) {
  var s = q.toLowerCase();

  if (/(price|cost|fee|membership|plan|rate|charge|how much)/.test(s)) {
    return "Membership prices (monthly billing):\nMonthly: Rs. 2,500 per month\nQuarterly: Rs. 6,500 for 3 months\nAnnual: Rs. 18,000 per year\nSwitch to annual billing on the pricing section and every plan drops by 20 percent. No joining fee, and your first trial class is free.";
  }
  if (/(trial|free class|first class|try)/.test(s)) {
    return "Your first trial class is free, one per person. Pick any class, then fill in the booking form with your name, phone, class, day and time. We confirm by phone within 2 working hours. Arrive 15 minutes early and bring workout shoes and a water bottle.";
  }
  if (/(timing|time|when|schedule|hours|open|close)/.test(s)) {
    return "Gym hours: Monday to Saturday, 5:30 AM to 10:00 PM. Sunday, 7:00 AM to 12:00 PM.\nClass timings this week:\n" + classListText();
  }
  if (/(class|yoga|hiit|boxing|spin|strength|conditioning|workout)/.test(s)) {
    return "This week we run:\n" + classListText() + "\nEvery class is coach-led and capped at 20 people.";
  }
  if (/(where|location|address|reach|direction|parking)/.test(s)) {
    return "We are at 1st Floor, Malwa Plaza, AB Road, Dewas, Madhya Pradesh. Free two-wheeler parking in the basement, and we are a 5 minute walk from the Dewas bus stand.";
  }
  if (/(trainer|coach|who teaches|instructor)/.test(s)) {
    return "Our coaches:\nArjun Mehta, Head Coach, Strength, 9 years\nRiya Sharma, HIIT and Spin, 6 years\nKabir Singh, Yoga and Mobility, 8 years\nNeha Patel, Conditioning and Nutrition, 5 years";
  }
  if (/(diet|nutrition|food|meal)/.test(s)) {
    return "Quarterly and Annual plans include a diet plan built with a coach, with vegetarian options. Monthly members can add a one-off diet consultation for Rs. 500.";
  }
  if (/(freeze|pause|hold)/.test(s)) {
    return "Yes, you can freeze your membership for up to 30 days a year, in blocks of at least 7 days. Tell the front desk 2 days before the freeze should start.";
  }
  if (/(refund|cancel)/.test(s)) {
    return "Unused membership can be refunded within 7 days of purchase, minus sessions already used. After 7 days, Annual plans are refunded on a pro-rata basis.";
  }
  if (/(book|join|sign up|register|enrol|enroll)/.test(s)) {
    return "To book, use the booking form on this page: your name, phone, email, class, day and time. You get a reference number on the spot, and we call you to confirm. Or ask me about prices or class timings first.";
  }
  if (/(hi|hello|hey|namaste)\b/.test(s)) {
    return "Hello! Ask me about membership prices, class timings, the free trial, trainers, or where the gym is.";
  }
  return "I can help with memberships, classes, timings and bookings, plus trainers, diet help, parking, freezes and refunds. Try asking, for example, 'What are the membership prices?' or 'What time are classes?'";
}

chatForm.addEventListener("submit", function (e) {
  e.preventDefault();
  var text = chatInput.value.trim();
  if (!text) return;
  addMsg(text, "user");
  chatInput.value = "";
  setTimeout(function () { addMsg(botReply(text), "bot"); }, 350);
});
document.querySelectorAll(".chat-quick button").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var q = btn.getAttribute("data-q");
    addMsg(q, "user");
    setTimeout(function () { addMsg(botReply(q), "bot"); }, 350);
  });
});

/* ---------- Init ---------- */
renderClasses();
renderTrainers();
applyBilling("monthly");
