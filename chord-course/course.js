/**
 * 和弦听辨课程逻辑
 */

// 课程数据
const lessonData = {
    1: {
        chords: ['C', 'F', 'G'],
        currentChord: null,
        stats: { correct: 0, total: 0, streak: 0 }
    },
    2: {
        chords: ['Am', 'Dm', 'Em'],
        currentChord: null,
        stats: { correct: 0, total: 0, streak: 0 }
    },
    3: {
        chords: ['C', 'F', 'G', 'Am', 'Dm', 'Em'],
        currentChord: null,
        stats: { correct: 0, total: 0, streak: 0 }
    }
};

/**
 * 播放随机和弦
 */
async function playRandomChord(lessonId) {
    const lesson = lessonData[lessonId];
    const chords = lesson.chords;
    
    // 随机选择一个和弦
    const randomIndex = Math.floor(Math.random() * chords.length);
    const chord = chords[randomIndex];
    
    lesson.currentChord = chord;
    
    // 更新显示
    const display = document.getElementById(`question-display-${lessonId}`);
    if (display) {
        display.textContent = '🔊 正在播放...';
    }
    
    // 播放和弦
    await playChord(chord);
    
    // 延迟后更新显示
    setTimeout(() => {
        if (display) {
            display.textContent = '🎧 听出来了吗？选择答案';
        }
    }, 500);
    
    // 重置答案按钮状态
    resetAnswerButtons(lessonId);
}

/**
 * 检查答案
 */
function checkAnswer(lessonId, answer) {
    const lesson = lessonData[lessonId];
    const correct = answer === lesson.currentChord;
    
    // 更新统计
    lesson.stats.total++;
    if (correct) {
        lesson.stats.correct++;
        lesson.stats.streak++;
    } else {
        lesson.stats.streak = 0;
    }
    
    // 更新UI
    updateStats(lessonId);
    showFeedback(lessonId, correct, lesson.currentChord);
    highlightAnswer(lessonId, answer, correct);
}

/**
 * 更新统计显示
 */
function updateStats(lessonId) {
    const stats = lessonData[lessonId].stats;
    
    const correctEl = document.getElementById(`correct-${lessonId}`);
    const totalEl = document.getElementById(`total-${lessonId}`);
    const streakEl = document.getElementById(`streak-${lessonId}`);
    
    if (correctEl) correctEl.textContent = stats.correct;
    if (totalEl) totalEl.textContent = stats.total;
    if (streakEl) streakEl.textContent = stats.streak;
}

/**
 * 显示反馈
 */
function showFeedback(lessonId, correct, actualChord) {
    const feedback = document.getElementById(`feedback-${lessonId}`);
    if (!feedback) return;
    
    if (correct) {
        feedback.textContent = '✅ 正确！太棒了！';
        feedback.className = 'practice-feedback correct';
    } else {
        feedback.textContent = `❌ 不对哦，正确答案是 ${actualChord}`;
        feedback.className = 'practice-feedback wrong';
    }
}

/**
 * 高亮答案
 */
function highlightAnswer(lessonId, answer, correct) {
    const buttons = document.querySelectorAll(`#answer-buttons-${lessonId} .answer-btn`);
    
    buttons.forEach(btn => {
        btn.classList.remove('correct', 'wrong');
        
        if (btn.dataset.answer === lessonData[lessonId].currentChord) {
            btn.classList.add('correct');
        } else if (btn.dataset.answer === answer && !correct) {
            btn.classList.add('wrong');
        }
    });
}

/**
 * 重置答案按钮
 */
function resetAnswerButtons(lessonId) {
    const buttons = document.querySelectorAll(`#answer-buttons-${lessonId} .answer-btn`);
    buttons.forEach(btn => {
        btn.classList.remove('correct', 'wrong');
    });
    
    const feedback = document.getElementById(`feedback-${lessonId}`);
    if (feedback) {
        feedback.textContent = '';
        feedback.className = 'practice-feedback';
    }
}

/**
 * 切换课程
 */
function goToLesson(lessonId) {
    // 更新标签
    document.querySelectorAll('.lesson-tab').forEach(tab => {
        tab.classList.toggle('active', parseInt(tab.dataset.lesson) === lessonId);
    });
    
    // 更新课程内容
    document.querySelectorAll('.lesson').forEach(lesson => {
        lesson.classList.toggle('active', lesson.id === `lesson-${lessonId}`);
    });
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * 页面初始化
 */
document.addEventListener('DOMContentLoaded', () => {
    // 课程标签切换
    document.querySelectorAll('.lesson-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            goToLesson(parseInt(tab.dataset.lesson));
        });
    });
    
    // 首次点击时初始化音频（浏览器要求）
    document.addEventListener('click', () => {
        audioEngine.init().catch(e => console.log('Audio init deferred'));
    }, { once: true });
});
