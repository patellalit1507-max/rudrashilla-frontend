export async function onRequestGet(context) {
  const response = await context.env.ASSETS.fetch(context.request)
  if (response.status === 404) {
    return context.env.ASSETS.fetch(new URL('/index.html', context.request.url))
  }
  return response
}
