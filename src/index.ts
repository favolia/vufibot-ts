import { _connection } from "./connection/connection";
import { _call } from './bot/handler/call';
import { _MESSAGE } from './bot/message';
import { _socket } from './connection/socket';

export async function startBot() {

    globalThis.bot = await _socket();

    bot.ev.on('connection.update', (update: any) => _connection(update))
    bot.ev.on('call', async (call: any) => _call(call[0]))
    bot.ev.on('messages.upsert', async (M : any) => await _MESSAGE(M))

}

startBot()