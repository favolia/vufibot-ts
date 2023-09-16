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
exports._MESSAGE = void 0;
const quickReply_1 = require("./handler/quickReply");
const _MESSAGE = (M) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const m = M.messages[0];
    const bot = global.bot;
    const { key, agentId, bizPrivacyStatus, broadcast, clearMedia, duration, ephemeralDuration, ephemeralOffToOn, ephemeralOutOfSync, ephemeralStartTimestamp, finalLiveLocation, futureproofData, ignore, keepInChat, labels, mediaCiphertextSha256, mediaData, message, messageC2STimestamp, messageSecret, messageStubParameters, messageStubType, messageTimestamp, multicast, originalSelfAuthorUserJidString, participant, paymentInfo, photoChange, pinInChat, pollAdditionalMetadata, pollUpdates, pushName, quotedPaymentInfo, quotedStickerData, reactions, revokeMessageTimestamp, starred, status, statusAlreadyViewed, statusPsa, urlNumber, urlText, userReceipt } = m;
    globalThis.from = key === null || key === void 0 ? void 0 : key.remoteJid;
    const userJid = ((_a = key === null || key === void 0 ? void 0 : key.remoteJid) === null || _a === void 0 ? void 0 : _a.includes('@g.us')) ? key.participant : key.remoteJid;
    const msg = (message === null || message === void 0 ? void 0 : message.conversation) ? message === null || message === void 0 ? void 0 : message.conversation : (_b = message === null || message === void 0 ? void 0 : message.extendedTextMessage) === null || _b === void 0 ? void 0 : _b.text;
    const isBot = key === null || key === void 0 ? void 0 : key.fromMe;
    console.log(from);
    (0, quickReply_1.quickReply)(msg);
    if (isBot)
        return;
    if (userJid != '628875090455@s.whatsapp.net')
        return;
    bot.sendMessage(from, { text: 'halo juga' });
    // console.log(JSON.stringify(m, undefined, 2))
    // console.log('replying to', m.messages[0].key.remoteJid)
    // await bot.sendMessage(m.messages[0].key.remoteJid!, { text: 'Hello there!' })
    // await bot.sendMessage('628875090455@s.whatsapp.net', { text: 'Hello there!' })
});
exports._MESSAGE = _MESSAGE;
