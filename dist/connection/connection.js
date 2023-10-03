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
exports._connection = void 0;
const baileys_1 = require("@whiskeysockets/baileys");
const index_1 = require("../index");
const chalk_1 = __importDefault(require("chalk"));
const setting_1 = require("../setting");
const server_1 = require("./server");
const { badSession, connectionClosed, connectionLost, connectionReplaced, loggedOut, multideviceMismatch, restartRequired, timedOut } = baileys_1.DisconnectReason;
const _connection = (update) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { connection, isNewLogin, isOnline, lastDisconnect, legacy, qr, receivedPendingNotifications } = update;
    const statusCode = (_b = (_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode;
    switch (connection) {
        case "close":
            {
                const shouldReconnect = statusCode !== loggedOut;
                if (shouldReconnect) {
                    yield (0, index_1.startBot)();
                    console.log((0, chalk_1.default) `{blue ${setting_1.setting.bot_name}} {dim >>} {yellow 🖧 Reconnecting...}`);
                }
                // console.log(chalk`{blue ${setting.bot_name}} {dim >>} {red Logged out, {white try scanning it again.}}`);
            }
            break;
        case "connecting":
            {
                console.log((0, chalk_1.default) `{blue ${setting_1.setting.bot_name}} {dim >>} {yellow 🖧 Trying to reconnect...}`);
            }
            break;
        case "open":
            {
                console.log((0, chalk_1.default) `{blue ${setting_1.setting.bot_name}} {dim >>} {green Connecting opened.}`);
                console.log((0, chalk_1.default) `{blue ${setting_1.setting.bot_name}} {dim >>} {green 🖧 Connecting...}`);
                console.log((0, chalk_1.default) `{blue ${setting_1.setting.bot_name}} {dim >>} {green Ⓞ is Online.}`);
                //             isOnline 
                //                 ? isNewLogin
                //                     ? console.log(chalk`{blue ${setting.bot_name}} {dim >>} {white {bgYellow ⚠ } It looks like this is the first connection, 
                // if you want to customize the bot, change the configuration(⚙) in settings.ts}`)
                //                     : console.log(chalk`{blue ${setting.bot_name}} {dim >>} {green Ⓞ is Online.}`)
                //                 : console.log(chalk`{blue ${setting.bot_name}} {dim >>} {green 🖧 Connecting...}`);
                //             isOnline 
            }
            break;
        default:
            switch ((_d = (_c = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _c === void 0 ? void 0 : _c.output) === null || _d === void 0 ? void 0 : _d.statusCode) {
                case badSession:
                    {
                        console.log((0, chalk_1.default) `{blue ${setting_1.setting.bot_name}} {dim >>} {red ${statusCode} {red Bad Session, try scanning it again.}}`);
                    }
                    break;
                case connectionClosed:
                    {
                        console.log((0, chalk_1.default) `{blue ${setting_1.setting.bot_name}} {dim >>} {red ${statusCode} {gray Connection Closed, Restaring...}}`);
                    }
                    break;
                case connectionLost:
                    {
                        console.log((0, chalk_1.default) `{blue ${setting_1.setting.bot_name}} {dim >>} {red ${statusCode} {red Connection Lost, Restaring...}}`);
                    }
                    break;
                case connectionReplaced:
                    {
                        console.log((0, chalk_1.default) `{blue ${setting_1.setting.bot_name}} {dim >>} {red ${statusCode} {yellow Connection Replaced, try restarting.}}`);
                    }
                    break;
                case multideviceMismatch:
                    {
                        console.log((0, chalk_1.default) `{blue ${setting_1.setting.bot_name}} {dim >>} {red ${statusCode} {red Multi Device Mis Match, try restarting.}}`);
                    }
                    break;
                case restartRequired:
                    {
                        console.log((0, chalk_1.default) `{blue ${setting_1.setting.bot_name}} {dim >>} {red ${statusCode} {yellow Restart Required, Restaring...}}`);
                    }
                    break;
                case timedOut:
                    {
                        console.log((0, chalk_1.default) `{blue ${setting_1.setting.bot_name}} {dim >>} {red ${statusCode} {red Timeout, Restaring...}}`);
                    }
                    break;
                default:
                    {
                        if (statusCode == undefined)
                            return;
                        console.log((0, chalk_1.default) `{blue ${setting_1.setting.bot_name}} {dim >>} {red ${statusCode} {gray Unkown status code or error, try restarting.}}`);
                    }
                    break;
            }
            if (connection == undefined)
                return;
            console.log((0, chalk_1.default) `{blue ${setting_1.setting.bot_name}} {dim >>} {red ${statusCode} {gray Unkown Reason}}`);
            break;
    }
});
exports._connection = _connection;
(0, server_1.serverUp)();
