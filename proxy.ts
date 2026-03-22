import acceptLanguage from 'accept-language'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { fallbackLng, supportedLngs, i18nCookieName } from './frontend/features/translation'


acceptLanguage.languages([...supportedLngs])

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico).*)'],
}

export function proxy(req: NextRequest) {
  let lng: string | undefined | null
  if (req.cookies.has(i18nCookieName)) lng = acceptLanguage.get(req.cookies.get(i18nCookieName)!.value)
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'))
  if (!lng) lng = fallbackLng

  if (
    !supportedLngs.some(loc => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(new URL(`/${lng}${req.nextUrl.pathname}`, req.url))
  }

  return NextResponse.next()
}
