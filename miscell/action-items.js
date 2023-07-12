const actionItems = [
    {
        id: 1,
        text: "Listen WK25 SD.CODE training lessons",
        completed: true,
        hidden: false,
    },
    {
        id: 2,
        text: "Complete WK25 SD.CODE project",
        completed: false,
        hidden: false,
    },
    { id: 3, text: "Pay apartment rental fee", completed: true, hidden: true },
    { id: 4, text: "Pay electicity bill", completed: true, hidden: true },
    { id: 5, text: "Pay gas bill", completed: false, hidden: false },
    { id: 6, text: "Pay internet bill", completed: false, hidden: false },
    {
        id: 7,
        text: "Pay appartment insurance for 2Q",
        completed: false,
        hidden: false,
    },
    {
        id: 8,
        text: "Send invites for the mid-summer party",
        completed: true,
        hidden: false,
    },
    {
        id: 9,
        text: "Buy drinks for the party",
        completed: false,
        hidden: false,
    },
    {
        id: 10,
        text: "Apply for job at Google",
        completed: false,
        hidden: false,
    },
    { id: 11, text: "Apply for job at Amazon", completed: true, hidden: false },
    { id: 12, text: "Apply for job at Avito", completed: false, hidden: false },
    { id: 13, text: "Apply for job at Google", completed: true, hidden: false },
    { id: 14, text: "Send brother a HB card", completed: true, hidden: true },
    { id: 16, text: "Pay back to the bank", completed: true, hidden: true },
    { id: 17, text: "Buy food for a cat", completed: true, hidden: true },
];

const newItemInputNode = document.getElementById("newItemInput");
const newItemBtnNode = document.getElementById("newItemBtn");
const myFavoritesListNode = document.getElementById("myFavoritesList");
const trashSwitchNode = document.getElementById("trashSwitch");
const trashContainerNode = document.getElementById("trashContainer");

renderActiveList();

// Event listener for new item
newItemBtnNode.addEventListener("click", function () {
    const itemFromUser = getItemFromUser();
    if (!itemFromUser.text) {
        alert("Please enter the field");
        return;
    }

    // add new item to items list
    addItem(itemFromUser);

    // add new item to rendering list
    createListItem(itemFromUser);

    clearInputField();
    clearTrashList();
    renderActiveList();
});

trashSwitchNode.addEventListener("click", function () {
    renderTrashList();
});

// Get new item from user
function getItemFromUser() {
    const newItemFromCustomer = {
        id: generateUniqueId(actionItems),
        text: newItemInputNode.value,
        completed: false,
        hidden: false,
    };
    return newItemFromCustomer;
}

function addItem(newActionItem) {
    actionItems.push(newActionItem);
}

// Generate unique id has not been used in array yet:
function generateUniqueId(arrayList) {
    let id = 1;
    while (arrayList.some((item) => item.id === id)) {
        id++;
    }
    return id;
}

// Create list item template for rendering
function createListItem(item) {
    const listItem = document.createElement("li");
    if (item.completed) {
        listItem.className = "display-item-wrapper completed";
    } else {
        listItem.className = "display-item-wrapper";
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `checkbox_${item.id}`;
    checkbox.className = "item-checkbox";
    checkbox.checked = item.completed;

    const label = document.createElement("label");
    label.className = "display-item";
    label.htmlFor = `checkbox_${item.id}`;
    label.innerText = item.text;

    const hideButton = document.createElement("button");
    hideButton.className = "item-hide-btn";
    hideButton.id = `btn_${item.id}`;
    // hideButton.innerText = '';

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(hideButton);

    return listItem;
}

function createTrashItem(item) {
    const trashItem = document.createElement("li");
    if (item.completed) {
        trashItem.className = "display-item-wrapper completed";
    } else {
        trashItem.className = "display-item-wrapper";
    }

    const label = document.createElement("label");
    label.className = "display-item";
    label.htmlFor = `checkbox_${item.id}`;
    label.innerText = item.text;

    const hideButton = document.createElement("button");
    hideButton.className = "restore-btn";
    hideButton.id = `btn_${item.id}`;
    // hideButton.innerText = '';

    trashItem.appendChild(label);
    trashItem.appendChild(hideButton);

    return trashItem;
}

function clearInputField() {
    return (newItemInputNode.value = "");
}

function clearActiveList() {
    return (myFavoritesListNode.innerHTML = "");
}

// Render the list
function renderActiveList() {
    clearActiveList();

    // Create list item and append list container
    actionItems.forEach((item) => {
        if (!item.hidden) {
            const listItem = createListItem(item);
            myFavoritesListNode.appendChild(listItem);
        }
    });

    // Set event listeners for checkboxes and btns
    const checkboxes = document.querySelectorAll(".item-checkbox");
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", handleCheckboxChange);
    });

    const hideButtons = document.querySelectorAll(".item-hide-btn");
    hideButtons.forEach((button) => {
        button.addEventListener("click", handleHideButtonClick);
    });
}

function clearTrashList() {
    return (trashContainerNode.innerHTML = "");
}

function renderTrashList() {
    clearTrashList();

    // Create list item and append list container
    actionItems.forEach((item) => {
        if (item.hidden) {
            const trashItem = createTrashItem(item);
            trashContainerNode.appendChild(trashItem);
        }
    });

    const restoreButtons = document.querySelectorAll(".restore-btn");
    restoreButtons.forEach((button) => {
        button.addEventListener("click", handleRestoreButtonClick);
    });
}

// Event handler for checkbox change event
function handleCheckboxChange(event) {
    const checkbox = event.target;
    // Get the item id from the checkbox id:
    const itemId = parseInt(checkbox.id.split("_")[1]);

    // Update checked status for item with relevant id:
    const item = actionItems.find((item) => item.id === itemId);
    if (item) {
        item.completed = checkbox.checked;
        console.log(`Action item ${itemId} status updated: ${item.completed}`);
    }
    renderActiveList();
}

// Event handler for hide button click event
function handleHideButtonClick(event) {
    const button = event.target;
    const itemId = parseInt(button.id.split("_")[1]);

    if (!confirm("Please confirm moving item to trash bin")) {
        return;
    }

    // Update hidden status for item with relevant id:
    const item = actionItems.find((item) => item.id === itemId);
    if (item) {
        item.hidden = true;
        console.log(
            `Action item ${itemId} hidden status updated: ${item.hidden}`
        );
    }
    renderActiveList();
    clearTrashList();
}

function handleRestoreButtonClick(event) {
    const button = event.target;
    const itemId = parseInt(button.id.split("_")[1]);

    // Update hidden status for item with relevant id:
    const item = actionItems.find((item) => item.id === itemId);
    if (item) {
        item.hidden = false;
        console.log(
            `Action item ${itemId} hidden status updated: ${item.hidden}`
        );
    }
    renderActiveList();
    renderTrashList();
}
