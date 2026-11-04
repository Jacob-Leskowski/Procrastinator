const form = document.getElementById('addAssignment');
const todolist = document.querySelector('.todoList');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const nameInput = document.getElementById('inpName').value;
    const descriptionInput = document.getElementById('inpDescription').value;
    const linkInput = document.getElementById('inpLink').value;
    const tagInput = document.getElementById('inpTag').value;


    const basicCard = `
        <li class="assignmentCard ${tagInput}">
            <a href="https://${linkInput}" class="assignmentCardContent" target="_blank">
                <section class="countdown">
                    <span class="days">00</span>
                    <span>:</span>
                    <span class="hours">00</span>
                    <span>:</span>
                    <span class="minutes">00</span>
                    <span>:</span>
                    <span class="seconds">00</span>
                </section>
                <div class="verticleBar"></div>
                <section class="assignemntInfo">
                    <h3>${nameInput}</h3>
                    <p>${descriptionInput}</p>
                </section>
            </a>
            <button type="button" class="deleteButton">
                <div class="deleteButtonBar deleteButtonRight"></div>
                <div class="deleteButtonBar deleteButtonLeft"></div>
            </button>
        </li>
    `;

    todolist.insertAdjacentHTML('beforeend', basicCard);
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