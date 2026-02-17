/**
 * 音频引擎 - 和弦听辨课程（扩展版）
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
            this.masterGain.gain.value = 0.5;
            this.masterGain.connect(this.audioContext.destination);
            this.initialized = true;
        } catch (e) {
            console.error('音频初始化失败:', e);
        }
    }

    async playChord(chordName, octave = 4) {
        await this.init();
        
        const notes = this.getChordNotes(chordName, octave);
        const now = this.audioContext.currentTime;
        const duration = 1.5;
        
        notes.forEach((freq, index) => {
            this.playNote(freq, now, duration);
        });
    }

    async playProgression(chords, bpm = 90) {
        await this.init();
        
        const now = this.audioContext.currentTime;
        const beatDuration = 60 / bpm;
        
        chords.forEach((chord, index) => {
            const startTime = now + index * beatDuration;
            const notes = this.getChordNotes(chord, 4);
            notes.forEach(freq => {
                this.playNote(freq, startTime, beatDuration - 0.1);
            });
        });
    }

    playNote(frequency, startTime, duration) {
        const ctx = this.audioContext;
        
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const osc3 = ctx.createOscillator();
        
        const gain1 = ctx.createGain();
        const gain2 = ctx.createGain();
        const gain3 = ctx.createGain();
        
        osc1.type = 'triangle';
        osc1.frequency.value = frequency;
        
        osc2.type = 'sine';
        osc2.frequency.value = frequency * 2;
        
        osc3.type = 'sine';
        osc3.frequency.value = frequency * 3;
        
        gain1.gain.value = 0.5;
        gain2.gain.value = 0.2;
        gain3.gain.value = 0.1;
        
        const envelope = ctx.createGain();
        envelope.gain.setValueAtTime(0, startTime);
        envelope.gain.linearRampToValueAtTime(0.6, startTime + 0.02);
        envelope.gain.exponentialRampToValueAtTime(0.3, startTime + 0.3);
        envelope.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc1.connect(gain1);
        osc2.connect(gain2);
        osc3.connect(gain3);
        
        gain1.connect(envelope);
        gain2.connect(envelope);
        gain3.connect(envelope);
        
        envelope.connect(this.masterGain);
        
        osc1.start(startTime);
        osc2.start(startTime);
        osc3.start(startTime);
        
        osc1.stop(startTime + duration + 0.1);
        osc2.stop(startTime + duration + 0.1);
        osc3.stop(startTime + duration + 0.1);
    }

    getChordNotes(chordName, octave) {
        const chordData = {
            // 大调和弦
            'C':  { root: 'C', type: 'major' },
            'F':  { root: 'F', type: 'major' },
            'G':  { root: 'G', type: 'major' },
            'D':  { root: 'D', type: 'major' },
            'E':  { root: 'E', type: 'major' },
            'A':  { root: 'A', type: 'major' },
            // 小调和弦
            'Am': { root: 'A', type: 'minor' },
            'Dm': { root: 'D', type: 'minor' },
            'Em': { root: 'E', type: 'minor' },
            'Bm': { root: 'B', type: 'minor' }
        };
        
        const data = chordData[chordName];
        if (!data) return [];
        
        const rootFreq = this.noteToFrequency(data.root, octave);
        
        if (data.type === 'major') {
            return [
                rootFreq,
                rootFreq * Math.pow(2, 4/12),
                rootFreq * Math.pow(2, 7/12)
            ];
        } else {
            return [
                rootFreq,
                rootFreq * Math.pow(2, 3/12),
                rootFreq * Math.pow(2, 7/12)
            ];
        }
    }

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

const audioEngine = new AudioEngine();

async function playChord(chordName, octave = 4) {
    await audioEngine.playChord(chordName, octave);
}

async function playProgression(chords) {
    await audioEngine.playProgression(chords);
}

// 12小节蓝调
async function play12BarBlues() {
    await playProgression(['C', 'C', 'C', 'C', 'F', 'F', 'C', 'C', 'G', 'F', 'C', 'G']);
}

// 8小节蓝调
async function play8BarBlues() {
    await playProgression(['C', 'F', 'C', 'G', 'F', 'C', 'G', 'G']);
}
