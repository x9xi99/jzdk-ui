import { serve } from "https://deno.land/std@0.220.1/http/server.ts";
import { serveDir } from "https://deno.land/std@0.220.1/http/file_server.ts";

serve(async (req) => {
  const url = new URL(req.url);
  
  // 处理 API 请求
  if (url.pathname.startsWith('/api/')) {
    const targetUrl = new URL(url.pathname + url.search, 'http://jzdk.333909.xyz');
    return await fetch(targetUrl, {
      method: req.method,
      headers: req.headers,
      body: req.body
    });
  }

  // 处理静态文件
  return await serveDir(req, {
    fsRoot: "dist",
    urlRoot: "",
    showDirListing: false,
    enableCors: true,
    quiet: true,
  });
}, { port: 8000 }); 
