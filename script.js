const form = document.getElementById('addAssignment');
const todolist = document.querySelector('.todoList');

var idCounter = 0;
var cards = [];

class Card {
    constructor(name, description, link, tag, dueDate) {
        this.id = idCounter++;

        if (name === undefined) {
            name = "New Assignment";
        }
        this.name = name;

        if (description === undefined) {
            description = "No description provided.";
        }
        this.description = description;

        if (link === undefined) {
            link = "www.google.com";
        }
        this.link = link;

        // no changes to tag
        this.tag = tag;

        if (dueDate === undefined) {
            dueDate = new Date();
        }
        this.dueDate = dueDate;
        SaveToCookies();
    }

    updateCounter() {
        const now = new Date();
        const pastDue = this.dueDate < now;
        const timeDiff = Math.abs(this.dueDate - now);

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDiff / 1000) % 60);
        // do not compute milliseconds here

        if (pastDue) {
            document.getElementById(`prefix-${this.id}`).textContent = "-";
            // change class name of the assignmnet card from assignmentCard ${this.tag} to assignmentCard lateAssignment
            const cardElement = document.getElementById(`assignmentCard-${this.id}`);
            cardElement.classList.remove(`${stripHtml(this.tag)}`);
            cardElement.classList.add(`lateAssignment`);
        }

        if (days === 0) {
            const miliseconds = Math.floor((timeDiff % 1000) / 10);
            if (hours === 0) {
                document.getElementById(`days-${this.id}`).textContent = "";
                document.getElementById(`dayDiv-${this.id}`).textContent = "";
            } else {
                document.getElementById(`days-${this.id}`).textContent = String(hours).padStart(2, '0');
                document.getElementById(`dayDiv-${this.id}`).textContent = ":";
            }
            if (minutes === 0 && hours === 0) {
                document.getElementById(`hours-${this.id}`).textContent = "";
                document.getElementById(`hourDiv-${this.id}`).textContent = "";
            } else {
                document.getElementById(`hours-${this.id}`).textContent = String(minutes).padStart(2, '0');
                document.getElementById(`hourDiv-${this.id}`).textContent = ":";
            }
            document.getElementById(`minutes-${this.id}`).textContent = String(seconds).padStart(2, '0');
            document.getElementById(`seconds-${this.id}`).textContent = String(miliseconds).padStart(2, '0');
        } else {
            if (days === 0) {
                document.getElementById(`days-${this.id}`).textContent = "";
                document.getElementById(`dayDiv-${this.id}`).textContent = "";
            } else {
                document.getElementById(`days-${this.id}`).textContent = String(days).padStart(2, '0');
                document.getElementById(`dayDiv-${this.id}`).textContent = ":";
            }
            if (hours === 0 && days === 0) {
                document.getElementById(`hours-${this.id}`).textContent = "";
                document.getElementById(`hourDiv-${this.id}`).textContent = "";
            } else {
                document.getElementById(`hours-${this.id}`).textContent = String(hours).padStart(2, '0');
                document.getElementById(`hourDiv-${this.id}`).textContent = ":";
            }
            document.getElementById(`minutes-${this.id}`).textContent = String(minutes).padStart(2, '0');
            document.getElementById(`seconds-${this.id}`).textContent = String(seconds).padStart(2, '0');
        }
    }

    addCardToDOM() {
        const basicCard = `
        <li class="assignmentCard ${stripHtml(this.tag)}" id="assignmentCard-${this.id}">
            <a href="https://${stripHtml(this.link)}" class="assignmentCardContent" target="_blank">
                <section class="countdown" id="countdown-${this.id}">
                    <span class="prefix" id="prefix-${this.id}"></span>
                    <span class="days" id="days-${this.id}">00</span>
                    <span id="dayDiv-${this.id}">:</span>
                    <span class="hours" id="hours-${this.id}">00</span>
                    <span id="hourDiv-${this.id}">:</span>
                    <span class="minutes" id="minutes-${this.id}">00</span>
                    <span>:</span>
                    <span class="seconds" id="seconds-${this.id}">00</span>
                </section>
                <div class="verticleBar"></div>
                <section class="assignemntInfo">
                    <h3>${stripHtml(this.name)}</h3>
                    <p>${stripHtml(this.description)}</p>
                </section>
            </a>
            <button type="button" class="deleteButton">
                <div class="deleteButtonBar deleteButtonRight"></div>
                <div class="deleteButtonBar deleteButtonLeft"></div>
            </button>
        </li>
    `;
        todolist.insertAdjacentHTML('beforeend', basicCard);
    }
}

function sortCardsByDueDate() {
    cards.sort((a, b) => a.dueDate - b.dueDate);
    todolist.innerHTML = '';
    cards.forEach(card => card.addCardToDOM());
}


function SaveToCookies() {
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();

    document.cookie =
        `cards=${encodeURIComponent(JSON.stringify(cards))}; expires=${expires}; path=/; SameSite=Lax`;
}

function LoadFromCookies() {
    const savedCookie = document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith('cards='));

    if (!savedCookie) return;

    try {
        const savedCards = JSON.parse(
            decodeURIComponent(savedCookie.substring('cards='.length))
        );

        cards = savedCards.map(data => {
            const card = new Card(
                data.name,
                data.description,
                data.link,
                data.tag,
                new Date(data.dueDate)
            );

            card.id = data.id; // Preserve the original card ID.
            return card;
        });

        idCounter = Math.max(-1, ...cards.map(card => card.id)) + 1;
    } catch (error) {
        console.error('Could not load saved cards:', error);
        cards = [];
    }
}

function stripHtml(htmlString) {
    return htmlString;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.textContent || "";
}

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const nameInput = document.getElementById('inpName').value;
    const descriptionInput = document.getElementById('inpDescription').value;
    const linkInput = document.getElementById('inpLink').value;
    const tagInput = document.getElementById('inpTag').value;
    const dueDateInput = document.getElementById('inpDue').value;

    const dueDate = new Date(dueDateInput);

    const newCard = new Card(nameInput, descriptionInput, linkInput, tagInput, dueDate);
    cards.push(newCard);
    newCard.addCardToDOM();
    sortCardsByDueDate();

    form.reset();
});

// delete button functionality
todolist.addEventListener('click', function (event) {
    const deleteButton = event.target.closest('.deleteButton');

    if (!deleteButton || !todolist.contains(deleteButton)) {
        return;
    }

    document.querySelector('.confirmDeletion').style.visibility = 'visible';

    // wait untill the user clicks either the confirm or cancel button
    const confirmButton = document.querySelector('.confirmDeletion .confirmDeletionButtons .confirmButton');
    const cancelButton = document.querySelector('.confirmDeletion .confirmDeletionButtons .cancelButton');

    confirmButton.addEventListener('click', function () {
        document.querySelector('.confirmDeletion').style.visibility = 'hidden';
        event.target.closest('.assignmentCard').remove();
        cards = cards.filter(card => card.id !== parseInt(event.target.closest('.assignmentCard').id.split('-')[1]));
    });

    cancelButton.addEventListener('click', function () {
        document.querySelector('.confirmDeletion').style.visibility = 'hidden';
    });

    if (todolist.children.length == 0) {
        document.querySelector('.emptyLists').style.visibility = 'visible';
        document.querySelector('.todoList').style.visibility = 'hidden';
    } else {
        document.querySelector('.emptyLists').style.visibility = 'hidden';
        document.querySelector('.todoList').style.visibility = 'visible';
    }
});

LoadFromCookies();

// loop updates
setInterval(function () {
    cards.forEach(card => {
        card.updateCounter();
    });
}, 10);