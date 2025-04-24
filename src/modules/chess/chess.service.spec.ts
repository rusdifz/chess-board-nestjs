import { Test, TestingModule } from '@nestjs/testing';
import { ChessService } from './chess.service';

describe('ChessService', () => {
  let service: ChessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChessService],
    }).compile();
    service = module.get<ChessService>(ChessService);
  });

  it('harus menginisialisasi papan dengan benar', () => {
    expect(service['board'][0][0]).toBe('R');
    expect(service['board'][1][0]).toBe('P');
    expect(service['board'][6][0]).toBe('p');
    expect(service['board'][7][0]).toBe('r');
    expect(service['board'][3][3]).toBe(null);
  });

  it('harus mengizinkan gerakan pion yang valid', () => {
    const from: [number, number] = [1, 4]; // e2
    const to: [number, number] = [3, 4]; // e4
    expect(service.makeMove(from, to)).toBe(true);
    expect(service['board'][3][4]).toBe('P');
    expect(service['board'][1][4]).toBe(null);
    expect(service['currentTurn']).toBe('b');
  });

  it('tidak boleh mengizinkan gerakan pion yang tidak valid', () => {
    const from: [number, number] = [1, 4]; // e2
    const to: [number, number] = [4, 4]; // e5
    expect(service.makeMove(from, to)).toBe(false);
    expect(service['board'][1][4]).toBe('P');
    expect(service['currentTurn']).toBe('w');
  });

  it('harus mendeteksi permainan selesai saat raja ditangkap', () => {
    service['board'] = Array.from({ length: 8 }, () => Array(8).fill(null));
    service['board'][4][4] = 'K'; // Raja putih
    service['board'][4][5] = 'q'; // Ratu hitam
    service['currentTurn'] = 'b';
    expect(service.isGameOver()).toBe(false);
    service.makeMove([4, 5], [4, 4]); // Ratu hitam menangkap raja putih
    expect(service.isGameOver()).toBe(true);
    expect(service.getWinner()).toBe('b');
  });
});
