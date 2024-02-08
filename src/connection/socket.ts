import {
  makeWASocket,
  useMultiFileAuthState
} from "@whiskeysockets/baileys";
import { setting } from '../setting';
import pino from "pino";


export const _socket = async () => {
  const { state, saveCreds } = await useMultiFileAuthState(setting.session_name);

  const bot = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    logger: pino({
        level: 'silent'
    }),
    browser: [
      'Safari',
      setting.socket_config.browser,
      setting.socket_config.browser_version
    ],
    // markOnlineOnConnect: true,
    // mobile: true,
    // keepAliveIntervalMs: 100000,
    // connectTimeoutMs: 100000,
    // qrTimeout: 100000,
    generateHighQualityLinkPreview: true,
  })

  bot.ev.on("creds.update", saveCreds);
  // bot.sendMessage(null, {audio: {url: ''}, mimetype: 'audio/ogg', ptt}, {quoted: })
  return bot;
}