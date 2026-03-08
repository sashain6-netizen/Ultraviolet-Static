self.__uv$config = {
  prefix: "/uv/service/",
  bare: "/bare/", // This is now a dummy path; Bare-Mux will intercept it
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "/uv/uv.handler.js",
  client: "/uv/uv.client.js", // Try to use your local version
  bundle: "/uv/uv.bundle.js",
  config: "/uv/uv.config.js",
  sw: "/uv/uv.sw.js",
};