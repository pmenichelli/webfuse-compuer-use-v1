browser.runtime.onMessage.addListener(message => {
    if (message.type === "interaction") {
        console.log('content_script received', message.action, message.args, message.vPointerCoords);
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
        await browser.virtualSession.interaction[interactionName](...args);
    }
};

console.log('content_script loaded');