browser.runtime.onMessage.addListener(message => {
    if (message.type === "interaction") {
        console.log('EXTENSION: content_script received', message.action, message.args);
        const args = message.args ?? [];
        browser.virtualSession.interaction[message.action](...args);
    } else if (message.type === "run_actions") {
        runActions(message.interactions);
    }
});

const mapping = {
    mouse_move: 'moveMouse',
    left_click: 'click',
}

runActions = async interactions => {
    for (let interaction of interactions) {
        const { action } = interaction;
        delete interaction.action;

        const interactionName = mapping[action] ?? action;

        const args = Object.values(interaction);
        console.log('EXTENSION: running', interactionName, args);
        await browser.virtualSession.interaction[interactionName](...args);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    const inputBounds = document.querySelector('#kiwi').getBoundingClientRect();
    const inputCenterX = inputBounds.left + inputBounds.width / 2;
    const inputCenterY = inputBounds.top + inputBounds.height / 2;

    const imgBounds = document.querySelector('img').getBoundingClientRect();
    const imgX = imgBounds.left + 1;
    const imgY = imgBounds.top + 1;

    const INTERACTIONS = [
        {
            "action": "mouse_move",
            "coordinate": [inputCenterX, inputCenterY]
        },
        {
            "action": "wait",
            "duration": 1000
        },
        {
            "action": "left_click",
        },
        {
            "action": "wait",
            "duration": 1000
        },
        {
            "action": "type",
            "text": "The work is mysterious and important...!"
        },
        {
            "action": "wait",
            "duration": 1000,
        },
        {
            "action": "mouse_move",
            "coordinate": [imgX, imgY]
        },
        {
            "action": "wait",
            "duration": 1000
        },
        {
            "action": "scroll",
            "amount": 300,
            "direction": "down"
        },
        {
            "action": "wait",
            "duration": 1000,
        },
        {
            "action": "scroll",
            "amount": 300,
            "direction": "down"
        },
        {
            "action": "wait",
            "duration": 1000,
        },
        {
            "action": "scroll",
            "amount": 100,
            "direction": "down"
        },
        {
            "action": "wait",
            "duration": 1000,
        },
        {
            "action": "scroll",
            "amount": 100,
            "direction": "down"
        },
        {
            "action": "mouse_move",
            "coordinate": [300, 700]
        },
        {
            "action": "left_click",
        },
        {
            "action": "scroll",
            "amount": 300,
            "direction": "down"
        },
        {
            "action": "wait",
            "duration": 1000,
        },
    ];
    const btn = document.getElementById('run-actions');
    btn.addEventListener('click', async () => {
        await runActions(INTERACTIONS);
    });
    console.log('EXTENSION: content_script loaded');
});
