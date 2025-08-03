// Поиск инструментов
const searchBar = document.querySelector('.search-bar');
searchBar.addEventListener('input', () => {
    const searchTerm = searchBar.value.toLowerCase();
    document.querySelectorAll('.tool-card').forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });

});
// Функция для загрузки и отображения changelog
async function loadChangelog() {
    const loadingEl = document.getElementById('changelog-loading');
    const contentEl = document.getElementById('changelog-content');
    const errorEl = document.getElementById('changelog-error');
    
    // Показываем загрузку, скрываем контент и ошибку
    loadingEl.style.display = 'block';
    contentEl.style.display = 'none';
    errorEl.style.display = 'none';
    
    try {
        // Загружаем raw-контент из GitHub
        const response = await fetch('https://raw.githubusercontent.com/showyxxx/tools/main/changelog.md');
        
        if (!response.ok) {
            throw new Error(`Ошибка загрузки: ${response.status} ${response.statusText}`);
        }
        
        const markdown = await response.text();
        
        // Преобразуем Markdown в HTML
        const html = marked.parse(markdown);
        
        // Вставляем результат
        contentEl.innerHTML = html;
        
        // Показываем контент, скрываем загрузку
        contentEl.style.display = 'block';
        loadingEl.style.display = 'none';
        
    } catch (error) {
        console.error('Ошибка загрузки changelog:', error);
        
        // Показываем сообщение об ошибке
        errorEl.textContent = `Не удалось загрузить историю изменений: ${error.message}`;
        errorEl.style.display = 'block';
        loadingEl.style.display = 'none';
    }
}

// Загружаем changelog при загрузке страницы
document.addEventListener('DOMContentLoaded', loadChangelog);

// Обновление по кнопке
document.getElementById('refresh-changelog').addEventListener('click', loadChangelog);
