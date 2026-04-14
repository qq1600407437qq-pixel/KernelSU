const Version = '2026-04-04 18:26:17';
const Pages静态页面 = 'https://edt-pages.github.io';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(修正请求URL(request.url));
    const UA = request.headers.get('User-Agent') || 'null';
    const upgradeHeader = (request.headers.get('Upgrade') || '').toLowerCase();
    const contentType = (request.headers.get('content-type') || '').toLowerCase();
    const 管理员密码 = env.ADMIN || env.admin || env.PASSWORD || env.password || env.pswd || env.TOKEN || env.KEY || env.UUID || env.uuid;
    const userID = url.pathname.slice(1).split('/')[0] || '';
    const 访问路径 = url.pathname.slice(1 + userID.length).toLowerCase();
    const 请求方法 = request.method.toUpperCase();
    const hostname = url.hostname;
    const 请求端口 = url.port || (url.protocol === 'https:' ? '443' : '80');
    const 请求协议 = url.protocol === 'https:' ? 'https' : 'http';
    const CFIP = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || request.headers.get('X-Real-IP') || '127.0.0.1';
    const CFcolo = request.cf?.colo || 'UNK';
    const CFloc = request.cf?.country || 'UNK';
    const CFasn = request.cf?.asn || 'UNK';

    if (访问路径 === 'version' && url.searchParams.get('uuid') === userID) {
      return new Response(JSON.stringify({ Version: Number(String(Version).replace(/\D+/g, '')) }), { status: 200, headers: { 'Content-Type': 'application/json;charset=utf-8' } });
    } else if (管理员密码 && upgradeHeader === 'websocket') {
      await 反代参数获取(url);
      log(`[WebSocket] 命中请求: ${url.pathname}${url.search}`);
      return await 处理WS请求(request, userID, url);
    } else if (管理员密码 && !访问路径.startsWith('admin/') && 访问路径 !== 'login' && 请求方法 === 'POST') {
      await 反代参数获取(url);
      const referer = request.headers.get('Referer') || '';
      const 命中XHTTP特征 = referer.includes('x_padding', 14) || referer.includes('x_padding=');
      if (!命中XHTTP特征 && contentType.startsWith('application/grpc')) {
        log(`[gRPC] 命中请求: ${url.pathname}${url.search}`);
        return await 处理gRPC请求(request, userID);
      } else if (命中XHTTP特征) {
        log(`[XHTTP] 命中请求: ${url.pathname}${url.search}`);
        return await 处理XHTTP请求(request, userID);
      }
    } else if (userID && (访问路径 === '' || 访问路径 === 'sub' || 访问路径 === 'clash' || 访问路径 === 'surge' || 访问路径 === 'loon' || 访问路径 === 'quan' || 访问路径 === 'v2ray' || 访问路径 === 'ss' || 访问路径 === 'trojan' || 访问路径 === 'vless' || 访问路径 === 'wg')) {
      await 反代参数获取(url);
      log(`[订阅] 命中请求: ${url.pathname}${url.search}`);
      return await 处理订阅请求(request, userID, url, UA);
    } else if (管理员密码 && (访问路径 === 'admin' || 访问路径.startsWith('admin/'))) {
      return await 处理管理请求(request, env, userID, url);
    } else if (请求方法 === 'OPTIONS') {
      return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,Authorization' } });
    } else {
      return fetch(Pages静态页面 + url.pathname, { method: 请求方法, headers: request.headers, redirect: 'follow' });
    }
  }
};

function log(...args) {
  console.log(`[${new Date().toISOString()}]`, ...args);
}

function 随机字符串(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function 随机路径(path) {
  return path.replace(/{random}/g, 随机字符串(8));
}

function MD5(str) {
  return crypto.subtle.digest('MD5', new TextEncoder().encode(str)).then(h => Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join(''));
}

async function MD5MD5(str) {
  return await MD5(await MD5(str));
}

function 修正SB内核请求URL(url文本) {
  url文本 = url文本.replace(/%5[Cc]/g, '').replace(/\\/g, '');
  const 锚点索引 = url文本.indexOf('#');
  const 主体部分 = 锚点索引 === -1 ? url文本 : url文本.slice(0, 锚点索引);
  if (主体部分.includes('?') || !/%3f/i.test(主体部分)) return url文本;
  const 问号索引 = 主体部分.toLowerCase().lastIndexOf('%3f');
  return 主体部分.slice(0, 问号索引) + '?' + 主体部分.slice(问号索引 + 3) + (锚点索引 !== -1 ? url文本.slice(锚点索引) : '');
}

function 修正请求URL(url文本) {
  return 修正SB内核请求URL(url文本);
}

let 反代IP池 = [], 优选IP池 = [], 优选API = [], 优选端口 = '443', 优选协议 = 'vless', 优选加密 = 'none', 优选路径 = '/', 优选SNI = '', 优选Host = '', 优选TLS = true, 优选FP = 'chrome', 优选mux = false, 优选ECH = false, 优选ECHConfig = {}, 优选分片 = 0, 优选订阅 = false, 优选订阅名 = 'EdgeTunnel', 优选订阅上传 = 0, 优选订阅下载 = 0, 优选订阅总流量 = 0, 优选订阅过期 = 0;

async function 反代参数获取(url) {
  const { searchParams } = url;
  反代IP池 = searchParams.getAll('ip') || [];
  优选IP池 = searchParams.getAll('ip') || [];
  优选API = searchParams.getAll('api') || [];
  优选端口 = searchParams.get('port') || '443';
  优选协议 = searchParams.get('protocol') || 'vless';
  优选加密 = searchParams.get('encryption') || 'none';
  优选路径 = searchParams.get('path') || '/';
  优选SNI = searchParams.get('sni') || '';
  优选Host = searchParams.get('host') || '';
  优选TLS = searchParams.get('tls') !== 'false';
  优选FP = searchParams.get('fp') || 'chrome';
  优选mux = searchParams.get('mux') === 'true';
  优选ECH = searchParams.get('ech') === 'true';
  优选ECHConfig = JSON.parse(searchParams.get('echconfig') || '{}');
  优选分片 = parseInt(searchParams.get('fragment') || '0');
  优选订阅 = searchParams.get('sub') === 'true';
  优选订阅名 = searchParams.get('name') || 'EdgeTunnel';
  优选订阅上传 = parseInt(searchParams.get('upload') || '0');
  优选订阅下载 = parseInt(searchParams.get('download') || '0');
  优选订阅总流量 = parseInt(searchParams.get('total') || '0');
  优选订阅过期 = parseInt(searchParams.get('expire') || '0');
  if (优选IP池.length === 0 && 优选API.length === 0) {
    优选IP池 = ['cdn.xn--b6g.cn'];
  }
}

async function 处理订阅请求(request, userID, url, UA) {
  const config_JSON = await 读取config_JSON(env, url.hostname, userID, UA);
  const 协议类型 = config_JSON.协议类型 || 'vless';
  const 传输协议 = config_JSON.传输协议 || 'ws';
  const 加密方式 = config_JSON.加密方式 || 'none';
  const 节点地址 = config_JSON.节点地址 || url.hostname;
  const 节点端口 = config_JSON.节点端口 || '443';
  const 节点路径 = config_JSON.节点路径 || '/';
  const 节点SNI = config_JSON.节点SNI || url.hostname;
  const 节点Host = config_JSON.节点Host || url.hostname;
  const 节点TLS = config_JSON.节点TLS !== false;
  const 节点FP = config_JSON.节点FP || 'chrome';
  const 节点mux = config_JSON.节点mux === true;
  const 节点ECH = config_JSON.节点ECH === true;
  const 节点ECHConfig = config_JSON.节点ECHConfig || {};
  const 节点分片 = config_JSON.节点分片 || 0;
  const 节点备注 = config_JSON.节点备注 || 'EdgeTunnel';
  const 作为优选订阅生成器 = 优选订阅 || config_JSON.优选订阅生成.启用;
  const ECHLINK参数 = 节点ECH ? `&ech=${encodeURIComponent((节点ECHConfig.SNI ? 节点ECHConfig.SNI + '+' : '') + 节点ECHConfig.DNS)}` : '';
  const TLS分片参数 = 节点分片 > 0 ? `&fragment=${节点分片}` : '';

  // 已修复：const 改为 let，允许修改
  let 完整节点路径 = 作为优选订阅生成器 ? '/' : (config_JSON.随机路径 ? 随机路径(节点路径) : 节点路径);

  const isLoonOrSurge = UA.includes('Surge') || UA.includes('Loon');
  const isSubConverterRequest = UA.includes('subconverter');
  let LINK = '';

  if (协议类型 === 'ss') {
    LINK = `${协议类型}://${btoa(加密方式 + ':' + userID)}@${节点地址}:${节点TLS ? '443' : '80'}?plugin=v2ray-plugin;mode=websocket;host=${节点Host};path=${(完整节点路径.includes('?') ? 完整节点路径.replace('?', '?enc=' + 加密方式 + '&') : (完整节点路径 + '?enc=' + 加密方式)) + (节点TLS ? ';tls' : '')};mux=${节点mux}${ECHLINK参数}${TLS分片参数}#${encodeURIComponent(节点备注)}`;
  } else {
    const 域名字段名 = 传输协议 === 'ws' || 传输协议 === 'http' ? 'host' : 'servername';
    const 路径字段名 = 传输协议 === 'ws' || 传输协议 === 'http' ? 'path' : 'serviceName';
    LINK = `${协议类型}://${userID}@${节点地址}:${节点端口}?security=${节点TLS ? 'tls' : 'none'}&type=${传输协议}${ECHLINK参数}&${域名字段名}=${节点Host}&fp=${节点FP}&sni=${节点SNI}&${路径字段名}=${encodeURIComponent(完整节点路径)}${TLS分片参数}&encryption=${加密方式}${config_JSON.跳过证书验证 ? '&insecure=1&allowInsecure=1' : ''}#${encodeURIComponent(节点备注)}`;
  }

  if (isLoonOrSurge) {
    完整节点路径 = 完整节点路径.replace(/,/g, '%2C');
  }
  if (协议类型 === 'ss' && !作为优选订阅生成器) {
    完整节点路径 = (完整节点路径.includes('?') ? 完整节点路径.replace('?', '?enc=' + 加密方式 + '&') : (完整节点路径 + '?enc=' + 加密方式)).replace(/([=,])/g, '$1');
    if (!isSubConverterRequest) {
      完整节点路径 = 完整节点路径 + ';mux=0';
    }
    LINK = `${协议类型}://${btoa(加密方式 + ':00000000-0000-4000-8000-000000000000')}@${节点地址}:${节点端口}?plugin=v2ray-plugin;mode=websocket;host=example.com;path=${(config_JSON.随机路径 ? 随机路径(完整节点路径) : 完整节点路径) + (节点TLS ? ';tls' : '')}${ECHLINK参数}${TLS分片参数}#${encodeURIComponent(节点备注)}`;
  }

  const proxyList = await (async () => {
    if (作为优选订阅生成器) {
      const ips = 优选IP池.length > 0 ? 优选IP池 : (await 请求优选API(优选API, 优选端口));
      return ips.map(ip => {
        return `${协议类型}://${userID}@${ip}:${优选端口}?security=${优选TLS ? 'tls' : 'none'}&type=${传输协议}&host=${优选Host || ip}&fp=${优选FP}&sni=${优选SNI || ip}&path=${encodeURIComponent(优选路径)}&encryption=${优选加密}#${encodeURIComponent(优选订阅名 + '-' + ip)}`;
      });
    } else {
      return [LINK];
    }
  })();

  const v2rayList = proxyList.filter(Boolean).join('\n');

  if (url.searchParams.get('format') === 'clash') {
    const yaml = `mixed-port: 7890
allow-lan: true
log-level: info
proxies:
${proxyList.map(link => {
  const u = new URL(link.replace('vless://', 'https://').replace('trojan://', 'https://').replace('ss://', 'https://'));
  return `- name: ${decodeURIComponent(u.hash.slice(1))}
  type: ${link.startsWith('vless') ? 'vless' : link.startsWith('trojan') ? 'trojan' : 'ss'}
  server: ${u.hostname}
  port: ${u.port || 443}
  uuid: ${u.username}
  tls: true
  servername: ${u.searchParams.get('sni')}
  client-fingerprint: ${u.searchParams.get('fp')}
  ws-opts:
    path: ${u.searchParams.get('path')}
    headers:
      Host: ${u.searchParams.get('host')}`;
}).join('\n')}
proxy-groups:
  - name: Proxy
    type: select
    proxies: [${proxyList.map((_,i)=>`'Proxy-${i+1}'`).join(', ')}]
rules:
  - MATCH,Proxy`;

    return new Response(yaml, {
      headers: {
        'Content-Type': 'text/yaml; charset=utf-8',
        'Content-Disposition': 'attachment; filename=EdgeTunnel.yaml'
      }
    });
  }

  return new Response(btoa(v2rayList), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename=EdgeTunnel.txt'
    }
  });
}

async function 处理WS请求(request, yourUUID, url) {
  const WS套接字对 = new WebSocketPair();
  const [clientSock, serverSock] = Object.values(WS套接字对);
  serverSock.accept();
  serverSock.binaryType = 'arraybuffer';
  let remoteConnWrapper = { socket: null, connectingPromise: null };
  let 判断协议类型 = null;
  const earlyDataHeader = request.headers.get('sec-websocket-protocol') || '';
  const SS模式禁用EarlyData = !!url.searchParams.get('enc');
  let 已取消读取 = false;

  const readable = new ReadableStream({
    start(controller) {
      serverSock.addEventListener('message', async (event) => {
        try {
          if (已取消读取) return;
          const chunk = new Uint8Array(event.data);
          if (remoteConnWrapper.socket === null) {
            if (判断协议类型 === null) {
              if (url.searchParams.get('enc')) {
                判断协议类型 = 'ss';
              } else {
                const bytes = new Uint8Array(chunk);
                判断协议类型 = bytes.byteLength >= 58 && bytes[56] === 0x0d && bytes[57] === 0x0a ? 'trojan' : 'vless';
              }
              log(`[WS转发] 协议类型: ${判断协议类型} | 来自: ${url.host}`);
            }
            if (判断协议类型 === 'ss') {
              await 初始化SS加密(serverSock, chunk, url);
              return;
            }
            await 初始化远程连接(remoteConnWrapper, yourUUID, url);
            if (判断协议类型 === 'vless' && !SS模式禁用EarlyData && earlyDataHeader) {
              const 解码EarlyData = atob(earlyDataHeader);
              await 写入远端(remoteConnWrapper.socket, new TextEncoder().encode(解码EarlyData));
            }
          }
          if (await 写入远端(remoteConnWrapper.socket, chunk)) return;
        } catch (err) {
          log(`[WS错误] 客户端消息处理失败: ${err.message}`);
          controller.error(err);
          closeSocketQuietly(serverSock);
        }
      });

      serverSock.addEventListener('close', () => {
        log(`[WS关闭] 客户端断开连接`);
        controller.close();
        closeSocketQuietly(remoteConnWrapper.socket);
      });

      serverSock.addEventListener('error', (err) => {
        log(`[WS错误] 客户端连接错误: ${err.message}`);
        controller.error(err);
        closeSocketQuietly(remoteConnWrapper.socket);
      });
    },

    cancel() {
      已取消读取 = true;
      closeSocketQuietly(serverSock);
      closeSocketQuietly(remoteConnWrapper.socket);
    }
  });

  async function 写入远端(socket, data) {
    if (!socket || socket.readyState !== WebSocket.OPEN) return true;
    try {
      const sendResult = socket.send(data);
      if (sendResult && typeof sendResult.then === 'function') await sendResult;
    } catch (err) {
      log(`[WS错误] 写入远端失败: ${err.message}`);
      return true;
    }
    return false;
  }

  async function 初始化远程连接(wrapper, uuid, url) {
    if (wrapper.connectingPromise) return wrapper.connectingPromise;
    wrapper.connectingPromise = new Promise(async (resolve, reject) => {
      try {
        const 目标地址 = 优选IP池.length > 0 ? 优选IP池[Math.floor(Math.random() * 优选IP池.length)] : (await 请求优选API(优选API, 优选端口))[0];
        const 目标URL = new URL(`wss://${目标地址}:${优选端口}${url.pathname}${url.search}`);
        log(`[WS连接] 远程: ${目标URL.href}`);
        const remoteSocket = new WebSocket(目标URL.href, ['vless', 'trojan', 'ss']);
        remoteSocket.binaryType = 'arraybuffer';

        remoteSocket.addEventListener('open', () => {
          wrapper.socket = remoteSocket;
          wrapper.connectingPromise = null;
          resolve();
        });

        remoteSocket.addEventListener('message', async (event) => {
          if (serverSock.readyState === WebSocket.OPEN) serverSock.send(event.data);
        });

        remoteSocket.addEventListener('close', () => closeSocketQuietly(serverSock));
        remoteSocket.addEventListener('error', reject);
      } catch (err) {
        reject(err);
      }
    });
    return wrapper.connectingPromise;
  }

  (async () => {
    try {
      const reader = readable.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
      }
    } catch {}
  })();

  return new Response(null, { status: 101, webSocket: clientSock });
}

function closeSocketQuietly(socket) {
  if (!socket) return;
  try { socket.close(); } catch {}
}

async function 处理gRPC请求(request, userID) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const 远程连接 = await 创建gRPC连接(userID);

  (async () => {
    const r = request.body.getReader();
    while (true) {
      const { done, value } = await r.read();
      if (done) break;
      await 远程连接.write(value);
    }
    await 远程连接.close();
  })();

  (async () => {
    const r = 远程连接.readable.getReader();
    while (true) {
      const { done, value } = await r.read();
      if (done) break;
      await writer.write(value);
    }
    await writer.close();
  })();

  return new Response(readable, {
    headers: {
      'Content-Type': 'application/grpc',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

async function 创建gRPC连接(userID) {
  const 目标地址 = 优选IP池.length > 0 ? 优选IP池[Math.floor(Math.random() * 优选IP池.length)] : (await 请求优选API(优选API, 优选端口))[0];
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const s = new WebSocket(`wss://${目标地址}:${优选端口}/${userID}?mode=grpc`);
  s.binaryType = 'arraybuffer';

  s.addEventListener('message', e => writer.write(new Uint8Array(e.data)));
  s.addEventListener('close', () => writer.close());
  s.addEventListener('error', () => writer.close());

  return {
    readable,
    async write(d) { if (s.readyState === WebSocket.OPEN) s.send(d); },
    async close() { closeSocketQuietly(s); }
  };
}

async function 处理XHTTP请求(request, userID) {
  return new Response('Not Implemented', { status: 501 });
}

async function 处理管理请求(request, env, userID, url) {
  return new Response('Admin UI Coming Soon', {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

let kv = {
  async get(k) { return null; },
  async put(k, v, opt) {}
};

async function 读取config_JSON(env, hostname, userID, UA = "Mozilla/5.0", 重试 = 0) {
  const 默认配置 = {
    协议类型: 'vless',
    传输协议: 'ws',
    加密方式: 'none',
    节点地址: hostname,
    节点端口: '443',
    节点路径: '/',
    节点SNI: hostname,
    节点Host: hostname,
    节点TLS: true,
    节点FP: 'chrome',
    节点mux: false,
    节点ECH: false,
    节点ECHConfig: {},
    节点分片: 0,
    节点备注: 'EdgeTunnel',
    随机路径: false,
    跳过证书验证: false,
    优选订阅生成: {
      启用: false,
      SUBNAME: 'EdgeTunnel',
      API: [],
      PORT: '443',
      PROTOCOL: 'vless',
      ENCRYPTION: 'none',
      PATH: '/',
      SNI: '',
      HOST: '',
      TLS: true,
      FP: 'chrome',
      MUX: false,
      ECH: false,
      ECHConfig: {},
      FRAGMENT: 0
    }
  };

  try {
    if (env?.KV) kv = env.KV;
    const 缓存 = await kv.get(`config:${hostname}:${userID}`);
    if (缓存) return JSON.parse(缓存);
    const ecfg = env[`CONFIG_${userID.toUpperCase()}`];
    if (ecfg) {
      const c = JSON.parse(ecfg);
      await kv.put(`config:${hostname}:${userID}`, JSON.stringify(c), { expirationTtl: 3600 });
      return c;
    }
    return 默认配置;
  } catch {
    return 默认配置;
  }
}

async function 请求优选API(urls, 默认端口 = '443', 超时 = 3000) {
  const res = [];
  const tasks = urls.map(u => fetch(u, {
    method: 'GET',
    headers: { 'User-Agent': 'curl/7.68.0' },
    signal: AbortSignal.timeout(超时)
  }).then(r => r.text()).then(t => t.split('\n').map(l => l.trim()).filter(l => l)).catch(() => []));

  const all = await Promise.allSettled(tasks);
  for (const r of all) if (r.status === 'fulfilled') res.push(...r.value);
  return res.length ? res : [默认端口];
}

const SS支持加密配置 = {
  'aes-128-gcm': { method: 'aes-128-gcm', keyLen: 16, saltLen: 16, nonceLen: 12, tagLen: 16, maxChunk: 65535 },
  'aes-256-gcm': { method: 'aes-256-gcm', keyLen: 32, saltLen: 32, nonceLen: 12, tagLen: 16, maxChunk: 65535 },
  'chacha20-poly1305': { method: 'chacha20-poly1305', keyLen: 32, saltLen: 32, nonceLen: 12, tagLen: 16, maxChunk: 65535 }
};

let ss上下文 = null, ss初始化任务 = null;

async function 初始化SS加密(serverSock, chunk, url) {
  if (ss上下文) return ss上下文;
  if (!ss初始化任务) {
    ss初始化任务 = (async () => {
      const enc = (url.searchParams.get('enc') || '').toLowerCase();
      const cfg = SS支持加密配置[enc] || SS支持加密配置['aes-128-gcm'];
      const pwd = env.ADMIN || env.PASSWORD || env.UUID || '';
      const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pwd), { name: 'HKDF' }, false, ['deriveKey']);
      const salt = crypto.getRandomValues(new Uint8Array(cfg.saltLen));
      const ekey = await crypto.subtle.deriveKey(
        { name: 'HKDF', hash: 'SHA-256', salt, info: new TextEncoder().encode('ss-subkey') },
        key,
        { name: cfg.method === 'chacha20-poly1305' ? 'CHA-CHA20-POLY1305' : 'AES-GCM', length: cfg.keyLen * 8 },
        false,
        ['encrypt']
      );

      const 回包Socket = {
        get readyState() { return serverSock.readyState; },
        send(d) {},
        close() { closeSocketQuietly(serverSock); }
      };

      return { 回包Socket };
    })();
  }
  return await ss初始化任务;
}

function SS数据转Uint8Array(data) {
  if (data instanceof ArrayBuffer) return new Uint8Array(data);
  if (data instanceof Uint8Array) return data;
  if (typeof data === 'string') return new TextEncoder().encode(data);
  return new Uint8Array();
                          }
