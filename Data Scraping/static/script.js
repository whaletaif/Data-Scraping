const radioButtons = document.querySelectorAll('.tabs [type="radio"]');
const labels = document.querySelectorAll('.tabs label');

radioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
        labels.forEach(label => {
            label.classList.remove('checked-label');
        });
        const checkedRadioId = radio.id;
        const checkedLabel = document.querySelector(`label[for="${checkedRadioId}"]`);
        if (checkedLabel) {
            checkedLabel.classList.add('checked-label');
        }
    });
});

const initiallyChecked = document.querySelector('.tabs [type="radio"]:checked');
if (initiallyChecked) {
    const initialLabel = document.querySelector(`label[for="${initiallyChecked.id}"]`);
    if (initialLabel) {
        initialLabel.classList.add('checked-label');
    }
}

const tagList = document.querySelector('.tag-list');
const addTagButton = document.getElementById('add-tag-button');
let tagCount = 0;

function addTagItem() {
    tagCount++;

    const tagItem = document.createElement('div');
    tagItem.classList.add('tag-item');

    const tagNumber = document.createElement('span');
    tagNumber.classList.add('tag-number');
    tagNumber.textContent = tagCount;

    const tagInput = document.createElement('input');
    tagInput.type = 'text';
    tagInput.classList.add('tag-input');
    tagInput.placeholder = `مطعم `;

    const removeButton = document.createElement('button');
    removeButton.classList.add('remove-tag-button');
    removeButton.textContent = 'X';
    removeButton.addEventListener('click', removeTagItem);

    tagItem.appendChild(removeButton);
    tagItem.appendChild(tagInput);
    tagItem.appendChild(tagNumber);

    tagList.appendChild(tagItem);
}

function removeTagItem(event) {
    const button = event.target;
    const tagItem = button.parentNode;
    tagList.removeChild(tagItem);


    const remainingTags = tagList.querySelectorAll('.tag-item');
    remainingTags.forEach((item, index) => {
        const numberSpan = item.querySelector('.tag-number');
        numberSpan.textContent = index + 1;
    });
    tagCount = remainingTags.length;
}

// addTagButton.addEventListener('click', addTagItem);

// addTagItem();

const numberInput = document.getElementById('number-input');
const incrementButton = document.querySelector('.increment-arrow');
const decrementButton = document.querySelector('.decrement-arrow');

// incrementButton.addEventListener('click', () => {
//     numberInput.value = parseInt(numberInput.value) + 1;
// });

// decrementButton.addEventListener('click', () => {
//     numberInput.value = parseInt(numberInput.value) - 1;
// });


// numberInput.addEventListener('change', () => {
//     if (parseInt(numberInput.value) < 0) {
//         numberInput.value = 0;
//     } else if (parseInt(numberInput.value) > 100) {
//         numberInput.value = 100;
//     }
// });


const apiButton = document.getElementById('api-button');
const apiPopup = document.getElementById('api-popup');
const closeApiButton = document.querySelector('#api-popup .close-button');
const copyButtons = document.querySelectorAll('.copy-button');
const scheduleButton = document.getElementById('schedule-button');
const schedulePopup = document.getElementById('schedule-popup');
const closeScheduleButton = document.querySelector('#schedule-popup .close-schedule-button');

function openApiPopup() {
    apiPopup.style.display = 'flex';
}


function closeApiPopup() {
    apiPopup.style.display = 'none';
}

function openSchedulePopup() {
    schedulePopup.style.display = 'flex';
}

function closeSchedulePopup() {
    schedulePopup.style.display = 'none';
}
closeScheduleButton.addEventListener('click', () => {
    schedulePopup.style.display = 'none';
});

scheduleButton.addEventListener('click', () => {
    schedulePopup.style.display = 'flex';
});

apiButton.addEventListener('click', openApiPopup);

closeApiButton.addEventListener('click', closeApiPopup);
// closeApiPopupButton.addEventListener('click', closeApiPopup);

scheduleButton.addEventListener('click', openSchedulePopup);

closeScheduleButton.addEventListener('click', closeSchedulePopup);
// closeSchedulePopupButton.addEventListener('click', closeSchedulePopup);


window.addEventListener('click', (event) => {
    if (event.target === apiPopup) {
        closeApiPopup();
    }
    if (event.target === schedulePopup) {
        closeSchedulePopup();
    }
});

copyButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.dataset.target;
        const linkInput = document.getElementById(targetId);
        if (linkInput) {
            linkInput.select();
            document.execCommand('copy');
            alert('تم النسخ : ' + linkInput.value);
        }
    });
});

const tableData = [
    {
        description: 'نص طويل جداً يصف شيئًا ما بالتفصيل الممل.',
        count: 50,
        startTime: '2025-04-30 18:00',
        endTime: '2025-04-30 18:30',
        duration: '30 دقيقة',
        type: 'تصدير',
        fileSize: '2.5 MB'
    },
    {
        description: 'وصف قصير.',
        count: 45,
        startTime: '2025-05-01 09:00',
        endTime: '2025-05-01 10:00',
        duration: '1 ساعة',
        type: 'استيراد',
        fileSize: '1.1 GB'
    },
];

const dataRowsBody = document.getElementById('data-rows');

function addTableRow(rowData) {
    const newRow = dataRowsBody.insertRow();

    const descriptionCell = newRow.insertCell();
    descriptionCell.textContent = rowData.description;

    const countCell = newRow.insertCell();
    countCell.textContent = rowData.count;

    const startTimeCell = newRow.insertCell();
    startTimeCell.textContent = rowData.startTime;

    const endTimeCell = newRow.insertCell();
    endTimeCell.textContent = rowData.endTime;

    const durationCell = newRow.insertCell();
    durationCell.textContent = rowData.duration;

    const typeCell = newRow.insertCell();
    typeCell.textContent = rowData.type;

    const fileSizeCell = newRow.insertCell();
    fileSizeCell.textContent = rowData.fileSize;
}

tableData.forEach(item => {
    addTableRow(item);
});

function addNewData(description, count, startTime, endTime, duration, type, fileSize) {
    const newData = {
        description: description,
        count: count,
        startTime: startTime,
        endTime: endTime,
        duration: duration,
        type: type,
        fileSize: fileSize
    };
    addTableRow(newData);
}

// addNewData('وصف جديد', 678, '2025-05-02 12:00', '2025-05-02 12:15', '15 دقيقة', 'تعديل', '500 KB');

// const errorData = [
//     { type: 'خطأ في الاتصال', count: 5 },
//     { type: 'خطأ في البيانات', count: 12 },
//     { type: 'خطأ في الخادم', count: 2 },
//     { type: 'أخطاء أخرى', count: 1 },
// ];

const errorRowsBody = document.getElementById('error-rows');

function addErrorRow(errorInfo) {
    const newRow = errorRowsBody.insertRow();

    const typeCell = newRow.insertCell();
    typeCell.textContent = errorInfo.type;

    const countCell = newRow.insertCell();
    countCell.textContent = errorInfo.count;
}

const form = document.getElementById('scraper-form');
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent page refresh

    // Clear previous logs
    errorRowsBody.innerHTML = '';

    // Get input values
    const keyword = form.querySelector('input[name="keyword"]').value.trim();
    const location = form.querySelector('input[name="location"]').value.trim();
    const limit = form.querySelector('input[name="limit"]').value.trim();
    const proxy = form.querySelector('input[name="proxy"]').value.trim();

    // Validate inputs
    let hasErrors = false;
    if (!keyword) {
        const newRow = errorRowsBody.insertRow();
        const logCell = newRow.insertCell();
        logCell.textContent = 'Keyword is required.';
        hasErrors = true;
    }

    if (!location) {
        const newRow = errorRowsBody.insertRow();
        const logCell = newRow.insertCell();
        logCell.textContent = 'Location is required.';
        hasErrors = true;
    }

    if (limit && (!Number.isInteger(Number(limit)) || Number(limit) <= 1)) {
        const newRow = errorRowsBody.insertRow();
        const logCell = newRow.insertCell();
        logCell.textContent = 'Limit must be a whole number greater than 0.';
        hasErrors = true;
    }

    if (proxy && !proxy.startsWith('http://') && !proxy.startsWith('https://')) {
        const newRow = errorRowsBody.insertRow();
        const logCell = newRow.insertCell();
        logCell.textContent = 'Proxy must start with http:// or https://.';
        hasErrors = true;
    }

    const issuesTab = document.getElementById('tab2-3');
    if (issuesTab) {
        issuesTab.checked = true; // Switch to the "المشاكل" tab
    }

    if (hasErrors) { return; }

    // Disable the submit button
    submitButton.disabled = true;

    try {
        const formData = new FormData(form);
        const response = await fetch('/scraper-maps', {
            method: 'POST',
            body: formData,
        });
    } finally {
        // Re-enable the submit button
        submitButton.disabled = false;
    }

});

// errorData.forEach(error => {
//     addErrorRow(error);
// });

const socket = io(); // Initialize SocketIO client

socket.on('connect', () => {
    console.log('WebSocket connected');
});

// Listen for log messages from the server
socket.on('log', (data) => {
    console.log('Log received:', data.message); // Debug log
    const newRow = errorRowsBody.insertRow();
    const logCell = newRow.insertCell();
    logCell.textContent = data.message;
});

// function addNewError(errorType, errorCount) {
//     const newError = { type: errorType, count: errorCount };
//     addErrorRow(newError);
// }
// addNewError('خطأ جديد', 3);

document.addEventListener('DOMContentLoaded', () => {
    const loginButtonDiv = document.querySelector('.login-button');
    const userInfoDiv = document.querySelector('.user-info');
    const userAvatarImg = document.querySelector('.user-info .user-photo');
    const userNameSpan = document.querySelector('.user-info .user-name');
    const welcomeUserElement = document.getElementById('welcomeUser');

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            loginButtonDiv.style.display = 'none';
            userInfoDiv.style.display = 'flex';

            if (welcomeUserElement) {
                welcomeUserElement.textContent = `مرحباً ${user.email ? user.email.split('@')[0] : user.displayName || 'مستخدم'}`;
            }

            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                userNameSpan.textContent = userData.displayName || user.displayName || (user.email ? user.email.split('@')[0] : 'اسم المستخدم');
                userAvatarImg.src = userData.photoURL || user.photoURL || 'default-avatar.png';
            } else {
                console.log("لا توجد بيانات إضافية في Firestore.");
                userNameSpan.textContent = user.displayName || (user.email ? user.email.split('@')[0] : 'اسم المستخدم');
                userAvatarImg.src = user.photoURL || 'default-avatar.png';
            }
        } else {
            loginButtonDiv.style.display = 'block';
            userInfoDiv.style.display = 'none';
            if (welcomeUserElement) {
                welcomeUserElement.textContent = '';
            }
        }
    });
});