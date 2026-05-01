import { useState } from 'react'
import { X, Send, Paperclip, Bold, Italic, Link } from 'lucide-react'
import { Button } from '../components/ui/button'

interface EmailComposeProps {
  to: string
  subject: string
  onClose: () => void
  onSent: () => void
}

const EmailCompose = ({ to, subject, onClose, onSent }: EmailComposeProps) => {
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = () => {
    // 方案B：通过 mailto 协议在页面内触发
    const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
    
    // 标记为已发送
    setTimeout(() => {
      onSent()
      onClose()
    }, 500)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">撰写邮件</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Email Fields */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">收件人</label>
            <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
              {to}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">主题</label>
            <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
              {subject}
            </div>
          </div>

          {/* Body */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">正文</label>
            
            {/* Toolbar */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 border border-gray-200 border-b-0 rounded-t-lg">
              <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Bold">
                <Bold className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Italic">
                <Italic className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Link">
                <Link className="w-4 h-4 text-gray-600" />
              </button>
              <div className="flex-1" />
              <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Attach">
                <Paperclip className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Text Area */}
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full h-64 px-4 py-3 border border-gray-200 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-wood focus:border-transparent resize-none text-gray-900"
              placeholder="在此输入邮件内容..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500">
            点击发送后，将调用系统邮件客户端
          </p>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={sending}
            >
              取消
            </Button>
            <Button
              variant="accent"
              onClick={handleSend}
              disabled={sending || !body.trim()}
              className="px-6"
            >
              {sending ? (
                <span className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>发送中...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>发送邮件</span>
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailCompose
