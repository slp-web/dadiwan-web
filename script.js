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
}

// ✅ 页面加载时，自动高亮首页（在函数外部调用）
showPage('home');
// ===== 知识问答数据 =====
const quizData = [
    {
        question: "大地湾彩陶距今约多少年？",
        options: ["3000年", "5000年", "8000年", "10000年"],
        answer: 2 // 索引从0开始，2代表"8000年"
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
    }
];


let currentQuestion = 0;
let score = 0;
let answered = false;

let timer = 10;          // 倒计时秒数
let timerInterval = null;

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

   // ===== 启动计时器 =====
timer = 10;
timerInterval = setInterval(function() {
    timer--;
    const display = document.getElementById('timer-display');
    if (display) display.textContent = timer;

    if (timer <= 0) {
        clearInterval(timerInterval);
        // 只有在互动页面且未答题时才自动跳转
        const interactPage = document.getElementById('interact');
        if (interactPage && interactPage.classList.contains('active') && !answered) {
            nextQuestion();
        } else {
            // 如果不在互动页面，重置计时器但不跳转
            timer = 10;
            if (display) display.textContent = timer;
        }
    }
}, 1000);
}

// ===== 选择答案 =====
function selectAnswer(idx) {
    if (answered) return;
    answered = true;

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
    currentQuestion = 0;
    score = 0;
    renderQuestion();
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
// 页面加载时渲染第一题
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
    // 存储访问标记（仅在当前会话有效）
    sessionStorage.setItem('dadiwan_visited', 'true');
    
    var overlay = document.getElementById('welcome-overlay');
    overlay.style.opacity = '0';
    setTimeout(function() {
        overlay.style.display = 'none';
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
// ===== 高级纹样演变对比 =====
var evoSlider = document.getElementById('evo-slider');
var evoLine = document.getElementById('evo-line');
var evoProgress = document.getElementById('evo-progress');
var evoLabel = document.getElementById('evo-stage-label');
var evoGlow = document.getElementById('evo-glow');

if (evoSlider) {
    // 阶段标签映射
    var stages = {
        0: '具象 · 原始鱼纹',
        25: '简化 · 线条概括',
        50: '抽象 · 几何化',
        75: '符号化 · 程式化',
        100: '极致抽象 · 符号'
    };

    evoSlider.addEventListener('input', function() {
        var val = parseInt(this.value);
        // 更新分割线位置
        evoLine.style.left = val + '%';
        // 更新进度数字
        evoProgress.textContent = val;
        // 更新光晕位置
        evoGlow.style.left = val + '%';

        // 根据值显示对应的阶段标签
        var labelText = '抽象 · 符号化';
        if (val < 15) labelText = stages[0];
        else if (val < 35) labelText = stages[25];
        else if (val < 60) labelText = stages[50];
        else if (val < 85) labelText = stages[75];
        else labelText = stages[100];
        evoLabel.textContent = labelText;

        // 随着滑动，图片缓慢变化（通过CSS滤镜模拟演变效果）
        var img = document.getElementById('evo-image');
        var blur = Math.max(0, (val - 50) * 0.04);
        var contrast = 100 - (val * 0.15);
        var brightness = 100 - (val * 0.08);
        img.style.filter = 'blur(' + blur + 'px) contrast(' + contrast + '%) brightness(' + brightness + '%)';
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