import {
    WAMessage,
    proto
} from '@whiskeysockets/baileys';
import * as userData from "../../lib/database/user.json";
import {awaitMessage} from "./func/awaitMessage"
import { quickReply } from './handler/quickReply';
import { setting, menuData, formatMenu, accountInfoText } from "../setting2";
import userMenager from "../utils/userMenager";
import { tiktokTts } from "./func/tikokTts"
import { textToImage } from "./func/img";
import { exec } from "./func/exec"
import { ai } from "./func/ai";
import axios from "axios";
import fs from "fs";
import {
  family100,
  siapaKahAku,
  cakLontong
} from "./func/games"

const belumRegist = '🚫 Kamu belum membuat akun\n\nuntuk registrasi ketik:\n_*.regist nama*_'

    const _User = new userMenager(userData);

export const _MESSAGE = async (M: any,) => {
    await _User.exportUserData()
  
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

    const groupInfo = await bot.groupMetadata(from);
    const isAdmin = groupInfo.participants.some((participant: any) => participant.id === userJid && (participant.admin === 'admin' || participant.admin === 'superadmin'));


  const msg: string = message?.conversation ||
    message?.extendedTextMessage?.text ||
    message?.imageMessage?.caption ||
    message?.documentMessage?.caption || '';

  const prefixRegex = /^[°•π÷×¶∆£¢€¥®™✓=|~`,*zxcv!?@#$%^&.\/\\©^]/;
  const prefix: string = prefixRegex.test(msg) ? msg.match(prefixRegex)?.[0] || '-' : '-';
  const commands: string = msg.startsWith(prefix) ? msg.replace(prefix, '') : '';
  const command: string = commands.toLowerCase().split(' ')[0] || '';

  const args = msg.trim().split(/\s+/);
  const q = args.slice(1).join(' ');
  

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
        await bot.sendMessage(from, { audio: { url: text }, mimetype: 'audio/mp4'}, { quoted: m })
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

    const waitMsg = async () => {
      
      let _getMsg: any = await awaitMessage({
        chatJid: from,
        sender: userJid,
        filter: (parm: any | undefined) => parm?.message.conversation || parm?.message.extendedTextMessage?.text || parm.message?.imageMessage?.caption || parm?.message.documentMessage?.caption || ''
      })

      let _newMsg: any = _getMsg?.message.conversation || _getMsg?.message.extendedTextMessage?.text || _getMsg.message?.imageMessage?.caption || _getMsg?.message.documentMessage?.caption || '';

      return _newMsg;
    }
  

  // General command
    switch (command) {

        case "p": case "ping": {
          reply("pong")
        } break;

        case 'menu': {


            let ppUrl: string;

            try {
                ppUrl = await bot.profilePictureUrl(userJid, 'image')
            } catch (error) {
                ppUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
            }

            const menu: string = formatMenu(menuData)

            const content = {
                text: menu,
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

          const replyMsg = !q ? (message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text || message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation ||  message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage?.caption || message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage?.caption) : q;

            const textInfo = !q ? message?.extendedTextMessage?.contextInfo?.quotedMessage ? `@${phoneNum?.replace(/@s.whatsapp.net/, '')}: ${replyMsg}` : q : q;

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
                        remoteJid: '0@s.whatsapp.net',
                        participant: '0@s.whatsapp.net',
                    },
                    message: {
                        conversation: `hidetag from _*${isOwner ? pushName + '👑' : pushName + '🗿'}*_`
                    }
                }
            })

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

        case 'hai': {
        await reply("Siapa nama mu tuan?")


        const answer: any = await waitMsg()
        
        await reply(`Hai *${answer}*, apa kabar asu`)
      } break; 

    }

  

    // Games command
    switch (command) {
        case "tebaklirik": case "tl": {
          const isRegistered = _User.searchUserByPhone(userJid)
          if(!isRegistered.status) return reply(belumRegist)

          let tebakLirik

          try {

            const { data } = await axios("https://api.im-rgsan.com/SpotifyLyricsGame/")

            tebakLirik = data.data[0]
            // const bufferTebakLirik = await tiktokTts(tebakLirik.lyrics)
            // bot.sendMessage(from, {audio: Buffer.from(bufferTebakLirik, 'base64'), mimetype: 'audio/mp4', ppt: true}, {quoted: m}).catch((err: any) => console.log(err.message))


          } catch (err) {
            return reply("Maaf, ada kesalahan. coba lagi")
          }

          reply(tebakLirik.games.q)

          const answer = await waitMsg()

          if (answer.toLowerCase() == tebakLirik.games.a.toLowerCase()) {
            reply(`🎉 *Kamu benar!* +${setting.gameSetting.quiz.tebakLirikPoint}💵\nuangmu: ${isRegistered?.data ? isRegistered.data.money + setting.gameSetting.quiz.tebakLirikPoint : setting.gameSetting.quiz.tebakLirikPoint}💵\n\n_${tebakLirik.games.a}_`)
            _User.addMoney({ id: isRegistered?.data?.id, amount: 5  })
            _User.addQuizWin({ id: isRegistered?.data?.id, amount: 1  })
            _User.addQuizStreak({ id: isRegistered?.data?.id, isWin: true, amount: 1 })
          } else {
             reply(`Jawaban mu salah!\n\n${tebakLirik.games.a}`);
            _User.addQuizLose({ id: isRegistered?.data?.id, amount: 1  })
            _User.addQuizStreak({ id: isRegistered?.data?.id, isWin: false, amount: 0 })
          }


        } break;

        case 'caklontong': case 'cl': {
          const isRegistered = _User.searchUserByPhone(userJid)
          if(!isRegistered.status) return reply(belumRegist)

            const catong = await cakLontong()

            if (!catong.status) return reply("Maaf, ada kesalahan. coba lagi");
            reply(catong.data.soal);
        
            const answer = await waitMsg()

            if (answer.toLowerCase() == catong.data.jawaban.toLowerCase()) {
              reply(`🎉 *Kamu benar!* +${setting.gameSetting.quiz.cakLontongPoint}💵\nuangmu: ${isRegistered?.data ? isRegistered.data.money + setting.gameSetting.quiz.cakLontongPoint : setting.gameSetting.quiz.cakLontongPoint}💵\n\n_${catong.data.jawaban}_\n\n${catong.data.deskripsi || ''}`)
              _User.addMoney({ id: isRegistered?.data?.id, amount: setting.gameSetting.quiz.cakLontongPoint  })
              _User.addQuizWin({ id: isRegistered?.data?.id, amount: 1  })
              _User.addQuizStreak({ id: isRegistered?.data?.id, isWin: true, amount: 1 })

            
            } else {
              reply(`🚫 *Salah!*\n\n${catong?.data?.jawaban}\n\n${catong.data.deskripsi || ''}`);
              _User.addQuizLose({ id: isRegistered?.data?.id, amount: 1  })
              _User.addQuizStreak({ id: isRegistered?.data?.id, isWin: false, amount: 0 })
            }


        } break;
    }
  

    // account command
    switch (command) {
      case 'regist': {
        const isRegistered = _User.searchUserByPhone(userJid)

        if(isRegistered.status) return reply(`Kamu sudah terdaftar ketik\n.akun untuk melihat akun.`)
        
        if (!q) return reply("Masukkan username\ncontoh: .regist nama");
        if (q?.length < setting.accountSetting.min_username_length) return reply(`Nama terlalu pendek *minimal ${setting.accountSetting.min_username_length} huruf!*`);

        if (q?.length > setting.accountSetting.min_username_length) return reply(`Nama terlalu panjang *maximal ${setting.accountSetting.min_username_length} huruf!*`);

        const result: any = _User.regist({ phone: userJid, username: q })

        if (result.status) {
          reply(`✅ *Berhasil registrasi!*\n\nDetail akun ketik:\n.akun`);
        } else {
          reply(result.message)
        }

        
      } break;

      case 'akun': {
        const isRegistered = _User.searchUserByPhone(userJid)
        if(!isRegistered.status) return reply(belumRegist)

        reply(accountInfoText({
          username: isRegistered.data?.username,
          money: isRegistered.data?.money,
          highestMoney: isRegistered.data?.highestMoney,
          quizWin: isRegistered.data?.quiz?.win,
          quizLose: isRegistered.data?.quiz?.lose,
          gold: isRegistered.data?.gold,
          id: isRegistered.data?.id,
          quizStreak: isRegistered.data?.quiz?.lastStreak,
        }))
        
      } break;

      case 'gantinama': {
        const isRegistered = _User.searchUserByPhone(userJid)
        if(!isRegistered.status) return reply(belumRegist)
        
        if (!q) return reply("Masukkan username contoh:\n*.gantinama nama_baru*");
        if (q?.length < setting.accountSetting.min_username_length) return reply(`Nama terlalu pendek *minimal ${setting.accountSetting.min_username_length} huruf!*`);
        if (q?.length > setting.accountSetting.max_username_length) return reply(`Nama terlalu panjang *maximal ${setting.accountSetting.max_username_length} huruf!*`);

        const result: any = _User.updateUsername({ id: isRegistered?.data?.id, username: q })

        if (!result.status) return reply(result.messageInd)

        reply(`✅ *Berhasil mengganti nama ${result.oldName} ke ${result.newName} !*\n\nDetail akun ketik:\n.akun`);
        
      } break;

      case 'cekakun': {
        
        if(!q) return reply(`Masukkan username atau id contoh:\n*.cekakun nama_atau_id*`)

        const findId = _User.searchUserById(q)
        const findUsername = _User.searchUserByUsername(q)

        if(!findId.status && !findUsername.status) return reply(`Username atau id tidak ditemukan`)

        if(findId.status) {

          reply(accountInfoText({
            username: findId.data?.username,
            money: findId.data?.money,
            highestMoney: findId.data?.highestMoney,
            quizWin: findId.data?.quiz?.win,
            quizLose: findId.data?.quiz?.lose,
            gold: findId.data?.gold,
            id: findId.data?.id,
            quizStreak: findId.data?.quiz?.lastStreak,
          }))
 
        
        } else {
          

          reply(accountInfoText({
            username: findUsername.data?.username,
            money: findUsername.data?.money,
            highestMoney: findUsername.data?.highestMoney,
            quizWin: findUsername.data?.quiz?.win,
            quizLose: findUsername.data?.quiz?.lose,
            gold: findUsername.data?.gold,
            id: findUsername.data?.id,
            quizStreak: findUsername.data?.quiz?.lastStreak,
          }))
          
        } 

      } break;

      case 'money': {
        const isRegistered = _User.searchUserByPhone(userJid)
        if(!isRegistered.status) return reply(belumRegist)

        const userMoney = _User.getCurrentMoney({ id: isRegistered?.data?.id})
        if(!userMoney.status) return reply(userMoney.messageInd || 'User tidak ditemukan.')

        reply(userMoney.money+' 💵')
      } break;

      case 'leaderboard': {
        
      } break;

        
    }


    // Owner command
    switch (command) {
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

        case 'exec': {
          if (!isOwner) return reply('kamu bukan owner!');
          if (!q) return reply('Kirim kode bash.');

          const exec_result = await exec(q)

          reply(exec_result)


        } break;
    }
}