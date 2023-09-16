export const quickReply = async (message: string) => {
    const bot = global.bot
    
    const msg = message.toLowerCase()
    switch (msg) {
        case 'sad':
            bot.sendMessage(global.from, {text: 'kasian.'})
            break;
    }

    return;
}