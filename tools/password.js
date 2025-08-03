// Генератор паролей
const passwordOutput = document.getElementById('password-output');
const copyBtn = document.getElementById('copy-password');
const lengthSlider = document.getElementById('password-length');
const lengthValue = document.getElementById('length-value');
const uppercase = document.getElementById('uppercase');
const lowercase = document.getElementById('lowercase');
const numbers = document.getElementById('numbers');
const symbols = document.getElementById('symbols');
const generateBtn = document.getElementById('generate-password');

// Обновление значения длины
lengthSlider.addEventListener('input', () => {
    lengthValue.textContent = lengthSlider.value;
});

// Генерация пароля
function generatePassword() {
    const length = parseInt(lengthSlider.value);
    const hasUpper = uppercase.checked;
    const hasLower = lowercase.checked;
    const hasNumbers = numbers.checked;
    const hasSymbols = symbols.checked;
    
    if (!hasUpper && !hasLower && !hasNumbers && !hasSymbols) {
        alert("Пожалуйста, выберите хотя бы один тип символов");
        return;
    }
    
    let charset = '';
    if (hasUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (hasLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (hasNumbers) charset += '0123456789';
    if (hasSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    
    passwordOutput.value = password;
}

// Копирование пароля
copyBtn.addEventListener('click', () => {
    passwordOutput.select();
    document.execCommand('copy');
    alert("Пароль скопирован в буфер обмена!");
});

generateBtn.addEventListener('click', generatePassword);

// Генерация пароля при загрузке
generatePassword();