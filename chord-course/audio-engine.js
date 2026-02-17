/**
 * 音频引擎 - 和弦听辨课程（带旋律演示版）
 */

class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 0.4;
            this.masterGain.connect(this.audioContext.destination);
            this.initialized = true;
        } catch (e) {
            console.error('音频初始化失败:', e);
        }
    }

    // 播放单个和弦
    async playChord(chordName, octave = 4) {
        await this.init();
        const notes = this.getChordNotes(chordName, octave);
        const now = this.audioContext.currentTime;
        
        notes.forEach(freq => {
            this.playChordNote(freq, now, 1.2);
        });
    }

    // 播放和弦走向（纯和弦）
    async playProgression(chords, bpm = 100) {
        await this.init();
        const now = this.audioContext.currentTime;
        const beatDuration = 60 / bpm;
        
        chords.forEach((chord, index) => {
            const startTime = now + index * beatDuration;
            const notes = this.getChordNotes(chord, 4);
            notes.forEach(freq => {
                this.playChordNote(freq, startTime, beatDuration - 0.05);
            });
        });
    }

    // ===== 新增：带旋律的和弦走向演示 =====
    
    async playProgressionWithMelody(progressionName) {
        await this.init();
        
        const demos = {
            'canon': {
                chords: ['C', 'G', 'Am', 'F'],
                // 旋律：C-E-G-E-C (简单上行)
                melody: [
                    { note: 'C5', start: 0, dur: 0.5 },
                    { note: 'E5', start: 0.5, dur: 0.5 },
                    { note: 'G5', start: 1, dur: 0.5 },
                    { note: 'D5', start: 1.5, dur: 0.5 },
                    { note: 'C5', start: 2, dur: 0.5 },
                    { note: 'E5', start: 2.5, dur: 0.5 },
                    { note: 'A4', start: 3, dur: 0.5 },
                    { note: 'C5', start: 3.5, dur: 0.5 }
                ],
                bpm: 120
            },
            '50s': {
                chords: ['C', 'Am', 'F', 'G'],
                // 旋律：下行感
                melody: [
                    { note: 'G4', start: 0, dur: 0.5 },
                    { note: 'E4', start: 0.5, dur: 0.5 },
                    { note: 'C4', start: 1, dur: 0.5 },
                    { note: 'A4', start: 1.5, dur: 0.5 },
                    { note: 'F4', start: 2, dur: 0.5 },
                    { note: 'A4', start: 2.5, dur: 0.5 },
                    { note: 'G4', start: 3, dur: 0.5 },
                    { note: 'B4', start: 3.5, dur: 0.5 }
                ],
                bpm: 100
            },
            'sad': {
                chords: ['Am', 'F', 'C', 'G'],
                // 旋律：悲伤的下行
                melody: [
                    { note: 'A4', start: 0, dur: 0.5 },
                    { note: 'G4', start: 0.5, dur: 0.5 },
                    { note: 'F4', start: 1, dur: 0.5 },
                    { note: 'E4', start: 1.5, dur: 0.5 },
                    { note: 'C4', start: 2, dur: 0.5 },
                    { note: 'D4', start: 2.5, dur: 0.5 },
                    { note: 'E4', start: 3, dur: 0.5 },
                    { note: 'D4', start: 3.5, dur: 0.5 }
                ],
                bpm: 80
            },
            'simple': {
                chords: ['C', 'F', 'G', 'C'],
                // 旋律：简单的上行
                melody: [
                    { note: 'C4', start: 0, dur: 0.5 },
                    { note: 'E4', start: 0.5, dur: 0.5 },
                    { note: 'F4', start: 1, dur: 0.5 },
                    { note: 'A4', start: 1.5, dur: 0.5 },
                    { note: 'G4', start: 2, dur: 0.5 },
                    { note: 'B4', start: 2.5, dur: 0.5 },
                    { note: 'C5', start: 3, dur: 0.75 }
                ],
                bpm: 100
            },
            'iiv': {
                chords: ['Dm', 'G', 'C'],
                // 爵士感旋律
                melody: [
                    { note: 'A4', start: 0, dur: 0.5 },
                    { note: 'C5', start: 0.5, dur: 0.5 },
                    { note: 'B4', start: 1, dur: 0.5 },
                    { note: 'G4', start: 1.5, dur: 0.5 },
                    { note: 'C5', start: 2, dur: 0.75 }
                ],
                bpm: 100
            },
            'axis': {
                chords: ['Am', 'F', 'C', 'G'],
                // 现代流行感
                melody: [
                    { note: 'E4', start: 0, dur: 0.4 },
                    { note: 'G4', start: 0.4, dur: 0.4 },
                    { note: 'A4', start: 0.8, dur: 0.4 },
                    { note: 'C5', start: 1.2, dur: 0.4 },
                    { note: 'D5', start: 1.6, dur: 0.4 },
                    { note: 'E5', start: 2, dur: 0.4 },
                    { note: 'D5', start: 2.4, dur: 0.4 },
                    { note: 'B4', start: 2.8, dur: 0.4 }
                ],
                bpm: 120
            },
            'sensitive': {
                chords: ['C', 'Em', 'Am', 'F'],
                // 细腻流动感
                melody: [
                    { note: 'E4', start: 0, dur: 0.5 },
                    { note: 'G4', start: 0.5, dur: 0.5 },
                    { note: 'A4', start: 1, dur: 0.5 },
                    { note: 'B4', start: 1.5, dur: 0.5 },
                    { note: 'C5', start: 2, dur: 0.5 },
                    { note: 'A4', start: 2.5, dur: 0.5 },
                    { note: 'F4', start: 3, dur: 0.5 },
                    { note: 'E4', start: 3.5, dur: 0.5 }
                ],
                bpm: 90
            },
            'andalusian': {
                chords: ['Am', 'G', 'F', 'E'],
                // 弗拉明戈/摇滚感
                melody: [
                    { note: 'A4', start: 0, dur: 0.3 },
                    { note: 'G4', start: 0.3, dur: 0.3 },
                    { note: 'F4', start: 0.6, dur: 0.3 },
                    { note: 'E4', start: 0.9, dur: 0.3 },
                    { note: 'D4', start: 1.2, dur: 0.3 },
                    { note: 'E4', start: 1.5, dur: 0.3 },
                    { note: 'F4', start: 1.8, dur: 0.3 },
                    { note: 'E4', start: 2.1, dur: 0.3 },
                    { note: 'D4', start: 2.4, dur: 0.3 },
                    { note: 'E4', start: 2.7, dur: 0.3 }
                ],
                bpm: 140
            },
            'blues12': {
                chords: ['C', 'C', 'C', 'C', 'F', 'F', 'C', 'C', 'G', 'F', 'C', 'G'],
                // 蓝调旋律
                melody: [
                    { note: 'C4', start: 0, dur: 0.5 },
                    { note: 'Eb4', start: 0.5, dur: 0.5 },
                    { note: 'E4', start: 1, dur: 0.5 },
                    { note: 'G4', start: 1.5, dur: 0.5 },
                    { note: 'A4', start: 2, dur: 0.5 },
                    { note: 'G4', start: 2.5, dur: 0.5 },
                    { note: 'E4', start: 3, dur: 0.5 },
                    { note: 'D4', start: 3.5, dur: 0.5 }
                ],
                bpm: 100
            }
        };
        
        const demo = demos[progressionName];
        if (!demo) return;
        
        const now = this.audioContext.currentTime;
        const beatDuration = 60 / demo.bpm;
        
        // 播放和弦
        demo.chords.forEach((chord, index) => {
            const startTime = now + index * beatDuration;
            const notes = this.getChordNotes(chord, 3);
            notes.forEach(freq => {
                this.playChordNote(freq, startTime, beatDuration - 0.05, 0.3);
            });
        });
        
        // 播放旋律
        demo.melody.forEach(note => {
            const freq = this.noteNameToFreq(note.note);
            const startTime = now + note.start;
            this.playMelodyNote(freq, startTime, note.dur);
        });
    }

    // 播放和弦音符
    playChordNote(frequency, startTime, duration, volume = 0.3) {
        const ctx = this.audioContext;
        
        // 钢琴音色：多个振荡器
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        
        const gain1 = ctx.createGain();
        const gain2 = ctx.createGain();
        
        osc1.type = 'triangle';
        osc1.frequency.value = frequency;
        
        osc2.type = 'sine';
        osc2.frequency.value = frequency * 2;
        
        gain1.gain.value = volume * 0.7;
        gain2.gain.value = volume * 0.3;
        
        const envelope = ctx.createGain();
        envelope.gain.setValueAtTime(0, startTime);
        envelope.gain.linearRampToValueAtTime(volume * 0.8, startTime + 0.01);
        envelope.gain.exponentialRampToValueAtTime(volume * 0.3, startTime + duration * 0.3);
        envelope.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc1.connect(gain1);
        osc2.connect(gain2);
        gain1.connect(envelope);
        gain2.connect(envelope);
        envelope.connect(this.masterGain);
        
        osc1.start(startTime);
        osc2.start(startTime);
        osc1.stop(startTime + duration + 0.1);
        osc2.stop(startTime + duration + 0.1);
    }

    // 播放旋律音符（更亮的音色）
    playMelodyNote(frequency, startTime, duration) {
        const ctx = this.audioContext;
        
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        
        osc.type = 'sine';
        osc.frequency.value = frequency;
        
        osc2.type = 'triangle';
        osc2.frequency.value = frequency * 2;
        
        const envelope = ctx.createGain();
        envelope.gain.setValueAtTime(0, startTime);
        envelope.gain.linearRampToValueAtTime(0.4, startTime + 0.02);
        envelope.gain.exponentialRampToValueAtTime(0.2, startTime + duration * 0.5);
        envelope.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 3000;
        
        osc.connect(envelope);
        osc2.connect(envelope);
        envelope.connect(filter);
        filter.connect(this.masterGain);
        
        osc.start(startTime);
        osc2.start(startTime);
        osc.stop(startTime + duration + 0.1);
        osc2.stop(startTime + duration + 0.1);
    }

    // 获取和弦音符频率
    getChordNotes(chordName, octave) {
        const chordData = {
            'C':  { root: 'C', type: 'major' },
            'D':  { root: 'D', type: 'major' },
            'E':  { root: 'E', type: 'major' },
            'F':  { root: 'F', type: 'major' },
            'G':  { root: 'G', type: 'major' },
            'A':  { root: 'A', type: 'major' },
            'B':  { root: 'B', type: 'major' },
            'Am': { root: 'A', type: 'minor' },
            'Dm': { root: 'D', type: 'minor' },
            'Em': { root: 'E', type: 'minor' },
            'Bm': { root: 'B', type: 'minor' }
        };
        
        const data = chordData[chordName];
        if (!data) return [];
        
        const rootFreq = this.noteNameToFreq(data.root + octave);
        
        if (data.type === 'major') {
            return [rootFreq, rootFreq * 1.26, rootFreq * 1.5];
        } else {
            return [rootFreq, rootFreq * 1.19, rootFreq * 1.5];
        }
    }

    // 音名转频率
    noteNameToFreq(noteName) {
        const noteMap = {
            'C3': 130.81, 'C4': 261.63, 'C5': 523.25,
            'D3': 146.83, 'D4': 293.66, 'D5': 587.33,
            'E3': 164.81, 'E4': 329.63, 'E5': 659.26,
            'F3': 174.61, 'F4': 349.23, 'F5': 698.46,
            'G3': 196.00, 'G4': 392.00, 'G5': 783.99,
            'A3': 220.00, 'A4': 440.00, 'A5': 880.00,
            'B3': 246.94, 'B4': 493.88, 'B5': 987.77,
            'Eb4': 311.13, 'Eb5': 622.25
        };
        return noteMap[noteName] || 440;
    }
}

// 全局实例
const audioEngine = new AudioEngine();

// 全局函数
async function playChord(chordName, octave = 4) {
    await audioEngine.playChord(chordName, octave);
}

async function playProgression(chords) {
    await audioEngine.playProgression(chords);
}

// 新增：播放带旋律的演示
async function playDemo(progressionName) {
    await audioEngine.playProgressionWithMelody(progressionName);
}

// 12小节蓝调
async function play12BarBlues() {
    await playProgression(['C', 'C', 'C', 'C', 'F', 'F', 'C', 'C', 'G', 'F', 'C', 'G']);
}

async function play12BarBluesDemo() {
    await audioEngine.playProgressionWithMelody('blues12');
}

// 8小节蓝调
async function play8BarBlues() {
    await playProgression(['C', 'F', 'C', 'G', 'F', 'C', 'G', 'G']);
}
