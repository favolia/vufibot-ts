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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._socket = void 0;
const baileys_1 = require("@whiskeysockets/baileys");
const setting_1 = require("../setting");
const pino_1 = __importDefault(require("pino"));
const _socket = () => __awaiter(void 0, void 0, void 0, function* () {
    const { state, saveCreds } = yield (0, baileys_1.useMultiFileAuthState)(setting_1.setting.session_name);
    const bot = (0, baileys_1.makeWASocket)({
        printQRInTerminal: true,
        auth: state,
        logger: (0, pino_1.default)({
            level: setting_1.setting.socket_config.logger_level
        }),
        browser: [
            'Safari',
            setting_1.setting.socket_config.browser,
            setting_1.setting.socket_config.browser_version
        ],
        // markOnlineOnConnect: true,
        // mobile: true,
        // keepAliveIntervalMs: 100000,
        // connectTimeoutMs: 100000,
        // qrTimeout: 100000,
        generateHighQualityLinkPreview: true,
    });
    bot.ev.on("creds.update", saveCreds);
    // bot.sendMessage(null, {audio: {url: ''}, mimetype: 'audio/ogg', ptt}, {quoted: })
    return bot;
});
exports._socket = _socket;
