# Aplikasi Catur Berbasis Konsol

Aplikasi ini adalah permainan catur yang berjalan di konsol (terminal), dibuat menggunakan [NestJS](https://nestjs.com/) dan [@squareboat/nest-console](https://github.com/squareboat/nest-console). Permainan ini mendukung dua pemain (putih dan hitam) yang bermain secara bergantian di satu konsol. Logika catur diimplementasikan secara manual, dengan papan catur ditampilkan setelah setiap gerakan.

---

## Instalasi

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di mesin lokal Anda:

1. **Clone Repository**:

   - Pastikan [Git](https://git-scm.com/) terinstall.
   - Clone repository aplikasi ini:
     ```bash
     git clone git@github.com:rusdifz/chess-board-nestjs.git
     ```

2. **Navigasi ke Direktori Proyek**:

   - Masuk ke direktori proyek:
     ```bash
     cd chess-app
     ```

3. **Instal Dependensi**:

   - Pastikan [Node.js](https://nodejs.org/) (versi 14 atau lebih baru) terinstall.
   - Instal dependensi yang diperlukan:
     ```bash
     npm install
     ```

4. **Build Proyek**:
   - Kompilasi kode TypeScript ke JavaScript:
     ```bash
     npm run build
     ```

---

## Cara Bermain

Setelah instalasi selesai, Anda dapat memulai permainan dengan langkah-langkah berikut:

1. **Mulai Permainan**:

   - Jalankan perintah berikut di terminal untuk memulai permainan:
     ```bash
     node cli play
     ```

2. **Melihat Papan Catur**:

   - Papan catur akan ditampilkan dalam format teks di konsol. Contoh tampilan:
     ```
       a b c d e f g h
     8 r n b q k b n r
     7 p p p p p p p p
     6 . . . . . . . .
     5 . . . . . . . .
     4 . . . . . . . .
     3 . . . . . . . .
     2 P P P P P P P P
     1 R N B Q K B N R
       a b c d e f g h
     ```
     - **Kolom**: Diwakili oleh huruf `a` hingga `h` (kiri ke kanan).
     - **Baris**: Diwakili oleh angka `1` hingga `8` (bawah ke atas).
     - **Potongan Putih**: Huruf besar (misalnya, `P` untuk pion, `K` untuk raja).
     - **Potongan Hitam**: Huruf kecil (misalnya, `p` untuk pion, `k` untuk raja).
     - **Kotak Kosong**: Ditandai dengan `.`.

3. **Membuat Gerakan**:

   - Permainan dimulai dengan giliran putih.
   - Masukkan gerakan dalam salah satu format berikut:
     - **Notasi Aljabar**: Misalnya, `e2 e4` untuk memindahkan potongan dari posisi `e2` ke `e4`.
     - **Notasi Koordinat**: Misalnya, `2,5 4,5` untuk memindahkan potongan dari baris 2, kolom 5 (e2) ke baris 4, kolom 5 (e4).
       - Dalam notasi koordinat:
         - **Baris**: Angka 1 hingga 8 (1 = baris bawah, 8 = baris atas).
         - **Kolom**: Angka 1 hingga 8 (1 = a, 2 = b, ..., 8 = h).
   - Contoh:
     - `e2 e4`: Memindahkan pion putih dari `e2` ke `e4`.
     - `2,5 4,5`: Memindahkan pion putih dari baris 2, kolom 5 (e2) ke baris 4, kolom 5 (e4).

4. **Validasi Gerakan**:

   - Aplikasi memvalidasi gerakan berdasarkan aturan catur.
   - Hanya potongan pemain yang sedang ber giliran yang dapat digerakkan:
     - Potongan putih (huruf besar) untuk giliran putih.
     - Potongan hitam (huruf kecil) untuk giliran hitam.
   - Jika gerakan tidak valid, Anda akan melihat pesan error seperti "Gerakan tidak valid" dan diminta memasukkan gerakan baru.

5. **Berakhirnya Permainan**:
   - Permainan berakhir ketika raja lawan tertangkap (tidak ada lagi di papan).
   - Aplikasi akan menampilkan pesan seperti: `Permainan selesai. Putih menang!` atau `Permainan selesai. Hitam menang!`.

---
