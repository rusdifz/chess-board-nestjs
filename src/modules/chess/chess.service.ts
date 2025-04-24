import { Injectable } from '@nestjs/common';
import { Command, ConsoleIO } from '@squareboat/nest-console';

@Injectable()
export class ChessService {
  private board: (string | null)[][];
  private currentTurn: 'w' | 'b'; // w = for white, b = for black

  constructor() {
    this.board = this.initializeBoard();
    this.currentTurn = 'w';
  }

  @Command('play', { desc: 'Start a new chess game' })
  async play(_cli: ConsoleIO) {
    this.board = this.initializeBoard();
    this.currentTurn = 'w';
    while (!this.isGameOver()) {
      _cli.info(this.displayBoard());
      _cli.info(
        `${this.currentTurn.toUpperCase()}'s turn (Putih: huruf besar, Hitam: huruf kecil)`,
      );
      const input = await _cli.ask(
        'Masukkan gerakan Anda (misalnya, "e2 e4" atau "2,5 2,4"):',
      );
      const [fromStr, toStr] = input.split(' ');
      const from = this.parsePosition(fromStr);
      const to = this.parsePosition(toStr);
      if (!from || !to) {
        _cli.error('Format input salah');
        continue;
      }
      if (!this.makeMove(from, to)) {
        _cli.error('Gerakan tidak valid');
        continue;
      }
    }
    const winner = this.getWinner();
    _cli.info(
      `Permainan selesai. ${winner === 'w' ? 'Putih' : 'Hitam'} menang!`,
    );
  }

  makeMove(from: [number, number], to: [number, number]): boolean {
    const piece = this.board[from[0]][from[1]];
    // Pastikan ada potongan di posisi awal dan milik pemain yang sedang ber giliran
    // Potongan putih (huruf besar) untuk giliran 'w', potongan hitam (huruf kecil) untuk 'b'
    if (
      !piece ||
      (this.currentTurn === 'w' && piece === piece.toLowerCase()) ||
      (this.currentTurn === 'b' && piece === piece.toUpperCase())
    ) {
      return false; // Tidak ada potongan atau warna salah
    }
    if (!this.isValidMove(piece, from, to)) return false;
    this.board[to[0]][to[1]] = piece;
    this.board[from[0]][from[1]] = null;
    this.currentTurn = this.currentTurn === 'w' ? 'b' : 'w';
    return true;
  }

  isGameOver(): boolean {
    const opponentKing = this.currentTurn === 'w' ? 'k' : 'K';
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.board[i][j] === opponentKing) return false;
      }
    }
    return true;
  }

  getWinner(): 'w' | 'b' | null {
    if (!this.hasKing('w')) return 'b';
    if (!this.hasKing('b')) return 'w';
    return null;
  }

  private initializeBoard(): (string | null)[][] {
    const board: (string | null)[][] = Array.from({ length: 8 }, () =>
      Array(8).fill(null),
    );
    // Baris belakang putih
    board[0] = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
    // Pion putih
    board[1] = ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'];
    // Pion hitam
    board[6] = ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'];
    // Baris belakang hitam
    board[7] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
    return board;
  }

  private displayBoard(): string {
    let output = '  a b c d e f g h\n';
    for (let i = 7; i >= 0; i--) {
      output += `${i + 1} `;
      for (let j = 0; j < 8; j++) {
        output += this.board[i][j] || '.';
        output += ' ';
      }
      output += `${i + 1}\n`;
    }
    output += '  a b c d e f g h';
    return output;
  }

  private isValidMove(
    piece: string,
    from: [number, number],
    to: [number, number],
  ): boolean {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    // Tentukan apakah potongan adalah putih (huruf besar) atau hitam (huruf kecil)
    const isWhite = piece === piece.toUpperCase();
    const direction = isWhite ? 1 : -1;

    // Validasi gerakan pion
    if (piece.toLowerCase() === 'p') {
      // Gerakan maju: hanya ke kotak kosong
      if (fromCol === toCol && this.board[toRow][toCol] === null) {
        if (toRow === fromRow + direction) return true; // Langkah tunggal
        // Langkah ganda dari posisi awal
        if (
          (isWhite && fromRow === 1 && toRow === 3) ||
          (!isWhite && fromRow === 6 && toRow === 4)
        ) {
          return this.board[fromRow + direction][fromCol] === null;
        }
      }
      // Penangkapan diagonal: harus ada potongan lawan
      if (Math.abs(toCol - fromCol) === 1 && toRow === fromRow + direction) {
        const target = this.board[toRow][toCol];
        if (
          target &&
          ((isWhite && target === target.toLowerCase()) ||
            (!isWhite && target === target.toUpperCase()))
        ) {
          return true; // Menangkap potongan lawan
        }
      }
    }
    // Validasi gerakan benteng
    if (piece.toLowerCase() === 'r') {
      if (fromRow === toRow) {
        const step = toCol > fromCol ? 1 : -1;
        for (let col = fromCol + step; col !== toCol; col += step) {
          if (this.board[fromRow][col] !== null) return false;
        }
        const target = this.board[toRow][toCol];
        return (
          target === null ||
          (isWhite
            ? target === target.toLowerCase()
            : target === target.toUpperCase())
        );
      }
      if (fromCol === toCol) {
        const step = toRow > fromRow ? 1 : -1;
        for (let row = fromRow + step; row !== toRow; row += step) {
          if (this.board[row][fromCol] !== null) return false;
        }
        const target = this.board[toRow][toCol];
        return (
          target === null ||
          (isWhite
            ? target === target.toLowerCase()
            : target === target.toUpperCase())
        );
      }
    }
    // Validasi gerakan kuda
    if (piece.toLowerCase() === 'n') {
      const rowDiff = Math.abs(toRow - fromRow);
      const colDiff = Math.abs(toCol - fromCol);
      if (
        (rowDiff === 2 && colDiff === 1) ||
        (rowDiff === 1 && colDiff === 2)
      ) {
        const target = this.board[toRow][toCol];
        return (
          target === null ||
          (isWhite
            ? target === target.toLowerCase()
            : target === target.toUpperCase())
        );
      }
    }
    // Validasi gerakan gajah
    if (piece.toLowerCase() === 'b') {
      if (Math.abs(toRow - fromRow) === Math.abs(toCol - fromCol)) {
        const rowStep = toRow > fromRow ? 1 : -1;
        const colStep = toCol > fromCol ? 1 : -1;
        for (let i = 1; i < Math.abs(toRow - fromRow); i++) {
          if (this.board[fromRow + i * rowStep][fromCol + i * colStep] !== null)
            return false;
        }
        const target = this.board[toRow][toCol];
        return (
          target === null ||
          (isWhite
            ? target === target.toLowerCase()
            : target === target.toUpperCase())
        );
      }
    }
    // Validasi gerakan ratu
    if (piece.toLowerCase() === 'q') {
      if (fromRow === toRow || fromCol === toCol) {
        const stepRow = fromRow === toRow ? 0 : toRow > fromRow ? 1 : -1;
        const stepCol = fromCol === toCol ? 0 : toCol > fromCol ? 1 : -1;
        for (
          let i = 1;
          i < Math.max(Math.abs(toRow - fromRow), Math.abs(toCol - fromCol));
          i++
        ) {
          if (this.board[fromRow + i * stepRow][fromCol + i * stepCol] !== null)
            return false;
        }
        const target = this.board[toRow][toCol];
        return (
          target === null ||
          (isWhite
            ? target === target.toLowerCase()
            : target === target.toUpperCase())
        );
      }
      if (Math.abs(toRow - fromRow) === Math.abs(toCol - fromCol)) {
        const rowStep = toRow > fromRow ? 1 : -1;
        const colStep = toCol > fromCol ? 1 : -1;
        for (let i = 1; i < Math.abs(toRow - fromRow); i++) {
          if (this.board[fromRow + i * rowStep][fromCol + i * colStep] !== null)
            return false;
        }
        const target = this.board[toRow][toCol];
        return (
          target === null ||
          (isWhite
            ? target === target.toLowerCase()
            : target === target.toUpperCase())
        );
      }
    }
    // Validasi gerakan raja
    if (piece.toLowerCase() === 'k') {
      if (Math.abs(toRow - fromRow) <= 1 && Math.abs(toCol - fromCol) <= 1) {
        const target = this.board[toRow][toCol];
        return (
          target === null ||
          (isWhite
            ? target === target.toLowerCase()
            : target === target.toUpperCase())
        );
      }
    }
    return false;
  }

  private hasKing(color: 'w' | 'b'): boolean {
    const king = color === 'w' ? 'K' : 'k';
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.board[i][j] === king) return true;
      }
    }
    return false;
  }

  private parsePosition(pos: string): [number, number] | null {
    if (pos.includes(',')) {
      const [rowStr, colStr] = pos.split(',');
      const row = parseInt(rowStr) - 1;
      const col = parseInt(colStr) - 1;
      if (row >= 0 && row < 8 && col >= 0 && col < 8) return [row, col];
    } else {
      const colLetter = pos[0].toLowerCase();
      const rowStr = pos[1];
      const col = colLetter.charCodeAt(0) - 'a'.charCodeAt(0);
      const row = parseInt(rowStr) - 1;
      if (col >= 0 && col < 8 && row >= 0 && row < 8) return [row, col];
    }
    return null;
  }
}
