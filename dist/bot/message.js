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
const setting_1 = require("../setting");
const ai_1 = require("./func/ai");
const img_1 = require("./func/img");
const exec_1 = require("./func/exec");
const _MESSAGE = (M) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
    const m = M.messages[0];
    const bot = global.bot;
    const { key, agentId, bizPrivacyStatus, broadcast, clearMedia, duration, ephemeralDuration, ephemeralOffToOn, ephemeralOutOfSync, ephemeralStartTimestamp, finalLiveLocation, futureproofData, ignore, keepInChat, labels, mediaCiphertextSha256, mediaData, message, messageC2STimestamp, messageSecret, messageStubParameters, messageStubType, messageTimestamp, multicast, originalSelfAuthorUserJidString, participant, paymentInfo, photoChange, pinInChat, pollAdditionalMetadata, pollUpdates, pushName, quotedPaymentInfo, quotedStickerData, reactions, revokeMessageTimestamp, starred, status, statusAlreadyViewed, statusPsa, urlNumber, urlText, userReceipt } = m;
    globalThis.from = key === null || key === void 0 ? void 0 : key.remoteJid;
    const userJid = ((_a = key === null || key === void 0 ? void 0 : key.remoteJid) === null || _a === void 0 ? void 0 : _a.includes('@g.us')) ? key.participant : key.remoteJid;
    const isOwner = setting_1.setting.owner.some((owner) => owner.number === userJid);
    const groupInfo = yield bot.groupMetadata(from);
    const isAdmin = groupInfo.participants.some((participant) => participant.id === userJid && (participant.admin === 'admin' || participant.admin === 'superadmin'));
    const msg = (message === null || message === void 0 ? void 0 : message.conversation)
        ? message.conversation
        : (message === null || message === void 0 ? void 0 : message.extendedTextMessage)
            ? (_b = message === null || message === void 0 ? void 0 : message.extendedTextMessage) === null || _b === void 0 ? void 0 : _b.text
            : (message === null || message === void 0 ? void 0 : message.imageMessage)
                ? (_c = message === null || message === void 0 ? void 0 : message.imageMessage) === null || _c === void 0 ? void 0 : _c.caption
                : (message === null || message === void 0 ? void 0 : message.documentMessage)
                    ? (_d = message === null || message === void 0 ? void 0 : message.documentMessage) === null || _d === void 0 ? void 0 : _d.caption
                    : null;
    const prefix = /^[°•π÷×¶∆£¢€¥®™✓=|~`,*zxcv!?@#$%^&.\/\\©^]/.test(msg) ? msg.match(/^[!?#$,^.,/\/\\©^]/gi) : '-';
    const commands = (msg === null || msg === void 0 ? void 0 : msg.startsWith(prefix)) ? msg.replace(prefix, '') || '' : '';
    const command = (commands === null || commands === void 0 ? void 0 : commands.toLowerCase().split(' ')[0]) || '';
    const args = msg === null || msg === void 0 ? void 0 : msg.trim().split(/ +/).slice(1);
    let q = args === null || args === void 0 ? void 0 : args.join(' ');
    const isBot = key === null || key === void 0 ? void 0 : key.fromMe;
    (0, quickReply_1.quickReply)(msg);
    if (isBot)
        return;
    const reply = (text) => __awaiter(void 0, void 0, void 0, function* () {
        bot.sendMessage(from, {
            text: text
        }, {
            quoted: m
        });
    });
    const sendAudio = (text) => __awaiter(void 0, void 0, void 0, function* () {
        yield bot.sendMessage(from, { audio: { url: text }, mimetype: 'audio/mp4', fileName: 'lol' }, { quoted: m });
    });
    const sendMsg = (text) => __awaiter(void 0, void 0, void 0, function* () {
        bot.sendMessage(from, {
            text: text
        });
    });
    const sendImg = (img) => __awaiter(void 0, void 0, void 0, function* () {
        yield bot.sendMessage(from, {
            image: {
                url: img
            },
        }, {
            quoted: m
        });
    });
    const sendImgCap = (img, caption) => __awaiter(void 0, void 0, void 0, function* () {
        yield bot.sendMessage(from, {
            image: {
                url: img
            },
            caption: caption
        }, {
            quoted: m
        });
    });
    switch (command) {
        case 'ping':
        case 'p':
            {
                reply('pong');
            }
            break;
        case 'menu':
            {
                let ppUrl;
                try {
                    ppUrl = yield bot.profilePictureUrl(userJid, 'image');
                }
                catch (error) {
                    ppUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
                }
                const _allMenu = setting_1.menuList.map((_menu, index) => `(${index + 1}) *.${_menu.name}*\nAccess: _${_menu.role}_\n${_menu.description}`);
                const allMenu = _allMenu.join('\n\n');
                const content = {
                    text: allMenu,
                    contextInfo: {
                        externalAdReply: {
                            title: `Halo ${pushName}`,
                            body: `${setting_1.setting.bot_name} by ${setting_1.setting.owner[0].name}`,
                            thumbnailUrl: ppUrl,
                            sourceUrl: `https://${setting_1.setting.owner[0].instagram}` || '',
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                };
                yield bot.sendMessage(from, content, { quoted: m });
            }
            break;
        case 'owner':
            {
                const allOwner = setting_1.setting.owner.map((own, index) => `no: *${index + 1}*\nnama: *${own.name}*\ninstagram: *${own.instagram || '-'}*\nnumber: *${own.number.replace(/@s.whatsapp.net/g, '')}*`);
                const replyMessage = allOwner.join('\n\n');
                reply(replyMessage);
            }
            break;
        case 'ai':
            {
                if (!q)
                    return reply('mau tanya apa?');
                const response = yield (0, ai_1.ai)(q);
                reply(response);
            }
            break;
        case 'img':
            {
                if (!q)
                    return reply('mau gambar apa?');
                const response = yield (0, img_1.textToImage)(q);
                if (!response.status) {
                    return reply(response.message);
                }
                sendImgCap(response.url, q);
            }
            break;
        case 'ht':
            {
                const phoneNum = !q ? ((_f = (_e = message === null || message === void 0 ? void 0 : message.extendedTextMessage) === null || _e === void 0 ? void 0 : _e.contextInfo) === null || _f === void 0 ? void 0 : _f.participant) ? message.extendedTextMessage
                    .contextInfo.participant : null : q;
                const replyMsg = !q ? ((_k = (_j = (_h = (_g = message === null || message === void 0 ? void 0 : message.extendedTextMessage) === null || _g === void 0 ? void 0 : _g.contextInfo) === null || _h === void 0 ? void 0 : _h.quotedMessage) === null || _j === void 0 ? void 0 : _j.extendedTextMessage) === null || _k === void 0 ? void 0 : _k.text) ? message.extendedTextMessage.contextInfo.quotedMessage.extendedTextMessage.text : ((_o = (_m = (_l = message === null || message === void 0 ? void 0 : message.extendedTextMessage) === null || _l === void 0 ? void 0 : _l.contextInfo) === null || _m === void 0 ? void 0 : _m.quotedMessage) === null || _o === void 0 ? void 0 : _o.conversation) ? message.extendedTextMessage.contextInfo.quotedMessage.conversation : ((_s = (_r = (_q = (_p = message === null || message === void 0 ? void 0 : message.extendedTextMessage) === null || _p === void 0 ? void 0 : _p.contextInfo) === null || _q === void 0 ? void 0 : _q.quotedMessage) === null || _r === void 0 ? void 0 : _r.imageMessage) === null || _s === void 0 ? void 0 : _s.caption) ? message.extendedTextMessage.contextInfo.quotedMessage.imageMessage.caption : ((_w = (_v = (_u = (_t = message === null || message === void 0 ? void 0 : message.extendedTextMessage) === null || _t === void 0 ? void 0 : _t.contextInfo) === null || _u === void 0 ? void 0 : _u.quotedMessage) === null || _v === void 0 ? void 0 : _v.videoMessage) === null || _w === void 0 ? void 0 : _w.caption) ? message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.caption : '' : q;
                const textInfo = !q ? ((_y = (_x = message === null || message === void 0 ? void 0 : message.extendedTextMessage) === null || _x === void 0 ? void 0 : _x.contextInfo) === null || _y === void 0 ? void 0 : _y.quotedMessage) ? `@${phoneNum.replace(/@s.whatsapp.net/, '')}: ${replyMsg}` : q : q;
                let groupUser = yield bot.groupMetadata(from);
                let waJids = [];
                // textInfo = ''
                groupUser['participants'].map((uye) => __awaiter(void 0, void 0, void 0, function* () {
                    //     textInfo += '@' + uye.id.split('@')[0] + '\n';
                    waJids.push(uye.id.replace('c.us', 's.whatsapp.net'));
                }));
                yield bot.sendMessage(from, {
                    text: textInfo,
                    mentions: waJids
                }, {
                    quoted: {
                        key: {
                            id: 'WhatsApp',
                            remoteJid: from,
                            participant: '0@s.whatsapp.net',
                        },
                        message: {
                            conversation: `hidetag from _*${isOwner ? pushName + '👑' : pushName + '🗿'}*_`
                        }
                    }
                });
            }
            break;
        case 'ev':
            {
                if (!isOwner)
                    return reply('kamu bukan owner!');
                if (!q)
                    return reply('kirim kode javascript');
                try {
                    let evaled = yield eval(q);
                    if (typeof evaled !== 'string')
                        evaled = require('util').inspect(evaled);
                    reply(`» ${evaled}`);
                }
                catch (err) {
                    console.error(err);
                    reply(`» Error: ${err.message}`);
                }
            }
            break;
        case 'bye':
            {
                if (!from.includes('@g.us'))
                    return reply('_command hanya bisa digunakan di grup._');
                if (!isAdmin)
                    return reply('kamu bukan admin.');
                try {
                    sendMsg('sampai jumpa semua👋😉');
                    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                        yield bot.groupLeave(from);
                    }), 3000);
                }
                catch (err) {
                    reply('something wrong');
                }
            }
            break;
        case 'exec':
            {
                if (!isOwner)
                    return;
                if (!q)
                    return reply('kirim kode execute');
                const exec_result = yield (0, exec_1.exec)(q);
                reply(exec_result);
            }
            break;
    }
    // bot.sendMessage(from, { text: 'halo juga' })
    // console.log(JSON.stringify(m, undefined, 2))
    // console.log('replying to', m.messages[0].key.remoteJid)
    // await bot.sendMessage(m.messages[0].key.remoteJid!, { text: 'Hello there!' })
    // await bot.sendMessage('628875090455@s.whatsapp.net', { text: 'Hello there!' })
});
exports._MESSAGE = _MESSAGE;
