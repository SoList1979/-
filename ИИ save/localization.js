// --- Модуль локализации ---
let translations = {}; // Сюда будут загружены переводы

// Определение языка браузера
function getBrowserLanguage() {
    const lang = navigator.language.toLowerCase();
    return lang.startsWith('ru') ? 'ru' : 'en'; // По умолчанию — английский
    //return 'en'; // Принудительная установка английского для теста
}

// Загрузка JSON-файла перевода
async function loadTranslations(lang) {
    try {
        const response = await fetch(`lang/lang_${lang}.json`);
        if (!response.ok) throw new Error(`Не удалось загрузить ${lang}`);
        translations = await response.json();
    } catch (error) {
        console.error("Ошибка загрузки перевода:", error);
        // Можно загрузить fallback (например, en)
        if (lang !== 'en') {
            await loadTranslations('en');
        }
    }
}

// Применение перевода ко всем элементам с data-i18n
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
}

// Инициализация
(async function initI18n() {
    const userLang = getBrowserLanguage();
    await loadTranslations(userLang);
    applyTranslations();
})();