type AssetBinding = {
  fetch: (request: Request) => Promise<Response>;
};

export default {
  async fetch(request: Request, env: { ASSETS: AssetBinding }) {
    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404) {
      return response;
    }

    const url = new URL(request.url);
    url.pathname = '/index.html';
    return env.ASSETS.fetch(new Request(url, request));
  },
};
