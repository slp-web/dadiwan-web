function showPage(pageId) {
    // 1. 隐藏所有页面
    document.querySelectorAll('.page').forEach(function(p) {
        p.classList.remove('active');
    });

    // 2. 显示选中的页面
    var target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
    }

    // 3. 高亮对应的导航链接
    document.querySelectorAll('nav a').forEach(function(link) {
        link.classList.remove('active');
    });

    var activeLink = document.querySelector('nav a[onclick*="' + pageId + '"]');
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // 4. 切换到首页时，重新触发入场动画
    if (pageId === 'home') {
        triggerHomeAnimation();
    }

        // 切换到彩陶图鉴时，更新3D渲染器尺寸
        if (pageId === 'gallery') {
            setTimeout(function() {
                resizeThree();
            }, 50);
        }
}

// ✅ 页面加载时，自动高亮首页（在函数外部调用）
showPage('home');
// ===== 知识问答数据 =====
const questionBank = [
    {
        question: "大地湾彩陶距今约多少年？",
        options: ["3000年", "5000年", "8000年", "10000年"],
        answer: 2
    },
    {
        question: "大地湾彩陶最著名的“镇馆之宝”是哪一件？",
        options: ["人头形器口彩陶瓶", "鱼纹彩陶盆", "几何纹彩陶罐", "宽带纹三足彩陶钵"],
        answer: 0
    },
    {
        question: "大地湾遗址位于哪个省份？",
        options: ["陕西省", "河南省", "甘肃省", "青海省"],
        answer: 2
    },
    {
        question: "大地湾彩陶上的鱼纹主要象征什么？",
        options: ["权力与地位", "多子多福与繁衍", "战争与征服", "自然崇拜"],
        answer: 1
    },
    {
        question: "以下哪种纹样不是大地湾彩陶的典型纹样？",
        options: ["鱼纹", "变体鸟纹", "网格纹", "龙纹"],
        answer: 3
    },
    {
        question: "大地湾彩陶的制作工艺中，第一步是？",
        options: ["彩绘", "选土", "烧制", "修坯"],
        answer: 1
    },
    {
        question: "大地湾彩陶的纹样中，哪种纹样经历了从具象到抽象的演变？",
        options: ["网格纹", "变体鸟纹", "鱼纹", "绳纹"],
        answer: 2
    },
    {
        question: "大地湾遗址距今约多少年？",
        options: ["3000-4000年", "5000-6000年", "8000-5000年", "10000-8000年"],
        answer: 2
    },
    {
        question: "大地湾彩陶的主要颜色是什么？",
        options: ["红色和黑色", "蓝色和白色", "绿色和黄色", "紫色和金色"],
        answer: 0
    },
    {
        question: "大地湾彩陶的纹样中，网格纹主要表现了什么？",
        options: ["渔网", "农田", "星空", "水波"],
        answer: 0
    },
    {
        question: "大地湾遗址的考古发现证明了什么？",
        options: ["中国彩陶起源于本土", "彩陶来自西方", "彩陶来自南方", "彩陶来自北方"],
        answer: 0
    },
    {
        question: "大地湾彩陶的制作工艺中，最后一步是？",
        options: ["彩绘", "修坯", "烧制", "选土"],
        answer: 2
    }
];

let quizData = [];          // 当前抽取的题目
// ===== 从题库中随机抽取N道题 =====
function pickQuestions(n) {
    const shuffled = [...questionBank];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, n);
}
let currentQuestion = 0;
let score = 0;
let answered = false;
let timer = 10;
let timerInterval = null;
let quizStarted = false;  

// ===== 渲染题目 =====
function renderQuestion() {
    const container = document.getElementById('quiz-container');
    if (!container) return;

    // ===== 清除之前的计时器 =====
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    // ===== 答题结束：显示成绩 =====
    if (currentQuestion >= quizData.length) {
        const total = quizData.length;
        const maxScore = total * 10;
        const percentage = Math.round((score / maxScore) * 100);
        let badge, level, comment;
    
        // ===== 计算徽章等级 =====
        if (percentage >= 80) {
            badge = '🏆';
            level = '彩陶大师';
            comment = '太棒了！你对大地湾彩陶文化有着深入的了解！';
        } else if (percentage >= 60) {
            badge = '📖';
            level = '彩陶爱好者';
            comment = '不错哦！继续探索大地湾彩陶的奥秘吧！';
        } else if (percentage >= 40) {
            badge = '🔍';
            level = '彩陶初学者';
            comment = '多看看彩陶图鉴，你会收获更多！';
        } else {
            badge = '🌱';
            level = '彩陶探索者';
            comment = '别灰心，每个人都是从零开始的！';
        }
    
        // ===== 先弹徽章窗 =====
        showBadgeModal(badge, level, comment);
    
        // ===== 再显示成绩页面 =====
        container.innerHTML = `
            <div style="background:white; border-radius:16px; padding:30px 24px; box-shadow:0 4px 20px rgba(0,0,0,0.08); text-align:center;">
                <div style="font-size:4rem; margin-bottom:8px;">${badge}</div>
                <h2 style="color:#3e2c1b; margin-bottom:4px;">🎉 答题完成！</h2>
                <p style="color:#7a5a44; font-size:0.95rem;">你获得了“${level}”称号</p>
                <div style="background:#f5efe6; border-radius:12px; padding:16px; margin:16px auto; display:inline-block; min-width:180px;">
                    <p style="font-size:2.2rem; font-weight:bold; color:#bf8f60;">${score} / ${maxScore}</p>
                    <p style="font-size:0.85rem; color:#7a5a44;">正确率 ${percentage}%</p>
                </div>
                <p style="color:#5a3e2b; font-size:0.95rem; max-width:300px; margin:0 auto 16px;">${comment}</p>
                <button onclick="restartQuiz()" style="padding:10px 36px; background:#5a3e2b; color:white; border:none; border-radius:8px; font-size:1rem; cursor:pointer;">重新挑战</button>
            </div>
        `;
        return;
    }
    // ===== 渲染当前题目 =====
    const q = quizData[currentQuestion];
    const total = quizData.length;
    const progress = Math.round((currentQuestion / total) * 100);

    let html = `
        <div style="background:white; border-radius:16px; padding:24px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
            <!-- 进度条 -->
            <div style="margin-bottom:8px;">
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; color:#7a5a44;">
                    <span>第 ${currentQuestion + 1}/${total} 题</span>
                    <span>${progress}%</span>
                </div>
                <div style="width:100%; height:6px; background:#d9cdbc; border-radius:4px; margin-top:4px;">
                    <div style="width:${progress}%; height:100%; background:#bf8f60; border-radius:4px; transition:width 0.3s;"></div>
                </div>
            </div>

            <!-- 计时器 -->
            <div style="display:flex; justify-content:flex-end; font-size:0.85rem; color:#7a5a44; margin-bottom:12px;">
                <span>⏱️ <span id="timer-display">${timer}</span>s</span>
            </div>

            <!-- 题目 -->
            <p style="font-weight:bold; font-size:1.1rem; margin-bottom:12px;">${currentQuestion + 1}. ${q.question}</p>
            <div style="display:flex; flex-direction:column; gap:8px;">
    `;

    q.options.forEach((opt, idx) => {
        html += `
            <button onclick="selectAnswer(${idx})" 
                    class="quiz-option"
                    style="text-align:left; padding:10px 16px; background:#f5efe6; border:2px solid #d9cdbc; border-radius:8px; cursor:pointer; font-size:0.95rem; transition: all 0.2s;">
                ${String.fromCharCode(65 + idx)}. ${opt}
            </button>
        `;
    });

    html += `
            </div>
            <div id="feedback-${currentQuestion}" style="margin-top:12px; font-weight:bold; min-height:28px;"></div>
            <button id="next-btn-${currentQuestion}" onclick="nextQuestion()" style="display:none; margin-top:12px; padding:8px 24px; background:#5a3e2b; color:white; border:none; border-radius:6px; cursor:pointer;">下一题 →</button>
        </div>
    `;

    container.innerHTML = html;
    answered = false;

    // ===== 启动计时器（仅当用户已开始答题） =====
    if (quizStarted) {
        startQuizTimer();
    }
}

// ===== 选择答案 =====
function selectAnswer(idx) {
    if (answered) return;
    answered = true;
    quizStarted = true;

    const q = quizData[currentQuestion];
    const feedback = document.getElementById(`feedback-${currentQuestion}`);
    const nextBtn = document.getElementById(`next-btn-${currentQuestion}`);
    const allBtns = document.querySelectorAll('#quiz-container button');
    
    // 禁用所有选项按钮
    allBtns.forEach(btn => {
        if (btn.textContent.includes('A.') || btn.textContent.includes('B.') || 
            btn.textContent.includes('C.') || btn.textContent.includes('D.')) {
            btn.disabled = true;
            btn.style.opacity = '0.6';
        }
    });

    if (idx === q.answer) {
        score += 10;
        feedback.innerHTML = '✅ 回答正确！+10分';
        feedback.style.color = '#2d7d46';
    } else {
        feedback.innerHTML = `❌ 回答错误，正确答案是 ${String.fromCharCode(65 + q.answer)}`;
        feedback.style.color = '#b3413d';
    }
    nextBtn.style.display = 'inline-block';
}

// ===== 下一题 =====
function nextQuestion() {
    // 只有当前在互动页面才执行
    const interactPage = document.getElementById('interact');
    if (!interactPage || !interactPage.classList.contains('active')) {
        return;
    }
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    currentQuestion++;
    renderQuestion();
}

// ===== 重新开始 =====
function restartQuiz() {
    quizStarted = false;
    quizData = pickQuestions(8);
    currentQuestion = 0;
    score = 0;
    renderQuestion();
}

// ===== 启动答题计时器 =====
function startQuizTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    timer = 10;
    timerInterval = setInterval(function() {
        timer--;
        const display = document.getElementById('timer-display');
        if (display) display.textContent = timer;

        if (timer <= 0) {
            clearInterval(timerInterval);
            const interactPage = document.getElementById('interact');
            if (interactPage && interactPage.classList.contains('active') && !answered) {
                nextQuestion();
            } else {
                timer = 10;
                if (display) display.textContent = timer;
            }
        }
    }, 1000);
}

// ===== 显示徽章弹窗 =====
function showBadgeModal(badge, level, comment) {
    // 只有当前在“互动小功能”页面才弹窗
    const interactPage = document.getElementById('interact');
    if (!interactPage || !interactPage.classList.contains('active')) {
        return;
    }
    
    document.getElementById('badge-icon').textContent = badge;
    document.getElementById('badge-title').textContent = level;
    document.getElementById('badge-desc').textContent = comment;
    document.getElementById('badge-modal').style.display = 'flex';
}

// ===== 关闭徽章弹窗 =====
function closeBadgeModal() {
    document.getElementById('badge-modal').style.display = 'none';
}
// 页面加载时：抽取8道题并渲染
quizData = pickQuestions(8);
renderQuestion();

// ===== 欢迎遮罩：每次会话首次访问显示 =====
function initWelcome() {
    // 检查当前会话是否已经访问过
    var visited = sessionStorage.getItem('dadiwan_visited');
    
    if (!visited) {
        // 本次会话第一次打开：显示遮罩
        var overlay = document.getElementById('welcome-overlay');
        overlay.style.display = 'flex';
        overlay.style.opacity = '1';
    }
}

function enterSite() {
    sessionStorage.setItem('dadiwan_visited', 'true');
    var overlay = document.getElementById('welcome-overlay');
    overlay.style.opacity = '0';
    setTimeout(function() {
        overlay.style.display = 'none';
        // 遮罩消失后再触发动画
        setTimeout(function() {
            triggerHomeAnimation();
        }, 10);
    }, 800);
}

// 页面加载时执行初始化
initWelcome();
// ===== 悬停信息提示 =====
function showHint(title, desc) {
    var bubble = document.getElementById('hint-bubble');
    document.getElementById('hint-title').textContent = title;
    document.getElementById('hint-desc').textContent = desc;
    bubble.style.display = 'block';
}

function hideHint() {
    document.getElementById('hint-bubble').style.display = 'none';
}
// ===== 滑动对比：5张图片切换 =====
var evoSlider = document.getElementById('evo-slider');
var evoLine = document.getElementById('evo-line');
var evoProgress = document.getElementById('evo-progress');
var evoLabel = document.getElementById('evo-stage-label');
var evoGlow = document.getElementById('evo-glow');
var evoImage = document.getElementById('evo-image');

// 5张演变图片
var evoImages = [
    { src: 'images/yu-wen-1.png', label: '具象 · 原始鱼纹' },
    { src: 'images/yu-wen-2.png', label: '简化 · 线条概括' },
    { src: 'images/yu-wen-3.png', label: '抽象 · 几何化' },
    { src: 'images/yu-wen-4.png', label: '符号化 · 程式化' },
    { src: 'images/yu-wen-5.png', label: '极致抽象 · 符号' }
];

if (evoSlider) {
    evoSlider.addEventListener('input', function() {
        var val = parseInt(this.value);
        // 更新分割线位置
        if (evoLine) evoLine.style.left = val + '%';
        // 更新进度数字
        if (evoProgress) evoProgress.textContent = val;
        // 更新光晕位置
        if (evoGlow) evoGlow.style.left = val + '%';

        // 根据滑块值计算显示哪张图片（0-100 映射到 0-4）
        var index = Math.round((val / 100) * (evoImages.length - 1));
        if (index >= evoImages.length) index = evoImages.length - 1;
        if (index < 0) index = 0;

        // 切换图片
        if (evoImage) evoImage.src = evoImages[index].src;
        // 更新阶段标签
        if (evoLabel) evoLabel.textContent = evoImages[index].label;
    });
}

// 缩略图导航跳转
function setEvoStage(value) {
    var slider = document.getElementById('evo-slider');
    if (slider) {
        slider.value = value;
        slider.dispatchEvent(new Event('input'));
    }
}

// 页面加载时初始化滑动对比图片
setEvoStage(50);

// ===== 蛙纹演变图片（5张） =====
var waImages = [
    { src: 'images/wa-wen-1.png', label: '具象 · 原始蛙纹' },
    { src: 'images/wa-wen-2.png', label: '简化 · 线条概括' },
    { src: 'images/wa-wen-3.png', label: '抽象 · 几何化' },
    { src: 'images/wa-wen-4.png', label: '符号化 · 程式化' },
    { src: 'images/wa-wen-5.png', label: '极致抽象 · 符号' }
];

// ===== 蛙纹滑动控制 =====
var waSlider = document.getElementById('wa-slider');
var waLine = document.getElementById('wa-line');
var waProgress = document.getElementById('wa-progress');
var waLabel = document.getElementById('wa-stage-label');
var waGlow = document.getElementById('wa-glow');
var waImage = document.getElementById('wa-image');

if (waSlider) {
    waSlider.addEventListener('input', function() {
        var val = parseInt(this.value);
        if (waLine) waLine.style.left = val + '%';
        if (waProgress) waProgress.textContent = val;
        if (waGlow) waGlow.style.left = val + '%';

        var index = Math.round((val / 100) * (waImages.length - 1));
        if (index >= waImages.length) index = waImages.length - 1;
        if (index < 0) index = 0;

        if (waImage) waImage.src = waImages[index].src;
        if (waLabel) waLabel.textContent = waImages[index].label;
    });
}

function setWaStage(value) {
    var slider = document.getElementById('wa-slider');
    if (slider) {
        slider.value = value;
        slider.dispatchEvent(new Event('input'));
    }
}

// 页面加载时初始化蛙纹
setWaStage(50);

// ===== 鸟纹演变图片（5张） =====
var niaoImages = [
    { src: 'images/niao-wen-1.png', label: '具象 · 原始鸟纹' },
    { src: 'images/niao-wen-2.png', label: '简化 · 线条概括' },
    { src: 'images/niao-wen-3.png', label: '抽象 · 几何化' },
    { src: 'images/niao-wen-4.png', label: '符号化 · 程式化' },
    { src: 'images/niao-wen-5.png', label: '极致抽象 · 符号' }
];

// ===== 鸟纹滑动控制 =====
var niaoSlider = document.getElementById('niao-slider');
var niaoLine = document.getElementById('niao-line');
var niaoProgress = document.getElementById('niao-progress');
var niaoLabel = document.getElementById('niao-stage-label');
var niaoGlow = document.getElementById('niao-glow');
var niaoImage = document.getElementById('niao-image');

if (niaoSlider) {
    niaoSlider.addEventListener('input', function() {
        var val = parseInt(this.value);
        if (niaoLine) niaoLine.style.left = val + '%';
        if (niaoProgress) niaoProgress.textContent = val;
        if (niaoGlow) niaoGlow.style.left = val + '%';

        var index = Math.round((val / 100) * (niaoImages.length - 1));
        if (index >= niaoImages.length) index = niaoImages.length - 1;
        if (index < 0) index = 0;

        if (niaoImage) niaoImage.src = niaoImages[index].src;
        if (niaoLabel) niaoLabel.textContent = niaoImages[index].label;
    });
}

function setNiaoStage(value) {
    var slider = document.getElementById('niao-slider');
    if (slider) {
        slider.value = value;
        slider.dispatchEvent(new Event('input'));
    }
}

// 页面加载时初始化鸟纹
setNiaoStage(50);

// ===== 彩陶数据 =====
var potteryData = {
    'ren-tou-ping': {
        title: '人头形器口彩陶瓶',
        desc: '大地湾"镇馆之宝"，人像与陶器完美结合',
        info: '文化类型：仰韶文化\n年代：距今约6000年\n出土地点：大地湾遗址',
        video: 'images/ren-tou-ping.mp4'
    },
    'kuan-dai-bo': {
        title: '宽带纹三足彩陶钵',
        desc: '我国已知最早的彩陶之一，纹饰简洁古朴',
        info: '文化类型：大地湾文化\n年代：距今约8000年\n出土地点：大地湾遗址',
        video: 'images/kuan-dai-bo.mp4'
    },
    'ji-he-guan': {
        title: '几何纹彩陶罐',
        desc: '线条流畅，体现先民的抽象审美能力',
        info: '文化类型：仰韶文化\n年代：距今约5500-5000年\n出土地点：大地湾遗址',
        video: 'images/ji-he-guan.mp4'
    },
    'yu-wen-pen': {
        title: '鱼纹彩陶盆',
        desc: '鱼纹从具象到抽象的演变代表',
        info: '文化类型：仰韶文化\n年代：距今约7000-6000年\n出土地点：大地湾遗址',
        video: 'images/yu-wen-pen.mp4'
    },
    'wang-ge-hu': {
        title: '网格纹彩陶壶',
        desc: '网格纹是大地湾最具代表性的装饰纹样',
        info: '文化类型：仰韶文化\n年代：距今约5500-5000年\n出土地点：大地湾遗址',
        video: 'images/wang-ge-hu.mp4'
    },
    'niao-wen-guan': {
        title: '变体鸟纹彩陶罐',
        desc: '鸟纹逐渐简化，走向符号化与程式化',
        info: '文化类型：仰韶文化\n年代：距今约5500-5000年\n出土地点：大地湾遗址',
        video: 'images/niao-wen-guan.mp4'
    }
};

// ===== 彩陶模型链接配置 =====
var modelUrls = {
    'ren-tou-ping': 'http://tk2o9510d.hn-bkt.clouddn.com/rentouxingqikoucaitaoping.glb',
    'kuan-dai-bo': 'http://tk2o9510d.hn-bkt.clouddn.com/kuandaiwensanzucaitaobo.glb',
    'ji-he-guan': 'http://tk2o9510d.hn-bkt.clouddn.com/jihewencaitaoguan.glb',
    'yu-wen-pen': 'http://tk2o9510d.hn-bkt.clouddn.com/yuwencaitaopeng.glb',
    'wang-ge-hu': 'http://tk2o9510d.hn-bkt.clouddn.com/wanggewencaitaohu.glb',
    'niao-wen-guan': 'http://tk2o9510d.hn-bkt.clouddn.com/biantiniaowencaitaoguan.glb'
};

// ===== 切换加载3D模型 =====
var currentModel = null;

function loadModel(key) {
    var container = document.getElementById('three-container');
    if (!container) {
        console.error('❌ three-container 不存在');
        return;
    }

    var tip = document.getElementById('loading-tip');
    if (!tip) {
        tip = document.createElement('div');
        tip.id = 'loading-tip';
        tip.style.cssText = 'position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#5a3e2b; font-size:0.9rem; z-index:5;';
        container.style.position = 'relative';
        container.appendChild(tip);
    }
    tip.textContent = '⏳ 彩陶加载中...';
    tip.style.display = 'block';

    var url = modelUrls[key];
    if (!url) {
        tip.textContent = '❌ 模型链接不存在';
        return;
    }

    // 移除旧模型
    if (currentModel) {
        window.threeScene.remove(currentModel);
        currentModel = null;
    }

    var loader = new THREE.GLTFLoader();
    loader.load(
        url,
        function(gltf) {
            var model = gltf.scene;
            model.scale.set(1.5, 1.5, 1.5);
            model.position.x = 0;
            window.threeScene.add(model);
            currentModel = model;
            tip.textContent = '✅ 加载完成！';
            // ✅ 模型加载完成后再次适配尺寸（加在这里）
             setTimeout(function() {
             resizeThree();
            }, 50);
            setTimeout(function() { tip.style.display = 'none'; }, 600);
            console.log('✅ 模型加载成功:', key);
        },
        function(xhr) {
            var progress = Math.round(xhr.loaded / xhr.total * 100);
            var tip = document.getElementById('loading-tip');
            if (tip) tip.textContent = '⏳ 彩陶加载中 ' + progress + '%';
        },
        function(error) {
            var tip = document.getElementById('loading-tip');
            if (tip) tip.textContent = '❌ 加载失败，请刷新重试';
            console.error('❌ 模型加载失败:', error);
        }
    );
}

// ===== 打开详情 =====
function openDetail(key) {
    var data = potteryData[key];
    if (!data) return;

    // 隐藏卡片网格
    var grid = document.querySelector('#gallery .card-grid');
    if (grid) grid.style.display = 'none';
    document.querySelector('#gallery .fade-up').style.display = 'none';  // 隐藏标题
    document.querySelector('#gallery .fade-up + p').style.display = 'none';  // 隐藏描述

    // 显示详情页
    document.getElementById('detail-view').style.display = 'block';

    // 填充文字信息
    document.getElementById('detail-title').textContent = data.title;
    document.getElementById('detail-desc').textContent = data.desc;
    document.getElementById('detail-full-info').textContent = data.info;

    // 设置视频
    var video = document.getElementById('detail-video');
    video.querySelector('source').src = data.video;
    video.load();

    // ✅ 关键：延迟执行，等浏览器完成布局后再适配3D尺寸
    setTimeout(function() {
        resizeThree();
    }, 100);

    // 加载模型
    loadModel(key);
}

// ===== 返回列表 =====
function closeDetail() {
    document.getElementById('gallery').querySelector('.card-grid').style.display = 'grid';
    document.getElementById('detail-view').style.display = 'none';
    document.querySelector('#gallery .fade-up').style.display = '';
    document.querySelector('#gallery .fade-up + p').style.display = '';

    var video = document.getElementById('detail-video');
    video.pause();
    video.currentTime = 0;
}

// ===== 触发首页入场动画 =====
function triggerHomeAnimation() {
    var pot = document.querySelector('.hero .spinning-pot');
    var title = document.querySelector('.hero h1');
    var desc = document.querySelector('.hero p');

    // 重置动画
    [pot, title, desc].forEach(function(el) {
        if (el) {
            el.classList.remove('animate-in');
            el.style.animation = 'none';
            void el.offsetWidth;
        }
    });

    // 强制回流后播放
    document.body.offsetHeight;

    setTimeout(function() {
        if (pot) {
            pot.classList.add('animate-in');
            pot.style.animation = '';
        }
        setTimeout(function() {
            if (title) {
                title.classList.add('animate-in');
                title.style.animation = '';
            }
        }, 150);
        setTimeout(function() {
            if (desc) {
                desc.classList.add('animate-in');
                desc.style.animation = '';
            }
        }, 300);
    }, 50);
}

// ===== 滚动触发动画 =====
document.addEventListener('DOMContentLoaded', function() {
    var elements = document.querySelectorAll('.fade-up');
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    elements.forEach(function(el) {
        observer.observe(el);
    });
});

// ===== 3D彩陶展示 =====
function init3D() {
    var container = document.getElementById('three-container');
    if (!container) return;

    // ✅ 使用容器的实际尺寸
    var width = container.clientWidth || 500;
    var height = container.clientHeight || 400;

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0xd9cdbc);

    var camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 5.5);
    camera.lookAt(0, 0, 0);

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;
    controls.target.set(0, 0.5, 0);
    controls.update();

    // 灯光
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    var dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    var fillLight = new THREE.DirectionalLight(0xffdd99, 0.5);
    fillLight.position.set(-3, 1, -4);
    scene.add(fillLight);

    // 保存到全局（供其他函数使用）
    window.threeScene = scene;
    window.threeCamera = camera;
    window.threeRenderer = renderer;
    window.threeControls = controls;

        // 动画循环
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
    
        // ===== 窗口变化自适应 =====
        window.addEventListener('resize', function() {
            resizeThree();
        });
    
        // 页面加载后主动适配一次尺寸
        setTimeout(function() {
            resizeThree();
        }, 100);
    }

// ===== 更新 Three.js 渲染器尺寸 =====
function resizeThree() {
    var container = document.getElementById('three-container');
    if (!container) {
        console.warn('resizeThree: three-container 不存在');
        return;
    }

    if (!window.threeRenderer || !window.threeCamera) {
        console.warn('resizeThree: 渲染器或相机未初始化');
        return;
    }

    var width = container.clientWidth;
    var height = container.clientHeight;

    if (width === 0 || height === 0) {
        console.warn('resizeThree: 容器尺寸为0，可能是隐藏状态');
        return;
    }

    console.log('resizeThree: 容器尺寸', width, height);
    console.log('resizeThree: 渲染器旧尺寸', window.threeRenderer.domElement.width, window.threeRenderer.domElement.height);

    window.threeCamera.aspect = width / height;
    window.threeCamera.updateProjectionMatrix();
    window.threeRenderer.setSize(width, height);

    console.log('resizeThree: 渲染器新尺寸', window.threeRenderer.domElement.width, window.threeRenderer.domElement.height);
}

// 页面加载完成后初始化3D，并默认加载人头瓶
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(init3D, 100);
    setTimeout(function() {
        loadModel('ren-tou-ping');
    }, 300);
});

// ===== 纹样拼图（多套轮换） =====
var puzzleList = [
    {
        name: '鱼纹①',
        images: ['images/Y-W-1.png', 'images/Y-W-2.png', 'images/Y-W-3.png', 'images/Y-W-4.png', 'images/Y-W-5.png', 'images/Y-W-6.png']
    },
    {
        name: '鱼纹②',
        images: ['images/Y-W_01.png', 'images/Y-W_02.png', 'images/Y-W_03.png', 'images/Y-W_04.png', 'images/Y-W_05.png', 'images/Y-W_06.png']
    }
];

var currentPuzzleIndex = 0;
var puzzleState = [0, 1, 2, 3, 4, 5];
var puzzleMoves = 0;
var puzzleSolved = false;
var selectedIndex = null;

// 渲染拼图
function renderPuzzle() {
    var container = document.getElementById('puzzle-container');
    if (!container) return;

    var currentPuzzle = puzzleList[currentPuzzleIndex];
    document.getElementById('puzzle-name').textContent = currentPuzzle.name;

    container.innerHTML = '';
    puzzleState.forEach(function(index, i) {
        var div = document.createElement('div');
        div.style.cssText = `
            background-image: url('${currentPuzzle.images[index]}');
            background-size: cover;
            background-position: center;
            border-radius: 8px;
            cursor: pointer;
            aspect-ratio: 1/1;
            border: 3px solid ${selectedIndex === i ? '#bf8f60' : '#d9cdbc'};
            transition: border-color 0.2s, transform 0.2s;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        `;
        div.onclick = function() { clickPuzzlePiece(i); };
        container.appendChild(div);
    });
    updatePuzzleStatus();
}

// 更新状态
function updatePuzzleStatus() {
    document.getElementById('puzzle-moves').textContent = puzzleMoves;
    if (puzzleSolved) {
        document.getElementById('puzzle-name').textContent = puzzleList[currentPuzzleIndex].name + ' ✅';
    }
}

// 检查是否拼好
function checkPuzzleSolved() {
    for (var i = 0; i < puzzleState.length; i++) {
        if (puzzleState[i] !== i) return false;
    }
    return true;
}

// 点击拼图块
function clickPuzzlePiece(index) {
    if (puzzleSolved) return;

    if (selectedIndex === null) {
        selectedIndex = index;
        renderPuzzle();
    } else if (selectedIndex === index) {
        selectedIndex = null;
        renderPuzzle();
    } else {
        var temp = puzzleState[selectedIndex];
        puzzleState[selectedIndex] = puzzleState[index];
        puzzleState[index] = temp;
        puzzleMoves++;
        selectedIndex = null;
        renderPuzzle();

        if (checkPuzzleSolved()) {
            puzzleSolved = true;
            updatePuzzleStatus();
            renderPuzzle();
            setTimeout(function() {
                showPuzzleModal(puzzleList[currentPuzzleIndex].name);
            }, 300);
        }
    }
}

// 打乱拼图
function shufflePuzzle() {
    puzzleState = [0, 1, 2, 3, 4, 5];
    puzzleMoves = 0;
    puzzleSolved = false;
    selectedIndex = null;

    var swapCount = 15 + Math.floor(Math.random() * 10);
    for (var s = 0; s < swapCount; s++) {
        var a = Math.floor(Math.random() * 6);
        var b = Math.floor(Math.random() * 6);
        if (a !== b) {
            var tmp = puzzleState[a];
            puzzleState[a] = puzzleState[b];
            puzzleState[b] = tmp;
        }
    }
    if (checkPuzzleSolved()) {
        puzzleState = [1, 0, 3, 2, 5, 4];
    }

    renderPuzzle();
}

// 换一个拼图
function nextPuzzle() {
    currentPuzzleIndex = (currentPuzzleIndex + 1) % puzzleList.length;
    shufflePuzzle();
}

// 初始化
shufflePuzzle();

// ===== 纹样切换 =====
function switchPattern(type, btn) {
    document.querySelectorAll('.compare-panel').forEach(function(p) {
        p.classList.remove('active');
    });
    document.querySelectorAll('.pattern-tab').forEach(function(t) {
        t.classList.remove('active');
    });
    var panel = document.getElementById('compare-' + type);
    if (panel) panel.classList.add('active');
    if (btn) btn.classList.add('active');
}

// ===== 拼图完成弹窗 =====
function showPuzzleModal(name) {
    var text = document.getElementById('puzzle-modal-text');
    if (text) text.textContent = '你已成功拼合「' + name + '」演变图';
    document.getElementById('puzzle-modal').style.display = 'flex';
}

function closePuzzleModal() {
    document.getElementById('puzzle-modal').style.display = 'none';
}

// ===== 互动小功能切换 =====
function switchInteract(type, btn) {
    document.querySelectorAll('.interact-panel').forEach(function(p) {
        p.classList.remove('active');
    });
    document.querySelectorAll('.interact-tab').forEach(function(t) {
        t.classList.remove('active');
    });
    var panel = document.getElementById('panel-' + type);
    if (panel) panel.classList.add('active');
    if (btn) btn.classList.add('active');
}