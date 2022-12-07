import { parse } from "parse";
import { serveFile } from "serveFile";
import { serve } from "serve";

function reqHandler(req: Request) {
  const appDistDir = parse(Deno.args).dist || "client/build";
  const url = new URL(req.url);
  if (url.pathname.startsWith("/ws")) {
    const { socket, response } = Deno.upgradeWebSocket(req);
    try {
      // handleWebsocketConnection(
      //   socket,
      //   url.searchParams.has("quickmatch"),
      //   url.searchParams.has("botmatch"),
      //   url.searchParams.get("sessionId"),
      // );
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
