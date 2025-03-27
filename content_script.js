browser.runtime.onMessage.addListener(message => {
    if (message.type === "interaction") {
        console.log('EXTENSION: content_script received', message.action, message.args);
        const args = message.args ?? [];
        browser.virtualSession.interaction[message.action](...args);
    } else if (message.type === "run_actions") {
        runActions(message.interactions);
    }
});

const runActions = async automations => {
    for (const automation of automations) {
        const { action } = automation;
        delete automation.action;

        const args = Object.values(automation);
        console.log('EXTENSION: running', action, ...args);
        await browser.virtualSession.automation[action](...args);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    if (!location.href.includes('test_extension_automations.html')){
        return;
    }
    const inputBounds = document.querySelector('#input-element').getBoundingClientRect();
    const inputCenterX = inputBounds.left + inputBounds.width / 2;
    const inputCenterY = inputBounds.top + inputBounds.height / 2;

    const imgBounds = document.querySelector('img').getBoundingClientRect();
    const imgX = imgBounds.left + 1;
    const imgY = imgBounds.top + 1;

    const AUTOMATIONS = [
        // click and type
        { "action": "mouse_move", "coordinate": [inputCenterX, inputCenterY] },
        { "action": "wait", "duration": 1000 },
        { "action": "left_click" },
        { "action": "wait", "duration": 1000 },
        { "action": "type", "text": "The work is mysterious and important...!" },
        { "action": "wait", "duration": 1000 },

        // scrolling
        { "action": "mouse_move", "coordinate": [imgX, imgY] },
        { "action": "wait", "duration": 1000 },
        { "action": "scroll", "amount": 300, "direction": "down" },
        { "action": "wait", "duration": 1000 },
        { "action": "scroll", "amount": 800, "direction": "down" },
        { "action": "wait", "duration": 1000 },
        { "action": "scroll", "amount": 400, "direction": "down" },

        // more scrolling
        { "action": "wait", "duration": 1000 },
        { "action": "scroll", "amount": 100, "direction": "down" },
        { "action": "wait", "duration": 1000 },
        { "action": "scroll", "amount": 100, "direction": "down" },

        // click on the main page and scroll
        { "action": "mouse_move", "coordinate": [300, 700] },
        { "action": "left_click" },
        { "action": "scroll", "amount": 600, "direction": "up" },
        { "action": "wait", "duration": 1000 },
    ];
    const btn = document.getElementById('run-actions');
    btn.addEventListener('click', async () => {
        await runActions(AUTOMATIONS);
    });
    console.log('EXTENSION: content_script loaded');
});
