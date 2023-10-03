export const quickReply = async (message: string) => {
    const bot = global.bot

    const msg = message?.toLowerCase()

    const toxic = [
      'anj', 'anjg', 'anjing',
      'memek', 'mmk', 'puki',
      'kontol', 'kntl', 'kon',
      'bgst', 'bgsat', 'bangsat',
      'banjingan', 'telaso', 'babi',
      'asu', 'asw', 'bangke', 'shit'
    ]

    if(toxic.includes(msg)) return bot.sendMessage(global.from, {text: 'kasar anjing.'});
  
    switch (msg) {
        case 'sad': {
            bot.sendMessage(global.from, { text: 'kasian.' })
        }
            break;
        case 'assalamualaikum': case 'assalamualaikumm': case 'samlekom': {
            bot.sendMessage(global.from, { text: 'walaikum salam.' })
        }
            break;
    }

    return;
}         