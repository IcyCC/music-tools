/**
 * 和弦听辨课程逻辑（完整版）
 */

// 基础和弦练习数据
const lessonData = {
    1: {
        chords: ['C', 'F', 'G'],
        currentChord: null,
        stats: { correct: 0, total: 0 }
    },
    2: {
        chords: ['Am', 'Dm', 'Em'],
        currentChord: null,
        stats: { correct: 0, total: 0 }
    }
};

// 第3课走向练习
const progressionData = {
    progressions: {
        'canon': { chords: ['C', 'G', 'Am', 'F'], name: 'Canon进行' },
        '50s': { chords: ['C', 'Am', 'F', 'G'], name: '50年代进行' },
        'sad': { chords: ['Am', 'F', 'C', 'G'], name: '悲伤进行' },
        'simple': { chords: ['C', 'F', 'G', 'C'], name: '三和弦' }
    },
    currentProgression: null,
    stats: { correct: 0, total: 0 }
};

// 第4课爵士练习
const jazzData = {
    progressions: {
        'ii-v-i': { chords: ['Dm', 'G', 'C'], name: 'ii-V-I' },
        'i-iv-v': { chords: ['C', 'F', 'G'], name: 'I-IV-V' },
        'canon': { chords: ['C', 'G', 'Am', 'F'], name: 'Canon' }
    },
    currentProgression: null,
    stats: { correct: 0, total: 0 }
};

// 第5课蓝调练习
const bluesData = {
    progressions: {
        '12bar': { chords: ['C', 'C', 'C', 'C', 'F', 'F', 'C', 'C', 'G', 'F', 'C', 'G'], name: '12小节蓝调' },
        '8bar': { chords: ['C', 'F', 'C', 'G', 'F', 'C', 'G', 'G'], name: '8小节蓝调' },
        'notblues': { chords: ['C', 'G', 'Am', 'F'], name: 'Canon（不是蓝调）' }
    },
    currentProgression: null,
    stats: { correct: 0, total: 0 }
};

// 第6课综合练习
const allProgressionsData = {
    progressions: {
        'canon': { chords: ['C', 'G', 'Am', 'F'], name: 'Canon' },
        '50s': { chords: ['C', 'Am', 'F', 'G'], name: '50年代' },
        'sad': { chords: ['Am', 'F', 'C', 'G'], name: '悲伤' },
        'iiv': { chords: ['Dm', 'G', 'C'], name: 'ii-V-I' },
        'axis': { chords: ['Am', 'F', 'C', 'G'], name: 'Axis' },
        'sensitive': { chords: ['C', 'Em', 'Am', 'F'], name: '敏感' },
        'andalusian': { chords: ['Am', 'G', 'F', 'E'], name: 'Andalusian' },
        'blues': { chords: ['C', 'C', 'C', 'C', 'F', 'F'], name: '蓝调' }
    },
    currentProgression: null,
    stats: { correct: 0, total: 0 }
};

// ========== 基础练习函数 ==========

async function playRandomChord(lessonId) {
    const lesson = lessonData[lessonId];
    const chords = lesson.chords;
    const chord = chords[Math.floor(Math.random() * chords.length)];
    lesson.currentChord = chord;
    
    const display = document.getElementById(`question-display-${lessonId}`);
    if (display) display.textContent = '🔊 正在播放...';
    
    await playChord(chord);
    
    setTimeout(() => {
        if (display) display.textContent = '🎧 听出来了吗？';
    }, 500);
    
    resetAnswerButtons(lessonId);
}

function checkAnswer(lessonId, answer) {
    const lesson = lessonData[lessonId];
    const correct = answer === lesson.currentChord;
    
    lesson.stats.total++;
    if (correct) lesson.stats.correct++;
    
    document.getElementById(`correct-${lessonId}`).textContent = lesson.stats.correct;
    document.getElementById(`total-${lessonId}`).textContent = lesson.stats.total;
    
    const feedback = document.getElementById(`feedback-${lessonId}`);
    feedback.textContent = correct ? '✅ 正确！' : `❌ 不对，是 ${lesson.currentChord}`;
    feedback.className = `practice-feedback ${correct ? 'correct' : 'wrong'}`;
    
    highlightAnswer(lessonId, answer, correct);
}

// ========== 第3课走向练习 ==========

async function playRandomProgression() {
    const keys = Object.keys(progressionData.progressions);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    
    progressionData.currentProgression = randomKey;
    const progression = progressionData.progressions[randomKey];
    
    const display = document.getElementById('question-display-prog');
    if (display) display.textContent = '🔊 正在播放...';
    
    await playProgression(progression.chords);
    
    setTimeout(() => {
        if (display) display.textContent = '🎧 听出来了吗？';
    }, 500);
    
    resetProgressionButtons('prog');
}

function checkProgressionAnswer(answer) {
    const correct = answer === progressionData.currentProgression;
    const correctProg = progressionData.progressions[progressionData.currentProgression];
    
    progressionData.stats.total++;
    if (correct) progressionData.stats.correct++;
    
    document.getElementById('correct-prog').textContent = progressionData.stats.correct;
    document.getElementById('total-prog').textContent = progressionData.stats.total;
    
    const feedback = document.getElementById('feedback-prog');
    feedback.textContent = correct ? 
        `✅ 正确！${correctProg.name}` : 
        `❌ 不对，是${correctProg.name}`;
    feedback.className = `practice-feedback ${correct ? 'correct' : 'wrong'}`;
    
    highlightProgressionButtons('prog', answer, correct);
}

// ========== 第4课爵士练习 ==========

async function playJazzProgression() {
    const keys = Object.keys(jazzData.progressions);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    
    jazzData.currentProgression = randomKey;
    const progression = jazzData.progressions[randomKey];
    
    await playProgression(progression.chords);
    resetProgressionButtons('jazz');
}

function checkJazzAnswer(answer) {
    const correct = answer === jazzData.currentProgression;
    const correctProg = jazzData.progressions[jazzData.currentProgression];
    
    jazzData.stats.total++;
    if (correct) jazzData.stats.correct++;
    
    document.getElementById('correct-jazz').textContent = jazzData.stats.correct;
    document.getElementById('total-jazz').textContent = jazzData.stats.total;
    
    const feedback = document.getElementById('feedback-jazz');
    feedback.textContent = correct ? 
        `✅ 正确！${correctProg.name}` : 
        `❌ 不对，是${correctProg.name}`;
    feedback.className = `practice-feedback ${correct ? 'correct' : 'wrong'}`;
    
    highlightProgressionButtons('jazz', answer, correct);
}

// ========== 第5课蓝调练习 ==========

async function playBluesProgression() {
    const keys = Object.keys(bluesData.progressions);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    
    bluesData.currentProgression = randomKey;
    const progression = bluesData.progressions[randomKey];
    
    // 只播放前6个和弦作为提示
    await playProgression(progression.chords.slice(0, 6));
    resetProgressionButtons('blues');
}

function checkBluesAnswer(answer) {
    const correct = answer === bluesData.currentProgression;
    const correctProg = bluesData.progressions[bluesData.currentProgression];
    
    bluesData.stats.total++;
    if (correct) bluesData.stats.correct++;
    
    document.getElementById('correct-blues').textContent = bluesData.stats.correct;
    document.getElementById('total-blues').textContent = bluesData.stats.total;
    
    const feedback = document.getElementById('feedback-blues');
    feedback.textContent = correct ? 
        `✅ 正确！${correctProg.name}` : 
        `❌ 不对，是${correctProg.name}`;
    feedback.className = `practice-feedback ${correct ? 'correct' : 'wrong'}`;
    
    highlightProgressionButtons('blues', answer, correct);
}

// ========== 第6课综合练习 ==========

async function playRandomAllProgression() {
    const keys = Object.keys(allProgressionsData.progressions);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    
    allProgressionsData.currentProgression = randomKey;
    const progression = allProgressionsData.progressions[randomKey];
    
    const display = document.getElementById('question-display-all');
    if (display) display.textContent = '🔊 正在播放...';
    
    await playProgression(progression.chords);
    
    setTimeout(() => {
        if (display) display.textContent = '🎧 听出来了吗？';
    }, 500);
    
    resetProgressionButtons('all');
}

function checkAllAnswer(answer) {
    const correct = answer === allProgressionsData.currentProgression;
    const correctProg = allProgressionsData.progressions[allProgressionsData.currentProgression];
    
    allProgressionsData.stats.total++;
    if (correct) allProgressionsData.stats.correct++;
    
    document.getElementById('correct-all').textContent = allProgressionsData.stats.correct;
    document.getElementById('total-all').textContent = allProgressionsData.stats.total;
    
    const feedback = document.getElementById('feedback-all');
    feedback.textContent = correct ? 
        `✅ 正确！${correctProg.name}` : 
        `❌ 不对，是${correctProg.name}`;
    feedback.className = `practice-feedback ${correct ? 'correct' : 'wrong'}`;
    
    highlightProgressionButtons('all', answer, correct);
}

// ========== 辅助函数 ==========

function resetAnswerButtons(lessonId) {
    document.querySelectorAll(`#answer-buttons-${lessonId} .answer-btn`)
        .forEach(btn => btn.classList.remove('correct', 'wrong'));
    const feedback = document.getElementById(`feedback-${lessonId}`);
    if (feedback) {
        feedback.textContent = '';
        feedback.className = 'practice-feedback';
    }
}

function highlightAnswer(lessonId, answer, correct) {
    document.querySelectorAll(`#answer-buttons-${lessonId} .answer-btn`).forEach(btn => {
        btn.classList.remove('correct', 'wrong');
        if (btn.dataset.answer === lessonData[lessonId].currentChord) {
            btn.classList.add('correct');
        } else if (btn.dataset.answer === answer && !correct) {
            btn.classList.add('wrong');
        }
    });
}

function resetProgressionButtons(type) {
    document.querySelectorAll(`#answer-buttons-${type} .answer-btn`)
        .forEach(btn => btn.classList.remove('correct', 'wrong'));
    const feedback = document.getElementById(`feedback-${type}`);
    if (feedback) {
        feedback.textContent = '';
        feedback.className = 'practice-feedback';
    }
}

function highlightProgressionButtons(type, answer, correct) {
    const dataMap = {
        'prog': progressionData,
        'jazz': jazzData,
        'blues': bluesData,
        'all': allProgressionsData
    };
    
    document.querySelectorAll(`#answer-buttons-${type} .answer-btn`).forEach(btn => {
        btn.classList.remove('correct', 'wrong');
        if (btn.dataset.answer === dataMap[type].currentProgression) {
            btn.classList.add('correct');
        } else if (btn.dataset.answer === answer && !correct) {
            btn.classList.add('wrong');
        }
    });
}

// ========== 课程导航 ==========

function goToLesson(lessonId) {
    document.querySelectorAll('.lesson-tab').forEach(tab => {
        tab.classList.toggle('active', parseInt(tab.dataset.lesson) === lessonId);
    });
    
    document.querySelectorAll('.lesson').forEach(lesson => {
        lesson.classList.toggle('active', lesson.id === `lesson-${lessonId}`);
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== 初始化 ==========

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lesson-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            goToLesson(parseInt(tab.dataset.lesson));
        });
    });
    
    document.addEventListener('click', () => {
        audioEngine.init().catch(e => console.log('Audio init deferred'));
    }, { once: true });
});
