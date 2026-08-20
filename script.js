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
    quizData = pickQuestions(8);
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

    // 加载模型
    var loader = new THREE.GLTFLoader();
    loader.load(
        'http://tk2o9510d.hn-bkt.clouddn.com/rentouxingqikoucaitaoping.glb',
        function(gltf) {
            var model = gltf.scene;
            model.scale.set(1.5, 1.5, 1.5);
            model.position.x = -0.3;
            scene.add(model);
            controls.autoRotate = true;
            console.log('✅ 模型加载成功！');
        },
        undefined,
        function(error) {
            console.error('❌ 模型加载失败:', error);
        }
    );

    // 显示加载提示
    var loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-tip';
    loadingDiv.style.cssText = 'position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#5a3e2b; font-size:0.9rem; z-index:5;';
    loadingDiv.textContent = '⏳ 彩陶加载中...';
    container.appendChild(loadingDiv);

    loader.load(
    'http://tk2o9510d.hn-bkt.clouddn.com/rentouxingqikoucaitaoping.glb',
    function(gltf) {
        // 加载完成后移除提示
        var tip = document.getElementById('loading-tip');
        if (tip) tip.remove();
        // ... 其余代码不变
    },
    function(xhr) {
        // 可选：显示加载进度
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
        var container = document.getElementById('three-container');
        if (!container) return;
        var width = container.clientWidth || 500;
        var height = container.clientHeight || 400;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });

    // 主动触发一次 resize，确保尺寸正确
    setTimeout(function() {
        window.dispatchEvent(new Event('resize'));
    }, 50);
}

// ===== 更新 Three.js 渲染器尺寸 =====
function resizeThree() {
    var container = document.getElementById('three-container');
    if (!container) return;
    if (!window.threeRenderer || !window.threeCamera) return;

    var width = container.clientWidth || 500;
    var height = container.clientHeight || 400;
    window.threeCamera.aspect = width / height;
    window.threeCamera.updateProjectionMatrix();
    window.threeRenderer.setSize(width, height);
}

// 页面加载完成后初始化3D
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(init3D, 100);
});
