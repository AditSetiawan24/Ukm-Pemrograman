// Game Variables
let val_c1 = 1;
let val_c2 = 1;
let val_c3 = 1;
let val_c4 = 1;
let val_c5 = 1;
let val_c6 = 1;
let val_c7 = 1;
let turn = 1;
let gameActive = true;

// Game Messages in Indonesian
const messages = {
    redTurn: '<i class="fas fa-user"></i> Giliran Pemain Merah',
    yellowTurn: '<i class="fas fa-user"></i> Giliran Pemain Kuning',
    redWins: '🎉 Pemain Merah Menang! 🎉',
    yellowWins: '🎉 Pemain Kuning Menang! 🎉',
    draw: '🤝 Permainan Seri! 🤝'
};

// Toggle Instructions
function toggleInstructions() {
    const instructions = document.getElementById('instructions');
    instructions.classList.toggle('show');
}

// Reset Game Function
function resetGame() {
    if (confirm('Apakah Anda yakin ingin memulai permainan baru?')) {
        location.reload();
    }
}

// Update Turn Indicator
function updateTurnIndicator(isRedTurn) {
    const redIndicator = document.getElementById('red-indicator');
    const yellowIndicator = document.getElementById('yellow-indicator');
    
    if (isRedTurn) {
        redIndicator.classList.add('active');
        yellowIndicator.classList.remove('active');
    } else {
        redIndicator.classList.remove('active');
        yellowIndicator.classList.add('active');
    }
}

// Add piece animation
function animatePiece(elementId, color) {
    const piece = document.getElementById(elementId);
    piece.style.animation = 'drop 0.5s ease-out';
    piece.style.backgroundColor = color;
    
    // Add glow effect
    setTimeout(() => {
        piece.style.boxShadow = color === 'red' 
            ? '0 0 20px rgba(231, 76, 60, 0.6)' 
            : '0 0 20px rgba(241, 196, 15, 0.6)';
        
        setTimeout(() => {
            piece.style.boxShadow = 'inset 0 2px 5px rgba(0,0,0,0.1)';
        }, 1000);
    }, 500);
}

// Enhanced winner announcement
function announceWinner(winner) {
    const winnerText = winner === 'red' ? messages.redWins : messages.yellowWins;
    
    // Create winner modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: slideDown 0.5s ease-out;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        max-width: 400px;
        animation: slideUp 0.5s ease-out 0.2s both;
    `;
    
    content.innerHTML = `
        <h2 style="font-size: 2rem; margin-bottom: 20px; color: #2c3e50;">${winnerText}</h2>
        <p style="margin-bottom: 30px; color: #7f8c8d;">Selamat! Anda berhasil menyusun 4 keping berturut-turut!</p>
        <button onclick="location.reload()" style="
            background: linear-gradient(45deg, #4CAF50, #45a049);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        ">
            <i class="fas fa-redo"></i> Main Lagi
        </button>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    gameActive = false;
}

// Check for winner function with Indonesian messages
function check(player) {
    if (!gameActive) return;
    
    setTimeout(() => {
        // Check vertical wins
        for (let i = 1; i <= 7; i++) {
            for (let j = 1; j <= 3; j++) {
                if (
                    document.getElementById(`c${i}r${j}`).style.backgroundColor == player &&
                    document.getElementById(`c${i}r${j + 1}`).style.backgroundColor == player &&
                    document.getElementById(`c${i}r${j + 2}`).style.backgroundColor == player &&
                    document.getElementById(`c${i}r${j + 3}`).style.backgroundColor == player
                ) {
                    announceWinner(player);
                    return;
                }
            }
        }

        // Check horizontal wins
        for (let i = 1; i <= 6; i++) {
            for (let j = 1; j <= 4; j++) {
                if (
                    document.getElementById(`c${j}r${i}`).style.backgroundColor == player &&
                    document.getElementById(`c${j + 1}r${i}`).style.backgroundColor == player &&
                    document.getElementById(`c${j + 2}r${i}`).style.backgroundColor == player &&
                    document.getElementById(`c${j + 3}r${i}`).style.backgroundColor == player
                ) {
                    announceWinner(player);
                    return;
                }
            }
        }

        // Check diagonal wins (top-left to bottom-right)
        for (let i = 1; i <= 4; i++) {
            for (let j = 1; j <= 3; j++) {
                if (
                    document.getElementById(`c${i}r${j}`).style.backgroundColor == player &&
                    document.getElementById(`c${i + 1}r${j + 1}`).style.backgroundColor == player &&
                    document.getElementById(`c${i + 2}r${j + 2}`).style.backgroundColor == player &&
                    document.getElementById(`c${i + 3}r${j + 3}`).style.backgroundColor == player
                ) {
                    announceWinner(player);
                    return;
                }
            }
        }

        // Check diagonal wins (top-right to bottom-left)
        for (let i = 1; i <= 4; i++) {
            for (let j = 6; j >= 4; j--) {
                if (
                    document.getElementById(`c${i}r${j}`).style.backgroundColor == player &&
                    document.getElementById(`c${i + 1}r${j - 1}`).style.backgroundColor == player &&
                    document.getElementById(`c${i + 2}r${j - 2}`).style.backgroundColor == player &&
                    document.getElementById(`c${i + 3}r${j - 3}`).style.backgroundColor == player
                ) {
                    announceWinner(player);
                    return;
                }
            }
        }
    }, 200);
}



// Main game logic
document.querySelectorAll(".column").forEach((column) => {
    column.addEventListener("click", () => {
        if (!gameActive) return;
        
        const columnId = column.id;
        const currentHeight = eval(`val_${columnId}`);
        
        // Check if column is full
        if (currentHeight > 6) {
            // Add shake animation for full column
            column.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                column.style.animation = '';
            }, 500);
            return;
        }
        
        eval(`val_${columnId}++`);

        if (turn % 2 !== 0) {
            // Red player's turn
            animatePiece(`${columnId}r${currentHeight}`, "red");
            turn++;
            check('red');
            document.getElementById("whosturn").innerHTML = messages.yellowTurn;
            updateTurnIndicator(false);
        } else {
            // Yellow player's turn
            animatePiece(`${columnId}r${currentHeight}`, "yellow");
            turn++;
            check('yellow');
            document.getElementById("whosturn").innerHTML = messages.redTurn;
            updateTurnIndicator(true);
        }
    });
});

// Add shake animation for full columns
const shakeKeyframes = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}
`;

// Add the keyframes to the document
if (!document.querySelector('#shake-animation')) {
    const style = document.createElement('style');
    style.id = 'shake-animation';
    style.textContent = shakeKeyframes;
    document.head.appendChild(style);
}

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    updateTurnIndicator(true); // Red starts
    
    // Add welcome message
    setTimeout(() => {
        console.log('🎮 Connect 4 Game dimuat! Selamat bermain!');
    }, 1000);
});
