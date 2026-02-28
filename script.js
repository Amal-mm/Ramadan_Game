// بيانات اللعبة
let players = [];
let currentQuestionIndex = 0;
let difficulty = '';
let shuffledQuestions = [];
let timerInterval;
let timeLeft = 30;
let answeredCurrentQuestion = false;

// قاعدة الأسئلة مع خيارات
const questions = {
    easy: [
        { q: "كم عدد أركان الإسلام؟", a: "خمسة", options: ["ثلاثة", "أربعة", "خمسة", "ستة"] },
        { q: "ما هو الشهر الذي يصوم فيه المسلمون؟", a: "رمضان", options: ["شعبان", "رمضان", "محرم", "ذو الحجة"] },
        { q: "في أي مدينة ولد النبي محمد ﷺ؟", a: "مكة المكرمة", options: ["المدينة المنورة", "الطائف", "مكة المكرمة", "جدة"] },
        { q: "ما هي أول سورة في القرآن الكريم؟", a: "الفاتحة", options: ["البقرة", "الفاتحة", "الإخلاص", "الناس"] },
        { q: "كم عدد الصلوات المفروضة في اليوم؟", a: "خمس صلوات", options: ["ثلاث صلوات", "أربع صلوات", "خمس صلوات", "ست صلوات"] },
        { q: "ما هو اسم الملك الموكل بالنفخ في الصور؟", a: "إسرافيل", options: ["جبريل", "ميكائيل", "إسرافيل", "عزرائيل"] },
        { q: "في أي شهر هجري تُؤدى فريضة الحج؟", a: "ذو الحجة", options: ["رمضان", "شوال", "ذو القعدة", "ذو الحجة"] },
        { q: "كم عدد أركان الإيمان؟", a: "ستة أركان", options: ["أربعة أركان", "خمسة أركان", "ستة أركان", "سبعة أركان"] },
        { q: "ما هي القبلة الأولى للمسلمين؟", a: "المسجد الأقصى", options: ["المسجد الحرام", "المسجد النبوي", "المسجد الأقصى", "مسجد قباء"] },
        { q: "ما اسم ناقة النبي صالح عليه السلام؟", a: "ناقة الله", options: ["ناقة السلام", "ناقة الله", "ناقة النور", "ناقة الرحمة"] }
    ],
    medium: [
        { q: "كم مرة ذُكر اسم محمد ﷺ في القرآن الكريم؟", a: "أربع مرات", options: ["مرتان", "ثلاث مرات", "أربع مرات", "خمس مرات"] },
        { q: "من هو الصحابي الذي لُقب بأسد الله؟", a: "حمزة بن عبد المطلب", options: ["علي بن أبي طالب", "خالد بن الوليد", "حمزة بن عبد المطلب", "عمر بن الخطاب"] },
        { q: "ما هي أطول سورة في القرآن الكريم؟", a: "البقرة", options: ["آل عمران", "النساء", "البقرة", "المائدة"] },
        { q: "من هو أول من جمع القرآن الكريم في مصحف واحد؟", a: "أبو بكر الصديق", options: ["عمر بن الخطاب", "عثمان بن عفان", "أبو بكر الصديق", "علي بن أبي طالب"] },
        { q: "ما اسم الغزوة التي وقعت في السنة الثانية للهجرة؟", a: "غزوة بدر", options: ["غزوة أحد", "غزوة بدر", "غزوة الخندق", "غزوة حنين"] },
        { q: "من هو النبي الذي ابتلعه الحوت؟", a: "يونس عليه السلام", options: ["موسى عليه السلام", "إلياس عليه السلام", "يونس عليه السلام", "إدريس عليه السلام"] },
        { q: "كم عدد أبواب الجنة؟", a: "ثمانية أبواب", options: ["خمسة أبواب", "ستة أبواب", "سبعة أبواب", "ثمانية أبواب"] },
        { q: "ما هي السورة التي تعدل ثلث القرآن؟", a: "الإخلاص", options: ["الفاتحة", "الكهف", "الإخلاص", "يس"] },
        { q: "من هي أول شهيدة في الإسلام؟", a: "سمية بنت خياط", options: ["خديجة بنت خويلد", "فاطمة الزهراء", "سمية بنت خياط", "أسماء بنت أبي بكر"] },
        { q: "كم عدد السور المكية في القرآن الكريم؟", a: "ثلاث وثمانون سورة", options: ["سبعون سورة", "خمس وسبعون سورة", "ثلاث وثمانون سورة", "تسعون سورة"] }
    ],
    hard: [
        { q: "كم عدد السجدات في القرآن الكريم؟", a: "خمس عشرة سجدة", options: ["اثنتا عشرة سجدة", "ثلاث عشرة سجدة", "أربع عشرة سجدة", "خمس عشرة سجدة"] },
        { q: "ما هي السورة التي لا تبدأ بالبسملة؟", a: "التوبة", options: ["الأنفال", "التوبة", "الحشر", "المنافقون"] },
        { q: "من هو الصحابي الذي اهتز لموته عرش الرحمن؟", a: "سعد بن معاذ", options: ["خبيب بن عدي", "مصعب بن عمير", "سعد بن معاذ", "حنظلة بن أبي عامر"] },
        { q: "كم عدد آيات سورة الكهف؟", a: "مائة وعشر آيات", options: ["مائة آية", "مائة وخمس آيات", "مائة وعشر آيات", "مائة وخمس عشرة آية"] },
        { q: "ما هو اسم السورة التي ذكرت فيها البسملة مرتين؟", a: "النمل", options: ["الأعراف", "النحل", "النمل", "القصص"] },
        { q: "من هو أول من كتب بسم الله الرحمن الرحيم؟", a: "سليمان عليه السلام", options: ["إبراهيم عليه السلام", "موسى عليه السلام", "داود عليه السلام", "سليمان عليه السلام"] },
        { q: "ما هي السورة التي تسمى بقلب القرآن؟", a: "يس", options: ["البقرة", "الكهف", "يس", "الرحمن"] },
        { q: "كم عدد أحرف القرآن الكريم تقريباً؟", a: "323671 حرفاً", options: ["200000 حرف", "280000 حرف", "323671 حرفاً", "400000 حرف"] },
        { q: "من هو النبي الذي أُعطي منطق الطير؟", a: "سليمان عليه السلام", options: ["داود عليه السلام", "يوسف عليه السلام", "سليمان عليه السلام", "إدريس عليه السلام"] },
        { q: "كم مرة ذُكر اسم عيسى عليه السلام في القرآن؟", a: "خمس وعشرون مرة", options: ["خمس عشرة مرة", "عشرون مرة", "خمس وعشرون مرة", "ثلاثون مرة"] }
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

// الرجوع للرئيسية
function goBackToHome() {
    const confirmed = confirm("هل تريد الرجوع للصفحة الرئيسية؟ سيتم إلغاء اللعبة الحالية.");
    if (confirmed) {
        clearInterval(timerInterval);
        players = [];
        currentQuestionIndex = 0;
        difficulty = '';
        shuffledQuestions = [];
        document.getElementById('playerInput').value = '';
        document.getElementById('playersList').innerHTML = '';
        document.getElementById('continueBtn').style.display = 'none';
        showScreen('homeScreen');
    }
}

// الانتقال للشاشات
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function goToPlayers() { showScreen('playersScreen'); }

const avatarColors = ['#d4af37','#e76f9a','#1a9e8a','#6c63ff','#e63946','#f4a261','#2a9d8f','#e9c46a'];

// إضافة لاعب
function addPlayer() {
    const input = document.getElementById('playerInput');
    const name = input.value.trim();
    if (name && !players.find(p => p.name === name)) {
        players.push({ name, score: 0 });
        input.value = '';
        updatePlayersList();
        document.getElementById('continueBtn').style.display = 'block';
    }
}

function updatePlayersList() {
    const list = document.getElementById('playersList');
    list.innerHTML = players.map((p, i) => `
        <div class="player-item" style="animation-delay:${i*0.06}s">
            <div class="player-avatar" style="background:${avatarColors[i % avatarColors.length]}">${p.name.charAt(0)}</div>
            <span class="player-name">${p.name}</span>
            <div class="player-num">#${i+1}</div>
            <button class="remove-btn" onclick="removePlayer(${i})">✕</button>
        </div>
    `).join('');
}

function removePlayer(index) {
    players.splice(index, 1);
    updatePlayersList();
    if (players.length === 0) document.getElementById('continueBtn').style.display = 'none';
}

function goToDifficulty() {
    if (players.length > 0) showScreen('difficultyScreen');
}

function goBackToPlayers() { showScreen('playersScreen'); }

// اختيار المستوى
function selectDifficulty(level) {
    difficulty = level;
    document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.closest('.difficulty-btn').classList.add('selected');
    document.getElementById('startGameBtn').style.display = 'block';
}

// بدء اللعبة
function startGame() {
    if (!difficulty) return;
    shuffledQuestions = [...questions[difficulty]].sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    showScreen('questionScreen');
    displayQuestion();
}

// عرض السؤال
function displayQuestion() {
    const question = shuffledQuestions[currentQuestionIndex];
    answeredCurrentQuestion = false;

    document.getElementById('questionCounter').textContent =
        `السؤال ${currentQuestionIndex + 1} من ${shuffledQuestions.length}`;
    document.getElementById('questionText').textContent = question.q;
    document.getElementById('answerResult').style.display = 'none';
    document.getElementById('playerSelection').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    // إعادة تعيين المؤقت والشبكة
    const timerEl = document.querySelector('.timer-inline');
    if (timerEl) { timerEl.style.opacity = '1'; timerEl.style.pointerEvents = ''; }
    document.getElementById('optionsGrid').classList.remove('single-option');
    document.getElementById('timerText').style.color = '';

    // بناء الخيارات — خلط عشوائي
    const shuffled = [...question.options].sort(() => Math.random() - 0.5);
    const grid = document.getElementById('optionsGrid');
    const labels = ['أ', 'ب', 'ج', 'د'];
    grid.innerHTML = shuffled.map((opt, i) => `
        <button class="option-btn" onclick="selectOption(this, '${opt.replace(/'/g,"\\'")}')">
            <span class="option-label">${labels[i]}</span>
            <span class="option-text">${opt}</span>
        </button>
    `).join('');

    startTimer();
}

// اختيار خيار
function selectOption(btn, selected) {
    if (answeredCurrentQuestion) return;
    answeredCurrentQuestion = true;
    clearInterval(timerInterval);

    const question = shuffledQuestions[currentQuestionIndex];
    const correct = question.a;
    const isCorrect = selected === correct;

    if (isCorrect) {
        // إجابة صحيحة: أخفِ المؤقت وكل الخيارات الأخرى
        document.querySelector('.timer-inline').style.transition = 'opacity 0.3s';
        document.querySelector('.timer-inline').style.opacity = '0';
        document.querySelector('.timer-inline').style.pointerEvents = 'none';

        document.querySelectorAll('.option-btn').forEach(b => {
            b.disabled = true;
            if (b === btn) {
                b.classList.add('correct');
                b.classList.add('correct-winner');
            } else {
                b.style.transition = 'opacity 0.25s, transform 0.25s';
                b.style.opacity = '0';
                b.style.transform = 'scale(0.9)';
                setTimeout(() => { b.style.display = 'none'; }, 260);
            }
        });

        // شبكة توسيط للخيار الوحيد
        setTimeout(() => {
            document.getElementById('optionsGrid').classList.add('single-option');
        }, 270);

        // لا رسالة منفصلة — اللون يكفي
        document.getElementById('answerResult').style.display = 'none';

    } else {
        // إجابة خاطئة: أبقِ الخيارات ليرى اللاعب الصواب
        document.querySelectorAll('.option-btn').forEach(b => {
            const txt = b.querySelector('.option-text').textContent;
            b.disabled = true;
            if (txt === correct) b.classList.add('correct');
            else if (b === btn) b.classList.add('wrong');
            else b.classList.add('dim');
        });

        const resultEl = document.getElementById('answerResult');
        const inner = document.getElementById('answerResultInner');
        resultEl.style.display = 'block';
        inner.innerHTML = `<span class="result-emoji">❌</span><span class="result-text">الإجابة الصحيحة: <strong>${correct}</strong></span>`;
        resultEl.className = 'answer-result wrong-result';
    }

    // عرض اختيار اللاعب
    const grid = document.getElementById('playerGrid');
    grid.innerHTML = players.map(p =>
        `<button class="player-select-btn" onclick="selectPlayer('${p.name.replace(/'/g,"\'")}', this)">${p.name}</button>`
    ).join('');
    document.getElementById('playerSelection').style.display = 'block';
    document.getElementById('nextBtn').style.display = 'block';
}


// المؤقت
function startTimer() {
    timeLeft = 30;
    const circle = document.getElementById('timerCircle');
    const timerText = document.getElementById('timerText');
    const circumference = 2 * Math.PI * 25;

    timerText.textContent = timeLeft;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = '0';
    circle.style.stroke = 'url(#gradient)';

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerText.textContent = timeLeft;
        const offset = circumference - (timeLeft / 30) * circumference;
        circle.style.strokeDashoffset = offset;

        // تغيير لون المؤقت عند الاقتراب من النهاية
        if (timeLeft <= 10) {
            circle.style.stroke = '#e63946';
            document.getElementById('timerText').style.color = '#e63946';
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timeoutQuestion();
        }
    }, 1000);
}

// انتهاء الوقت
function timeoutQuestion() {
    if (answeredCurrentQuestion) return;
    answeredCurrentQuestion = true;

    const correct = shuffledQuestions[currentQuestionIndex].a;
    document.querySelectorAll('.option-btn').forEach(b => {
        b.disabled = true;
        if (b.querySelector('.option-text').textContent === correct) b.classList.add('correct');
        else b.classList.add('dim');
    });

    const resultEl = document.getElementById('answerResult');
    const inner = document.getElementById('answerResultInner');
    resultEl.style.display = 'block';
    inner.innerHTML = `<span class="result-emoji">⏰</span><span class="result-text">انتهى الوقت! الإجابة: <strong>${correct}</strong></span>`;
    resultEl.className = 'answer-result timeout-result';

    const grid = document.getElementById('playerGrid');
    grid.innerHTML = players.map(p => `
        <button class="player-select-btn" onclick="selectPlayer('${p.name.replace(/'/g,"\\'")}', this)">
            ${p.name}
        </button>
    `).join('');
    document.getElementById('playerSelection').style.display = 'block';
    document.getElementById('nextBtn').style.display = 'block';
}

// اختيار اللاعب الذي أجاب
function selectPlayer(name, btn) {
    const player = players.find(p => p.name === name);
    if (player) player.score++;
    document.querySelectorAll('.player-select-btn').forEach(b => b.classList.remove('selected-player'));
    btn.classList.add('selected-player');
}

// السؤال التالي
function nextQuestion() {
    // إعادة لون المؤقت
    document.getElementById('timerText').style.color = '';
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
        displayQuestion();
    } else {
        showResults();
    }
}

// عرض النتائج
function showResults() {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    const winner = sortedPlayers[0];
    document.getElementById('winnerName').textContent = winner.name;
    document.getElementById('winnerScore').textContent = `${winner.score} نقطة من ${shuffledQuestions.length}`;
    document.getElementById('finalScores').innerHTML = sortedPlayers.map((p, i) => `
        <div class="score-item">
            <span class="score-rank">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`}</span>
            <span class="score-name">${p.name}</span>
            <span class="score-points">${p.score} نقطة</span>
        </div>
    `).join('');
    showScreen('resultsScreen');
    createConfetti();
}

// كونفيتي
function createConfetti() {
    const colors = ['#d4af37','#f7c548','#1a5f7a','#159895','#c9184a','#f39c12'];
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const c = document.createElement('div');
            c.className = 'confetti';
            c.style.left = Math.random() * 100 + '%';
            c.style.top = '-50px';
            c.style.width = (Math.random() * 10 + 5) + 'px';
            c.style.height = (Math.random() * 10 + 5) + 'px';
            c.style.background = colors[Math.floor(Math.random() * colors.length)];
            c.style.animationDuration = (Math.random() * 2 + 2) + 's';
            c.style.animationDelay = Math.random() * 0.5 + 's';
            document.body.appendChild(c);
            setTimeout(() => c.remove(), 5000);
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

createStars();
