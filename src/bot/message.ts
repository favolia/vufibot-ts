import {
    WAMessage,
    proto
} from '@whiskeysockets/baileys';
import { quickReply } from './handler/quickReply';
import { setting, menuList } from "../setting";
import { ai } from "./func/ai";
import { textToImage } from "./func/img";
import { exec } from "./func/exec";

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
    const isOwner: boolean = setting.owner.some((owner: any) => owner.number === userJid);

  console.log(from)

    const groupInfo = await bot.groupMetadata(from);
    const isAdmin = groupInfo.participants.some((participant: any) => participant.id === userJid && (participant.admin === 'admin' || participant.admin === 'superadmin'));

    const msg: string | undefined | null | any = message?.conversation
        ? message.conversation
        : message?.extendedTextMessage
            ? message?.extendedTextMessage?.text
            : message?.imageMessage
                ? message?.imageMessage?.caption
                : message?.documentMessage
                    ? message?.documentMessage?.caption
                    : null;

    const prefix = /^[°•π÷×¶∆£¢€¥®™✓=|~`,*zxcv!?@#$%^&.\/\\©^]/.test(msg) ? msg.match(/^[!?#$,^.,/\/\\©^]/gi) : '-'

    const commands = msg?.startsWith(prefix) ? msg.replace(prefix,
        '') || '' : '';
    const command = commands?.toLowerCase().split(' ')[0] || ''

    const args = msg?.trim().split(/ +/).slice(1)
    let q = args?.join(' ')

    const isBot: boolean | undefined | null = key?.fromMe

    quickReply(msg)

    if (isBot) return;

    const reply = async (text: string) => {

        bot.sendMessage(from, {
            text: text
        }, {
            quoted: m
        })
    }

    const sendAudio = async (text: string) => {
        await bot.sendMessage(from, { audio: { url: text }, mimetype: 'audio/mp4', fileName: 'lol' }, { quoted: m })
    }

    const sendMsg = async (text: string) => {
        bot.sendMessage(from, {
            text: text
        })
    }

    const sendImg = async (img: URL) => {
        await bot.sendMessage(from, {
            image: {
                url: img
            },
        }, {
            quoted: m
        })
    }

    const sendImgCap = async (img: URL, caption: string) => {
        await bot.sendMessage(from, {
            image: {
                url: img
            },
            caption: caption
        }, {
            quoted: m
        })
    }


    switch (command) {

      case 'ping': case 'p': {
        reply('pong')
      } break;

        case 'menu': {


            let ppUrl: string;

            try {
                ppUrl = await bot.profilePictureUrl(userJid, 'image')
            } catch (error) {
                ppUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
            }

            const _allMenu: string[] = menuList.map((_menu, index) => `(${index + 1}) *.${_menu.name}*\nAccess: _${_menu.role}_\n${_menu.description}`)
            const allMenu = _allMenu.join('\n\n')

            const content = {
                text: allMenu,
                contextInfo: {
                    externalAdReply: {
                        title: `Halo ${pushName}`,
                        body: `${setting.bot_name} by ${setting.owner[0].name}`,
                        thumbnailUrl: ppUrl,
                        sourceUrl: `https://${setting.owner[0].instagram}` || '',
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            };

            await bot.sendMessage(from, content, { quoted: m });
        } break;

        case 'owner': {
            const allOwner: string[] = setting.owner.map((own: any, index: number) => `no: *${index + 1}*\nnama: *${own.name}*\ninstagram: *${own.instagram || '-'}*\nnumber: *${own.number.replace(/@s.whatsapp.net/g, '')}*`);

            const replyMessage = allOwner.join('\n\n');

            reply(replyMessage);
        } break;

        case 'ai': {
            if (!q) return reply('mau tanya apa?')

            const response: string = await ai(q)
            reply(response)
        } break;

        case 'img': {
            if (!q) return reply('mau gambar apa?')

            const response: any = await textToImage(q)
            if (!response.status) {
                return reply(response.message)
            }

            sendImgCap(response.url, q)
        } break;

        case 'ht': {
            const phoneNum = !q ? message?.extendedTextMessage
                ?.contextInfo?.participant ? message.extendedTextMessage
                    .contextInfo.participant : null : q;

            const replyMsg = !q ? message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text ? message.extendedTextMessage.contextInfo.quotedMessage.extendedTextMessage.text : message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation ? message.extendedTextMessage.contextInfo.quotedMessage.conversation : message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage?.caption ? message.extendedTextMessage.contextInfo.quotedMessage.imageMessage.caption : message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage?.caption ? message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.caption : '' : q
            const textInfo = !q ? message?.extendedTextMessage?.contextInfo?.quotedMessage ? `@${phoneNum.replace(/@s.whatsapp.net/, '')}: ${replyMsg}` : q : q;

            let groupUser = await bot.groupMetadata(from);
            let waJids: any[] = [];
            // textInfo = ''
            groupUser['participants'].map(
                async (uye: any) => {
                    //     textInfo += '@' + uye.id.split('@')[0] + '\n';
                    waJids.push(uye.id.replace('c.us', 's.whatsapp.net'))
                }
            )

            await bot.sendMessage(from, {
                text: textInfo,
                mentions: waJids
            }, {
                quoted: {
                    key: {
                        id: 'WhatsApp',
                        remoteJid: from,
                        participant: '628811223344@s.whatsapp.net',
                    },
                    message: {
                        conversation: `hidetag from _*${isOwner ? pushName + '👑' : pushName + '🗿'}*_`
                    }
                }
            })

        } break;

        case 'ev': {
            if (!isOwner) return reply('kamu bukan owner!');
            if (!q) return reply('kirim kode javascript');

            try {
                let evaled = await eval(q)
                if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
                reply(`» ${evaled}`)
            } catch (err: any) {
                console.error(err)
                reply(`» Error: ${err.message}`)
            }
        } break;

        case 'bye': {
            if (!from.includes('@g.us')) return reply('_command hanya bisa digunakan di grup._')
            if (!isAdmin) return reply('kamu bukan admin.')


            try {
                sendMsg('sampai jumpa semua👋😉')
                setTimeout(async () => {
                    await bot.groupLeave(from)
                }, 3000)
            } catch (err) {
                reply('something wrong')
            }

        } break;

      case 'exec': {
        if (!isOwner) return;
        if (!q) return reply('kirim kode execute');

        const exec_result: string = await exec(q)

        reply(exec_result)
      } break;

    }


    // bot.sendMessage(from, { text: 'halo juga' })

    // console.log(JSON.stringify(m, undefined, 2))

    // console.log('replying to', m.messages[0].key.remoteJid)
    // await bot.sendMessage(m.messages[0].key.remoteJid!, { text: 'Hello there!' })
    // await bot.sendMessage('628875090455@s.whatsapp.net', { text: 'Hello there!' })
}