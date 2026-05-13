# 🚀 Programlama Evreni

Kodlama becerilerinizi geliştirebileceğiniz, çeşitli zorluk seviyelerinde algoritmik sorular ve quizler çözerek puan toplayabileceğiniz interaktif bir meydan okuma platformu.

🔗 **Canlı Demo:** [Programlama Evreni'ni Ziyaret Et](https://programlama-evreni.vercel.app/)

## ✨ Özellikler

- **Gelişmiş Kimlik Doğrulama:** JWT tabanlı, şifrelenmiş (Bcrypt) güvenli kayıt ve giriş sistemi.
- **Meydan Okumalar (Challenges):** Quiz ve Kodlama olmak üzere farklı türde süreli sorular.
- **Gerçek Zamanlı Süre Kontrolü:** Sorularda geri sayım sayacı ve süre dolduğunda otomatik değerlendirme.
- **Puanlama ve Liderlik Tablosu:** Doğru çözümlerden puan kazanma ve diğer kullanıcılarla rekabet etme.
- **Güvenli Profil Yönetimi:** Kullanıcı paneli ve uçtan uca doğrulamalı şifre güncelleme altyapısı.
- **Modern Arayüz:** Tailwind CSS ile tasarlanmış tam duyarlı (responsive) ve karanlık/aydınlık mod (dark/light) destekli UI.

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** Next.js (App Router), React, Tailwind CSS, TypeScript
- **Backend:** Next.js Route Handlers (API)
- **Veritabanı:** MongoDB & Mongoose
- **Güvenlik:** JSON Web Tokens (JWT), Bcryptjs

## 🚀 Kurulum ve Çalıştırma

Projeyi kendi bilgisayarında yerel olarak çalıştırmak için aşağıdaki adımları izleyebilirsin.

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/Egecher/Programlama-Evreni.git
cd programlama-evreni

```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
# veya
yarn install

```

### 3. Çevre Değişkenlerini Ayarlayın

Projenin ana dizininde bir `.env` dosyası oluşturun ve aşağıdaki değişkenleri ekleyip boş olanları (`MONGO_URI` ve `JWT_SECRET`) kendi bilgilerinizle doldurun:

```bash
PORT=3001
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
MONGO_URI=mongodb+srv://<kullanici_adi>:<sifre>@cluster...
JWT_SECRET=senin_cok_gizli_jwt_anahtarin
JWT_EXPIRES_IN=7d

```

*(Not: Canlı ortama (Vercel vb.) deploy ederken `NEXT_PUBLIC_APP_URL` değerini kendi domaininiz olarak ayarlamayı unutmayın.
- example: `https://programlama-evreni.vercel.app`)*

### 4. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
# veya
yarn dev

```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine giderek uygulamayı görüntüleyebilirsiniz.