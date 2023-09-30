import {
    DisconnectReason,
    ConnectionState,
} from "@whiskeysockets/baileys";
import {
    Boom
} from '@hapi/boom'
import {
    startBot
} from "../index";
import chalk from "chalk";
import {
    setting
} from "../setting";

const {
    badSession,
    connectionClosed,
    connectionLost,
    connectionReplaced,
    loggedOut,
    multideviceMismatch,
    restartRequired,
    timedOut
} = DisconnectReason

export const _connection = async (update: ConnectionState) => {

    const {
        connection,
        isNewLogin,
        isOnline,
        lastDisconnect,
        legacy,
        qr,
        receivedPendingNotifications
    } = update

    const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode

    switch (connection) {
        case "close": {

            const shouldReconnect = statusCode !== loggedOut
            if (shouldReconnect) {
                await startBot()
                console.log(chalk`{blue ${setting.bot_name}} {dim >>} {yellow 🖧 Reconnecting...}`);
            }
            // console.log(chalk`{blue ${setting.bot_name}} {dim >>} {red Logged out, {white try scanning it again.}}`);
        }
            break;

        case "connecting": {
            console.log(chalk`{blue ${setting.bot_name}} {dim >>} {yellow 🖧 Trying to reconnect...}`);
        }
            break;

        case "open": {
            console.log(chalk`{blue ${setting.bot_name}} {dim >>} {green Connecting opened.}`);
            console.log(chalk`{blue ${setting.bot_name}} {dim >>} {green 🖧 Connecting...}`);
            console.log(chalk`{blue ${setting.bot_name}} {dim >>} {green Ⓞ is Online.}`)

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

            switch ((lastDisconnect?.error as Boom)?.output?.statusCode) {
                case badSession: {
                    console.log(chalk`{blue ${setting.bot_name}} {dim >>} {red ${statusCode} {red Bad Session, try scanning it again.}}`);

                }
                    break;

                case connectionClosed: {
                    console.log(chalk`{blue ${setting.bot_name}} {dim >>} {red ${statusCode} {gray Connection Closed, Restaring...}}`);

                }
                    break;

                case connectionLost: {
                    console.log(chalk`{blue ${setting.bot_name}} {dim >>} {red ${statusCode} {red Connection Lost, Restaring...}}`);

                }
                    break;

                case connectionReplaced: {
                    console.log(chalk`{blue ${setting.bot_name}} {dim >>} {red ${statusCode} {yellow Connection Replaced, try restarting.}}`);
                }
                    break;

                case multideviceMismatch: {
                    console.log(chalk`{blue ${setting.bot_name}} {dim >>} {red ${statusCode} {red Multi Device Mis Match, try restarting.}}`);
                }
                    break;

                case restartRequired: {
                    console.log(chalk`{blue ${setting.bot_name}} {dim >>} {red ${statusCode} {yellow Restart Required, Restaring...}}`);

                }
                    break;

                case timedOut: {
                    console.log(chalk`{blue ${setting.bot_name}} {dim >>} {red ${statusCode} {red Timeout, Restaring...}}`);

                }
                    break;

                default: {
                    if (statusCode == undefined) return
                    console.log(chalk`{blue ${setting.bot_name}} {dim >>} {red ${statusCode} {gray Unkown status code or error, try restarting.}}`);
                }
                    break;
            }

            if (connection == undefined) return
            console.log(chalk`{blue ${setting.bot_name}} {dim >>} {red ${statusCode} {gray Unkown Reason}}`);

            break;
    }

}