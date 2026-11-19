import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * 개발 서버(npm run dev)에서 /api/* 를 api 폴더의 서버리스 함수로 처리
 * - 배포 환경(Vercel)에서는 쓰이지 않음. vercel dev 를 써도 됨
 * - api/{name}.ts 가 export 하는 GET 등 메서드 함수를 Web Request/Response 로 호출
 */
function apiDevServer(): Plugin {
  return {
    name: 'dakidak-api-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next();

        const url = new URL(req.url, 'http://localhost');
        const name = url.pathname.slice('/api/'.length).replace(/\/$/, '');
        const file = resolve(server.config.root, 'api', `${name}.ts`);
        if (!/^[a-z0-9-]+$/.test(name) || !existsSync(file)) {
          res.statusCode = 404;
          res.setHeader('content-type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ error: 'not_found', message: '없는 API 예요.' }));
          return;
        }

        try {
          const mod = (await server.ssrLoadModule(file)) as Record<string, unknown>;
          const handler = mod[req.method ?? 'GET'];
          if (typeof handler !== 'function') {
            res.statusCode = 405;
            res.end();
            return;
          }

          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (typeof value === 'string') headers.set(key, value);
          }
          const response = (await handler(new Request(url, { method: req.method, headers }))) as Response;

          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (error) {
          next(error);
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // .env.local 의 KAKAO_REST_API_KEY 를 개발용 서버리스 함수에서 읽을 수 있게 전달 (프론트엔드에는 노출되지 않음)
  const env = loadEnv(mode, process.cwd(), '');
  if (env.KAKAO_REST_API_KEY && !process.env.KAKAO_REST_API_KEY) {
    process.env.KAKAO_REST_API_KEY = env.KAKAO_REST_API_KEY;
  }

  return {
    plugins: [react(), apiDevServer()],
  };
});
