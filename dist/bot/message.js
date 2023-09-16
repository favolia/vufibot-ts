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
const _MESSAGE = (M, bot) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, archived, contactPrimaryIdentityKey, conversationTimestamp, createdAt, createdBy, description, disappearingMode, displayName, endOfHistoryTransfer, endOfHistoryTransferType, ephemeralExpiration, ephemeralSettingTimestamp, isDefaultSubgroup, isParentGroup, lastMessageRecvTimestamp, lastMsgTimestamp, lidJid, markedAsUnread, mediaVisibility, messages, muteEndTime, name, newJid, notSpam, oldJid, pHash, parentGroupId, participant, pinned, pnJid, pnhDuplicateLidThread, readOnly, shareOwnPn, support, suspended, tcToken, tcTokenSenderTimestamp, tcTokenTimestamp, terminated, unreadCount, unreadMentionCount, wallpaper } = M;
    const {} = bot;
    // if (M.messages[0].key.fromMe) return;
    // console.log(JSON.stringify(m, undefined, 2))
    // console.log('replying to', m.messages[0].key.remoteJid)
    // await bot.sendMessage(m.messages[0].key.remoteJid!, { text: 'Hello there!' })
    // await bot.sendMessage('628875090455@s.whatsapp.net', { text: 'Hello there!' })
});
exports._MESSAGE = _MESSAGE;
