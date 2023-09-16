import {
    Chat,
    makeWASocket,
} from "@whiskeysockets/baileys";

export const _MESSAGE = async (M: Chat, bot: typeof makeWASocket) => {

    const {
        id,
        archived,
        contactPrimaryIdentityKey,
        conversationTimestamp,
        createdAt,
        createdBy,
        description,
        disappearingMode,
        displayName,
        endOfHistoryTransfer,
        endOfHistoryTransferType,
        ephemeralExpiration,
        ephemeralSettingTimestamp,
        isDefaultSubgroup,
        isParentGroup,
        lastMessageRecvTimestamp,
        lastMsgTimestamp,
        lidJid,
        markedAsUnread,
        mediaVisibility,
        messages,
        muteEndTime,
        name,
        newJid,
        notSpam,
        oldJid,
        pHash,
        parentGroupId,
        participant,
        pinned,
        pnJid,
        pnhDuplicateLidThread,
        readOnly,
        shareOwnPn,
        support,
        suspended,
        tcToken,
        tcTokenSenderTimestamp,
        tcTokenTimestamp,
        terminated,
        unreadCount,
        unreadMentionCount,
        wallpaper
    } = M

    const {
        
    } = bot


    // if (M.messages[0].key.fromMe) return;
    // console.log(JSON.stringify(m, undefined, 2))

    // console.log('replying to', m.messages[0].key.remoteJid)
    // await bot.sendMessage(m.messages[0].key.remoteJid!, { text: 'Hello there!' })
    // await bot.sendMessage('628875090455@s.whatsapp.net', { text: 'Hello there!' })
}