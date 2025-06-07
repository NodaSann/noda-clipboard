// 生成二维码（qrcodejs用法）
window.addEventListener('DOMContentLoaded', function() {
  var qrDiv = document.getElementById('qrcode-canvas');
  if (window.QRCode && qrDiv) {
    qrDiv.innerHTML = '';
    new QRCode(qrDiv, {
      text: window.shareUrl || '',
      width: 120,
      height: 120
    });
  }
});
const copyButtons = document.querySelectorAll('.copymsg');
const clipboard = new ClipboardJS(copyButtons);
clipboard.on('success', function(e) {
  const msg = document.getElementById('Copy_msg');
  msg.classList.remove('hidden');
  msg.style.opacity = '1';
  setTimeout(() => {
    msg.style.opacity = '0';
    setTimeout(() => msg.classList.add('hidden'), 500);
  }, 1200);
  e.clearSelection();
});
// 分享链接复制
const copyShareBtn = document.getElementById('copy-share-link');
if (copyShareBtn) {
  copyShareBtn.onclick = function() {
    const input = document.getElementById('share-link');
    input.select();
    document.execCommand('copy');
    this.textContent = '已复制';
    setTimeout(() => { this.textContent = '复制链接'; }, 1200);
  };
}
// AJAX异步加载消息
async function loadMessages() {
  const boardId = window.boardId;
  const res = await fetch(`/clipboard/${boardId}/api/messages`);
  if (!res.ok) return;
  const data = await res.json();
  const list = document.getElementById('messages-list');
  // 先移除所有消息article
  list.querySelectorAll('article').forEach(el => el.remove());
  const tip = document.getElementById('no-message-tip');
  if (data.length === 0) {
    tip.style.display = '';
  } else {
    tip.style.display = 'none';
    data.forEach(chunk => {
      const article = document.createElement('article');
      article.className = "bg-gray-50 rounded-md shadow p-4 relative group";
      article.innerHTML =
        '<div class="text-gray-800 whitespace-pre-line break-words mb-2">' + chunk.message + '</div>' +
        '<footer class="flex justify-between items-center text-xs text-gray-400">' +
        '<span>' + chunk.date + '</span>' +
        '<div class="flex gap-2 items-center">' +
        '<form action="/clipboard/' + boardId + '/del/' + chunk._id + '" method="get" class="inline">' +
        '<button type="submit" class="text-red-500 hover:underline">删除</button>' +
        '</form>' +
        '<button class="copymsg text-blue-500 hover:underline" data-clipboard-text="' + chunk.message.replace(/\"/g, '&quot;') + '">复制</button>' +
        '<span class="text-gray-300 text-xs ml-1">复制到剪贴板</span>' +
        '</div>' +
        '</footer>';
      list.appendChild(article);
    });
  }
  // 重新绑定复制功能
  const copyButtons = document.querySelectorAll('.copymsg');
  const clipboard = new ClipboardJS(copyButtons);
  clipboard.on('success', function(e) {
    const msg = document.getElementById('Copy_msg');
    msg.classList.remove('hidden');
    msg.style.opacity = '1';
    setTimeout(() => {
      msg.style.opacity = '0';
      setTimeout(() => msg.classList.add('hidden'), 500);
    }, 1200);
    e.clearSelection();
  });
}
// 定时自动刷新
setInterval(loadMessages, 5000);
// 手动刷新
const refreshBtn = document.getElementById('refresh-btn');
if (refreshBtn) refreshBtn.onclick = loadMessages;
// 发送消息后自动刷新（表单提交后）
const form = document.querySelector('form[action$="/message"]');
if (form) {
  form.addEventListener('submit', function(e) {
    setTimeout(loadMessages, 1000);
  });
}
// 页面初始时根据消息数量显示/隐藏无消息提示
window.addEventListener('DOMContentLoaded', function() {
  const list = document.getElementById('messages-list');
  const tip = document.getElementById('no-message-tip');
  const hasMsg = list.querySelector('article');
  tip.style.display = hasMsg ? 'none' : '';
});
// 快捷键发送（Ctrl+Enter 或 Cmd+Enter）
document.addEventListener('keydown', function(e) {
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  if ((isMac ? e.metaKey : e.ctrlKey) && e.key === 'Enter') {
    const btn = document.getElementById('submitBtn');
    if (btn) btn.click();
    e.preventDefault();
  }
});