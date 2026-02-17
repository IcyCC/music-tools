/**
 * 音频引擎 - 和弦听辨课程
 */

class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.initialized = false;
    }

    /**
     * 初始化音频上下文
     */
    async init() {
        if (this.initialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 0.5;
            this.masterGain.connect(this.audioContext.destination);
            this.initialized = true;
        } catch (e) {
            console.error('音频初始化失败:', e);
        }
    }

    /**
     * 播放单个和弦
     */
    async playChord(chordName, octave = 4) {
        await this.init();
        
        const notes = this.getChordNotes(chordName, octave);
        const now = this.audioContext.currentTime;
        const duration = 1.5;
        
        notes.forEach((freq, index) => {
            this.playNote(freq, now, duration);
        });
    }

    /**
     * 播放和弦进行
     */
    async playProgression(chords) {
        await this.init();
        
        const now = this.audioContext.currentTime;
        const chordDuration = 1.2;
        
        chords.forEach((chord, index) => {
            const startTime = now + index * chordDuration;
            const notes = this.getChordNotes(chord, 4);
            notes.forEach(freq => {
                this.playNote(freq, startTime, chordDuration - 0.2);
            });
        });
    }

    /**
     * 播放单个音符
     */
    playNote(frequency, startTime, duration) {
        const ctx = this.audioContext;
        
        // 创建振荡器组合模拟钢琴
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const osc3 = ctx.createOscillator();
        
        const gain1 = ctx.createGain();
        const gain2 = ctx.createGain();
        const gain3 = ctx.createGain();
        
        // 基频 + 泛音
        osc1.type = 'triangle';
        osc1.frequency.value = frequency;
        
        osc2.type = 'sine';
        osc2.frequency.value = frequency * 2;
        
        osc3.type = 'sine';
        osc3.frequency.value = frequency * 3;
        
        // 音量设置
        gain1.gain.value = 0.5;
        gain2.gain.value = 0.2;
        gain3.gain.value = 0.1;
        
        // 包络
        const envelope = ctx.createGain();
        envelope.gain.setValueAtTime(0, startTime);
        envelope.gain.linearRampToValueAtTime(0.6, startTime + 0.02);
        envelope.gain.exponentialRampToValueAtTime(0.3, startTime + 0.3);
        envelope.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        // 连接
        osc1.connect(gain1);
        osc2.connect(gain2);
        osc3.connect(gain3);
        
        gain1.connect(envelope);
        gain2.connect(envelope);
        gain3.connect(envelope);
        
        envelope.connect(this.masterGain);
        
        // 开始和结束
        osc1.start(startTime);
        osc2.start(startTime);
        osc3.start(startTime);
        
        osc1.stop(startTime + duration + 0.1);
        osc2.stop(startTime + duration + 0.1);
        osc3.stop(startTime + duration + 0.1);
    }

    /**
     * 获取和弦的音符频率
     */
    getChordNotes(chordName, octave) {
        const chordData = {
            // 大调和弦
            'C':  { root: 'C', type: 'major' },
            'F':  { root: 'F', type: 'major' },
            'G':  { root: 'G', type: 'major' },
            // 小调和弦
            'Am': { root: 'A', type: 'minor' },
            'Dm': { root: 'D', type: 'minor' },
            'Em': { root: 'E', type: 'minor' }
        };
        
        const data = chordData[chordName];
        if (!data) return [];
        
        const rootFreq = this.noteToFrequency(data.root, octave);
        
        if (data.type === 'major') {
            // 大三和弦：根音、大三度、纯五度
            return [
                rootFreq,
                rootFreq * Math.pow(2, 4/12),  // 大三度
                rootFreq * Math.pow(2, 7/12)   // 纯五度
            ];
        } else {
            // 小三和弦：根音、小三度、纯五度
            return [
                rootFreq,
                rootFreq * Math.pow(2, 3/12),  // 小三度
                rootFreq * Math.pow(2, 7/12)   // 纯五度
            ];
        }
    }

    /**
     * 音名转频率
     */
    noteToFrequency(note, octave) {
        const noteMap = {
            'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
            'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
            'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
        };
        
        const semitone = noteMap[note];
        const midiNumber = (octave + 1) * 12 + semitone;
        return 440 * Math.pow(2, (midiNumber - 69) / 12);
    }
}

// 全局实例
const audioEngine = new AudioEngine();

// 全局函数供HTML调用
async function playChord(chordName, octave = 4) {
    await audioEngine.playChord(chordName, octave);
}

async function playProgression(chords) {
    await audioEngine.playProgression(chords);
}
