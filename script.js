// عناصر واجهة المساعد الذكي
const assistant = document.getElementById('ai-assistant');
const floatingBtn = document.getElementById('ai-floating-btn');
const closeBtn = document.getElementById('close-btn');
const minimizeBtn = document.getElementById('minimize-btn');
const sendBtn = document.getElementById('send-btn');
const userMessageInput = document.getElementById('user-message');
const messagesContainer = document.getElementById('assistant-messages');

// رابط الخادم الوسيط - تأكد من تحديثه برابطك
const BACKEND_URL = "https://promptica-backend.vercel.app/generate";

// فتح وإغلاق المساعد
floatingBtn.addEventListener('click', () => {
  assistant.classList.add('visible');
});

closeBtn.addEventListener('click', () => {
  assistant.classList.remove('visible');
});

minimizeBtn.addEventListener('click', () => {
  assistant.classList.remove('visible');
});

// إرسال الرسالة
sendBtn.addEventListener('click', sendMessage);
userMessageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// التحكم في ارتفاع حقل الإدخال
userMessageInput.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = (this.scrollHeight) + 'px';
});

async function sendMessage() {
  const message = userMessageInput.value.trim();
  if (!message) return;
  
  // إضافة رسالة المستخدم
  addMessage(message, 'user');
  userMessageInput.value = '';
  userMessageInput.style.height = 'auto';
  
  try {
    // إظهار مؤشر تحميل
    const loadingMessage = addMessage('...جارٍ التفكير', 'bot');
    
    // إرسال الطلب إلى الخادم الوسيط
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ prompt: message })
    });
    
    // تحقق من نجاح الطلب
    if (!response.ok) {
      throw new Error(`خطأ في الخادم: ${response.status}`);
    }
    
    const data = await response.json();
    
    // التحقق من هيكل الرد واستخراج النص
    let botReply = extractGeminiResponse(data);
    
    // إزالة مؤشر التحمل وإضافة الرد
    messagesContainer.removeChild(loadingMessage);
    addMessage(botReply, 'bot');
    
  } catch (error) {
    // إزالة مؤشر التحمل وإضافة رسالة الخطأ
    const errorMessages = document.querySelectorAll('.message.bot');
    const lastBotMessage = errorMessages[errorMessages.length - 1];
    
    if (lastBotMessage && lastBotMessage.querySelector('p').textContent === '...جارٍ التفكير') {
      messagesContainer.removeChild(lastBotMessage);
    }
    
    addMessage(`حدث خطأ: ${error.message}`, 'bot');
    console.error('Error:', error);
  }
}

// دالة مساعدة لاستخراج الرد من هيكل Gemini
function extractGeminiResponse(data) {
  try {
    // الهيكل الأساسي المتوقع
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    
    // هيكل بديل عند وجود أخطاء
    if (data.error?.message) {
      return `خطأ في الخادم: ${data.error.message}`;
    }
    
    // إذا كان هناك رد مباشر (لأغراض التشخيص)
    if (data.message) {
      return data.message;
    }
    
    // إذا لم يتم التعرف على الهيكل
    return "هيكل الرد غير متوقع من الخادم";
    
  } catch (e) {
    return "خطأ في معالجة الرد من الخادم";
  }
}
function addMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender);
  
  const avatar = document.createElement('div');
  avatar.classList.add('avatar');
  avatar.textContent = sender === 'bot' ? 'G' : 'Y';
  
  const content = document.createElement('div');
  content.classList.add('content');
  
  const messageText = document.createElement('p');
  messageText.textContent = text;
  
  const timestamp = document.createElement('div');
  timestamp.classList.add('timestamp');
  timestamp.textContent = getCurrentTime();
  
  content.appendChild(messageText);
  content.appendChild(timestamp);
  
  messageDiv.appendChild(avatar);
  messageDiv.appendChild(content);
  
  messagesContainer.appendChild(messageDiv);
  
  // التمرير إلى أحدث رسالة
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  return messageDiv;
}

function getCurrentTime() {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
}

// إبقاء الخادم نشطًا لتجنب السبات
// وظيفة للحفاظ على نشاط الخادم
function keepServerAlive() {
  fetch(BACKEND_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({prompt: "حافظ على نشاطي"})
  })
  .then(response => console.log("تم إبقاء الخادم نشطًا"))
  .catch(error => console.error("خطأ في إبقاء الخادم نشطًا:", error));
}

// تشغيل كل 5 دقائق
setInterval(keepServerAlive, 5 * 60 * 1000);

// تشغيل فور تحميل الصفحة
window.addEventListener('load', keepServerAlive);