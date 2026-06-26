// ========================================
// 小智编程游乐场 - 主要功能代码
// ========================================

// 全局变量
var pendingTopicId = null;
var pendingDay = null;
var allProgress = {};
var haveStickers = [];

// ============ 数据加载 ============

function loadProgress() {
    var saved = localStorage.getItem('xiaozhi_progress');
    if (saved) { allProgress = JSON.parse(saved); }
}

function saveProgress() {
    localStorage.setItem('xiaozhi_progress', JSON.stringify(allProgress));
}

function loadStickers() {
    var saved = localStorage.getItem('xiaozhi_stickers');
    if (saved) { haveStickers = JSON.parse(saved); }
}

function saveStickers() {
    localStorage.setItem('xiaozhi_stickers', JSON.stringify(haveStickers));
}

function isDayDone(topicId, day) {
    if (!allProgress[topicId]) return false;
    return allProgress[topicId][day] === true;
}

function isTopicAllDone(topicId) {
    if (!allProgress[topicId]) return false;
    var count = 0;
    for (var day = 1; day <= 15; day++) {
        if (allProgress[topicId][day] === true) { count++; }
    }
    return count === 15;
}

function markDayDone(topicId, day) {
    if (!allProgress[topicId]) { allProgress[topicId] = {}; }
    if (!allProgress[topicId][day]) {
        allProgress[topicId][day] = true;
        saveProgress();
        if (isTopicAllDone(topicId)) {
            for (var i = 0; i < allStickers.length; i++) {
                if (allStickers[i].needTopic === topicId) {
                    if (haveStickers.indexOf(allStickers[i].id) === -1) {
                        haveStickers.push(allStickers[i].id);
                        saveStickers();
                        updateRewardDisplay();
                        createParticles();
                        addChatMessage('🎉 完成了「' + getTopicName(topicId) + '」！获得' + allStickers[i].emoji + '贴纸！💕', 'bot');
                    }
                }
            }
        }
        updateRewardDisplay();
        return true;
    }
    return false;
}

function updateRewardDisplay() {
    var container = document.getElementById('rewardContainer');
    var html = '';
    for (var i = 0; i < allStickers.length; i++) {
        var s = allStickers[i];
        var isHave = haveStickers.indexOf(s.id) !== -1;
        var cls = isHave ? 'reward-sticker' : 'reward-sticker locked';
        var rot = Math.random() * 4 - 2;
        html += '<div class="' + cls + '" style="--rot:' + rot + 'deg" title="' + s.name + '">' + s.emoji + '</div>';
    }
    container.innerHTML = html;
}

// 初始化
loadProgress();
loadStickers();
updateRewardDisplay();

// ============ 聊天功能 ============

function sendChatMessage() {
    var input = document.getElementById('chatInput');
    var msg = input.value.trim();
    if (!msg) return;
    addChatMessage(msg, 'user');
    input.value = '';
    setTimeout(function() {
        var reply = '';
        if (msg.indexOf('变量') !== -1) { reply = '🐱 变量就像小盒子📦 起个名字放东西，想用就叫它～'; }
        else if (msg.indexOf('循环') !== -1) { reply = '🐱 循环就像转圈圈🔄 让电脑自动重复做一件事～'; }
        else if (msg.indexOf('你好') !== -1) { reply = '🐱 你好呀😺 小智超开心～'; }
        else if (msg.indexOf('谢谢') !== -1) { reply = '🐱 不客气！有问题随时找我～🎉'; }
        else { reply = '🐱 嗯～ 试试点「找小智答疑」按钮，那里可以用AI帮你哦～💕'; }
        addChatMessage(reply, 'bot');
        createParticles();
    }, 500);
}

function addChatMessage(content, sender) {
    var container = document.getElementById('chatMessages');
    var div = document.createElement('div');
    div.className = 'chat-message ' + sender;
    if (sender === 'bot') {
        div.innerHTML = '<div class="chat-avatar">🐱</div><div class="chat-bubble bot-bubble">' + content + '<div style="font-size:9px;margin-top:3px;">刚刚</div></div>';
    } else {
        div.innerHTML = '<div class="chat-avatar">👤</div><div class="chat-bubble user-bubble">' + content + '<div style="font-size:9px;margin-top:3px;">刚刚</div></div>';
    }
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function catClick() {
    var cat = document.getElementById('walkingCat');
    if (cat) {
        cat.style.transform = 'scale(1.3)';
        setTimeout(function() { cat.style.transform = 'scale(1)'; }, 200);
    }
    createParticles();
    addChatMessage('🐱 喵～ 小智在这里陪你！有问题随时找我～💕', 'bot');
}

// ============ 特效 ============

function createParticles() {
    var emojis = ['⭐', '🐾', '🌟', '✨', '🐱', '🌈', '🍭', '🎉', '💕'];
    for (var i = 0; i < 12; i++) {
        var p = document.createElement('div');
        p.className = 'particle';
        p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        p.style.left = (window.innerWidth / 2 + (Math.random() - 0.5) * 180) + 'px';
        p.style.top = (window.innerHeight / 2 + (Math.random() - 0.5) * 130) + 'px';
        p.style.setProperty('--tx', (Math.random() - 0.5) * 150 + 'px');
        p.style.setProperty('--ty', (Math.random() - 0.5) * 100 - 80 + 'px');
        document.body.appendChild(p);
        setTimeout(function() { p.remove(); }, 1000);
    }
}

// ============ 弹窗开关 ============

function openAIModal() { document.getElementById('aiModal').style.display = 'block'; }
function closeAIModal() { document.getElementById('aiModal').style.display = 'none'; }
function openDoctorModal() { document.getElementById('doctorModal').style.display = 'block'; }
function closeDoctorModal() { document.getElementById('doctorModal').style.display = 'none'; }
function openLabModal() {
    document.getElementById('labModal').style.display = 'block';
    document.getElementById('errorGuide').style.display = 'none';
    if (!pendingTopicId) {
        document.getElementById('exampleCodeArea').style.display = 'none';
        document.getElementById('labTaskInfo').innerHTML = '✨ 自由练习模式～ 写任何代码都可以！';
    }
}
function closeLabModal() {
    document.getElementById('labModal').style.display = 'none';
    document.getElementById('exampleCodeArea').style.display = 'none';
    pendingTopicId = null;
    pendingDay = null;
}

// ============ 闯关系统 ============

function openPlanModal() {
    var container = document.getElementById('planTopicList');
    var html = '';
    for (var i = 0; i < allTopics.length; i++) {
        var t = allTopics[i];
        var done = isTopicAllDone(t.id) ? ' 🏆' : '';
        html += '<div class="plan-item" onclick="openPlanDays(\'' + t.id + '\')">';
        html += '<div class="plan-header" style="background:' + t.color + '">';
        html += '<span>' + t.icon + ' ' + t.name + done + '</span><span>15关 →</span>';
        html += '</div></div>';
    }
    container.innerHTML = html;
    document.getElementById('planModal').style.display = 'block';
    document.getElementById('planDaysList').innerHTML = '';
}

function openPlanDays(topicId) {
    var topic = null;
    for (var i = 0; i < allTopics.length; i++) {
        if (allTopics[i].id === topicId) { topic = allTopics[i]; break; }
    }
    var html = '<div><button onclick="backToTopics()" style="background:#FFE0B5;border:none;padding:8px 18px;border-radius:25px;cursor:pointer;">← 返回</button></div>';
    html += '<h3 style="margin:12px 0;">' + topic.icon + ' ' + topic.name + ' - 15天闯关</h3>';
    for (var day = 1; day <= 15; day++) {
        var star = isDayDone(topicId, day) ? '★' : '☆';
        html += '<div class="plan-item">';
        html += '<div class="plan-header" onclick="toggleDayDetail(' + day + ')" style="background:' + topic.color + ';cursor:pointer;">';
        html += '<span>📅 第' + day + '天</span><span>' + star + ' ▼</span></div>';
        html += '<div class="plan-detail" id="dayDetail-' + day + '">';
        html += '<div class="concept-box"><strong>📖 今天学什么</strong><br>学习' + topic.name + '的知识！</div>';
        html += '<div class="practice-box"><strong>✏️ 练习任务</strong><br>' + getDayContent(topicId, day).task + '<br><br>';
        html += '<span style="color:#FF6B6B;cursor:pointer;text-decoration:underline;" onclick="startPractice(\'' + topicId + '\',' + day + ')">👉 去实验室完成</span></div>';
        html += '</div></div>';
    }
    document.getElementById('planDaysList').innerHTML = html;
    document.getElementById('planTopicList').style.display = 'none';
}

function backToTopics() {
    document.getElementById('planTopicList').style.display = 'block';
    document.getElementById('planDaysList').innerHTML = '';
}

function toggleDayDetail(day) {
    var d = document.getElementById('dayDetail-' + day);
    d.classList.contains('show') ? d.classList.remove('show') : d.classList.add('show');
}

function closePlanModal() { document.getElementById('planModal').style.display = 'none'; backToTopics(); }

function startPractice(topicId, day) {
    pendingTopicId = topicId;
    pendingDay = day;
    closePlanModal();
    openLabModal();
    var content = getDayContent(topicId, day);
    document.getElementById('labTaskInfo').innerHTML = '🎯 <strong>' + getTopicName(topicId) + ' 第' + day + '天</strong><br>' + content.task + '<br>✨ <strong>自己动手敲代码才能点亮星星⭐</strong>';
    document.getElementById('exampleCodeArea').style.display = 'block';
    document.getElementById('exampleCodeContent').innerHTML = content.example.replace(/\n/g, '<br>');
    document.getElementById('labEditor').value = '';
    document.getElementById('errorGuide').style.display = 'none';
    document.getElementById('labOutput').innerHTML = '✨ 照着示例自己敲，然后点运行～';
    addChatMessage('🐱 加油！' + getTopicName(topicId) + '第' + day + '天，小智相信你可以的！💕', 'bot');
}

// ============ 代码实验室 ============

function runAndCheckCode() {
    var code = document.getElementById('labEditor').value;
    var outputDiv = document.getElementById('labOutput');
    if (!code.trim()) { outputDiv.innerHTML = '❌ 还没有代码呢～照着示例敲一遍吧！'; return; }
    outputDiv.innerHTML = '✨ 小智正在检查...';
    var oldLog = console.log;
    var logs = [];
    console.log = function() {
        var args = [];
        for (var i = 0; i < arguments.length; i++) { args.push(arguments[i]); }
        logs.push(args.join(' '));
        oldLog.apply(console, arguments);
    };
    try {
        eval(code);
        console.log = oldLog;
        document.getElementById('errorGuide').style.display = 'none';
        if (logs.length > 0) {
            var result = '';
            for (var i = 0; i < logs.length; i++) { result += '🐱 ' + logs[i] + '<br>'; }
            outputDiv.innerHTML = result;
        } else { outputDiv.innerHTML = '✅ 运行成功！🎉'; }
        createParticles();
        if (pendingTopicId && pendingDay) {
            if (!isDayDone(pendingTopicId, pendingDay)) {
                markDayDone(pendingTopicId, pendingDay);
                outputDiv.innerHTML += '<br><br>✨ 第' + pendingDay + '天星星已点亮！⭐';
                addChatMessage('🎉 完成了' + getTopicName(pendingTopicId) + '第' + pendingDay + '天！继续加油！💕', 'bot');
                document.getElementById('exampleCodeArea').style.display = 'none';
                pendingTopicId = null;
                pendingDay = null;
            } else { outputDiv.innerHTML += '<br><br>⭐ 这关已完成过了！'; }
        }
    } catch(e) {
        console.log = oldLog;
        outputDiv.innerHTML = '❌ 报错：' + e.message + '<br><br>💡 检查：<br>• 是不是用了中文符号？<br>• 大小写对不对？<br>• 分号忘了吗？';
        document.getElementById('errorGuide').style.display = 'block';
    }
}

function clearLab() {
    document.getElementById('labEditor').value = '';
    document.getElementById('labOutput').innerHTML = '✨ 清空啦～照着示例自己敲吧！';
    document.getElementById('errorGuide').style.display = 'none';
}

function goToBugDoctor() { closeLabModal(); openDoctorModal(); }

// ============ AI功能（调用Netlify代理） ============

// ⭐ 核心改动：不再直接调阿里云，改成调自己的Netlify函数
async function askAI() {
    var question = document.getElementById('aiQuestion').value;
    var resultDiv = document.getElementById('aiResult');
    
    if (!question) { alert('输入问题吧～'); return; }
    
    resultDiv.innerHTML = '✨ 小智正在思考...🐱';
    
    try {
        // 调用Netlify函数（API Key藏在Netlify环境变量里）
        var response = await fetch('/.netlify/functions/ask-ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: question })
        });
        
        var data = await response.json();
        
        if (data.success) {
            resultDiv.innerHTML = '🐱 小智回答：<br>' + data.answer.replace(/\n/g, '<br>');
        } else {
            throw new Error(data.error || '未知错误');
        }
        
        createParticles();
        addChatMessage('🐱 回答完啦～还有问题吗？💕', 'bot');
    } catch(e) {
        resultDiv.innerHTML = '❌ 出错啦：' + e.message + '<br><br>💡 可以刷新页面后再试试～';
    }
}

// Bug诊断 - 同样调用Netlify代理
async function findBug() {
    var code = document.getElementById('bugCode').value;
    var error = document.getElementById('bugError').value;
    var resultDiv = document.getElementById('doctorResult');
    
    if (!code) { alert('请把代码贴进来～'); return; }
    
    resultDiv.innerHTML = '🔍 小智正在仔细检查...';
    
    var question = '代码：\n```\n' + code + '\n```';
    if (error) { question += '\n错误信息：' + error; }
    question += '\n请用小朋友能听懂的话指出问题并给出修改建议。';
    
    try {
        // 调用Netlify函数
        var response = await fetch('/.netlify/functions/fix-bug', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: question })
        });
        
        var data = await response.json();
        
        if (data.success) {
            resultDiv.innerHTML = '🔧 小智诊断：<br>' + data.answer.replace(/\n/g, '<br>');
        } else {
            throw new Error(data.error || '未知错误');
        }
        
        createParticles();
        addChatMessage('🐱 找到问题啦！按上面改改就能好～💪💕', 'bot');
    } catch(e) {
        resultDiv.innerHTML = '❌ 出错啦：' + e.message;
    }
}

// ============ 按钮动画 ============

document.addEventListener('DOMContentLoaded', function() {
    var btns = document.querySelectorAll('.hand-btn, .chat-send');
    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener('click', function() {
            this.classList.add('jelly');
            var that = this;
            setTimeout(function() { that.classList.remove('jelly'); }, 300);
        });
    }
});

// GSAP动画
gsap.to('.float-item', { duration: 3, y: -10, repeat: -1, yoyo: true, stagger: 0.15, ease: 'sine.inOut' });
gsap.from('.fun-card', { duration: 0.5, scale: 0.9, rotate: -3, opacity: 0, stagger: 0.08, ease: 'back.out' });

console.log('🎪 小智编程游乐场加载完成！');