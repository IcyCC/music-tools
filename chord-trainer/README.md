# 🎹 和弦走向听力训练器 | Chord Progression Ear Trainer

一个专业的和弦走向听力训练单页应用，帮助你训练识别各种调性的常见和弦走向。

![Demo](https://img.shields.io/badge/version-1.0.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ 功能特点

### 🎯 四种练习模式
- **识别走向** - 听一段和弦进行，选择正确的罗马数字标记
- **单个和弦** - 识别单个和弦的性质（大调、小调、属七等）
- **调性识别** - 听一段进行，判断是什么调
- **听写模式** - 完整听写出和弦进行的每个和弦

### 📊 五级难度系统
1. **初级** - 基础三和弦 (I-IV-V)
2. **中级** - 常见流行走向
3. **高级** - 七和弦，爵士基础
4. **专家** - 复杂和弦，转调
5. **大师** - 所有技巧，长序列

### 🎼 丰富的和弦走向库
- **流行 Pop** - Canon进行、50年代进行、悲伤进行等
- **爵士 Jazz** - ii-V-I、Turnaround、Coltrane变体等
- **蓝调 Blues** - 12小节蓝调、爵士蓝调等
- **古典 Classical** - 正格终止、变格进行等
- **摇滚 Rock** - Andalusian、Mixolydian Rock等

### 🎹 多种乐器音色
- 钢琴 Piano
- 吉他 Guitar
- 合成器 Synth
- 风琴 Organ
- 弦乐 Strings

### 🔑 24个调性支持
- 12个大调 + 12个小调
- C, G, D, A, E, B, F#, F, Bb, Eb, Ab, Db
- Am, Em, Bm, F#m, C#m, G#m, D#m, Dm, Gm, Cm, Fm, Bbm

### 📈 学习进度追踪
- 正确率统计
- 连胜记录
- 成就系统
- 弱项分析
- 数据导出

## 🚀 在线使用

访问: [https://yourusername.github.io/chord-progressions-trainer/](https://yourusername.github.io/chord-progressions-trainer/)

## 🛠️ 本地运行

```bash
# 克隆仓库
git clone https://github.com/yourusername/chord-progressions-trainer.git

# 进入目录
cd chord-progressions-trainer

# 使用任意HTTP服务器运行
# 方法1: Python
python -m http.server 8000

# 方法2: Node.js
npx serve

# 方法3: PHP
php -S localhost:8000

# 然后在浏览器打开 http://localhost:8000
```

## 📁 项目结构

```
chord-progressions-trainer/
├── index.html          # 主HTML文件
├── styles.css          # 样式文件
├── app.js              # 主应用逻辑
├── theory.js           # 音乐理论数据
├── audio.js            # Web Audio API 音频引擎
├── README.md           # 项目说明
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Pages 部署配置
```

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Space` | 播放/暂停 |
| `Enter` | 提交答案 |
| `N` | 下一题 |
| `H` | 显示提示 |
| `R` | 重复播放 |
| `1-9` | 选择答案 |

## 🎓 学习建议

1. **从初级难度开始**，逐渐提高
2. **先熟悉 I、IV、V 级和弦**的听感
3. **注意和弦之间的"解决感"和"张力"**
4. **每天坚持练习15-30分钟**
5. **结合实际歌曲进行分析**

## 🔧 技术栈

- **HTML5** - 语义化标签
- **CSS3** - Flexbox, Grid, CSS变量, 动画
- **JavaScript (ES6+)** - 模块化设计
- **Web Audio API** - 实时音频合成
- **LocalStorage** - 进度保存

## 📝 和弦走向参考

### 流行 Pop
| 罗马数字 | 名称 | 经典歌曲 |
|----------|------|----------|
| I - V - vi - IV | Canon进行 | Let It Be, Don't Stop Believing |
| I - vi - IV - V | 50年代进行 | Stand By Me |
| vi - IV - I - V | 悲伤进行 | Someone Like You |

### 爵士 Jazz
| 罗马数字 | 名称 | 经典歌曲 |
|----------|------|----------|
| ii - V - I | 爵士核心 | Autumn Leaves |
| I - vi - ii - V | Turnaround | I've Got Rhythm |

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License © 2024

---

**Made with ❤️ for musicians**
