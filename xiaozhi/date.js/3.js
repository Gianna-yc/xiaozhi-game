// ========================================
// 小智编程游乐场 - 数据配置文件
// ========================================

// 10个学习主题
var allTopics = [
    { id: 'python', name: '🐍 Python', icon: '🐍', color: '#6BCB77' },
    { id: 'web', name: '🌐 网页制作', icon: '🌐', color: '#FF6B6B' },
    { id: 'game', name: '🎮 游戏开发', icon: '🎮', color: '#9B59B6' },
    { id: 'c_lang', name: '🔵 C语言', icon: '🔵', color: '#4A90D9' },
    { id: 'java', name: '☕ Java', icon: '☕', color: '#E67E22' },
    { id: 'scratch', name: '🐱 Scratch', icon: '🐱', color: '#FFB347' },
    { id: 'ai', name: '🤖 AI入门', icon: '🤖', color: '#FF6B6B' },
    { id: 'algorithm', name: '📊 算法入门', icon: '📊', color: '#4A90D9' },
    { id: 'app', name: '📱 App开发', icon: '📱', color: '#6BCB77' },
    { id: 'robot', name: '🤖 机器人', icon: '🤖', color: '#FFB347' }
];

// 10种奖励贴纸
var allStickers = [
    { id: 's1', name: 'Python小蛇', emoji: '🐍', needTopic: 'python' },
    { id: 's2', name: '网页蜘蛛', emoji: '🕸️', needTopic: 'web' },
    { id: 's3', name: '游戏手柄', emoji: '🎮', needTopic: 'game' },
    { id: 's4', name: 'C语言狮子', emoji: '🦁', needTopic: 'c_lang' },
    { id: 's5', name: 'Java咖啡', emoji: '☕', needTopic: 'java' },
    { id: 's6', name: 'Scratch猫', emoji: '🐱', needTopic: 'scratch' },
    { id: 's7', name: 'AI机器人', emoji: '🤖', needTopic: 'ai' },
    { id: 's8', name: '算法大脑', emoji: '🧠', needTopic: 'algorithm' },
    { id: 's9', name: 'App手机', emoji: '📱', needTopic: 'app' },
    { id: 's10', name: '机器人齿轮', emoji: '⚙️', needTopic: 'robot' }
];

// 每个主题每天的练习内容
function getDayContent(topicId, dayNum) {
    var contents = {
        python: {
            task: '用print函数打印"Hello, 我是编程小英雄！"和你的名字',
            example: '# Python 第' + dayNum + '天练习\nprint("Hello, 我是编程小英雄！")\nname = "小明"\nprint("我的名字是：" + name)'
        },
        web: {
            task: '创建一个网页，包含一个大标题和一个段落',
            example: '// 网页制作 第' + dayNum + '天练习\nvar title = document.createElement("h1");\ntitle.textContent = "我的第一个网页";\ndocument.body.appendChild(title);\nconsole.log("网页创建成功！");'
        },
        game: {
            task: '创建一个400x300的画布，在里面画一个红色方块',
            example: '// 游戏开发 第' + dayNum + '天练习\nvar canvas = document.createElement("canvas");\ncanvas.width = 400;\ncanvas.height = 300;\ndocument.body.appendChild(canvas);\nvar ctx = canvas.getContext("2d");\nctx.fillStyle = "#87CEEB";\nctx.fillRect(0, 0, canvas.width, canvas.height);\nctx.fillStyle = "#FF4444";\nctx.fillRect(100, 100, 30, 30);\nconsole.log("红色方块出现了！");'
        },
        c_lang: {
            task: '打印"Hello, C语言!"并创建一个年龄变量打印出来',
            example: '// C语言练习 第' + dayNum + '天\nconsole.log("Hello, C语言!");\nvar age = 10;\nconsole.log("我今年" + age + "岁");'
        },
        java: {
            task: '打印"Hello Java!"并创建一个名字变量打印出来',
            example: '// Java练习 第' + dayNum + '天\nconsole.log("Hello Java!");\nvar name = "小明";\nconsole.log("我叫" + name);'
        },
        scratch: {
            task: '打开Scratch官网，拖拽「当绿旗被点击」积木试试！',
            example: '// Scratch提示\nconsole.log("Scratch在线编辑器：https://scratch.mit.edu/projects/editor/");\nconsole.log("拖拽积木开始编程吧！");'
        },
        ai: {
            task: '了解AI的应用场景，在代码中打印出3个AI的例子',
            example: '// AI入门 第' + dayNum + '天\nconsole.log("🤖 AI就是让电脑学习！");\nconsole.log("例子1：人脸识别");\nconsole.log("例子2：语音助手");\nconsole.log("例子3：智能推荐");'
        },
        algorithm: {
            task: '找出数组 [5, 2, 8, 1, 9] 中的最大值并打印',
            example: '// 算法练习 - 找最大值\nvar numbers = [5, 2, 8, 1, 9];\nvar max = numbers[0];\nfor(var i = 1; i < numbers.length; i++) {\n    if(numbers[i] > max) {\n        max = numbers[i];\n    }\n}\nconsole.log("最大的数是：" + max);'
        },
        app: {
            task: '了解手机App开发的基本概念',
            example: '// App开发概念\nconsole.log("📱 手机App开发真有趣！");\nconsole.log("Android用Java/Kotlin");\nconsole.log("iOS用Swift");'
        },
        robot: {
            task: '了解机器人编程的基本概念',
            example: '// 机器人编程\nconsole.log("🤖 机器人可以前进！");\nconsole.log("机器人可以后退！");\nconsole.log("机器人可以转弯！");'
        }
    };
    
    // 如果主题没有定义，返回默认内容
    if (contents[topicId]) {
        return contents[topicId];
    } else {
        return {
            task: '学习' + topicId + '的第' + dayNum + '天知识',
            example: '// ' + topicId + ' 第' + dayNum + '天练习\nconsole.log("开始学习啦！");\nconsole.log("今天是我学习编程的第' + dayNum + '天！");'
        };
    }
}

// 获取某个主题的名称
function getTopicName(topicId) {
    for (var i = 0; i < allTopics.length; i++) {
        if (allTopics[i].id === topicId) {
            return allTopics[i].name;
        }
    }
    return topicId;
}