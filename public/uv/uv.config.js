self.__uv$config = {
  prefix: "/uv/service/",
  // We leave this as a placeholder because the Wisp transport will take over
  bare: "https://tomp.app/", 
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "/uv/uv.handler.js",
  client: "https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet@3.2.7/dist/uv.client.js",
  bundle: "/uv/uv.bundle.js",
  config: "/uv/uv.config.js",
  sw: "/uv/uv.sw.js",
};