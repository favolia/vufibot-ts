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
exports.startBot = void 0;
const connection_1 = require("./connection/connection");
const call_1 = require("./bot/handler/call");
const socket_1 = require("./connection/socket");
function startBot() {
    return __awaiter(this, void 0, void 0, function* () {
        const bot = yield (0, socket_1.socket)();
        bot.ev.on('connection.update', (update) => (0, connection_1._connection)(update));
        bot.ev.on('call', (call) => __awaiter(this, void 0, void 0, function* () { return (0, call_1._call)(call[0], bot); }));
        bot.ev.on('messages.upsert', (m) => __awaiter(this, void 0, void 0, function* () {
            if (m.messages[0].key.fromMe)
                return;
            // console.log(JSON.stringify(m, undefined, 2))
            // console.log('replying to', m.messages[0].key.remoteJid)
            // await bot.sendMessage(m.messages[0].key.remoteJid!, { text: 'Hello there!' })
            // await bot.sendMessage('628875090455@s.whatsapp.net', { text: 'Hello there!' })
        }));
    });
}
exports.startBot = startBot;
// run in main file
startBot();
