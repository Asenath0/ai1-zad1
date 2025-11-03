const MAP_WIDTH = 500;
const MAP_HEIGHT = 500;
const TILE_ROW_COUNT = 4;
const TILE_HEIGHT = 500 / TILE_ROW_COUNT;
const TILE_WIDTH = 500 / TILE_ROW_COUNT;


class PuzzleGame {
    constructor(imageDataURL) {
        this.imageDataURL = imageDataURL;
        this.size = TILE_ROW_COUNT;
        this.gameBoard = this.createSolvedBoard();
        this.currentBoard = [...this.gameBoard.map(row => [...row])];
        this.container = null;
        this.dragState = {
            isDragging: false,
            dragElement: null,
            offsetX: 0,
            offsetY: 0
        };
    }

    createSolvedBoard() {
        const board = [];
        for (let row = 0; row < this.size; row++) {
            board[row] = [];
            for (let col = 0; col < this.size; col++) {
                board[row][col] = row * this.size + col;
            }
        }
        return board;
    }

    scramble() {
        const flattened = this.currentBoard.flat();
        for (let i = flattened.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [flattened[i], flattened[j]] = [flattened[j], flattened[i]];
        }
        
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                this.currentBoard[row][col] = flattened[row * this.size + col];
            }
        }
    }

    createContainer() {
        const puzzleContainer = document.createElement('div');
        puzzleContainer.className = 'container';
        puzzleContainer.id = 'puzzle-container';
        this.container = puzzleContainer;
        return puzzleContainer;
    }

    isPieceCorrect(row, col) {
        return this.currentBoard[row][col] === this.gameBoard[row][col];
    }

    renderPieces() {
        if (!this.container) return;
        
        this.container.innerHTML = '';
        
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const pieceIndex = this.currentBoard[row][col];
                const originalRow = Math.floor(pieceIndex / this.size);
                const originalCol = pieceIndex % this.size;
                
                const piece = document.createElement('div');
                piece.className = 'puzzle-piece';
                
                if (this.isPieceCorrect(row, col)) {
                    piece.classList.add('correct');
                }
                
                piece.style.width = TILE_WIDTH + 'px';
                piece.style.height = TILE_HEIGHT + 'px';
                piece.dataset.pieceIndex = pieceIndex;
                piece.dataset.currentRow = row;
                piece.dataset.currentCol = col;
                
                piece.style.left = col * TILE_WIDTH + 'px';
                piece.style.top = row * TILE_HEIGHT + 'px';
                piece.style.backgroundImage = `url(${this.imageDataURL})`;
                piece.style.backgroundPosition = `-${originalCol * TILE_WIDTH}px -${originalRow * TILE_HEIGHT}px`;
                piece.style.backgroundSize = `${MAP_WIDTH}px ${MAP_HEIGHT}px`;
                
                piece.addEventListener('mousedown', (e) => this.startDrag(e, piece));
                
                this.container.appendChild(piece);
            }
        }
        
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', (e) => this.endDrag(e));
    }

    startDrag(e, piece) {
        e.preventDefault();
        this.dragState.isDragging = true;
        this.dragState.dragElement = piece;
        
        const rect = piece.getBoundingClientRect();
        
        this.dragState.offsetX = e.clientX - rect.left;
        this.dragState.offsetY = e.clientY - rect.top;
        
        piece.style.zIndex = '1000';
        piece.style.opacity = '0.8';
    }

    drag(e) {
        if (!this.dragState.isDragging || !this.dragState.dragElement) return;
        
        e.preventDefault();
        const containerRect = this.container.getBoundingClientRect();
        
        const newX = e.clientX - containerRect.left - this.dragState.offsetX;
        const newY = e.clientY - containerRect.top - this.dragState.offsetY;
        
        this.dragState.dragElement.style.left = newX + 'px';
        this.dragState.dragElement.style.top = newY + 'px';
    }

    endDrag(e) {
        if (!this.dragState.isDragging || !this.dragState.dragElement) return;
        
        const draggedPiece = this.dragState.dragElement;
        
        draggedPiece.style.zIndex = '';
        draggedPiece.style.opacity = '';
        
        const rect = draggedPiece.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();
        
        const centerX = rect.left + rect.width / 2 - containerRect.left;
        const centerY = rect.top + rect.height / 2 - containerRect.top;
        
        const dropCol = Math.floor(centerX / TILE_WIDTH);
        const dropRow = Math.floor(centerY / TILE_HEIGHT);
        
        if (dropRow >= 0 && dropRow < this.size && dropCol >= 0 && dropCol < this.size) {
            this.swapPieces(
                parseInt(draggedPiece.dataset.currentRow),
                parseInt(draggedPiece.dataset.currentCol),
                dropRow,
                dropCol
            );
        }

        this.renderPieces();
        
        this.dragState.isDragging = false;
        this.dragState.dragElement = null;

        if (this.isWin()) {
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Puzzle Solved!', {
                    body: 'Congratulations! You completed the map puzzle.',
                });
            }
            this.showWinOverlay();
        }
    }

    showWinOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'win-overlay';
        
        const message = document.createElement('div');
        message.className = 'win-message';
        message.innerHTML = `
            <h2>Congratulations!</h2>
            <p>You solved the puzzle!</p>
        `;
        
        overlay.appendChild(message);
        this.container.appendChild(overlay);
    }

    swapPieces(fromRow, fromCol, toRow, toCol) {
        const temp = this.currentBoard[fromRow][fromCol];
        this.currentBoard[fromRow][fromCol] = this.currentBoard[toRow][toCol];
        this.currentBoard[toRow][toCol] = temp;
    }

    isWin() {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.currentBoard[row][col] !== this.gameBoard[row][col]) {
                    return false;
                }
            }
        }
        return true;
    }
}

let puzzleGame = null;

window.onload = () => {
    Notification.requestPermission()

    if (typeof L === 'undefined') {
        console.error('Leaflet failed to load');
        return;
    }
    map = L.map('map').setView([45.8150, 15.9819], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const myLocationButton = document.getElementById('my-localization');
    myLocationButton.onclick = () => {
        if (!('geolocation' in navigator)) {
            console.error('Geolocation not supported by this browser');
            alert('Geolocation is not available in your browser.');
            return;
        }

        myLocationButton.disabled = true;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                map.setView([lat, lng], 16);

                const marker = L.marker([lat, lng]).addTo(map);
                marker.openPopup();
                
                myLocationButton.disabled = false;
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to get your location: ' + (error.message || 'unknown error'));
                myLocationButton.disabled = false;
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }


}

function downloadMap() {
    const scrambleButton = document.getElementById('draw-on-canvas');
    scrambleButton.disabled = false;
    const puzzleContainer = document.getElementById('puzzle-container');
    if (puzzleContainer) {
        puzzleContainer.remove();
    }
    const canvas = document.getElementById('canvas');
    canvas.style.display = 'block';

    leafletImage(map, function(err, capturedCanvas) {
        if (err) {
            console.error('Error capturing map:', err);
            return;
        }
        
        const ctx = canvas.getContext('2d');
        canvas.width = MAP_WIDTH;
        canvas.height = MAP_HEIGHT;

        ctx.drawImage(capturedCanvas, 0, 0);
    });
}

function scrambleMap() {
    const scrambleButton = document.getElementById('draw-on-canvas');
    scrambleButton.disabled = true;
    const canvas = document.getElementById('canvas');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    const canvasDataURL = canvas.toDataURL();
    
    canvas.style.display = 'none';
    
    puzzleGame = new PuzzleGame(canvasDataURL);
    puzzleGame.scramble();
    
    const puzzleContainer = puzzleGame.createContainer();
    puzzleGame.renderPieces();
    
    canvas.parentNode.insertBefore(puzzleContainer, canvas.nextSibling);
}
