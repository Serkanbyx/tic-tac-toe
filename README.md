# 🎮 Tic Tac Toe

A modern, responsive Tic Tac Toe game featuring an unbeatable AI opponent powered by the Minimax algorithm with alpha-beta pruning. Challenge the computer or play against a friend in this classic strategy game!

[![Created by Serkanby](https://img.shields.io/badge/Created%20by-Serkanby-blue?style=flat-square)](https://serkanbayraktar.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Serkanbyx-181717?style=flat-square&logo=github)](https://github.com/Serkanbyx)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

## Features

- **Two Game Modes**: Play against a friend (PvP) or challenge the AI opponent
- **Three Difficulty Levels**: Easy (random moves), Medium (70% optimal), Hard (unbeatable Minimax)
- **Smart AI Opponent**: Powered by Minimax algorithm with alpha-beta pruning for optimal performance
- **Score Tracking**: Keep track of wins for both players during your session
- **Winning Highlights**: Animated highlighting of winning combinations
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Accessible UI**: ARIA labels and semantic HTML for screen reader support
- **Modern Aesthetics**: Dark theme with smooth animations and transitions

## Live Demo

[🎮 View Live Demo](https://tic-tac-toeeeeeeeeee.netlify.app/)

## Technologies

- **HTML5**: Semantic markup with accessibility features (ARIA labels, roles)
- **CSS3**: CSS Grid, Flexbox, CSS Variables, Keyframe Animations
- **Vanilla JavaScript (ES6+)**: Modern JavaScript with no dependencies
- **Minimax Algorithm**: AI decision-making with alpha-beta pruning optimization

## Installation

### Local Development

1. **Clone the repository**

```bash
git clone https://github.com/Serkanbyx/tic-tac-toe.git
```

2. **Navigate to project directory**

```bash
cd tic-tac-toe
```

3. **Open in browser**

You can open `index.html` directly in your browser, or use a local server:

**Using Python:**

```bash
# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000
```

**Using Node.js:**

```bash
npx serve
```

**Using VS Code:**

Install "Live Server" extension and click "Go Live"

4. **Open your browser and navigate to** `http://localhost:3000`

## Usage

1. **Select Game Mode**: Choose between "2 Players" for local multiplayer or "vs AI" to play against the computer
2. **Choose Difficulty** (AI mode only): Select Easy, Medium, or Hard difficulty
3. **Make Your Move**: Click on any empty cell to place your symbol (X always goes first)
4. **Win the Game**: Align three of your symbols horizontally, vertically, or diagonally
5. **Track Your Score**: Scores are displayed at the top and persist during your session
6. **Restart**: Click "Restart Game" to start a new round

## How It Works

### Minimax Algorithm

The AI uses the Minimax algorithm to evaluate all possible game states and choose the optimal move. The algorithm recursively simulates all possible moves to find the best outcome.

```javascript
function minimax(boardState, depth, isMaximizing, alpha, beta) {
    // Terminal states
    if (result.winner === AI) return 10 - depth;    // AI wins (prefer faster wins)
    if (result.winner === HUMAN) return depth - 10; // Human wins (prefer slower losses)
    if (noMovesLeft) return 0;                       // Draw

    if (isMaximizing) {
        // AI's turn - maximize score
        for (each possible move) {
            score = minimax(board, depth + 1, false, alpha, beta);
            maxScore = max(score, maxScore);
        }
        return maxScore;
    } else {
        // Human's turn - minimize score
        for (each possible move) {
            score = minimax(board, depth + 1, true, alpha, beta);
            minScore = min(score, minScore);
        }
        return minScore;
    }
}
```

### Alpha-Beta Pruning

To optimize performance, the algorithm uses alpha-beta pruning to eliminate branches that don't need to be explored, significantly reducing computation time.

### Difficulty Levels

| Level  | Strategy                              |
| ------ | ------------------------------------- |
| Easy   | Random valid move selection           |
| Medium | 70% optimal move, 30% random          |
| Hard   | Always optimal (Minimax) - Unbeatable |

## Customization

### Change Color Theme

Edit the CSS variables in `css/style.css`:

```css
:root {
  --bg-color: #252525; /* Background color */
  --cell-bg: #414141; /* Cell background */
  --accent-red: #ff0000; /* X player color */
  --text-color: #ffffff; /* Text color */
}
```

### Adjust AI Difficulty Balance

Modify the medium difficulty ratio in `js/script.js`:

```javascript
function getMediumMove() {
  if (Math.random() < 0.7) {
    // Change 0.7 to adjust difficulty
    return getBestMove();
  }
  return getEasyMove();
}
```

### Add Sound Effects

You can enhance the game by adding sound effects:

```javascript
const clickSound = new Audio("assets/click.mp3");
const winSound = new Audio("assets/win.mp3");

function makeMove(index, player) {
  clickSound.play();
  // ... existing code
}
```

## Features in Detail

### Completed Features

- ✅ Classic 3x3 Tic Tac Toe gameplay
- ✅ Two-player local multiplayer mode
- ✅ AI opponent with Minimax algorithm
- ✅ Three difficulty levels
- ✅ Score tracking system
- ✅ Winning cell highlighting with animation
- ✅ Responsive mobile-first design
- ✅ Accessibility features (ARIA labels)
- ✅ AI thinking indicator

### Future Features

- [ ] Sound effects for moves and wins
- [ ] Game history and statistics
- [ ] Online multiplayer mode
- [ ] Custom themes and skins
- [ ] 4x4 and 5x5 grid options
- [ ] Player name customization
- [ ] Undo move functionality

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes using semantic commits:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation
   - `style:` Formatting changes
   - `refactor:` Code refactoring
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Developer

**Serkanby**

- 🌐 Website: [serkanbayraktar.com](https://serkanbayraktar.com/)
- 💻 GitHub: [@Serkanbyx](https://github.com/Serkanbyx)
- 📧 Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)

## Acknowledgments

- [Contributor Covenant](https://www.contributor-covenant.org/) for the Code of Conduct
- [Shields.io](https://shields.io/) for the badges
- Classic Tic Tac Toe game design inspiration

## Contact

- 🐛 Found a bug? [Open an Issue](https://github.com/Serkanbyx/tic-tac-toe/issues)
- 💡 Have a suggestion? [Start a Discussion](https://github.com/Serkanbyx/tic-tac-toe/discussions)
- 📧 Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)
- 🌐 Website: [serkanbayraktar.com](https://serkanbayraktar.com/)

---

⭐ If you like this project, don't forget to give it a star!
