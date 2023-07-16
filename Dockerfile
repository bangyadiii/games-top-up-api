# Menggunakan image node versi terbaru sebagai base image
FROM node:latest

# Mengatur direktori kerja di dalam container
WORKDIR /app

# Menyalin package.json dan package-lock.json ke direktori kerja
COPY package*.json ./

# Menjalankan perintah npm install untuk menginstal dependensi
RUN npm install

# Menyalin seluruh kode sumber aplikasi ke direktori kerja
COPY . .

# Menjalankan perintah build untuk membangun aplikasi NestJS
RUN npm run build

# Menentukan port yang akan digunakan oleh aplikasi
EXPOSE 9999

# Menjalankan perintah start untuk menjalankan aplikasi NestJS
CMD ["npm", "run", "start:prod"]
