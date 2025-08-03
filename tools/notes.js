// Заметки
const notesList = document.getElementById('notes-list');
const noteText = document.getElementById('note-text');
const saveNoteBtn = document.getElementById('save-note');

function loadNotes() {
    notesList.innerHTML = '';
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.forEach((note, index) => {
        const noteEl = document.createElement('div');
        noteEl.className = 'note';
        noteEl.innerHTML = `
            <button class="delete-note" data-index="${index}">×</button>
            <div class="note-content">${note.text}</div>
            <div class="note-date">${new Date(note.date).toLocaleString()}</div>
        `;
        notesList.appendChild(noteEl);
    });

    // Удаление заметок
    document.querySelectorAll('.delete-note').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(button.getAttribute('data-index'));
            deleteNote(index);
        });
    });
}

function saveNote() {
    const text = noteText.value.trim();
    if (text === '') return;

    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push({
        text: text,
        date: new Date().toISOString()
    });

    localStorage.setItem('notes', JSON.stringify(notes));
    noteText.value = '';
    loadNotes();
}

function deleteNote(index) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes();
}

saveNoteBtn.addEventListener('click', saveNote);

// Загружаем заметки при открытии страницы
loadNotes();