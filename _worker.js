const Version = '2026-04-04 18:26:17';
const Pages静态页面 = 'https://edt-pages.github.io';

export default {
async fetch(request, env, ctx) {
const url = new URL(修正请求URL(request.url));
const UA = request.headers.get('User-Agent') || 'null';
const upgradeHeader = (request.headers.get('Upgrade') || '').toLowerCase(), contentType = (request.headers.get('content-type') || '').toLowerCase();
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
const 完整节点路径 = 作为优选订阅生成器 ? '/' : (config_JSON.随机路径 ? 随机路径(节点路径) : 节点路径);
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

if (isLoonOrSurge) 完整节点路径 = 完整节点路径.replace(/,/g, '%2C');
if (协议类型 === 'ss' && !作为优选订阅生成器) {
完整节点路径 = (完整节点路径.includes('?') ? 完整节点路径.replace('?', '?enc=' + 加密方式 + '&') : (完整节点路径 + '?enc=' + 加密方式)).replace(/([=,])/g, '$1');
if (!isSubConverterRequest) 完整节点路径 = 完整节点路径 + ';mux=0';
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
      headers: { 'Content-Type': 'text/yaml; charset=utf-8', 'Content-Disposition': 'attachment; filename=EdgeTunnel.yaml' }
    });
  }

  return new Response(btoa(v2rayList), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Content-Disposition': 'attachment; filename=EdgeTunnel.txt' }
  });
}
