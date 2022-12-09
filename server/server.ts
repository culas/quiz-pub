import { parse } from "parse";
import { serve } from "serve";
import { serveFile } from "serveFile";
import { QuizSession } from "./QuizSession.ts";

const sessions: Map<string, QuizSession> = new Map();

function reqHandler(req: Request) {
  const appDistDir = parse(Deno.args).dist || "client/build";
  const url = new URL(req.url);
  if (req.headers.get('upgrade') === 'websocket') {
    const { socket, response } = Deno.upgradeWebSocket(req);
    try {
      socket.onmessage = msg => {
        if (msg.data.type === 'start-run') {
          const { adminCode, joinCode, name } = msg.data;
          sessions.set(msg.data.joinCode, new QuizSession(adminCode, joinCode, name, socket));
        }
        if (msg.data.type === 'join') {
          sessions.get(msg.data.joinCode)?.addPlayer(socket, msg.data.name);
        }
      }
    } catch (error: any) {
      return new Response(error?.message, { status: 400 });
    }
    return response;
  }
  if (url.pathname.match(/\.(js|css|png)$/)) {
    return serveFile(req, `${Deno.cwd()}/${appDistDir}/${url.pathname}`);
  }
  return serveFile(req, `${Deno.cwd()}/${appDistDir}/index.html`);
}

serve(reqHandler, { port: 42069 });
