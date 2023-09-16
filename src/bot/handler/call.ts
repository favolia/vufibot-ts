import { WACallEvent } from "@whiskeysockets/baileys";
import chalk from 'chalk';
import { setting } from '../../setting';

export const _call = (call: WACallEvent) => {
    const bot = global.bot

    const {
        chatId,
        date,
        from,
        id,
        offline,
        status,
        isGroup,
        isVideo,
        latencyMs
    } = call

    switch (status) {
        case 'accept': {
            console.log(chalk`{blue ${setting.bot_name} {green ⚠.> ${from.replace('@s.whatsapp.net', '')} call is accepted at ${date} }}`)
        } break;

        case 'offer': case 'ringing': case 'timeout': {
            console.log(chalk`{blue ${setting.bot_name} {yellow ⚠.> ${from.replace('@s.whatsapp.net', '')} is calling at ${date} }}`)
            bot.rejectCall(id || chatId, from)
        } break;

        case 'reject': {
            console.log(chalk`{blue ${setting.bot_name} {gray ⚠.> ${from.replace('@s.whatsapp.net', '')} is rejected call at ${date} }}`)
            bot.rejectCall(id || chatId, from)
        } break;

        default:
            console.log(chalk`{blue ${setting.bot_name} {yellow ⚠.> unkown call at ${date} }}}`)
            break;
    }

    // bot.sendMessage(callFrom, {
    //     text: 'anda akan di blokir, karna telah menelpon bot!'
    // })
    // await delay(3000)
    // await bot.updateBlockStatus(callFrom, "block")

}