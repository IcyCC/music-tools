/**
 * 音乐理论模块 - 和弦走向听力训练器
 * 包含所有调性、和弦、走向的理论数据
 */

const MusicTheory = {
    // ===== 音名 =====
    noteNames: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
    flatNoteNames: ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'],
    
    // ===== 音程（半音数）=====
    intervals: {
        'P1': 0,   // 纯一度
        'm2': 1,   // 小二度
        'M2': 2,   // 大二度
        'm3': 3,   // 小三度
        'M3': 4,   // 大三度
        'P4': 5,   // 纯四度
        'A4': 6,   // 增四度/减五度
        'P5': 7,   // 纯五度
        'm6': 8,   // 小六度
        'M6': 9,   // 大六度
        'm7': 10,  // 小七度
        'M7': 11,  // 大七度
        'P8': 12   // 纯八度
    },

    // ===== 和弦类型 =====
    chordTypes: {
        'major': {
            name: '大调和弦',
            symbol: '',
            intervals: [0, 4, 7],
            quality: 'major'
        },
        'minor': {
            name: '小调和弦',
            symbol: 'm',
            intervals: [0, 3, 7],
            quality: 'minor'
        },
        'dim': {
            name: '减三和弦',
            symbol: '°',
            intervals: [0, 3, 6],
            quality: 'diminished'
        },
        'aug': {
            name: '增三和弦',
            symbol: '+',
            intervals: [0, 4, 8],
            quality: 'augmented'
        },
        'dom7': {
            name: '属七和弦',
            symbol: '7',
            intervals: [0, 4, 7, 10],
            quality: 'dominant'
        },
        'maj7': {
            name: '大七和弦',
            symbol: 'maj7',
            intervals: [0, 4, 7, 11],
            quality: 'major'
        },
        'm7': {
            name: '小七和弦',
            symbol: 'm7',
            intervals: [0, 3, 7, 10],
            quality: 'minor'
        },
        'm7b5': {
            name: '半减七和弦',
            symbol: 'm7b5',
            intervals: [0, 3, 6, 10],
            quality: 'half-diminished'
        },
        'dim7': {
            name: '减七和弦',
            symbol: 'dim7',
            intervals: [0, 3, 6, 9],
            quality: 'diminished'
        },
        'sus2': {
            name: '挂二和弦',
            symbol: 'sus2',
            intervals: [0, 2, 7],
            quality: 'suspended'
        },
        'sus4': {
            name: '挂四和弦',
            symbol: 'sus4',
            intervals: [0, 5, 7],
            quality: 'suspended'
        },
        'add9': {
            name: '加九和弦',
            symbol: 'add9',
            intervals: [0, 4, 7, 14],
            quality: 'major'
        },
        '6': {
            name: '六和弦',
            symbol: '6',
            intervals: [0, 4, 7, 9],
            quality: 'major'
        },
        'm6': {
            name: '小六和弦',
            symbol: 'm6',
            intervals: [0, 3, 7, 9],
            quality: 'minor'
        }
    },

    // ===== 大调音阶 =====
    majorScale: [0, 2, 4, 5, 7, 9, 11], // W-W-H-W-W-W-H
    
    // ===== 小调音阶 =====
    minorScale: {
        natural: [0, 2, 3, 5, 7, 8, 10],    // 自然小调
        harmonic: [0, 2, 3, 5, 7, 8, 11],   // 和声小调
        melodic: [0, 2, 3, 5, 7, 9, 11]     // 旋律小调（上行）
    },

    // ===== 调性数据 =====
    keys: {
        // 大调
        major: {
            'C':  { notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'], signature: 0 },
            'G':  { notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'], signature: 1 },
            'D':  { notes: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'], signature: 2 },
            'A':  { notes: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'], signature: 3 },
            'E':  { notes: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'], signature: 4 },
            'B':  { notes: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'], signature: 5 },
            'F#': { notes: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'], signature: 6 },
            'F':  { notes: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'], signature: -1 },
            'Bb': { notes: ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'], signature: -2 },
            'Eb': { notes: ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'], signature: -3 },
            'Ab': { notes: ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'], signature: -4 },
            'Db': { notes: ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'], signature: -5 }
        },
        // 小调
        minor: {
            'Am':  { notes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], signature: 0, relativeMajor: 'C' },
            'Em':  { notes: ['E', 'F#', 'G', 'A', 'B', 'C', 'D'], signature: 1, relativeMajor: 'G' },
            'Bm':  { notes: ['B', 'C#', 'D', 'E', 'F#', 'G', 'A'], signature: 2, relativeMajor: 'D' },
            'F#m': { notes: ['F#', 'G#', 'A', 'B', 'C#', 'D', 'E'], signature: 3, relativeMajor: 'A' },
            'C#m': { notes: ['C#', 'D#', 'E', 'F#', 'G#', 'A', 'B'], signature: 4, relativeMajor: 'E' },
            'G#m': { notes: ['G#', 'A#', 'B', 'C#', 'D#', 'E', 'F#'], signature: 5, relativeMajor: 'B' },
            'D#m': { notes: ['D#', 'E#', 'F#', 'G#', 'A#', 'B', 'C#'], signature: 6, relativeMajor: 'F#' },
            'Dm':  { notes: ['D', 'E', 'F', 'G', 'A', 'Bb', 'C'], signature: -1, relativeMajor: 'F' },
            'Gm':  { notes: ['G', 'A', 'Bb', 'C', 'D', 'Eb', 'F'], signature: -2, relativeMajor: 'Bb' },
            'Cm':  { notes: ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'], signature: -3, relativeMajor: 'Eb' },
            'Fm':  { notes: ['F', 'G', 'Ab', 'Bb', 'C', 'Db', 'Eb'], signature: -4, relativeMajor: 'Ab' },
            'Bbm': { notes: ['Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'Ab'], signature: -5, relativeMajor: 'Db' }
        }
    },

    // ===== 罗马数字标记 =====
    romanNumerals: {
        major: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'viidim'],
        minor: ['i', 'iidim', 'III', 'iv', 'V', 'VI', 'VII']
    },

    // ===== 和弦走向库 =====
    progressions: {
        pop: [
            {
                numerals: ['I', 'V', 'vi', 'IV'],
                name: 'Canon进行',
                nameEn: 'Canon Progression',
                description: '最常见的流行进行，帕赫贝尔卡农',
                difficulty: 1,
                examples: ['Let It Be', 'Don\'t Stop Believing', 'We Are Young']
            },
            {
                numerals: ['I', 'vi', 'IV', 'V'],
                name: '50年代进行',
                nameEn: '50s Progression',
                description: '经典老歌常用',
                difficulty: 1,
                examples: ['Stand By Me', 'Every Breath You Take']
            },
            {
                numerals: ['vi', 'IV', 'I', 'V'],
                name: '悲伤进行',
                nameEn: 'Sad Progression',
                description: '从小调和弦开始，带有忧伤感',
                difficulty: 2,
                examples: ['Someone Like You', 'Apologize']
            },
            {
                numerals: ['I', 'IV', 'V', 'I'],
                name: '基础三和弦',
                nameEn: 'Basic Three Chords',
                description: '最简单的进行',
                difficulty: 1,
                examples: ['La Bamba', 'Twist and Shout']
            },
            {
                numerals: ['I', 'V', 'IV', 'I'],
                name: 'Blues Rock',
                nameEn: 'Blues Rock',
                description: '布鲁斯摇滚风格',
                difficulty: 1,
                examples: ['Johnny B. Goode', 'Rock Around the Clock']
            },
            {
                numerals: ['vi', 'I', 'V', 'IV'],
                name: 'Axis进行',
                nameEn: 'Axis Progression',
                description: '现代流行常用',
                difficulty: 2,
                examples: ['With or Without You', 'Be the One']
            },
            {
                numerals: ['I', 'iii', 'vi', 'IV'],
                name: '敏感进行',
                nameEn: 'Sensitive Progression',
                description: '带有大调小调暧昧感',
                difficulty: 3,
                examples: ['No Woman No Cry']
            },
            {
                numerals: ['IV', 'I', 'V', 'vi'],
                name: '反转Canon',
                nameEn: 'Inverted Canon',
                description: 'Canon进行变体',
                difficulty: 2,
                examples: []
            },
            {
                numerals: ['I', 'IV', 'vi', 'V'],
                name: '流行变体1',
                nameEn: 'Pop Variant 1',
                description: '流行音乐变体',
                difficulty: 2,
                examples: ['Complicated', 'Back to December']
            },
            {
                numerals: ['I', 'I', 'IV', 'V'],
                name: 'Amen终止',
                nameEn: 'Amen Cadence',
                description: '宗教音乐常用',
                difficulty: 1,
                examples: []
            }
        ],
        
        jazz: [
            {
                numerals: ['ii', 'V', 'I'],
                name: '爵士核心',
                nameEn: 'ii-V-I',
                description: '爵士乐最重要进行',
                difficulty: 2,
                examples: ['Autumn Leaves', 'All The Things You Are']
            },
            {
                numerals: ['vi', 'ii', 'V', 'I'],
                name: '扩展ii-V-I',
                nameEn: 'Extended ii-V-I',
                description: '四小节扩展版',
                difficulty: 3,
                examples: ['Fly Me to the Moon']
            },
            {
                numerals: ['I', 'vi', 'ii', 'V'],
                name: 'Turnaround',
                nameEn: 'Turnaround',
                description: '循环进行',
                difficulty: 3,
                examples: ['I\'ve Got Rhythm']
            },
            {
                numerals: ['iii', 'vi', 'ii', 'V', 'I'],
                name: 'All The Things',
                nameEn: 'All The Things',
                description: '最长常用进行',
                difficulty: 4,
                examples: ['All The Things You Are']
            },
            {
                numerals: ['I', 'IV', 'viidim', 'iii'],
                name: 'Satie进行',
                nameEn: 'Satie Progression',
                description: '印象派色彩',
                difficulty: 4,
                examples: []
            },
            {
                numerals: ['ii7', 'V7', 'Imaj7'],
                name: '七和弦ii-V-I',
                nameEn: 'Seventh ii-V-I',
                description: '加入七音',
                difficulty: 3,
                examples: []
            },
            {
                numerals: ['iiim7', 'vim7', 'iim7', 'V7'],
                name: '爵士Turnaround',
                nameEn: 'Jazz Turnaround',
                description: '全七和弦',
                difficulty: 4,
                examples: []
            },
            {
                numerals: ['I', 'bIIIdim7', 'ii7', 'V7'],
                name: 'Coltrane变体',
                nameEn: 'Coltrane Variant',
                description: '减和弦替换',
                difficulty: 5,
                examples: []
            },
            {
                numerals: ['ii7', 'V7alt', 'Imaj7'],
                name: '变化属七',
                nameEn: 'Altered Dominant',
                description: '使用变化音',
                difficulty: 5,
                examples: []
            },
            {
                numerals: ['iiim7', 'VI7', 'iim7', 'V7'],
                name: 'Backdoor进行',
                nameEn: 'Backdoor Progression',
                description: '后门进行',
                difficulty: 4,
                examples: []
            }
        ],

        blues: [
            {
                numerals: ['I', 'I', 'I', 'I', 'IV', 'IV', 'I', 'I', 'V', 'IV', 'I', 'V'],
                name: '12小节蓝调',
                nameEn: '12-Bar Blues',
                description: '蓝调基础结构',
                difficulty: 2,
                examples: ['Sweet Home Chicago', 'Crossroads']
            },
            {
                numerals: ['I', 'IV', 'I', 'V'],
                name: '8小节蓝调',
                nameEn: '8-Bar Blues',
                description: '简化蓝调',
                difficulty: 2,
                examples: []
            },
            {
                numerals: ['I7', 'IV7', 'V7'],
                name: '三和弦蓝调',
                nameEn: 'Three Chord Blues',
                description: '最简蓝调',
                difficulty: 1,
                examples: []
            },
            {
                numerals: ['I7', 'I7', 'I7', 'I7', 'IV7', 'IV7', 'I7', 'I7', 'V7', 'IV7', 'I7', 'I7'],
                name: '快速变化',
                nameEn: 'Quick Change',
                description: '第二小节到IV',
                difficulty: 2,
                examples: []
            },
            {
                numerals: ['I7', 'IV7', 'I7', 'V7', 'IV7', 'I7', 'iiim7', 'V7'],
                name: '爵士蓝调',
                nameEn: 'Jazz Blues',
                description: '融合爵士',
                difficulty: 4,
                examples: []
            }
        ],

        classical: [
            {
                numerals: ['I', 'IV', 'V', 'I'],
                name: '正格终止',
                nameEn: 'Authentic Cadence',
                description: '古典基础',
                difficulty: 1,
                examples: []
            },
            {
                numerals: ['I', 'vi', 'IV', 'V'],
                name: '变格进行',
                nameEn: 'Plagal Motion',
                description: '教会终止',
                difficulty: 2,
                examples: []
            },
            {
                numerals: ['I', 'V', 'vi', 'IV'],
                name: ' deceive终止',
                nameEn: 'Deceptive Cadence',
                description: 'V到vi的欺骗',
                difficulty: 3,
                examples: []
            },
            {
                numerals: ['I', 'ii6', 'V', 'I'],
                name: '二和弦进行',
                nameEn: 'Second Chord Progression',
                description: '古典常用',
                difficulty: 3,
                examples: []
            },
            {
                numerals: ['I', 'V6', 'vi', 'IV6'],
                name: '第一转位',
                nameEn: 'First Inversion',
                description: '使用转位',
                difficulty: 4,
                examples: []
            },
            {
                numerals: ['I', 'I6', 'IV', 'V6', 'I'],
                name: '古典序进',
                nameEn: 'Classical Sequence',
                description: '古典序进',
                difficulty: 4,
                examples: []
            }
        ],

        rock: [
            {
                numerals: ['I', 'bVII', 'bVI', 'V'],
                name: 'Andalusian',
                nameEn: 'Andalusian Cadence',
                description: '摇滚/金属常用',
                difficulty: 3,
                examples: ['Hit the Road Jack', 'Sultans of Swing']
            },
            {
                numerals: ['I', 'bVII', 'IV', 'I'],
                name: 'Mixolydian Rock',
                nameEn: 'Mixolydian Rock',
                description: '调式摇滚',
                difficulty: 2,
                examples: ['Sweet Child O Mine']
            },
            {
                numerals: ['i', 'bVI', 'bIII', 'bVII'],
                name: '小调摇滚',
                nameEn: 'Minor Rock',
                description: '黑暗摇滚',
                difficulty: 3,
                examples: ['All Along the Watchtower']
            },
            {
                numerals: ['I', 'V', 'vi', 'iii', 'IV', 'I', 'IV', 'V'],
                name: '史诗进行',
                nameEn: 'Epic Progression',
                description: '史诗感',
                difficulty: 3,
                examples: ['Earth Song']
            }
        ],

        // 小调和弦走向
        minor: [
            {
                numerals: ['i', 'VI', 'III', 'VII'],
                name: '小调进行1',
                nameEn: 'Minor Progression 1',
                description: '小调经典',
                difficulty: 2,
                examples: ['Zombie', 'Shadow of the Day']
            },
            {
                numerals: ['i', 'iv', 'VII', 'III'],
                name: '小调进行2',
                nameEn: 'Minor Progression 2',
                description: '小调常用',
                difficulty: 2,
                examples: []
            },
            {
                numerals: ['i', 'bVI', 'bIII', 'bVII'],
                name: '自然小调',
                nameEn: 'Natural Minor',
                description: '自然小调序列',
                difficulty: 2,
                examples: []
            },
            {
                numerals: ['i', 'iv', 'V', 'i'],
                name: '和声小调',
                nameEn: 'Harmonic Minor',
                description: 'V大调和弦',
                difficulty: 3,
                examples: []
            },
            {
                numerals: ['i', 'VI', 'v', 'iv'],
                name: 'Andalusian小调',
                nameEn: 'Andalusian Minor',
                description: '弗拉明戈色彩',
                difficulty: 4,
                examples: []
            }
        ]
    },

    // ===== 难度等级配置 =====
    difficultyLevels: {
        1: {
            name: '初级',
            description: '基础三和弦，I-IV-V',
            chordTypes: ['major', 'minor'],
            progressionLength: [2, 4],
            keys: ['C', 'G', 'F', 'Am', 'Em'],
            progressionStyles: ['pop']
        },
        2: {
            name: '中级',
            description: '常见流行走向',
            chordTypes: ['major', 'minor', 'dom7'],
            progressionLength: [4],
            keys: ['C', 'G', 'D', 'A', 'F', 'Am', 'Em', 'Dm'],
            progressionStyles: ['pop', 'blues']
        },
        3: {
            name: '高级',
            description: '七和弦，爵士基础',
            chordTypes: ['major', 'minor', 'dom7', 'maj7', 'm7'],
            progressionLength: [4, 8],
            keys: 'all',
            progressionStyles: ['pop', 'jazz', 'blues']
        },
        4: {
            name: '专家',
            description: '复杂和弦，转调',
            chordTypes: 'all',
            progressionLength: [4, 8, 12],
            keys: 'all',
            progressionStyles: ['pop', 'jazz', 'blues', 'classical', 'rock']
        },
        5: {
            name: '大师',
            description: '所有技巧，长序列',
            chordTypes: 'all',
            progressionLength: [8, 12, 16],
            keys: 'all',
            progressionStyles: ['pop', 'jazz', 'blues', 'classical', 'rock', 'minor']
        }
    },

    // ===== 辅助方法 =====
    
    /**
     * 获取和弦在调内的级数
     * @param {string} key - 调性 (如 'C', 'Am')
     * @param {string} chord - 和弦 (如 'C', 'Dm')
     * @returns {object} 级数信息
     */
    getChordDegree(key, chord) {
        const isMinor = key.includes('m');
        const mode = isMinor ? 'minor' : 'major';
        const keyData = this.keys[mode][key];
        
        if (!keyData) return null;
        
        const rootNote = chord.replace(/[m7°+]/g, '');
        const degree = keyData.notes.indexOf(rootNote);
        
        if (degree === -1) return null;
        
        const numerals = isMinor ? this.romanNumerals.minor : this.romanNumerals.major;
        return {
            degree: degree + 1,
            numeral: numerals[degree],
            isMinor: isMinor
        };
    },

    /**
     * 构建指定调性和级数的和弦
     * @param {string} key - 调性
     * @param {number|string} degree - 级数
     * @param {string} chordType - 和弦类型
     * @returns {object} 和弦信息
     */
    buildChord(key, degree, chordType = 'major') {
        const isMinor = key.includes('m');
        const mode = isMinor ? 'minor' : 'major';
        const keyData = this.keys[mode][key];
        
        if (!keyData) return null;
        
        // 处理罗马数字
        if (typeof degree === 'string') {
            degree = this.romanToDegree(degree, isMinor);
        }
        
        const rootIndex = (degree - 1) % 7;
        const rootNote = keyData.notes[rootIndex];
        
        // 根据级数确定和弦类型
        let quality = chordType;
        if (!chordType || chordType === 'major') {
            if (isMinor) {
                if (degree === 1 || degree === 4 || degree === 5) quality = 'minor';
                else if (degree === 2) quality = 'dim';
                else quality = 'major';
            } else {
                if (degree === 2 || degree === 3 || degree === 6) quality = 'minor';
                else if (degree === 7) quality = 'dim';
                else quality = 'major';
            }
        }
        
        const chordInfo = this.chordTypes[quality];
        const midiRoot = this.noteToMidi(rootNote);
        
        return {
            name: rootNote + chordInfo.symbol,
            root: rootNote,
            quality: quality,
            intervals: chordInfo.intervals,
            midiNotes: chordInfo.intervals.map(i => midiRoot + i),
            numeral: this.degreeToRoman(degree, isMinor, quality)
        };
    },

    /**
     * 罗马数字转级数
     */
    romanToDegree(roman, isMinor = false) {
        const numerals = isMinor ? this.romanNumerals.minor : this.romanNumerals.major;
        const cleanRoman = roman.replace(/dim|°/g, '').replace(/7/g, '');
        const index = numerals.findIndex(n => n.includes(cleanRoman) || cleanRoman.includes(n));
        return index + 1;
    },

    /**
     * 级数转罗马数字
     */
    degreeToRoman(degree, isMinor = false, quality = 'major') {
        const numerals = isMinor ? this.romanNumerals.minor : this.romanNumerals.major;
        let numeral = numerals[(degree - 1) % 7];
        
        if (quality === 'dim' || quality === 'm7b5') {
            numeral = numeral + '°';
        } else if (quality === 'aug') {
            numeral = numeral + '+';
        }
        
        return numeral;
    },

    /**
     * 音名转MIDI编号
     */
    noteToMidi(note, octave = 4) {
        const noteMap = {
            'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
            'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
            'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
        };
        return noteMap[note] + (octave + 1) * 12;
    },

    /**
     * MIDI编号转音名
     */
    midiToNote(midi, useFlats = false) {
        const note = midi % 12;
        const octave = Math.floor(midi / 12) - 1;
        const names = useFlats ? this.flatNoteNames : this.noteNames;
        return names[note] + octave;
    },

    /**
     * 获取指定难度的随机和弦走向
     */
    getRandomProgression(difficulty, styles = ['pop', 'jazz']) {
        const config = this.difficultyLevels[difficulty];
        let availableProgressions = [];
        
        for (const style of styles) {
            if (config.progressionStyles.includes(style) || config.progressionStyles === 'all') {
                const styleProgressions = this.progressions[style] || [];
                availableProgressions = availableProgressions.concat(
                    styleProgressions.filter(p => p.difficulty <= difficulty)
                );
            }
        }
        
        if (availableProgressions.length === 0) {
            availableProgressions = this.progressions.pop;
        }
        
        return availableProgressions[Math.floor(Math.random() * availableProgressions.length)];
    },

    /**
     * 获取指定难度的随机调性
     */
    getRandomKey(difficulty) {
        const config = this.difficultyLevels[difficulty];
        let availableKeys = [];
        
        if (config.keys === 'all') {
            availableKeys = [
                ...Object.keys(this.keys.major),
                ...Object.keys(this.keys.minor)
            ];
        } else {
            availableKeys = config.keys;
        }
        
        return availableKeys[Math.floor(Math.random() * availableKeys.length)];
    },

    /**
     * 构建完整的和弦走向
     */
    buildProgression(key, progression) {
        const isMinor = key.includes('m');
        const chords = [];
        
        for (const numeral of progression.numerals) {
            const degree = this.romanToDegree(numeral, isMinor);
            const quality = this.inferQuality(numeral);
            chords.push(this.buildChord(key, degree, quality));
        }
        
        return {
            key: key,
            name: progression.name,
            nameEn: progression.nameEn,
            numerals: progression.numerals,
            chords: chords,
            difficulty: progression.difficulty
        };
    },

    /**
     * 从罗马数字推断和弦质量
     */
    inferQuality(numeral) {
        if (numeral.includes('°') || numeral.includes('dim')) return 'dim';
        if (numeral.includes('+') || numeral.includes('aug')) return 'aug';
        if (numeral.includes('7')) {
            if (numeral.toLowerCase() === numeral) return 'm7';
            if (numeral.includes('m7')) return 'm7';
            if (numeral.includes('maj7')) return 'maj7';
            return 'dom7';
        }
        if (numeral.toLowerCase() === numeral) return 'minor';
        if (numeral.toUpperCase() === numeral) return 'major';
        return 'major';
    },

    /**
     * 获取和弦走向的MIDI数据
     */
    getProgressionMidi(progressionData) {
        return progressionData.chords.map(chord => ({
            name: chord.name,
            notes: chord.midiNotes,
            numeral: chord.numeral,
            duration: 1
        }));
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MusicTheory;
}
