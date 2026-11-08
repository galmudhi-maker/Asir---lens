
// ASIR LENS — Main interactions

// شاشة البداية
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hide");
  }, 900);
});

// قائمة الجوال
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

// عرض الوجهات
const destinationGrid = document.getElementById("destinationGrid");

function renderDestinations(filter = "all") {
  const filtered = filter === "all"
    ? destinations
    : destinations.filter(place => place.category === filter);

  destinationGrid.innerHTML = filtered.map((place, index) => `
    <article class="destination-card">
      <div class="destination-image"
        style="background-image:url('${place.image}')">
      </div>
      <div class="destination-body">
        <small>${place.type}</small>
        <h3>${place.name}</h3>
        <p>${place.description}</p>
        <button data-place="${index}" class="details-button">
          اكتشف الحكاية ↗
        </button>
      </div>
    </article>
  `).join("");

  destinationGrid.querySelectorAll(".details-button").forEach(button => {
    button.addEventListener("click", () => {
      const place = filtered[Number(button.dataset.place)];
      alert(place.name + "\n\n" + place.details);
    });
  });
}

renderDestinations();

// تصفية الوجهات
document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    button.classList.add("active");
    renderDestinations(button.dataset.filter);
  });
});

// العدسة الذكية: مطابقة اسم معلم مدعوم
const imageInput = document.getElementById("landmarkImage");
const lensResult = document.getElementById("lensResult");

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    lensResult.textContent = "الرجاء اختيار ملف صورة.";
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const preview = new Image();
    preview.src = reader.result;

    preview.onload = () => {
      const oldPreview = document.getElementById("userPreview");
      if (oldPreview) oldPreview.remove();

      const img = document.createElement("img");
      img.id = "userPreview";
      img.src = reader.result;
      img.alt = "الصورة المختارة";
      img.style.width = "100%";
      img.style.maxHeight = "180px";
      img.style.objectFit = "cover";
      img.style.borderRadius = "10px";
      img.style.marginTop = "12px";

      lensResult.prepend(img);

      lensResult.innerHTML += "";
      const message = document.createElement("p");
      message.textContent =
        "تم تحميل الصورة بنجاح. هذه النسخة التجريبية لا تتعرف آليًا على محتوى الصور؛ يمكنك استكشاف المعالم من مكتبة الوجهات.";
      lensResult.appendChild(message);
    };
  };

  reader.readAsDataURL(file);
});

// رحلة عبر الزمن
const timeSlider = document.getElementById("timeSlider");
const timeImage = document.getElementById("timeImage");
const timeValue = document.getElementById("timeValue");

timeSlider.addEventListener("input", () => {
  const value = Number(timeSlider.value);

  if (value < 35) {
    timeImage.classList.add("past-mode");
    timeValue.textContent = "الماضي";
  } else if (value < 70) {
    timeImage.classList.remove("past-mode");
    timeValue.textContent = "مرحلة انتقالية";
  } else {
    timeImage.classList.remove("past-mode");
    timeValue.textContent = "الحاضر";
  }
});

// رفيق الرحلة
document.getElementById("planButton").addEventListener("click", () => {
  const type = document.getElementById("tripType").value;
  const result = document.getElementById("planResult");

  const plans = {
    nature: {
      title: "رحلة الطبيعة",
      places: ["السودة", "تنومة", "النماص"]
    },
    heritage: {
      title: "رحلة التراث",
      places: ["رجال ألمع", "أبها", "خميس مشيط"]
    },
    all: {
      title: "رحلة متنوعة",
      places: ["أبها", "السودة", "رجال ألمع"]
    }
  };

  const plan = plans[type];

  result.innerHTML = `
    <strong>${plan.title}</strong>
    <p>وجهات مقترحة:</p>
    ${plan.places.map((place, i) =>
      `<p>${i + 1}. ${place}</p>`
    ).join("")}
    <small>اقتراح مبدئي قابل للتعديل، وليس مسارًا جغرافيًا محسوبًا.</small>
  `;
});

// تحدي المستكشف
const questions = [
  {
    question: "أين تقع قرية رجال ألمع التراثية؟",
    answers: ["منطقة عسير", "منطقة الرياض", "منطقة تبوك"],
    correct: 0
  },
  {
    question: "بماذا يشتهر فن القط العسيري؟",
    answers: ["الزخارف الجدارية", "النحت على الخشب فقط", "صناعة الفخار"],
    correct: 0
  },
  {
    question: "أي من هذه الوجهات تشتهر بمرتفعاتها الجبلية؟",
    answers: ["السودة", "الربع الخالي", "ساحل البحر الأحمر"],
    correct: 0
  },
  {
    question: "ما المدينة التي تُعد مركزًا لمنطقة عسير؟",
    answers: ["أبها", "الدمام", "المدينة المنورة"],
    correct: 0
  }
];

let questionIndex = 0;
let score = 0;

const quizQuestion = document.getElementById("quizQuestion");
const quizAnswers = document.getElementById("quizAnswers");
const quizFeedback = document.getElementById("quizFeedback");
const nextQuestion = document.getElementById("nextQuestion");

function showQuestion() {
  const question = questions[questionIndex];

  quizQuestion.textContent = question.question;
  quizAnswers.innerHTML = "";
  quizFeedback.textContent = "";
  nextQuestion.hidden = true;

  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.textContent = answer;

    button.addEventListener("click", () => {
      const buttons = quizAnswers.querySelectorAll("button");

      buttons.forEach(item => item.disabled = true);

      if (index === question.correct) {
        button.classList.add("correct");
        quizFeedback.textContent = "إجابة صحيحة! أحسنت، أنت مستكشف مميز.";
        score++;
      } else {
        button.classList.add("wrong");
        buttons[question.correct].classList.add("correct");
        quizFeedback.textContent = "إجابة غير صحيحة، تعلّم معلومة جديدة عن عسير!";
      }

      nextQuestion.hidden = false;
    });

    quizAnswers.appendChild(button);
  });
}

nextQuestion.addEventListener("click", () => {
  questionIndex++;

  if (questionIndex < questions.length) {
    showQuestion();
  } else {
    quizQuestion.textContent = "انتهت رحلة التحدي!";
    quizAnswers.innerHTML = "";
    quizFeedback.textContent =
      `نتيجتك: ${score} من ${questions.length}. شكرًا لاستكشاف عسير!`;
    nextQuestion.hidden = true;

    questionIndex = 0;
    score = 0;
  }
});

showQuestion();
