/**
 * 音频引擎模块 - 和弦走向听力训练器
 * 使用 Web Audio API 生成和弦声音
 */

class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.reverbNode = null;
        this.isPlaying = false;
        this.currentOscillators = [];
        
        // 音色配置
        this.instrument = 'piano';
        this.masterVolume = 0.7;
        this.reverbAmount = 0.3;
        
        // 播放配置
        this.bpm = 90;
        this.beatDuration = 60 / 90; // 秒
        this.playbackRate = 1;
        
        // ADSR 包络
        this.envelope = {
            attack: 0.02,
            decay: 0.1,
            sustain: 0.7,
            release: 0.3
        };
        
        // 钢琴音色参数
        this.pianoHarmonics = {
            fundamental: 1.0,
            second: 0.5,
            third: 0.25,
            fourth: 0.125
        };
    }

    /**
     * 初始化音频上下文
     */
    async init() {
        if (this.audioContext) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // 创建主增益节点
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = this.masterVolume;
            
            // 创建卷积混响
            await this.createReverb();
            
            // 连接节点
            this.masterGain.connect(this.audioContext.destination);
            
            console.log('Audio engine initialized');
        } catch (error) {
            console.error('Failed to initialize audio:', error);
            throw error;
        }
    }

    /**
     * 创建卷积混响
     */
    async createReverb() {
        // 创建简单的混响效果
        const convolver = this.audioContext.createConvolver();
        
        // 生成脉冲响应
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * 2; // 2秒混响
        const impulse = this.audioContext.createBuffer(2, length, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                // 指数衰减
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
            }
        }
        
        convolver.buffer = impulse;
        this.reverbNode = convolver;
    }

    /**
     * 播放单个和弦
     * @param {number[]} midiNotes - MIDI音符数组
     * @param {number} duration - 持续时间（秒）
     * @param {number} startTime - 开始时间
     */
    playChord(midiNotes, duration = 1, startTime = null) {
        if (!this.audioContext) return;
        
        const now = startTime || this.audioContext.currentTime;
        
        for (const midiNote of midiNotes) {
            this.playNote(midiNote, duration, now);
        }
    }

    /**
     * 播放单个音符
     * @param {number} midiNote - MIDI音符编号
     * @param {number} duration - 持续时间（秒）
     * @param {number} startTime - 开始时间
     */
    playNote(midiNote, duration = 1, startTime = null) {
        if (!this.audioContext) return;
        
        const frequency = this.midiToFrequency(midiNote);
        const now = startTime || this.audioContext.currentTime;
        
        switch (this.instrument) {
            case 'piano':
                this.playPianoNote(frequency, duration, now);
                break;
            case 'guitar':
                this.playGuitarNote(frequency, duration, now);
                break;
            case 'synth':
                this.playSynthNote(frequency, duration, now);
                break;
            case 'organ':
                this.playOrganNote(frequency, duration, now);
                break;
            case 'strings':
                this.playStringsNote(frequency, duration, now);
                break;
            default:
                this.playPianoNote(frequency, duration, now);
        }
    }

    /**
     * 钢琴音色
     */
    playPianoNote(frequency, duration, startTime) {
        const ctx = this.audioContext;
        const endTime = startTime + duration;
        
        // 使用多个振荡器模拟钢琴泛音
        const oscillators = [];
        const gains = [];
        
        // 基频
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.value = frequency;
        gain1.gain.value = 0.6;
        osc1.connect(gain1);
        oscillators.push(osc1);
        gains.push(gain1);
        
        // 第二泛音
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.value = frequency * 2;
        gain2.gain.value = 0.25;
        osc2.connect(gain2);
        oscillators.push(osc2);
        gains.push(gain2);
        
        // 第三泛音
        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        osc3.type = 'sine';
        osc3.frequency.value = frequency * 3;
        gain3.gain.value = 0.1;
        osc3.connect(gain3);
        oscillators.push(osc3);
        gains.push(gain3);
        
        // 创建包络
        const envelopeGain = ctx.createGain();
        envelopeGain.gain.setValueAtTime(0, startTime);
        envelopeGain.gain.linearRampToValueAtTime(0.8, startTime + this.envelope.attack);
        envelopeGain.gain.linearRampToValueAtTime(
            this.envelope.sustain * 0.8,
            startTime + this.envelope.attack + this.envelope.decay
        );
        envelopeGain.gain.linearRampToValueAtTime(0, endTime + this.envelope.release);
        
        // 连接所有节点
        const merger = ctx.createGain();
        for (const gain of gains) {
            gain.connect(envelopeGain);
        }
        envelopeGain.connect(merger);
        merger.connect(this.masterGain);
        
        // 添加混响
        if (this.reverbNode && this.reverbAmount > 0) {
            const dryGain = ctx.createGain();
            const wetGain = ctx.createGain();
            dryGain.gain.value = 1 - this.reverbAmount;
            wetGain.gain.value = this.reverbAmount;
            
            envelopeGain.connect(dryGain);
            dryGain.connect(this.masterGain);
            
            envelopeGain.connect(this.reverbNode);
            this.reverbNode.connect(wetGain);
            wetGain.connect(this.masterGain);
        }
        
        // 启动和停止
        for (const osc of oscillators) {
            osc.start(startTime);
            osc.stop(endTime + this.envelope.release + 0.1);
        }
        
        this.currentOscillators.push(...oscillators);
    }

    /**
     * 吉他音色
     */
    playGuitarNote(frequency, duration, startTime) {
        const ctx = this.audioContext;
        const endTime = startTime + duration;
        
        // 主振荡器
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.value = frequency;
        
        // 低通滤波器
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 2000;
        filter.Q.value = 1;
        
        // 包络
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.5, startTime + 0.01); // 快速attack
        gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);
        
        // 连接
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        osc.start(startTime);
        osc.stop(endTime + 0.1);
        
        this.currentOscillators.push(osc);
    }

    /**
     * 合成器音色
     */
    playSynthNote(frequency, duration, startTime) {
        const ctx = this.audioContext;
        const endTime = startTime + duration;
        
        // 使用两个锯齿波 + 一个正弦波
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const subOsc = ctx.createOscillator();
        
        osc1.type = 'sawtooth';
        osc1.frequency.value = frequency;
        osc1.detune.value = 5;
        
        osc2.type = 'sawtooth';
        osc2.frequency.value = frequency;
        osc2.detune.value = -5;
        
        subOsc.type = 'sine';
        subOsc.frequency.value = frequency / 2;
        
        // 滤波器
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000 + (frequency * 2);
        filter.Q.value = 2;
        
        // 滤波器包络
        filter.frequency.setValueAtTime(500, startTime);
        filter.frequency.linearRampToValueAtTime(2000, startTime + 0.1);
        filter.frequency.linearRampToValueAtTime(800, endTime);
        
        // 增益
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.4, startTime + 0.05);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.2);
        gain.gain.linearRampToValueAtTime(0, endTime);
        
        // 连接
        [osc1, osc2, subOsc].forEach(osc => {
            osc.connect(filter);
        });
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        [osc1, osc2, subOsc].forEach(osc => {
            osc.start(startTime);
            osc.stop(endTime + 0.1);
        });
        
        this.currentOscillators.push(osc1, osc2, subOsc);
    }

    /**
     * 风琴音色
     */
    playOrganNote(frequency, duration, startTime) {
        const ctx = this.audioContext;
        const endTime = startTime + duration;
        
        // Hammond风琴风格 - 多个正弦波叠加
        const drawbars = [1, 2, 3, 4, 6, 8]; // 倍频
        const levels = [0.4, 0.3, 0.2, 0.15, 0.1, 0.05]; // 各倍频音量
        
        const oscillators = [];
        
        drawbars.forEach((multiplier, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = frequency * multiplier;
            gain.gain.value = levels[index];
            
            // Leslie效果模拟（轻微颤音）
            const vibrato = ctx.createOscillator();
            const vibratoGain = ctx.createGain();
            vibrato.frequency.value = 5;
            vibratoGain.gain.value = 3;
            vibrato.connect(vibratoGain);
            vibratoGain.connect(osc.frequency);
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            osc.start(startTime);
            osc.stop(endTime + 0.1);
            vibrato.start(startTime);
            vibrato.stop(endTime + 0.1);
            
            oscillators.push(osc, vibrato);
        });
        
        this.currentOscillators.push(...oscillators);
    }

    /**
     * 弦乐音色
     */
    playStringsNote(frequency, duration, startTime) {
        const ctx = this.audioContext;
        const endTime = startTime + duration;
        
        // 弦乐合奏 - 多个轻微失谐的振荡器
        const numPlayers = 4;
        const oscillators = [];
        
        for (let i = 0; i < numPlayers; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.value = frequency;
            osc.detune.value = (Math.random() - 0.5) * 20; // 轻微失谐
            
            // 慢attack模拟弦乐
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.15, startTime + 0.15);
            gain.gain.linearRampToValueAtTime(0.1, endTime - 0.2);
            gain.gain.linearRampToValueAtTime(0, endTime);
            
            // 低通滤波
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 3000;
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);
            
            osc.start(startTime);
            osc.stop(endTime + 0.1);
            
            oscillators.push(osc);
        }
        
        this.currentOscillators.push(...oscillators);
    }

    /**
     * 播放和弦走向
     * @param {object[]} progression - 和弦走向数据
     * @param {function} onChordChange - 和弦变化回调
     */
    async playProgression(progression, onChordChange = null) {
        if (this.isPlaying) return;
        
        await this.init();
        this.isPlaying = true;
        
        const beatDuration = this.beatDuration / this.playbackRate;
        
        for (let i = 0; i < progression.length; i++) {
            if (!this.isPlaying) break;
            
            const chord = progression[i];
            const now = this.audioContext.currentTime;
            
            // 回调通知
            if (onChordChange) {
                onChordChange(i, chord);
            }
            
            // 播放和弦
            this.playChord(chord.notes, chord.duration * beatDuration, now);
            
            // 等待
            await this.sleep(chord.duration * beatDuration * 1000);
        }
        
        this.isPlaying = false;
    }

    /**
     * 停止播放
     */
    stopPlayback() {
        this.isPlaying = false;
        
        // 停止所有振荡器
        for (const osc of this.currentOscillators) {
            try {
                osc.stop();
            } catch (e) {
                // 忽略已停止的振荡器
            }
        }
        
        this.currentOscillators = [];
    }

    /**
     * 设置主音量
     */
    setMasterVolume(value) {
        this.masterVolume = Math.max(0, Math.min(1, value));
        if (this.masterGain) {
            this.masterGain.gain.value = this.masterVolume;
        }
    }

    /**
     * 设置混响量
     */
    setReverbAmount(value) {
        this.reverbAmount = Math.max(0, Math.min(1, value));
    }

    /**
     * 设置乐器
     */
    setInstrument(instrument) {
        this.instrument = instrument;
    }

    /**
     * 设置BPM
     */
    setBPM(bpm) {
        this.bpm = Math.max(40, Math.min(200, bpm));
        this.beatDuration = 60 / this.bpm;
    }

    /**
     * 设置播放速度
     */
    setPlaybackRate(rate) {
        this.playbackRate = Math.max(0.5, Math.min(2, rate));
    }

    /**
     * MIDI编号转频率
     */
    midiToFrequency(midi) {
        return 440 * Math.pow(2, (midi - 69) / 12);
    }

    /**
     * 频率转MIDI编号
     */
    frequencyToMidi(frequency) {
        return Math.round(69 + 12 * Math.log2(frequency / 440));
    }

    /**
     * 异步睡眠
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 播放节拍器
     */
    playMetronome(beat, startTime = null) {
        const ctx = this.audioContext;
        if (!ctx) return;
        
        const now = startTime || ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = beat === 0 ? 1000 : 800; // 强拍高音
        
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(now);
        osc.stop(now + 0.05);
    }
}

// 创建全局实例
const audioEngine = new AudioEngine();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AudioEngine, audioEngine };
}
