"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._call = void 0;
const chalk_1 = __importDefault(require("chalk"));
const setting_1 = require("../../setting");
const _call = (call, bot) => {
    const { chatId, date, from, id, offline, status, isGroup, isVideo, latencyMs } = call;
    switch (status) {
        case 'accept':
            {
                console.log((0, chalk_1.default) `{blue ${setting_1.setting.bot_name} {green ⚠.> ${from.replace('@s.whatsapp.net', '')} call is accepted at ${date} }}`);
            }
            break;
        case 'offer':
        case 'ringing':
        case 'timeout':
            {
                console.log((0, chalk_1.default) `{blue ${setting_1.setting.bot_name} {yellow ⚠.> ${from.replace('@s.whatsapp.net', '')} is calling at ${date} }}`);
                bot.rejectCall(id || chatId, from);
            }
            break;
        case 'reject':
            {
                console.log((0, chalk_1.default) `{blue ${setting_1.setting.bot_name} {gray ⚠.> ${from.replace('@s.whatsapp.net', '')} is rejected call at ${date} }}`);
                bot.rejectCall(id || chatId, from);
            }
            break;
        default:
            console.log((0, chalk_1.default) `{blue ${setting_1.setting.bot_name} {yellow ⚠.> unkown call at ${date} }}}`);
            break;
    }
    // bot.sendMessage(callFrom, {
    //     text: 'anda akan di blokir, karna telah menelpon bot!'
    // })
    // await delay(3000)
    // await bot.updateBlockStatus(callFrom, "block")
};
exports._call = _call;
