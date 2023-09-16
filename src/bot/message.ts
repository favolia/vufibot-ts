import {
    WAMessage,
    proto
} from '@whiskeysockets/baileys';
import axios from 'axios';
import { quickReply } from './handler/quickReply';

export const _MESSAGE = async (M: any,) => {
    const m: proto.IWebMessageInfo = M.messages[0]
    const bot = global.bot

    const {
        key,
        agentId,
        bizPrivacyStatus,
        broadcast,
        clearMedia,
        duration,
        ephemeralDuration,
        ephemeralOffToOn,
        ephemeralOutOfSync,
        ephemeralStartTimestamp,
        finalLiveLocation,
        futureproofData,
        ignore,
        keepInChat,
        labels,
        mediaCiphertextSha256,
        mediaData,
        message,
        messageC2STimestamp,
        messageSecret,
        messageStubParameters,
        messageStubType,
        messageTimestamp,
        multicast,
        originalSelfAuthorUserJidString,
        participant,
        paymentInfo,
        photoChange,
        pinInChat,
        pollAdditionalMetadata,
        pollUpdates,
        pushName,
        quotedPaymentInfo,
        quotedStickerData,
        reactions,
        revokeMessageTimestamp,
        starred,
        status,
        statusAlreadyViewed,
        statusPsa,
        urlNumber,
        urlText,
        userReceipt
    }: WAMessage = m

    globalThis.from = key?.remoteJid!
    const userJid: string | null | undefined = key?.remoteJid?.includes('@g.us') ? key.participant : key.remoteJid;

    const msg: string | undefined | null | any = message?.conversation ? message?.conversation : message?.extendedTextMessage?.text

    const isBot: boolean | undefined | null = key?.fromMe

    quickReply(msg)

    if (isBot) return;
    if (userJid != '628875090455@s.whatsapp.net') return;

    bot.sendMessage(from, { text: 'halo juga' })

    // console.log(JSON.stringify(m, undefined, 2))

    // console.log('replying to', m.messages[0].key.remoteJid)
    // await bot.sendMessage(m.messages[0].key.remoteJid!, { text: 'Hello there!' })
    // await bot.sendMessage('628875090455@s.whatsapp.net', { text: 'Hello there!' })
}