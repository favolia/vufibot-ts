import {
  WAMessage,
  proto,
  jidDecode,
  downloadMediaMessage,
  generateWAMessageFromContent
} from '@whiskeysockets/baileys';
import * as userData from "../../lib/database/user.json";
import { awaitMessage } from "./func/awaitMessage"
import { quickReply } from './handler/quickReply';
import { setting, menuData, formatMenu, accountInfoText } from "../setting2";
import userMenager from "../utils/userMenager";
import { tiktokTts } from "./func/tikokTts"
import { textToImage } from "./func/img";
import { exec } from "./func/exec"
import { ai } from "./func/ai";
import { spotifySearchMusic, spotifyFetchURL } from "./func/spotify";
import axios from "axios";
import moment from "moment-timezone";
import { srcToWebP, blobToWebP, arrayBufferToWebP } from 'webp-converter-browser';
// import { Sharp } from "sharp";
// import pino from "pino";
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
    multicast,   originalSelfAuthorUserJidString,
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

  const content = JSON.stringify(M);
  const botNumberDecode = await jidDecode(bot.user.id);
  const botNumber = `${botNumberDecode?.user}@${botNumberDecode?.server}` ?? '';
  const tanggal = moment().tz("Asia/jakarta").format("dddd, ll");
  const wib = moment(Date.now()).tz("Asia/jakarta").locale("id").format("HH:mm:ss z");
  const wita = moment(Date.now()).tz("Asia/Makassar").locale("id").format("HH:mm:ss z");
  const wit = moment(Date.now()).tz("Asia/Jayapura").locale("id").format("HH:mm:ss z");
  const quoted: any = message?.extendedTextMessage?.contextInfo ? message?.extendedTextMessage?.contextInfo?.quotedMessage : false;

  const quotedMime = Object.keys(quoted || {})[0] || '';
  const isQuotedImage = quotedMime === 'imageMessage';
  const isQuotedConversation = quotedMime === 'conversation';
  const isQuotedVideo = quotedMime === 'videoMessage';
  const isQuotedAudio = quotedMime === 'audioMessage';
  const isQuotedSticker = quotedMime === 'stickerMessage';
  const isQuotedDocument = quotedMime === 'documentMessage';
  const isQuotedLocation = quotedMime === 'locationMessage';
  const isQuotedContact = quotedMime === 'contactMessage';
  const isQuotedProduct = quotedMime === 'productMessage';

  const mime: string = Object.keys(message || {})[0] || '';
  const isMedia = /image|video|sticker|audio/.test(mime);

  const sender = isOwner ? userJid : (userJid || botNumber);

  // group
  const isGroup = from.endsWith("@g.us");
  const groupMetadata = isGroup ? await bot.groupMetadata(from).catch((e: any) => { }) : "";
  const groupName = isGroup ? groupMetadata.subject : "";
  const groupMembers = isGroup ? groupMetadata.participants : "";
  const groupAdmins = isGroup ? groupMetadata.participants.filter((v: any) => v.admin !== null).map((v: any) => v.id) : "";
  const groupOwner = isGroup ? groupMetadata.owner : "";
  const groupDesc = isGroup ? groupMetadata.desc : "";
  const groupDescUpdate = isGroup ? groupMetadata.descUpdate : "";
  const groupSetting = isGroup ? groupMetadata.restrict : "";
  const groupTime = isGroup ? groupMetadata.announce : "";
  const groupSize = isGroup ? groupMetadata.size : "";
  const groupBanned = isGroup ? groupMetadata.banned : "";
  const isBotGroupAdmins = groupAdmins.includes(botNumber) || false;
  const isGroupAdmins = groupAdmins.includes(userJid) || false;
  const isGroupAdminsBot = groupAdmins.includes(botNumber) || false;
  const isGroupAdminsUser = groupAdmins.includes(userJid) || false;
  const isGroupAdminsUserBot = groupAdmins.includes(userJid) || groupAdmins.includes(botNumber) || false;

  // bot status
  const used = process.memoryUsage();



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

  const sendQuotedMessage = async () => {
    if (!quoted) return reply('Reply a message.')
    if (isQuotedConversation) return sendMsg(quoted.conversation);

    try {
      const getQuotedInfo = generateWAMessageFromContent(from, quoted, {userJid: userJid ? userJid : ''});
  
      const buffer = await downloadMediaMessage(
          getQuotedInfo,
          'buffer',
          {}
      );
  
      await bot.sendMessage(from, {[quotedMime.replace('Message', '')]: buffer }).catch((err: any) => reply(String(err.message)));
      
    } catch (err: any) {
      reply(err.message)
    }

  }

  const sendAudio = async (text: string) => {
    await bot.sendMessage(from, { audio: { url: text }, mimetype: 'audio/mp4' }, { quoted: m })
  }

  const sendMsg = async (text: string) => {
    bot.sendMessage(from, {
      text: text
    })
  }

  const sendImg = async (img: string) => {
    await bot.sendMessage(from, {
      image: {
        url: img
      },
    }, {
      quoted: m
    })
  }

  const sendImgCap = async (img: string, caption: string) => {
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
      // if (!q) return reply('mau tanya apa?')

      // const response: any = await ai(q)
      // if (response.success) {
      //   reply(response.reply)
      // } else {
      //   reply(response.message)
      // }
      reply("maaf fitur ini Lucak.")
    } break;

    case 'img': {
      // if (!q) return reply('mau gambar apa?')

      // const response: any = await textToImage(q)
      // if (!response.status) {
      //   return reply(response.message)
      // }

      // sendImgCap(response.url, q)
      reply("maaf fitur ini Lucak.")
    } break;

    case 'ss': {
      if (!q) return reply('contoh: github.com | mobile');

      const splitText = q.split('|');
      if (!splitText[0].trim()) return reply('url/link wajib di isi.');

      const type = {
        desktop: 'resX=1280&resY=900',
        mobile: 'resX=360&resY=700',
        full: 'isFullPage=true',
        notFull: 'isFullPage=false'
      };

      const isMobile = splitText[1] ? splitText[1].trim() === 'mobile' : '';
      const isFull = splitText[1] ? splitText[1].trim() === 'full' : '';
      const endpoint = `https://backup15.terasp.net/api/screenshot?${isMobile ? type.mobile : type.desktop}&outFormat=png&waitTime=200&${isFull ? type.full : type.notFull}&url=${splitText[0].trim()}`;

      await sendImgCap(endpoint, q).catch(err => reply('gagal.'));
    } break;

    case 'ht': {
      const phoneNum = !q ? message?.extendedTextMessage
        ?.contextInfo?.participant ? message.extendedTextMessage
          .contextInfo.participant : null : q;

      const replyMsg = !q ? (message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text || message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation || message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage?.caption || message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage?.caption) : q;

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

      case 'sticker': case 's': {
        if (!isQuotedImage && mime !== 'imageMessage') return reply('Reply dengan gambar atau kirim gambar dengan caption .sticker.');

        function toArrayBuffer(buffer: any) {
          const arrayBuffer = new ArrayBuffer(buffer.length);
          const view = new Uint8Array(arrayBuffer);
          for (let i = 0; i < buffer.length; ++i) {
            view[i] = buffer[i];
          }
          return arrayBuffer;
        }
        
        try {
          let imageBuffer;

          if (!isQuotedImage) {
            const media = await downloadMediaMessage(m, 'buffer', {});
            imageBuffer = media;
          } else {
            const getQuotedInfo = generateWAMessageFromContent(from, quoted, { userJid: userJid ? userJid : '' });
            imageBuffer = await downloadMediaMessage(getQuotedInfo, 'buffer', {});
          }

          // Konversi gambar ke format WebP
          const arrBuff = toArrayBuffer(imageBuffer)
          const webpBuffer = await arrayBufferToWebP(arrBuff, {})

          console.log(webpBuffer)
          // Kirim stiker dalam format WebP
          // await bot.sendMessage(from, { sticker: webpBuffer }).catch((err: any) => reply(String(err.message)));

        } catch (err: any) {
          console.log(err)
          reply(err.message);
        }
      } break;

    case 'audio': {
      if (!q) return reply('kirim ling audio kontol!');

     let ppUrl: string;

      try {
        ppUrl = await bot.profilePictureUrl(userJid, 'image')
      } catch (error) {
        ppUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
      }

      const content = {
        contextInfo: {
          externalAdReply: {
            title: 'p',
            body: `${setting.bot_name} by ${setting.owner[0].name}`,
            thumbnailUrl: ppUrl,
            sourceUrl: `https://${setting.owner[0].instagram}` || '',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      };

  await bot.sendMessage(from, {
    audio: {
       url: q
      },
      mimetype: 'audio/mp4',
      contextInfo: content.contextInfo }
    );
    } break;
      
  }



  // Games command
  switch (command) {
    case "tebaklirik": case "tl": {
      const isRegistered = _User.searchUserByPhone(userJid)
      if (!isRegistered.status) return reply(belumRegist)

      let tebakLirik

      try {

        const { data } = await axios("https://api.im-rgsan.com/SpotifyLyricsGame/")

        tebakLirik = data.data[0]

        _User.setQuizMatch({
          id: isRegistered?.data?.id,
          match: isRegistered?.data?.quiz?.match && isRegistered?.data?.quiz?.match > 0 ? isRegistered?.data?.quiz.match + 1 : 1,
        })

        // const bufferTebakLirik = await tiktokTts(tebakLirik.lyrics)
        // bot.sendMessage(from, {audio: Buffer.from(bufferTebakLirik, 'base64'), mimetype: 'audio/mp4', ppt: true}, {quoted: m}).catch((err: any) => console.log(err.message))


      } catch (err) {
        return reply("Maaf, ada kesalahan. coba lagi")
      }

      reply(tebakLirik.games.q)

      const answer = await waitMsg()

      if (answer.toLowerCase() == tebakLirik.games.a.toLowerCase()) {
        reply(`🎉 *Kamu benar!* +${setting.gameSetting.quiz.tebakLirikPoint}💵\nuangmu: ${isRegistered?.data ? isRegistered.data.money + setting.gameSetting.quiz.tebakLirikPoint : setting.gameSetting.quiz.tebakLirikPoint}💵\n\n_${tebakLirik.games.a}_`)
        _User.addMoney({ id: isRegistered?.data?.id, amount: 5 })
        _User.addQuizWin({ id: isRegistered?.data?.id, amount: 1 })
        _User.addQuizStreak({ id: isRegistered?.data?.id, isWin: true, amount: 1 })
      } else {
        reply(`🚫 *Salah!*\n\n${tebakLirik.games.a}`);
        _User.addQuizLose({ id: isRegistered?.data?.id, amount: 1 })
        _User.addQuizStreak({ id: isRegistered?.data?.id, isWin: false, amount: 0 })
      }


    } break;

    case 'caklontong': case 'cl': {
      const isRegistered = _User.searchUserByPhone(userJid)
      if (!isRegistered.status) return reply(belumRegist)

      const catong = await cakLontong()

      // if (!catong.status) return reply("Maaf, ada kesalahan. coba lagi");
      reply(catong.data.soal);
      _User.setQuizMatch({
        id: isRegistered?.data?.id,
        match: isRegistered?.data?.quiz?.match && isRegistered?.data?.quiz?.match > 0 ? isRegistered?.data?.quiz.match + 1 : 1,
      })

      const answer = await waitMsg()

      if (answer.toLowerCase() == catong.data.jawaban.toLowerCase()) {
        reply(`🎉 *Kamu benar!* +${setting.gameSetting.quiz.cakLontongPoint}💵\nuangmu: ${isRegistered?.data ? isRegistered.data.money + setting.gameSetting.quiz.cakLontongPoint : setting.gameSetting.quiz.cakLontongPoint}💵\n\n_${catong.data.jawaban}_\n\n${catong.data.deskripsi || ''}`)
        _User.addMoney({ id: isRegistered?.data?.id, amount: setting.gameSetting.quiz.cakLontongPoint })
        _User.addQuizWin({ id: isRegistered?.data?.id, amount: 1 })
        _User.addQuizStreak({ id: isRegistered?.data?.id, isWin: true, amount: 1 })


      } else {
        reply(`🚫 *Salah!*\n\n${catong?.data?.jawaban}\n\n${catong.data.deskripsi || ''}`);
        _User.addQuizLose({ id: isRegistered?.data?.id, amount: 1 })
        _User.addQuizStreak({ id: isRegistered?.data?.id, isWin: false, amount: 0 })
      }


    } break;
  }


  // account command
  switch (command) {
    case 'regist': {
      const isRegistered = _User.searchUserByPhone(userJid)

      if (isRegistered.status) return reply(`Kamu sudah terdaftar ketik\n.akun untuk melihat akun.`)

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
      if (!isRegistered.status) return reply(belumRegist)

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
      if (!isRegistered.status) return reply(belumRegist)

      if (!q) return reply("Masukkan username contoh:\n*.gantinama nama_baru*");
      if (q?.length < setting.accountSetting.min_username_length) return reply(`Nama terlalu pendek *minimal ${setting.accountSetting.min_username_length} huruf!*`);
      if (q?.length > setting.accountSetting.max_username_length) return reply(`Nama terlalu panjang *maximal ${setting.accountSetting.max_username_length} huruf!*`);

      const result: any = _User.updateUsername({ id: isRegistered?.data?.id, username: q })

      if (!result.status) return reply(result.messageInd)

      reply(`✅ *Berhasil mengganti nama ${result.oldName} ke ${result.newName} !*\n\nDetail akun ketik:\n.akun`);

    } break;

    case 'cekakun': {

      if (!q) return reply(`Masukkan username atau id contoh:\n*.cekakun nama_atau_id*`)

      const findId = _User.searchUserById(q)
      const findUsername = _User.searchUserByUsername(q)

      if (!findId.status && !findUsername.status) return reply(`Username atau id tidak ditemukan`)

      if (findId.status) {

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
      if (!isRegistered.status) return reply(belumRegist)

      const userMoney = _User.getCurrentMoney({ id: isRegistered?.data?.id })
      if (!userMoney.status) return reply(userMoney.messageInd || 'User tidak ditemukan.')

      reply(userMoney.money + ' 💵')
    } break;

    case 'leaderboard': {
      const leaderboard = _User.getLeaderboardMoney()

      const leaderboardText = leaderboard.map((data: any, index: number) => {
        return `*${data.username}* ${index + 1 == 1 ? '🥇' : index + 1 == 2 ? '🥈' : index + 1 == 3 ? '🥉' : ''}\n💵 ${data.money}\n💰 ${data.highestMoney}`
      })
        .join('\n\n')

      reply(leaderboardText)
    } break;


  }


  // Download command
  switch (command) {
    case 'spotify': {
      if (!q) return reply("Masukkan judul lagu spotify contoh:\n.spotify *raissa anggiani - Losing Us.*");

      const spotify = await spotifySearchMusic(q)
      if (!spotify.status) return reply(spotify.data);

      // reply(spotify?.data ?? "Tidak ditemukan")
     // console.log(spotify.data)
      reply(`${spotify.data}\n\nPilih musik sesuai angka, contoh *1*`)

      const newMsg = await waitMsg()

      const choice = newMsg.replace(/ /g, '').split('|')[0]
      const downloadVia = newMsg.replace(/ /g, '').split('|')[1]

      if (!spotify?.musicIndex?.includes(Number(choice))) return reply("Pilihan tidak ditemukan");

        // const selected = spotify.data[Number(choice) - 1]
        const selectedMusic = spotify.musicList[Number(choice) - 1]

      reply(`*${selectedMusic.title}*` + ' | Proses, mohon tunggu... ')

        // reply(JSON.stringify(spotify.musicList[Number(choice) - 1].url))
        
      const musicData = await spotifyFetchURL(selectedMusic.url)

        if (!musicData.status) return reply('Tidak dapat mengunduh musik');   

            const spotifyContent = {
        contextInfo: {
          externalAdReply: {
            title: musicData?.metadata?.title ?? '-',
            body: musicData?.metadata?.artists ?? '-',
            thumbnailUrl: musicData.metadata.cover,
            sourceUrl: selectedMusic.url || '',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      };

      
      try {
        if (downloadVia === 'link') {
          await bot.sendMessage(from, {
            text: musicData.link,
            contextInfo: spotifyContent.contextInfo
          });
        } else if (downloadVia === 'file') {
          await bot.sendMessage(from, {
            document: {url: musicData.link},
            mimetype: 'audio/mp3',
            fileName: `${selectedMusic.title}.mp3`,
            contextInfo: spotifyContent.contextInfo
          });
        } else {
          await bot.sendMessage(from, {
            audio: {
              url: musicData.link
            },
            mimetype: 'audio/mp4',
            contextInfo: spotifyContent.contextInfo
          });
        }
      } catch (err) {
        reply('Url audio rusak.');
      }   
      
    }
  }


  // Owner command
  switch (command) {
    case 'ev': {
      if (!isOwner) return reply('kamu bukan owner!');
      if (!q) return reply('kirim kode javascript');

      try {
        let evaled = await eval(`${q}`)
        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
        reply(`» ${evaled}`)
      } catch (err: any) {
        console.error(err)
        reply(`» Error: ${err.message}`)
      }
    } break;

      case "eval": {
        if (!isOwner) return;
        let result
        try { 
    result = eval(q)
      } catch (e)  {
             result = require('util').format(e)
     } finally {
        reply(result)
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