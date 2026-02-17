/**
 * 主应用模块 - 和弦走向听力训练器
 */

class ChordTrainer {
    constructor() {
        // 状态
        this.currentMode = 'progression';
        this.difficulty = 1;
        this.selectedKeys = ['C'];
        this.selectedStyles = ['pop', 'jazz'];
        this.bpm = 90;
        this.duration = 1;
        this.instrument = 'piano';
        
        // 当前题目
        this.currentQuestion = null;
        this.questionNumber = 0;
        this.userAnswer = null;
        
        // 统计
        this.stats = {
            total: 0,
            correct: 0,
            streak: 0,
            maxStreak: 0,
            totalScore: 0,
            todayCount: 0,
            history: []
        };
        
        // 计时器
        this.timerInterval = null;
        this.timeElapsed = 0;
        
        // 事件监听
        this.setupEventListeners();
        
        // 加载保存的数据
        this.loadProgress();
    }

    /**
     * 初始化应用
     */
    init() {
        console.log('Chord Trainer initialized');
        this.updateUI();
        this.initProgressChart();
    }

    /**
     * 设置事件监听
     */
    setupEventListeners() {
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            // 避免在输入框中触发
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    this.togglePlayback();
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (document.getElementById('submit-btn').classList.contains('hidden')) {
                        this.nextQuestion();
                    } else {
                        this.submitAnswer();
                    }
                    break;
                case 'KeyN':
                    if (e.ctrlKey || e.metaKey) return;
                    this.nextQuestion();
                    break;
                case 'KeyH':
                    this.getHint();
                    break;
                case 'KeyR':
                    this.replay();
                    break;
                case 'Digit1':
                case 'Digit2':
                case 'Digit3':
                case 'Digit4':
                case 'Digit5':
                case 'Digit6':
                case 'Digit7':
                case 'Digit8':
                    const num = parseInt(e.code.replace('Digit', ''));
                    this.selectAnswerByIndex(num - 1);
                    break;
            }
        });
        
        // 点击答案选项
        document.addEventListener('click', (e) => {
            const answerBtn = e.target.closest('.answer-btn');
            if (answerBtn) {
                const index = parseInt(answerBtn.dataset.index);
                this.selectAnswer(index);
            }
        });
    }

    /**
     * 设置练习模式
     */
    setMode(mode) {
        this.currentMode = mode;
        
        // 更新UI
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        // 更新问题类型显示
        const modeNames = {
            'progression': '识别和弦走向',
            'single': '识别单个和弦',
            'key': '调性识别',
            'dictation': '听写模式'
        };
        document.getElementById('question-type').textContent = modeNames[mode];
        
        // 重新生成答案区
        this.generateAnswerArea();
        
        // 开始新题目
        this.generateQuestion();
    }

    /**
     * 设置难度
     */
    setDifficulty(level) {
        this.difficulty = Math.max(1, Math.min(5, level));
        
        // 更新滑块位置
        const fill = document.getElementById('difficulty-fill');
        const thumb = document.getElementById('difficulty-thumb');
        const percent = (level - 1) * 25;
        
        fill.style.width = percent + '%';
        thumb.style.left = percent + '%';
        
        // 更新显示
        document.getElementById('current-difficulty').textContent = 
            MusicTheory.difficultyLevels[level].name;
        
        this.generateQuestion();
    }

    /**
     * 更新BPM
     */
    updateBPM(value) {
        this.bpm = parseInt(value);
        document.getElementById('bpm-value').textContent = value;
        audioEngine.setBPM(this.bpm);
    }

    /**
     * 更新和弦持续时间
     */
    updateDuration(value) {
        this.duration = parseFloat(value);
        document.getElementById('duration-value').textContent = value + 's';
    }

    /**
     * 设置乐器
     */
    setInstrument(instrument) {
        this.instrument = instrument;
        audioEngine.setInstrument(instrument);
    }

    /**
     * 全选调性
     */
    selectAllKeys() {
        document.querySelectorAll('.key-btn').forEach(btn => {
            btn.classList.add('active');
        });
        this.selectedKeys = [...MusicTheory.noteNames, ...MusicTheory.noteNames.map(n => n + 'm')];
    }

    /**
     * 取消全选调性
     */
    deselectAllKeys() {
        document.querySelectorAll('.key-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.selectedKeys = [];
    }

    /**
     * 切换调性选择
     */
    toggleKey(key) {
        const btn = document.querySelector(`.key-btn[data-key="${key}"]`);
        if (!btn) return;
        
        btn.classList.toggle('active');
        
        if (btn.classList.contains('active')) {
            if (!this.selectedKeys.includes(key)) {
                this.selectedKeys.push(key);
            }
        } else {
            this.selectedKeys = this.selectedKeys.filter(k => k !== key);
        }
    }

    /**
     * 切换风格选择
     */
    toggleStyle(style) {
        const checkbox = document.querySelector(`input[data-style="${style}"]`);
        if (!checkbox) return;
        
        if (checkbox.checked) {
            if (!this.selectedStyles.includes(style)) {
                this.selectedStyles.push(style);
            }
        } else {
            this.selectedStyles = this.selectedStyles.filter(s => s !== style);
        }
    }

    /**
     * 生成答案区域
     */
    generateAnswerArea() {
        const area = document.getElementById('answer-area');
        
        switch (this.currentMode) {
            case 'progression':
                area.innerHTML = '<div class="answer-grid" id="answer-grid"></div>';
                break;
            case 'single':
                area.innerHTML = `
                    <div class="answer-grid chord-quality-grid">
                        <button class="answer-btn" data-quality="major">
                            <span class="answer-numerals">大三和弦</span>
                            <span class="answer-name">Major</span>
                        </button>
                        <button class="answer-btn" data-quality="minor">
                            <span class="answer-numerals">小三和弦</span>
                            <span class="answer-name">Minor</span>
                        </button>
                        <button class="answer-btn" data-quality="dim">
                            <span class="answer-numerals">减三和弦</span>
                            <span class="answer-name">Diminished</span>
                        </button>
                        <button class="answer-btn" data-quality="aug">
                            <span class="answer-numerals">增三和弦</span>
                            <span class="answer-name">Augmented</span>
                        </button>
                        <button class="answer-btn" data-quality="dom7">
                            <span class="answer-numerals">属七和弦</span>
                            <span class="answer-name">Dominant 7</span>
                        </button>
                        <button class="answer-btn" data-quality="maj7">
                            <span class="answer-numerals">大七和弦</span>
                            <span class="answer-name">Major 7</span>
                        </button>
                    </div>
                `;
                break;
            case 'key':
                area.innerHTML = '<div class="answer-grid key-grid" id="answer-grid"></div>';
                break;
            case 'dictation':
                area.innerHTML = `
                    <div class="dictation-area">
                        <div class="dictation-slots" id="dictation-slots"></div>
                        <div class="dictation-keyboard">
                            <p class="hint-text">点击下方按钮填写和弦</p>
                            <div class="chord-buttons" id="chord-buttons"></div>
                        </div>
                    </div>
                `;
                break;
        }
    }

    /**
     * 生成新题目
     */
    generateQuestion() {
        this.questionNumber++;
        this.userAnswer = null;
        this.timeElapsed = 0;
        
        // 更新题号显示
        document.getElementById('question-num').textContent = this.questionNumber;
        
        // 根据模式生成题目
        switch (this.currentMode) {
            case 'progression':
                this.generateProgressionQuestion();
                break;
            case 'single':
                this.generateSingleChordQuestion();
                break;
            case 'key':
                this.generateKeyQuestion();
                break;
            case 'dictation':
                this.generateDictationQuestion();
                break;
        }
        
        // 重置UI
        document.getElementById('feedback-area').classList.add('hidden');
        document.getElementById('submit-btn').classList.remove('hidden');
        document.getElementById('next-btn').classList.add('hidden');
        
        // 开始计时
        this.startTimer();
        
        // 清空和弦显示
        document.querySelector('#current-chord .chord-name').textContent = '-';
        
        // 更新进度指示器
        this.updateProgressIndicator();
    }

    /**
     * 生成和弦走向题目
     */
    generateProgressionQuestion() {
        // 随机选择调性
        const key = this.selectedKeys[Math.floor(Math.random() * this.selectedKeys.length)] || 'C';
        
        // 随机选择和弦走向
        const progression = MusicTheory.getRandomProgression(this.difficulty, this.selectedStyles);
        
        // 构建完整走向数据
        this.currentQuestion = {
            type: 'progression',
            key: key,
            progression: MusicTheory.buildProgression(key, progression),
            correctAnswer: progression.numerals.join(' - ')
        };
        
        // 更新当前调性显示
        const isMinor = key.includes('m');
        document.getElementById('current-key').textContent = 
            key + ' ' + (isMinor ? '小调' : '大调');
        
        // 生成答案选项
        this.generateProgressionOptions();
    }

    /**
     * 生成和弦走向答案选项
     */
    generateProgressionOptions() {
        const grid = document.getElementById('answer-grid');
        if (!grid) return;
        
        // 获取正确答案
        const correct = this.currentQuestion.correctAnswer;
        const correctNumerals = this.currentQuestion.progression.numerals;
        
        // 生成干扰选项
        const options = [correct];
        const allProgressions = [];
        
        // 收集所有可能的走向
        for (const style of this.selectedStyles) {
            const styleProgressions = MusicTheory.progressions[style] || [];
            allProgressions.push(...styleProgressions);
        }
        
        // 随机选择其他走向作为干扰项
        const shuffled = allProgressions.sort(() => Math.random() - 0.5);
        for (const prog of shuffled) {
            const answer = prog.numerals.join(' - ');
            if (!options.includes(answer) && options.length < 6) {
                options.push(answer);
            }
        }
        
        // 如果不够6个，生成随机变体
        while (options.length < 6) {
            const randomNumerals = this.generateRandomProgression(correctNumerals.length);
            const answer = randomNumerals.join(' - ');
            if (!options.includes(answer)) {
                options.push(answer);
            }
        }
        
        // 打乱顺序
        options.sort(() => Math.random() - 0.5);
        
        // 渲染选项
        grid.innerHTML = options.map((option, index) => `
            <button class="answer-btn" data-answer="${option}" data-index="${index}">
                <span class="answer-shortcut">${index + 1}</span>
                <span class="answer-numerals">${option}</span>
            </button>
        `).join('');
        
        // 存储选项
        this.currentQuestion.options = options;
    }

    /**
     * 生成随机和弦走向
     */
    generateRandomProgression(length) {
        const isMinor = Math.random() > 0.5;
        const numerals = isMinor ? 
            ['i', 'iidim', 'III', 'iv', 'V', 'VI', 'VII'] :
            ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'viidim'];
        
        const result = [];
        for (let i = 0; i < length; i++) {
            result.push(numerals[Math.floor(Math.random() * numerals.length)]);
        }
        return result;
    }

    /**
     * 生成单个和弦题目
     */
    generateSingleChordQuestion() {
        const key = this.selectedKeys[Math.floor(Math.random() * this.selectedKeys.length)] || 'C';
        const qualities = ['major', 'minor', 'dim', 'aug', 'dom7', 'maj7'];
        
        // 根据难度调整可选和弦
        const availableQualities = qualities.slice(0, this.difficulty + 2);
        const quality = availableQualities[Math.floor(Math.random() * availableQualities.length)];
        
        // 随机选择根音
        const isMinor = key.includes('m');
        const keyData = MusicTheory.keys[isMinor ? 'minor' : 'major'][key];
        const rootNote = keyData.notes[Math.floor(Math.random() * 7)];
        
        // 构建和弦
        const chordType = MusicTheory.chordTypes[quality];
        const midiRoot = MusicTheory.noteToMidi(rootNote);
        
        this.currentQuestion = {
            type: 'single',
            key: key,
            root: rootNote,
            quality: quality,
            midiNotes: chordType.intervals.map(i => midiRoot + i),
            correctAnswer: quality
        };
        
        document.getElementById('current-key').textContent = 
            key + ' ' + (isMinor ? '小调' : '大调');
    }

    /**
     * 生成调性识别题目
     */
    generateKeyQuestion() {
        // 随机选择一个和弦走向
        const key = this.selectedKeys[Math.floor(Math.random() * this.selectedKeys.length)] || 'C';
        const progression = MusicTheory.getRandomProgression(this.difficulty, ['pop']);
        
        this.currentQuestion = {
            type: 'key',
            correctKey: key,
            progression: MusicTheory.buildProgression(key, progression),
            correctAnswer: key
        };
        
        // 生成答案选项
        this.generateKeyOptions();
    }

    /**
     * 生成调性选项
     */
    generateKeyOptions() {
        const grid = document.getElementById('answer-grid');
        if (!grid) return;
        
        const correct = this.currentQuestion.correctAnswer;
        const options = [correct];
        
        // 添加其他调性作为干扰
        const allKeys = [...Object.keys(MusicTheory.keys.major), ...Object.keys(MusicTheory.keys.minor)];
        const shuffled = allKeys.sort(() => Math.random() - 0.5);
        
        for (const key of shuffled) {
            if (!options.includes(key) && options.length < 6) {
                options.push(key);
            }
        }
        
        options.sort(() => Math.random() - 0.5);
        
        grid.innerHTML = options.map((option, index) => `
            <button class="answer-btn" data-answer="${option}" data-index="${index}">
                <span class="answer-shortcut">${index + 1}</span>
                <span class="answer-numerals">${option}</span>
            </button>
        `).join('');
        
        this.currentQuestion.options = options;
    }

    /**
     * 生成听写模式题目
     */
    generateDictationQuestion() {
        const key = this.selectedKeys[Math.floor(Math.random() * this.selectedKeys.length)] || 'C';
        const progression = MusicTheory.getRandomProgression(this.difficulty, this.selectedStyles);
        
        this.currentQuestion = {
            type: 'dictation',
            key: key,
            progression: MusicTheory.buildProgression(key, progression),
            correctAnswer: progression.numerals,
            userAnswer: []
        };
        
        // 初始化听写槽位
        this.initDictationSlots(progression.numerals.length);
        
        // 生成和弦按钮
        this.generateChordButtons();
    }

    /**
     * 初始化听写槽位
     */
    initDictationSlots(count) {
        const slots = document.getElementById('dictation-slots');
        if (!slots) return;
        
        slots.innerHTML = Array(count).fill(0).map((_, i) => `
            <div class="dictation-slot" data-slot="${i}">
                <span class="slot-label">${i + 1}</span>
                <span class="slot-content">?</span>
            </div>
        `).join('');
    }

    /**
     * 生成和弦按钮
     */
    generateChordButtons() {
        const buttons = document.getElementById('chord-buttons');
        if (!buttons) return;
        
        const numerals = MusicTheory.romanNumerals.major.concat(MusicTheory.romanNumerals.minor);
        const uniqueNumerals = [...new Set(numerals)];
        
        buttons.innerHTML = uniqueNumerals.map(numeral => `
            <button class="chord-btn" data-numeral="${numeral}">${numeral}</button>
        `).join('');
        
        // 添加事件
        buttons.querySelectorAll('.chord-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.addDictationAnswer(btn.dataset.numeral);
            });
        });
    }

    /**
     * 添加听写答案
     */
    addDictationAnswer(numeral) {
        if (!this.currentQuestion) return;
        
        const slots = document.querySelectorAll('.dictation-slot');
        const userAnswer = this.currentQuestion.userAnswer;
        
        if (userAnswer.length < slots.length) {
            userAnswer.push(numeral);
            slots[userAnswer.length - 1].querySelector('.slot-content').textContent = numeral;
        }
    }

    /**
     * 选择答案
     */
    selectAnswer(index) {
        // 移除之前的选择
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // 选择当前
        const btn = document.querySelector(`.answer-btn[data-index="${index}"]`);
        if (btn) {
            btn.classList.add('selected');
            this.userAnswer = btn.dataset.answer;
        }
    }

    /**
     * 通过索引选择答案
     */
    selectAnswerByIndex(index) {
        this.selectAnswer(index);
    }

    /**
     * 播放和弦走向
     */
    async playProgression() {
        if (!this.currentQuestion) return;
        
        await audioEngine.init();
        
        const playBtn = document.getElementById('play-btn');
        const playIcon = document.getElementById('play-icon');
        
        if (audioEngine.isPlaying) {
            audioEngine.stopPlayback();
            playIcon.textContent = '▶️';
            return;
        }
        
        playIcon.textContent = '⏸️';
        
        // 获取MIDI数据
        const midiData = MusicTheory.getProgressionMidi(this.currentQuestion.progression);
        
        // 播放
        await audioEngine.playProgression(midiData, (index, chord) => {
            // 更新当前和弦显示
            document.querySelector('#current-chord .chord-name').textContent = chord.name;
            
            // 更新进度指示器
            this.updateProgressIndicator(index);
            
            // 更新钢琴卷帘
            this.updatePianoRoll(chord.notes);
        });
        
        playIcon.textContent = '▶️';
    }

    /**
     * 更新进度指示器
     */
    updateProgressIndicator(activeIndex = -1) {
        const indicator = document.getElementById('progression-indicator');
        if (!indicator || !this.currentQuestion) return;
        
        const length = this.currentQuestion.progression.chords.length;
        
        indicator.innerHTML = Array(length).fill(0).map((_, i) => `
            <div class="progression-dot ${i === activeIndex ? 'active' : ''} ${i < activeIndex ? 'completed' : ''}"></div>
        `).join('');
    }

    /**
     * 更新钢琴卷帘
     */
    updatePianoRoll(notes) {
        const roll = document.getElementById('piano-roll');
        if (!roll) return;
        
        // 清空
        roll.innerHTML = '';
        
        // 生成琴键高度
        const minMidi = 48; // C3
        const maxMidi = 84; // C6
        const range = maxMidi - minMidi;
        
        for (const note of notes) {
            const normalizedNote = note % 12 + 60; // 归一化到C4-C5范围
            const height = ((normalizedNote - minMidi) / range) * 100;
            
            const key = document.createElement('div');
            key.className = 'piano-key active';
            key.style.height = Math.max(10, Math.min(90, height)) + '%';
            roll.appendChild(key);
        }
    }

    /**
     * 切换播放
     */
    togglePlayback() {
        if (audioEngine.isPlaying) {
            audioEngine.stopPlayback();
            document.getElementById('play-icon').textContent = '▶️';
        } else {
            this.playProgression();
        }
    }

    /**
     * 重放
     */
    replay() {
        audioEngine.stopPlayback();
        this.playProgression();
    }

    /**
     * 停止播放
     */
    stopPlayback() {
        audioEngine.stopPlayback();
        document.getElementById('play-icon').textContent = '▶️';
    }

    /**
     * 提交答案
     */
    submitAnswer() {
        if (!this.userAnswer && this.currentMode !== 'dictation') {
            this.showToast('请先选择一个答案', 'error');
            return;
        }
        
        // 停止计时
        this.stopTimer();
        
        // 检查答案
        let isCorrect = false;
        
        if (this.currentMode === 'dictation') {
            isCorrect = this.checkDictationAnswer();
        } else {
            isCorrect = this.userAnswer === this.currentQuestion.correctAnswer;
        }
        
        // 更新统计
        this.updateStats(isCorrect);
        
        // 显示反馈
        this.showFeedback(isCorrect);
        
        // 高亮正确/错误答案
        this.highlightAnswers(isCorrect);
        
        // 更新UI
        document.getElementById('submit-btn').classList.add('hidden');
        document.getElementById('next-btn').classList.remove('hidden');
        
        // 检查成就
        this.checkAchievements();
        
        // 保存进度
        this.saveProgress();
    }

    /**
     * 检查听写答案
     */
    checkDictationAnswer() {
        if (!this.currentQuestion) return false;
        
        const userAnswer = this.currentQuestion.userAnswer;
        const correctAnswer = this.currentQuestion.correctAnswer;
        
        if (userAnswer.length !== correctAnswer.length) return false;
        
        return userAnswer.every((answer, i) => answer === correctAnswer[i]);
    }

    /**
     * 更新统计
     */
    updateStats(isCorrect) {
        this.stats.total++;
        this.stats.todayCount++;
        
        if (isCorrect) {
            this.stats.correct++;
            this.stats.streak++;
            this.stats.maxStreak = Math.max(this.stats.maxStreak, this.stats.streak);
            
            // 计算分数（根据难度和时间）
            const baseScore = this.difficulty * 100;
            const timeBonus = Math.max(0, 30 - this.timeElapsed) * 2;
            const streakBonus = Math.min(this.stats.streak * 10, 100);
            this.stats.totalScore += baseScore + timeBonus + streakBonus;
        } else {
            this.stats.streak = 0;
        }
        
        // 记录历史
        this.stats.history.push({
            question: this.questionNumber,
            correct: isCorrect,
            difficulty: this.difficulty,
            mode: this.currentMode,
            timestamp: Date.now()
        });
        
        // 更新UI
        this.updateStatsUI();
    }

    /**
     * 更新统计UI
     */
    updateStatsUI() {
        const accuracy = this.stats.total > 0 ? 
            Math.round((this.stats.correct / this.stats.total) * 100) : 0;
        
        document.getElementById('accuracy').textContent = accuracy + '%';
        document.getElementById('streak').textContent = this.stats.streak;
        document.getElementById('total-score').textContent = this.stats.totalScore;
        document.getElementById('today-count').textContent = this.stats.todayCount;
        document.getElementById('total-count').textContent = this.stats.total;
    }

    /**
     * 显示反馈
     */
    showFeedback(isCorrect) {
        const feedbackArea = document.getElementById('feedback-area');
        const feedbackIcon = document.getElementById('feedback-icon');
        const feedbackText = document.getElementById('feedback-text');
        const correctAnswer = document.getElementById('correct-answer');
        const userAnswer = document.getElementById('user-answer');
        
        feedbackArea.classList.remove('hidden', 'correct', 'incorrect');
        feedbackArea.classList.add(isCorrect ? 'correct' : 'incorrect');
        
        feedbackIcon.textContent = isCorrect ? '✓' : '✗';
        feedbackText.textContent = isCorrect ? '正确！' : '错误';
        
        correctAnswer.textContent = this.currentQuestion.correctAnswer;
        userAnswer.textContent = this.userAnswer || '未作答';
    }

    /**
     * 高亮答案
     */
    highlightAnswers(isCorrect) {
        document.querySelectorAll('.answer-btn').forEach(btn => {
            if (btn.dataset.answer === this.currentQuestion.correctAnswer) {
                btn.classList.add('correct');
            } else if (btn.classList.contains('selected') && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
    }

    /**
     * 跳过题目
     */
    skipQuestion() {
        this.userAnswer = null;
        this.submitAnswer();
    }

    /**
     * 获取提示
     */
    getHint() {
        if (!this.currentQuestion) return;
        
        let hint = '';
        
        switch (this.currentMode) {
            case 'progression':
                hint = `调性: ${this.currentQuestion.key}\n长度: ${this.currentQuestion.progression.chords.length}个和弦`;
                break;
            case 'single':
                hint = `根音: ${this.currentQuestion.root}`;
                break;
            case 'key':
                hint = `这是${this.currentQuestion.correctKey.includes('m') ? '小' : '大'}调`;
                break;
        }
        
        this.showToast(hint, 'info');
    }

    /**
     * 下一题
     */
    nextQuestion() {
        this.generateQuestion();
    }

    /**
     * 开始计时
     */
    startTimer() {
        this.stopTimer();
        this.timeElapsed = 0;
        
        this.timerInterval = setInterval(() => {
            this.timeElapsed++;
            const minutes = Math.floor(this.timeElapsed / 60);
            const seconds = this.timeElapsed % 60;
            document.getElementById('time-elapsed').textContent = 
                `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    /**
     * 停止计时
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    /**
     * 改变播放速度
     */
    changeSpeed(delta) {
        const newRate = audioEngine.playbackRate + delta;
        if (newRate >= 0.5 && newRate <= 2) {
            audioEngine.setPlaybackRate(newRate);
            document.getElementById('speed-value').textContent = newRate + 'x';
        }
    }

    /**
     * 检查成就
     */
    checkAchievements() {
        const achievements = document.querySelectorAll('.achievement');
        
        // 初次成功
        if (this.stats.correct >= 1) {
            achievements[0]?.classList.remove('locked');
            achievements[0]?.classList.add('unlocked');
        }
        
        // 五连胜
        if (this.stats.streak >= 5) {
            achievements[1]?.classList.remove('locked');
            achievements[1]?.classList.add('unlocked');
        }
        
        // 十连胜
        if (this.stats.streak >= 10) {
            achievements[2]?.classList.remove('locked');
            achievements[2]?.classList.add('unlocked');
        }
        
        // 专家级
        if (this.difficulty >= 4 && this.stats.correct >= 50) {
            achievements[3]?.classList.remove('locked');
            achievements[3]?.classList.add('unlocked');
        }
    }

    /**
     * 初始化进度图表
     */
    initProgressChart() {
        const canvas = document.getElementById('progress-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        this.progressCtx = ctx;
        
        this.drawProgressChart();
    }

    /**
     * 绘制进度图表
     */
    drawProgressChart() {
        if (!this.progressCtx) return;
        
        const ctx = this.progressCtx;
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        
        // 清空
        ctx.clearRect(0, 0, width, height);
        
        // 背景
        ctx.fillStyle = '#1e1e3f';
        ctx.fillRect(0, 0, width, height);
        
        // 绘制最近10次的成绩
        const recentHistory = this.stats.history.slice(-10);
        if (recentHistory.length === 0) return;
        
        const barWidth = (width - 20) / recentHistory.length;
        const maxHeight = height - 30;
        
        recentHistory.forEach((item, i) => {
            const barHeight = item.correct ? maxHeight : 10;
            const x = 10 + i * barWidth;
            const y = height - 15 - barHeight;
            
            ctx.fillStyle = item.correct ? '#22c55e' : '#ef4444';
            ctx.fillRect(x, y, barWidth - 2, barHeight);
        });
    }

    /**
     * 切换参考类别
     */
    toggleCategory(categoryId) {
        const content = document.getElementById(categoryId);
        const title = content?.previousElementSibling;
        
        if (content) {
            content.classList.toggle('show');
        }
        if (title) {
            title.classList.toggle('expanded');
        }
    }

    /**
     * 显示设置
     */
    showSettings() {
        document.getElementById('settings-modal')?.classList.remove('hidden');
    }

    /**
     * 显示帮助
     */
    showHelp() {
        document.getElementById('help-modal')?.classList.remove('hidden');
    }

    /**
     * 关闭模态框
     */
    closeModal(modalId) {
        document.getElementById(modalId)?.classList.add('hidden');
    }

    /**
     * 保存设置
     */
    saveSettings() {
        const masterVolume = document.getElementById('master-volume')?.value / 100;
        const reverbAmount = document.getElementById('reverb-amount')?.value / 100;
        const darkMode = document.getElementById('dark-mode')?.checked;
        
        audioEngine.setMasterVolume(masterVolume);
        audioEngine.setReverbAmount(reverbAmount);
        
        // TODO: 应用深色模式
        
        this.closeModal('settings-modal');
        this.showToast('设置已保存', 'success');
    }

    /**
     * 重置设置
     */
    resetSettings() {
        document.getElementById('master-volume').value = 80;
        document.getElementById('reverb-amount').value = 30;
        document.getElementById('dark-mode').checked = false;
    }

    /**
     * 保存进度
     */
    saveProgress() {
        try {
            localStorage.setItem('chordTrainer_progress', JSON.stringify(this.stats));
        } catch (e) {
            console.warn('Failed to save progress:', e);
        }
    }

    /**
     * 加载进度
     */
    loadProgress() {
        try {
            const saved = localStorage.getItem('chordTrainer_progress');
            if (saved) {
                const data = JSON.parse(saved);
                this.stats = { ...this.stats, ...data };
                
                // 检查是否是今天
                const today = new Date().toDateString();
                const lastDate = new Date(data.lastDate).toDateString();
                if (today !== lastDate) {
                    this.stats.todayCount = 0;
                }
            }
            this.stats.lastDate = Date.now();
        } catch (e) {
            console.warn('Failed to load progress:', e);
        }
    }

    /**
     * 重置进度
     */
    resetProgress() {
        if (confirm('确定要重置所有进度吗？此操作不可恢复。')) {
            this.stats = {
                total: 0,
                correct: 0,
                streak: 0,
                maxStreak: 0,
                totalScore: 0,
                todayCount: 0,
                history: []
            };
            this.saveProgress();
            this.updateStatsUI();
            this.drawProgressChart();
            this.showToast('进度已重置', 'info');
        }
    }

    /**
     * 导出数据
     */
    exportProgress() {
        const data = JSON.stringify(this.stats, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `chord-trainer-progress-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        this.showToast('数据已导出', 'success');
    }

    /**
     * 更新UI
     */
    updateUI() {
        this.updateStatsUI();
        this.setDifficulty(this.difficulty);
    }

    /**
     * 显示Toast通知
     */
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
            <span class="toast-message">${message}</span>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// ===== 全局函数 =====

let trainer;

function startApp() {
    // 隐藏启动屏幕
    document.getElementById('splash-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    
    // 初始化训练器
    trainer = new ChordTrainer();
    trainer.init();
    
    // 生成第一题
    trainer.generateQuestion();
}

function setMode(mode) {
    trainer?.setMode(mode);
}

function setDifficulty(level) {
    trainer?.setDifficulty(level);
}

function updateBPM(value) {
    trainer?.updateBPM(value);
}

function updateDuration(value) {
    trainer?.updateDuration(value);
}

function setInstrument(value) {
    trainer?.setInstrument(value);
}

function selectAllKeys() {
    trainer?.selectAllKeys();
}

function deselectAllKeys() {
    trainer?.deselectAllKeys();
}

function playProgression() {
    trainer?.playProgression();
}

function playPrevious() {
    // TODO: 实现
}

function playNext() {
    // TODO: 实现
}

function stopPlayback() {
    trainer?.stopPlayback();
}

function changeSpeed(delta) {
    trainer?.changeSpeed(delta);
}

function submitAnswer() {
    trainer?.submitAnswer();
}

function skipQuestion() {
    trainer?.skipQuestion();
}

function getHint() {
    trainer?.getHint();
}

function nextQuestion() {
    trainer?.nextQuestion();
}

function toggleCategory(categoryId) {
    trainer?.toggleCategory(categoryId);
}

function showSettings() {
    trainer?.showSettings();
}

function showHelp() {
    trainer?.showHelp();
}

function closeModal(modalId) {
    trainer?.closeModal(modalId);
}

function saveSettings() {
    trainer?.saveSettings();
}

function resetSettings() {
    trainer?.resetSettings();
}

function resetProgress() {
    trainer?.resetProgress();
}

function exportProgress() {
    trainer?.exportProgress();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 预初始化音频引擎
    document.addEventListener('click', () => {
        audioEngine.init().catch(e => console.warn('Audio init deferred'));
    }, { once: true });
});

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ChordTrainer, trainer };
}
