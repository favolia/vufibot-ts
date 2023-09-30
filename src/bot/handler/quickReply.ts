export const quickReply = async (message: string) => {
    const bot = global.bot

    const msg = message?.toLowerCase()
    switch (msg) {
        case 'sad': {
            bot.sendMessage(global.from, { text: 'kasian.' })
        }
            break;
        case 'anjing': case 'anj': case 'bgst': case 'bangsat': {
            bot.sendMessage(global.from, { text: 'kasar ngana.' })
        }
            break;
        case 'assalamualaikum': case 'assalamualaikumm': case 'samlekom': {
            bot.sendMessage(global.from, { text: 'walaikum salam.' })
        }
            break;
    }

    return;
}         