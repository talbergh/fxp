// test-ui NUI Script
// Author: talbergh

const app = document.getElementById('app');
const closeBtn = document.getElementById('closeBtn');
const exampleBtn = document.getElementById('exampleBtn');

// Event Listeners
closeBtn.addEventListener('click', closeUI);
exampleBtn.addEventListener('click', handleExampleAction);

// ESC key handler
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeUI();
    }
});

// NUI Message Handler
window.addEventListener('message', function(event) {
    const data = event.data;
    
    switch (data.action) {
        case 'show':
            showUI(data.data);
            break;
        case 'hide':
            hideUI();
            break;
        case 'update':
            updateUI(data.data);
            break;
    }
});

// UI Functions
function showUI(data = {}) {
    app.classList.remove('hidden');
    document.body.style.cursor = 'default';
}

function hideUI() {
    app.classList.add('hidden');
    document.body.style.cursor = 'none';
}

function closeUI() {
    hideUI();
    // Notify game script
    fetch(`https://${GetParentResourceName()}/close`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({})
    });
}

function updateUI(data) {
    // Update UI elements with new data
    console.log('Updating UI with:', data);
}

function handleExampleAction() {
    // Send data to game script
    fetch(`https://${GetParentResourceName()}/example-action`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            action: 'example',
            timestamp: Date.now()
        })
    });
}

// Utility function to get resource name
function GetParentResourceName() {
    return window.location.hostname;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('test-ui NUI loaded');
});
