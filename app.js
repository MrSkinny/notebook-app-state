/* global $ */

const appState = {
    // typically, `allNotebooks` would be pulled from a database and not stored in state
    allNotebooks: [
        {
            id: '100',
            label: 'Personal',
            notes: [
                {
                    id: '200',
                    title: 'Shopping',
                    body: 'This is a note about shopping. Maybe I will put a list of stuff to buy here. For example purposes, we want to keep notes to a single paragraph.'
                },
                {
                    id: '201',
                    title: 'Doctors no.',
                    body: '455-555-3232 appointment on 6/12'
                },
                {
                    id: '202',
                    title: 'Call with mom',
                    body: "She needs me to clean out my old clothes, they're turning bedroom into an exercise room...!"
                },
            ]
        },
        {
            id: '101',
            label: 'Work',
            notes: [
                {
                    id: '203',
                    title: 'Meeting with Sales',
                    body: 'Need to up the quarterly projections ASAP'
                },
                {
                    id: '204',
                    title: 'Relocation',
                    body: 'Looking at 3 diff locations for the extension office; need space for 15 people'
                },
                {
                    id: '205',
                    title: 'Dept. memos',
                    body: "We're not sending out enough memos for people to keep up with the important goings-ons in and around the office. Meet with Bhaumik, Joe to increase memo output 5x"
                }
            ]
        }
    ],
    selectedNotebook: null,
    selectedNote: null,
    isAddingNote: false
};

function setNotebook(state, notebookId) {
    state.selectedNotebook = Object.assign({}, state.allNotebooks.find(nb => nb.id === notebookId));
}

function setNote(state, noteId) {
    if (noteId === '-1') {
        state.selectedNote = null;
        state.isAddingNote = true;
    } else {
        state.selectedNote = Object.assign({}, state.selectedNotebook.notes.find(n => n.id === noteId));
        state.isAddingNote = false;
    }
}

function renderNotebookDropdown(state, el) {
    let html = '';
    html += '<select class="styled-select slate" id="notebook-dropdown">';
    html += '<option value="0">---</option>';
    state.allNotebooks.forEach(notebook => {
        if (state.selectedNotebook && notebook.id === state.selectedNotebook.id) {
            html += `<option selected value="${state.selectedNotebook.id}">${state.selectedNotebook.label}</option>`;
        } else {
            html += `<option value="${notebook.id}">${notebook.label}</option>`;
        }
    });
    html += '</select>';

    el.html(html);
}

function renderNoteList(state, el){
    let html = '';
    if (state.selectedNotebook) {
        state.selectedNotebook.notes.forEach(note => {
            if (state.selectedNote && state.selectedNote.id === note.id) {
                html += `
                    <div class="note-item selected" id="${note.id}">
                        ${note.title}
                    </div>
                `;
            } else {
                html += `
                    <div class="note-item" id="${note.id}">
                        ${note.title}
                    </div>
                `;
            }
        });
    }

    html += `
        <div class="note-item note-item-add" id="-1">
            + Add Note
        </div>
    `;
    el.html(html);
}

function renderNote(state, el){
    let html = '';
    if (state.isAddingNote) {
        html += `
            <form>
                <label>Title</title>
                <input style="width: 100%" type="text" />
                <label>Content</label>
                <textarea style="width: 100%" rows="10"></textarea>
                <input type="submit" value="Add" />
            </form>
        `;
    } else if (!state.selectedNote) {
        html += '<header>Pick a Note!</header>';
    } else {
        html += `
            <header>${state.selectedNote.title}</header>
            <p>${state.selectedNote.body}</p>
        `;
    }

    el.html(html);
}

function addEventListeners() {
    $('.notebook-selector').on('change', event => {
        const notebookId = $(event.target).find('option:selected').val();
        if (notebookId === '0') return;
        setNotebook(appState, notebookId);
        renderNotebookDropdown(appState, $('.notebook-selector'));
        renderNoteList(appState, $('.note-list'));
    });

    $('.note-list').on('click', '.note-item', event => {
        const noteId = event.target.id;
        setNote(appState, noteId);
        renderNoteList(appState, $('.note-list'));
        renderNote(appState, $('.note-detail-content'));
    });
}

$(function() {
    setNotebook(appState, appState.allNotebooks[0].id);
    renderNotebookDropdown(appState, $('.notebook-selector'));
    renderNoteList(appState, $('.note-list'));
    renderNote(appState, $('.note-detail-content'));
    addEventListeners();
});
