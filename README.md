# slotFinder

Magyar nyelvű alkalmazás csapatok közös időpont egyeztetésére Google Calendar használatával.

## Funkciók

- 🔐 Felhasználókezelés (bejelentkezés, regisztráció)
- 📅 Google Calendar integráció (service account-on keresztül)
- 👥 Más felhasználók foglalt időpontjainak megtekintése
- ⭐ Szabad idősávok kiemelése
- 📤 Meghívó küldése szabad időpontra
- ⚙️ Egyedi nem elérhető időpontok beállítása (pl. vasárnap, ebédidő)
- 💾 5 perces cache a gyorsabb működéshez

## Telepítés

### 1. Klónozás

```bash
git clone https://github.com/rrd108/slotFinder.git
cd slotFinder
```

### 2. Dependencies telepítése

```bash
npm install
```

### 3. Google Service Account beállítása

1. Hozd létre a [Google Cloud Console](https://console.cloud.google.com/)-on
2. API-k és szolgáltatások → Könyvtár → Google Calendar API → Engedélyezés
3. Hitelesítő adatok → Szolgáltatásfiók létrehozása
4. Kulcs létrehozása → JSON formátum
5. Mentsd el a fájlt `webmania-XXX.json` néven

### 4. Adatbázis létrehozása

```bash
npx nuxt-users migrate
npx tsx server/database/schema.ts
```

### 5. Admin felhasználó létrehozása

```bash
npx nuxt-users create-user -e "admin@ példa.hu" -n "Admin" -p "Jelszó123!" -r admin
```

### 6. Futtatás

```bash
npm run dev
```

Az alkalmazás a `http://localhost:3000` címen érhető el.

## Google Calendar megosztás

Minden felhasználónak meg kell osztania a naptárát a service account-tal:

1. Google Calendar → Beállítások → Naptár kiválasztása
2. Naptár megosztása specific személyekkel
3. Add hozzá a service account email címét: `slotfinder@webmania-383615.iam.gserviceaccount.com`
4. jogosultság: **Csak az elfoglaltsági adatok megtekintése**

## Használat

1. **Bejelentkezés** az email/jelszó párossal
2. **Beállítások** oldalon add hozzá a Google Calendar ID-d
3. **Főoldalon** válaszd ki a más felhasználókat
4. A naptár mutatja a szabad és foglalt időpontokat
5. Szabad idősávra kattintva meghívót küldhetsz

## Termelés

```bash
npm run build
node .output/server/index.mjs
```

Vagy PM2-vel:

```bash
pm2 start .output/server/index.mjs --name slotfinder
```

## Technológia

- **Framework**: Nuxt 4
- **UI**: @nuxt/ui v4
- **Auth**: nuxt-users
- **Adatbázis**: SQLite
- **Google API**: googleapis

## Licenc

MIT
