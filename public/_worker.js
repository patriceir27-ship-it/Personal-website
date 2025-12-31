// Add this if you want to use Cloudflare Workers for form handling
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  return fetch(request)
}
