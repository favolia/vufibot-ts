"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quickReply = void 0;
const quickReply = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const bot = global.bot;
    const msg = message === null || message === void 0 ? void 0 : message.toLowerCase();
    switch (msg) {
        case 'sad':
            {
                bot.sendMessage(global.from, { text: 'kasian.' });
            }
            break;
        case 'anjing':
        case 'anj':
        case 'bgst':
        case 'bangsat':
            {
                bot.sendMessage(global.from, { text: 'kasar ngana.' });
            }
            break;
        case 'assalamualaikum':
        case 'assalamualaikumm':
        case 'samlekom':
            {
                bot.sendMessage(global.from, { text: 'walaikum salam.' });
            }
            break;
    }
    return;
});
exports.quickReply = quickReply;
