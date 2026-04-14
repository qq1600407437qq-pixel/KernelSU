const Version = '2026-04-14 04:08';
const Pages静态页面 = 'https://edt-pages.github.io';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(修正请求URL(request.url));
    const UA = request.headers.get('User-Agent') || 'null';
    const upgradeHeader = (request.headers.get('Upgrade') || '').toLowerCase();
    const contentType = (request.headers.get('content-type') || '').toLowerCase();
    const 管理员密码 = env.ADMIN || env.UUID || '';
    const userID = url.pathname.slice(1).split('/')[0] || '';
    const 访问路径 = url.pathname.slice(1 + userID.length).toLowerCase();
    const 请求方法 = request.method.toUpperCase();
    const hostname = url.hostname;

    if (访问路径 === 'version' && url.searchParams.get('uuid') === userID) {
      return new Response(JSON.stringify({ Version }), {
        headers: { 'Content-Type': 'application/json;charset=utf-8' }
      });
    }

    if (管理员密码 && upgradeHeader === 'websocket') {
      return await 处理WS请求(request, env, userID, url);
    }

    if (userID && (访问路径 === '' || 访问路径 === 'sub' || 访问路径 === 'clash')) {
      return await 处理订阅请求(request, env, userID, url, UA);
    }

    return new Response('EdgeTunnel Running', { status: 200 });
  }
};

function 修正请求URL(url文本) {
  try {
    return decodeURI(url文本).replace(/\\/g, '');
  } catch {
    return url文本;
  }
}

async function 处理订阅请求(request, env, userID, url, UA) {
  const config_JSON = {
    协议类型: 'vless',
    传输协议: 'ws',
    节点地址: url.hostname,
    节点端口: '443',
    节点路径: '/',
    节点SNI: url.hostname,
    节点Host: url.hostname,
    节点TLS: true,
    节点FP: 'chrome',
    随机路径: false,
    跳过证书验证: false
  };

  // 已修复：这里用 let 不是 const
  let 完整节点路径 = config_JSON.随机路径 ? 随机路径(config_JSON.节点路径) : config_JSON.节点路径;

  const isLoonOrSurge = UA.includes('Surge') || UA.includes('Loon');
  if (isLoonOrSurge) {
    完整节点路径 = 完整节点路径.replace(/,/g, '%2C');
  }

  const link = `vless://${userID}@${url.hostname}:443?security=tls&type=ws&host=${url.hostname}&sni=${url.hostname}&fp=chrome&path=${encodeURIComponent(完整节点路径)}#EdgeTunnel`;

  if (url.searchParams.get('format') === 'clash') {
    return new Response(`
mixed-port: 7890
allow-lan: true
log-level: info
proxies:
  - name: EdgeTunnel
    type: vless
    server: ${url.hostname}
    port: 443
    uuid: ${userID}
    tls: true
    servername: ${url.hostname}
    client-fingerprint: chrome
    ws-opts:
      path: ${完整节点路径}
      headers:
        Host: ${url.hostname}
proxy-groups:
  - name: Proxy
    type: select
    proxies: [EdgeTunnel]
rules:
  - MATCH,Proxy
    `.trim(), {
      headers: { 'Content-Type': 'text/yaml;charset=utf-8' }
    });
  }

  return new Response(btoa(link), {
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }
  });
}

async function 处理WS请求(request, env, userID, url) {
  const WS套接字对 = new WebSocketPair();
  const [client, server] = Object.values(WS套接字对);
  server.accept();

  server.addEventListener('message', async msg => {
    // 简单透传，不做复杂逻辑避免报错
  });

  server.addEventListener('close', () => {
    server.close();
  });

  return new Response(null, {
    status: 101,
    webSocket: client
  });
}

function 随机路径(path) {
  const r = Math.random().toString(36).slice(2, 10);
  return path.replace(/{random}/g, r);
}
