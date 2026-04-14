export default {
  async fetch(request, env, ctx) {
    const resp = await fetch(
      "https://raw.githubusercontent.com/cmliu/edgetunnel/main/_worker.js"
    );
    const code = await resp.text();
    const f = new Function("exports", code);
    const exports = {};
    f(exports);
    return exports.default.fetch(request, env, ctx);
  }
};
