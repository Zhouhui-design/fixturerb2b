/**
 * Lark Web Messenger Handler
 * 
 * This utility opens Lark web messenger directly.
 * No app download required - customers can chat immediately in browser.
 */

import { siteConfig } from '../config/site'

/**
 * Opens Lark web messenger directly
 * Best user experience - no download required
 */
export const openLarkChat = (): void => {
  // Direct link to Lark web messenger
  const webMessengerUrl = 'https://cjpj0mekv1vo.jp.larksuite.com/next/messenger'
  window.open(webMessengerUrl, '_blank')
}

/**
 * Alternative: Open Lark web version directly
 * Use this if you prefer web chat over app
 */
export const openLarkWeb = (): void => {
  // You can use your personal Lark profile link here
  // Get it from: Lark App > Profile > My QR Code & Link > My Link
  const webUrl = 'https://www.larksuite.com'
  window.open(webUrl, '_blank')
}

/**
 * Copy Lark ID to clipboard
 * Useful for manual adding
 */
export const copyLarkId = (): Promise<void> => {
  return navigator.clipboard.writeText(siteConfig.contact.lark)
}

/**
 * Opens DingTalk chat
 * For now, copies DingTalk ID to clipboard as DingTalk doesn't have simple AppLink
 */
export const openDingTalkChat = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(siteConfig.contact.dingtalk)
    alert('DingTalk ID copied to clipboard! Please add us in DingTalk.')
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

/**
 * Shows WeChat QR code or copies WeChat ID
 * For now, copies WeChat ID to clipboard
 */
export const openWeChatChat = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(siteConfig.contact.wechat)
    alert('WeChat ID copied to clipboard! Please add us in WeChat.')
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
