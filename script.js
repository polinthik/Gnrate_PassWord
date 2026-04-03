//ГЕНЕРАЦИЯ//
function generatePassword() {
    const length = parseInt(document.getElementById('length')?.value) || 12;
    const useUpper = document.getElementById('useUpper')?.checked || false;
    const useLower = document.getElementById('useLower')?.checked || false;
    const useDigits = document.getElementById('useDigits')?.checked || false;
    const useSpecial = document.getElementById('useSpecial')?.checked || false;

    if (!useUpper && !useLower && !useDigits && !useSpecial) {
        alert('Выберите хотя бы одну категорию символов!');
        return null;
    }

    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const special = '!@#$%^&*()_+=-{}[]:;"\'<>,.?/|\\~';

    let charSets = [];
    if (useUpper) charSets.push(upper);
    if (useLower) charSets.push(lower);
    if (useDigits) charSets.push(digits);
    if (useSpecial) charSets.push(special);

    let allChars = charSets.join('');
    let passwordChars = [];

    // Хотяб 1 символ из выбранных//
    for (let set of charSets) {
        passwordChars.push(set[Math.floor(Math.random() * set.length)]);
    }
    for (let i = passwordChars.length; i < length; i++) {
        passwordChars.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }
    for (let i = passwordChars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
    }

    return passwordChars.join('');
}

// Надежность//
const commonPasswords = [
    'password', '123456', '12345678', '1234', 'qwerty', '12345', 'dragon',
    'baseball', 'football', 'letmein', 'monkey', '696969', 'abc123',
    'mustang', 'michael', 'shadow', 'master', 'jennifer', '111111',
    'superman', 'harley', '1234567', 'hunter', 'trustno1', 'ranger',
    'buster', 'thomas', 'tigger', 'robert', 'soccer', 'batman', 'test',
    'pass', 'hello', 'admin', 'welcome', 'qwerty123', '123qwe', '1q2w3e', 'q1w2e3'
];

function checkPasswordStrength(password) {
    if (!password) return null;

    let score = 0;
    let details = [];

    // Проверка на распространённые пароли//
    if (commonPasswords.includes(password.toLowerCase())) {
        return {
            score: 0,
            strength: 'КРИТИЧЕСКИ СЛАБЫЙ',
            time: 'мгновенно',
            details: ['⚠ Пароль входит в список самых распространённых!']
        };
    }

    const length = password.length;
    if (length >= 12) {
        score += 2;
        details.push('✓ Отличная длина (12+)');
    } else if (length >= 8) {
        score += 1;
        details.push('✓ Хорошая длина (8-11)');
    } else {
        details.push('✗ Слишком короткий пароль (рекомендуется 8+)');
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-={}\[\]:;"'<>,.?/|\\~]/.test(password);

    if (hasUpper) { score += 1; details.push('✓ Есть прописные буквы'); }
    else details.push('✗ Нет прописных букв');

    if (hasLower) { score += 1; details.push('✓ Есть строчные буквы'); }
    else details.push('✗ Нет строчных букв');

    if (hasDigit) { score += 1; details.push('✓ Есть цифры'); }
    else details.push('✗ Нет цифр');

    if (hasSpecial) { score += 1; details.push('✓ Есть спецсимволы'); }
    else details.push('✗ Нет спецсимволов');

    // Проверка на разнообразие//
    const uniqueChars = new Set(password).size;
    if (uniqueChars < length * 0.7) {
        details.push('⚠ Много повторяющихся символов');
        score -= 0.5;
    }

    let strength, time;
    if (score >= 6) {
        strength = 'ОТЛИЧНЫЙ';
        time = 'более 100 лет';
    } else if (score >= 4) {
        strength = 'ХОРОШИЙ';
        time = 'от нескольких месяцев до года';
    } else if (score >= 2) {
        strength = 'СРЕДНИЙ';
        time = 'от нескольких дней до недели';
    } else {
        strength = 'СЛАБЫЙ';
        time = 'от нескольких минут до часов';
    }

    return {
        score: Math.min(6, Math.max(0, score)),
        strength: strength,
        time: time,
        details: details
    };
}
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const passwordResult = document.getElementById('passwordResult');
    const copyBtn = document.getElementById('copyBtn');

    if (generateBtn && passwordResult) {
        generateBtn.addEventListener('click', () => {
            const pwd = generatePassword();
            if (pwd) {
                passwordResult.textContent = pwd;
                passwordResult.style.transform = 'skew(1deg)';
                setTimeout(() => { passwordResult.style.transform = ''; }, 150);
            }
        });
    }

    if (copyBtn && passwordResult) {
        copyBtn.addEventListener('click', () => {
            const pwd = passwordResult.textContent;
            if (pwd && pwd !== '••••••••') {
                navigator.clipboard.writeText(pwd);
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Скопировано!';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i> Копировать';
                }, 2000);
            } else {
                alert('Сначала сгенерируйте пароль!');
            }
        });
    }

    // ПРОВЕРКА//
    const checkBtn = document.getElementById('checkBtn');
    const passwordInput = document.getElementById('passwordInput');
    const resultPanel = document.getElementById('resultPanel');

    if (checkBtn && passwordInput) {
        checkBtn.addEventListener('click', () => {
            const password = passwordInput.value;
            if (!password) {
                alert('Введите пароль для проверки!');
                return;
            }

            const result = checkPasswordStrength(password);
            if (!result) return;

            resultPanel.style.display = 'block';
            
            const fillPercent = (result.score / 6) * 100;
            const strengthFill = document.getElementById('strengthFill');
            const strengthText = document.getElementById('strengthText');
            const detailsDiv = document.getElementById('details');
            const timeInfo = document.getElementById('timeInfo');

            if (strengthFill) strengthFill.style.width = fillPercent + '%';
            if (strengthText) strengthText.textContent = result.strength;
            if (timeInfo) timeInfo.innerHTML = `<i class="fas fa-clock"></i> Примерное время взлома: ${result.time}`;
            
            if (detailsDiv) {
                detailsDiv.innerHTML = result.details.map(d => `<div>${d}</div>`).join('');
            }

            //Критерий безопасности (цвет)//
            if (strengthFill) {
                if (result.score >= 4) strengthFill.style.background = '#00ff73';
                else if (result.score >= 2) strengthFill.style.background = '#ffaa44';
                else strengthFill.style.background = '#ff4444';
            }
            
            // Глитч-эффект//
            resultPanel.style.transform = 'translateX(2px)';
            setTimeout(() => { resultPanel.style.transform = ''; }, 150);
        });
    }

    //Глазик в проверке//
    const togglePassword = document.getElementById('togglePassword');
    const passwordInputField = document.getElementById('passwordInput');

    if (togglePassword && passwordInputField) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInputField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInputField.setAttribute('type', type);
            const icon = togglePassword.querySelector('i');
            if (type === 'text') {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                togglePassword.style.textShadow = '0 0 8px #00ff73';
                passwordInputField.style.borderColor = '#00ff73';
                passwordInputField.style.boxShadow = '0 0 10px rgba(0, 255, 115, 0.3)';
            } else {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                togglePassword.style.textShadow = 'none';
                passwordInputField.style.borderColor = '';
                passwordInputField.style.boxShadow = '';
            }
        });
    }

    //Глитч загоровка//
    const neonTitle = document.querySelector('.neon-title');
    if (neonTitle) {
        document.addEventListener('mousemove', (e) => {
            let x = (e.clientX / window.innerWidth) * 4 - 2;
            let y = (e.clientY / window.innerHeight) * 2 - 1;
            neonTitle.style.transform = `translate(${x * 0.8}px, ${y * 0.5}px)`;
        });
    }

    //Свечение//
    const cards = document.querySelectorAll('.cyber-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = '0.3s';
                entry.target.style.boxShadow = '0 0 25px rgba(0,255,255,0.6)';
                setTimeout(() => {
                    entry.target.style.boxShadow = '';
                }, 500);
            }
        });
    }, { threshold: 0.2 });

    cards.forEach(c => observer.observe(c));
});
// СОВЕТЫ//
const securityTips = [
    { text: "Пароль из 12 случайных символов (буквы + цифры + символы) взламывается более 100 лет при современных технологиях." },
    { text: "Никогда не используйте один и тот же пароль для разных сайтов — если один взломают, злоумышленники получат доступ ко всем вашим аккаунтам." },
    { text: "Двухфакторная аутентификация делает ваш аккаунт на 99.9% безопаснее даже при слабом пароле." },
    { text: "Самые распространённые пароли в мире: '123456', 'password' и 'qwerty'. Их взламывают за доли секунды!" },
    { text: "Добавление всего одной заглавной буквы и цифры увеличивает сложность пароля в сотни раз." },
    { text: "Фразы-пароли из 4-5 случайных слов (например, 'кошка-лампа-река-солнце') легко запомнить, но очень трудно взломать." },
    { text: "Никогда не сообщайте свой пароль никому, даже если звонят из 'службы поддержки' — это мошенники." },
    { text: "Регулярно меняйте пароли от важных аккаунтов — хотя бы раз в 3-6 месяцев." },
    { text: "Пароль 'admin123' взламывается мгновенно. Хороший пароль не должен содержать словарных слов и имён." },
    { text: "Длина пароля важнее сложности. Пароль из 16 символов надёжнее, чем из 4, даже если в нём только строчные буквы." },
    { text: "Проверьте, не утек ли ваш пароль в интернет — сервис 'haveibeenpwned.com' покажет, был ли ваш аккаунт скомпрометирован." },
    { text: "Биометрическая аутентификация (отпечаток пальца, Face ID) удобна и безопасна — используйте её, где возможно." },
    { text: "Не сохраняйте пароли в браузере, если компьютером пользуются другие люди. Используйте отдельный менеджер паролей." },
    { text: "Специальные символы (!@#$%^&*) добавляют сложность, но не заменяют длину пароля. 15+ символов — ваш лучший друг." }
];

function getDailyTip() {
    const today = new Date().toDateString();
    let storedDate = localStorage.getItem('tipDate');
    let tipIndex = localStorage.getItem('tipIndex');
    
    if (storedDate !== today || tipIndex === null) {
        tipIndex = Math.floor(Math.random() * securityTips.length);
        localStorage.setItem('tipDate', today);
        localStorage.setItem('tipIndex', tipIndex);
    }
    
    return securityTips[parseInt(tipIndex)];
}

function displayDailyTip() {
    const tip = getDailyTip();
    const tipContainer = document.getElementById('dailyTip');
    
    if (tipContainer) {
        tipContainer.innerHTML = `
            <div class="tip-header">
                <i class="fas fa-microchip"></i>
                <span>СОВЕТ ДНЯ</span>
            </div>
            <div class="tip-content">
                ${tip.text}
            </div>
            <div class="tip-footer">
                <i class="fas fa-sync-alt"></i> Совет обновляется каждый день
            </div>
        `;
    }
}
    displayDailyTip();