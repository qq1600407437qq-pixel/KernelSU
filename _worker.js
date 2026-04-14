export default {
  async fetch(request, env, ctx) {
    const url = "https://raw.githubusercontent.com/cmliu/edgetunnel/refs/heads/main/_worker.js";
    const res = await fetch(url);
    const code = await res.text();
    const module = await import("data:text/javascript," + encodeURIComponent(code));
    return module.default.fetch(request, env, ctx);
  }
};
