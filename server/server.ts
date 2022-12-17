import { parse } from "parse";
import { serve } from "serve";
import { serveFile } from "serveFile";
import { QuizSession } from "./QuizSession.ts";

const sessions: Map<string, QuizSession> = new Map();

const announcementChannel = new BroadcastChannel("announcement");
announcementChannel.onmessage = ({ data }) => {
  const session = sessions.get(data.joinCode);
  if (session === undefined && data.adminCode && data.joinCode) {
    console.log('create session from announcement');
    sessions.set(data.joinCode, new QuizSession(data.adminCode, data.joinCode));
  } else if (session !== undefined && data.adminCode == undefined) {
    // case: a player joined a server that hasn't received the announcement yet
    announcementChannel.postMessage({ adminCode: session.adminCode, joinCode: session.joinCode });
  }
};

async function reqHandler(req: Request) {
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
            console.log("reconnect host");
            session.addHost(socket);
          }
        } else {
          console.log("creating session");
          const quizSession = new QuizSession(adminCode, joinCode, socket);
          sessions.set(joinCode, quizSession);
          announcementChannel.postMessage({ adminCode, joinCode });
          quizSession.onClose = () => {
            console.log("closing: ", joinCode);
            sessions.delete(joinCode);
          };
        }
      } else if (joinCode) {
        const quizSession = sessions.get(joinCode);
        if (quizSession) {
          console.log("connecting player");
          quizSession.addPlayer(socket);
        } else {
          console.log("session does not exist");
          // requesting a re-announcement of the session if it exists
          announcementChannel.postMessage({ joinCode });
          socket.onopen = () => {
            socket.send(
              JSON.stringify({
                type: "MESSAGE",
                text: `No quiz with code ${joinCode} found`,
              }),
            );
            socket.close();
          };
        }
      }
      // deno-lint-ignore no-explicit-any
    } catch (error: any) {
      return new Response(error?.message, { status: 400 });
    }
    return response;
  }
  if (url.pathname.match(/\.(js|css|png|webmanifest)$/)) {
    const fileResp = await serveFile(req, `${Deno.cwd()}/${appDistDir}/${url.pathname}`, { etagAlgorithm: "sha-256" });
    fileResp.headers.append('Cache-Control', 'public,max-age=604800,immutable');
    return fileResp;
  }
  return serveFile(req, `${Deno.cwd()}/${appDistDir}/index.html`);
}

serve(reqHandler, { port: 42069 });
