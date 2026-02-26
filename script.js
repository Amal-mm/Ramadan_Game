// بيانات اللعبة
let players = [];
let currentQuestionIndex = 0;
let difficulty = '';
let shuffledQuestions = [];
let timerInterval;
let timeLeft = 40;

// قاعدة الأسئلة
const questions = {
    easy: [
        { q: "كم عدد أركان الإسلام؟", a: "خمسة أركان" },
        { q: "ما هو الشهر الذي يصوم فيه المسلمون؟", a: "شهر رمضان المبارك" },
        { q: "في أي مدينة ولد النبي محمد صلى الله عليه وسلم؟", a: "مكة المكرمة" },
        { q: "ما هي أول سورة في القرآن الكريم؟", a: "سورة الفاتحة" },
        { q: "كم عدد الصلوات المفروضة في اليوم؟", a: "خمس صلوات" },
        { q: "ما هو اسم الملك الموكل بالنفخ في الصور؟", a: "إسرافيل عليه السلام" },
        { q: "في أي شهر هجري تُؤدى فريضة الحج؟", a: "شهر ذو الحجة" },
        { q: "كم عدد أركان الإيمان؟", a: "ستة أركان" },
        { q: "ما اسم ناقة النبي صالح عليه السلام؟", a: "ناقة الله" },
        { q: "ما هي القبلة الأولى للمسلمين؟", a: "المسجد الأقصى" }
    ],
    medium: [
        { q: "كم مرة ذُكر اسم محمد صلى الله عليه وسلم في القرآن الكريم؟", a: "أربع مرات" },
        { q: "من هو الصحابي الذي لُقب بأسد الله؟", a: "حمزة بن عبد المطلب رضي الله عنه" },
        { q: "ما هي أطول سورة في القرآن الكريم؟", a: "سورة البقرة" },
        { q: "كم عدد السور المكية في القرآن الكريم؟", a: "ثلاث وثمانون سورة" },
        { q: "من هو أول من جمع القرآن الكريم في مصحف واحد؟", a: "أبو بكر الصديق رضي الله عنه" },
        { q: "ما اسم الغزوة التي وقعت في السنة الثانية للهجرة؟", a: "غزوة بدر الكبرى" },
        { q: "من هو النبي الذي ابتلعه الحوت؟", a: "يونس عليه السلام" },
        { q: "كم عدد أبواب الجنة؟", a: "ثمانية أبواب" },
        { q: "ما هي السورة التي تعدل ثلث القرآن؟", a: "سورة الإخلاص" },
        { q: "من هي أول شهيدة في الإسلام؟", a: "سمية بنت خياط رضي الله عنها" }
    ],
    hard: [
        { q: "كم عدد السجدات في القرآن الكريم؟", a: "خمس عشرة سجدة" },
        { q: "ما هي السورة التي لا تبدأ بالبسملة؟", a: "سورة التوبة" },
        { q: "من هو الصحابي الذي اهتز لموته عرش الرحمن؟", a: "سعد بن معاذ رضي الله عنه" },
        { q: "كم عدد آيات سورة الكهف؟", a: "مائة وعشر آيات" },
        { q: "من هو النبي الذي دفن في نهر النيل؟", a: "يوسف عليه السلام" },
        { q: "ما هو اسم السورة التي ذكرت فيها البسملة مرتين؟", a: "سورة النمل" },
        { q: "كم مرة ذُكرت كلمة الجنة في القرآن الكريم؟", a: "ستة وستون مرة" },
        { q: "من هو أول من كتب بسم الله الرحمن الرحيم؟", a: "سليمان عليه السلام" },
        { q: "ما هي السورة التي تسمى بقلب القرآن؟", a: "سورة يس" },
        { q: "كم عدد أحرف القرآن الكريم؟", a: "ثلاثمائة وثلاثة وعشرون ألف وستمائة وسبعون حرفاً" }
    ]
};

// إنشاء النجوم
function createStars() {
    const starsContainer = document.getElementById('stars');
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
    }
}

// الانتقال للشاشات
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function goToPlayers() {
    showScreen('playersScreen');
}

// إضافة لاعب
function addPlayer() {
    const input = document.getElementById('playerInput');
    const name = input.value.trim();
    
    if (name && !players.find(p => p.name === name)) {
        players.push({ name: name, score: 0 });
        input.value = '';
        updatePlayersList();
        document.getElementById('continueBtn').style.display = 'block';
    }
}

function updatePlayersList() {
    const list = document.getElementById('playersList');
    list.innerHTML = players.map((p, i) => `
        <div class="player-item">
            <span>${p.name}</span>
            <button class="remove-btn" onclick="removePlayer(${i})">حذف</button>
        </div>
    `).join('');
}

function removePlayer(index) {
    players.splice(index, 1);
    updatePlayersList();
    if (players.length === 0) {
        document.getElementById('continueBtn').style.display = 'none';
    }
}

function goToDifficulty() {
    if (players.length > 0) {
        showScreen('difficultyScreen');
    }
}

// الرجوع لصفحة اللاعبين
function goBackToPlayers() {
    showScreen('playersScreen');
}

// اختيار المستوى
function selectDifficulty(level) {
    difficulty = level;
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.closest('.difficulty-btn').classList.add('selected');
    document.getElementById('startGameBtn').style.display = 'block';
}

// بدء اللعبة
function startGame() {
    if (!difficulty) return;
    
    // خلط الأسئلة عشوائياً
    shuffledQuestions = [...questions[difficulty]].sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    
    showScreen('questionScreen');
    displayQuestion();
}

// عرض السؤال
function displayQuestion() {
    const question = shuffledQuestions[currentQuestionIndex];
    document.getElementById('questionCounter').textContent = 
        `السؤال ${currentQuestionIndex + 1} من ${shuffledQuestions.length}`;
    document.getElementById('questionText').textContent = question.q;
    document.getElementById('answerBox').classList.remove('show');
    document.getElementById('playerSelection').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    
    // بدء المؤقت
    startTimer();
}

// المؤقت
function startTimer() {
    timeLeft = 40;
    const circle = document.getElementById('timerCircle');
    const timerText = document.getElementById('timerText');
    const circumference = 2 * Math.PI * 90;
    
    timerText.textContent = timeLeft;
    circle.style.strokeDashoffset = '0';
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerText.textContent = timeLeft;
        
        const offset = circumference - (timeLeft / 40) * circumference;
        circle.style.strokeDashoffset = offset;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showAnswer();
        }
    }, 1000);
}

// عرض الإجابة
function showAnswer() {
    const question = shuffledQuestions[currentQuestionIndex];
    document.getElementById('answerText').textContent = question.a;
    document.getElementById('answerBox').classList.add('show');
    
    // عرض اختيار اللاعبين
    const grid = document.getElementById('playerGrid');
    grid.innerHTML = players.map(p => `
        <button class="player-select-btn" onclick="selectPlayer('${p.name}')">
            ${p.name}
        </button>
    `).join('');
    
    document.getElementById('playerSelection').style.display = 'block';
    document.getElementById('nextBtn').style.display = 'block';
}

// اختيار اللاعب الذي أجاب
function selectPlayer(name) {
    const player = players.find(p => p.name === name);
    if (player) {
        player.score++;
    }
    document.getElementById('playerSelection').style.display = 'none';
}

// السؤال التالي
function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < shuffledQuestions.length) {
        displayQuestion();
    } else {
        showResults();
    }
}

// عرض النتائج
function showResults() {
    // ترتيب اللاعبين
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    const winner = sortedPlayers[0];
    
    document.getElementById('winnerName').textContent = winner.name;
    document.getElementById('winnerScore').textContent = `${winner.score} نقطة من ${shuffledQuestions.length}`;
    
    const scoresHtml = sortedPlayers.map(p => `
        <div class="score-item">
            <span class="score-name">${p.name}</span>
            <span class="score-points">${p.score} نقطة</span>
        </div>
    `).join('');
    
    document.getElementById('finalScores').innerHTML = scoresHtml;
    
    showScreen('resultsScreen');
    createConfetti();
}

// كونفيتي
function createConfetti() {
    const colors = ['#d4af37', '#f7c548', '#1a5f7a', '#159895', '#c9184a', '#f39c12'];
    const container = document.body;
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-50px';
            confetti.style.width = (Math.random() * 10 + 5) + 'px';
            confetti.style.height = (Math.random() * 10 + 5) + 'px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            container.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 5000);
        }, i * 30);
    }
}

// إعادة اللعبة
function restartGame() {
    players = [];
    currentQuestionIndex = 0;
    difficulty = '';
    shuffledQuestions = [];
    clearInterval(timerInterval);
    
    document.getElementById('playerInput').value = '';
    document.getElementById('playersList').innerHTML = '';
    document.getElementById('continueBtn').style.display = 'none';
    
    showScreen('homeScreen');
}

// تهيئة
createStars();