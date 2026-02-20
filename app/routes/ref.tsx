import { redirect } from 'react-router'
import type { Route } from './+types/ref'
import { supabase } from '../lib/supabase'

export async function loader({ request, params }: Route.LoaderArgs) {
  const { code } = params
  if (!code) throw new Response('Not Found', { status: 404 })

  // 1. Fetch link & product info
  const { data: link, error } = await supabase
    .from('affiliate_links')
    .select('id, product:products(url)')
    .eq('unique_code', code)
    .single()

  if (error || !link || !link.product) {
    throw new Response('Invalid affiliate link', { status: 404 })
  }

  // 2. Log the click
  const ip =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const referer = request.headers.get('referer') || 'unknown'

  await supabase.from('affiliate_clicks').insert([
    {
      affiliate_link_id: link.id,
      ip_address: ip,
      user_agent: userAgent,
      referer: referer,
    },
  ])

  // 3. Construct the product URL and append the ref code
  // Handles cross-domain tracking by appending ?ref=UUID
  // Supabase types might infer relation as array or single object
  const productData = Array.isArray(link.product)
    ? link.product[0]
    : link.product
  const productUrlStr =
    typeof productData?.url === 'string' ? productData.url : ''
  const productUrl = new URL(
    productUrlStr.startsWith('http')
      ? productUrlStr
      : `https://${productUrlStr}`,
  )
  productUrl.searchParams.set('ref', link.id)

  // 4. Set Cookie and Redirect instantly
  const headers = new Headers()
  headers.append(
    'Set-Cookie',
    `bc_aff_id=${link.id}; Path=/; Max-Age=${60 * 60 * 24 * 30}; HttpOnly; Secure; SameSite=Lax`,
  )

  return redirect(productUrl.toString(), {
    headers,
  })
}
