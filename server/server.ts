import { parse } from "parse";
import { serve } from "serve";
import { serveFile } from "serveFile";
import { QuizSession } from "./QuizSession.ts";

const sessions: Map<string, QuizSession> = new Map();

function reqHandler(req: Request) {
  const appDistDir = parse(Deno.args).dist || "client";
  const url = new URL(req.url);
  if (req.headers.get("upgrade") === "websocket") {
    const { socket, response } = Deno.upgradeWebSocket(req);
    try {
      const joinCode = url.searchParams.get("joinCode");
      const adminCode = url.searchParams.get("adminCode");
      console.log("joinCode", joinCode, "adminCode", adminCode);
      if (adminCode && joinCode) {
        console.log("connecting host");
        if (sessions.has(joinCode)) {
          const session = sessions.get(joinCode);
          if (session?.adminCode === adminCode) {
            console.log("looks like a reconnect from the host");
            session.addHost(socket);
          }
        } else {
          console.log("creating session");
          sessions.set(joinCode, new QuizSession(adminCode, joinCode, socket));
        }
      } else if (joinCode) {
        console.log("connecting player");
        sessions.get(joinCode)?.addPlayer(socket);
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
