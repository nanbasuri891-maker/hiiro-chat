// 1. 定数・設定の定義（物理的な接続先）
const API_ENDPOINT = 'YOUR_API_ENDPOINT_HERE'; // ここに接続先URLを入力
const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// 2. メッセージ描画関数（UIUXの質を担保）
function addMessage(role, text) {
    const bubble = document.createElement('div');
    bubble.className = `message ${role}`; // CSSでスタイルを分岐
    bubble.textContent = text;
    chatLog.appendChild(bubble);
    
    // 常に最新のメッセージへスクロール
    chatLog.scrollTop = chatLog.scrollHeight;
}

// 3. 送信処理（実行速度とエラーハンドリング）
async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    // ユーザー側の表示
    addMessage('user', text);
    userInput.value = '';
    userInput.style.height = 'auto'; // 入力欄のリセット
    
    // AIの「考え中」状態を物理的に示す（リレーション維持）
    const loadingBubble = document.createElement('div');
    loadingBubble.className = 'message ai loading';
    loadingBubble.textContent = '...';
    chatLog.appendChild(loadingBubble);

    try {
        // 実際の通信
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        
        // 「考え中」を消して、回答を表示
        chatLog.removeChild(loadingBubble);
        addMessage('ai', data.reply || data.answer); // 接続先に合わせて調整

    } catch (error) {
        chatLog.removeChild(loadingBubble);
        addMessage('ai', '通信エラーが発生しました。時間を置いて話しかけてね。');
        console.error('Error:', error);
    }
}

// 4. イベントリスナー（操作性の最適化）
sendBtn.addEventListener('click', handleSend);

userInput.addEventListener('keydown', (e) => {
    // Shift+Enterは改行、Enterのみは送信
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
});

// 入力欄の自動伸長
userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = userInput.scrollHeight + 'px';
});