import { IncomingMessage } from "http";

export function getPostData(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        resolve(JSON.parse(body));
      });
    } catch (err) {
      reject(err);
    }
  });
}