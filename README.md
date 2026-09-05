# NutriTrack 2.0 🌿

NutriTrack is a wellness tracking web application that brings **nutrition, hydration and digital eye wellness** into one daily dashboard.

This repository is an independent portfolio-oriented implementation inspired by the original NutriTrack prototype.

## ✨ Current Features

### Smart Nutrition
- Food search with built-in nutrition data
- Automatic calorie and macro calculations
- Natural-language **Smart Log** prototype
- Manual meal entry as a fallback
- Meal history
- Daily calorie and macro targets

### 💧 Hydration
- 2,000 ml daily goal
- Quick-add 250 / 500 / 750 ml
- Hydration progress
- Daily hydration history

### 👁️ Eye Wellness
- 20-20-20 rule
- Eye-break tracking
- Break completion
- Wellness progress

### 📊 Insights
- 7-day calorie trend
- Average calorie intake
- Meal and eye-break statistics
- Basic data-driven insight

## 🛠️ Tech Stack

- React
- TypeScript
- Vite
- CSS
- Lucide React
- LocalStorage

## 🧠 Smart Log

The current Smart Log is a **local prototype** that demonstrates the product workflow:

`Natural language → food detection → nutrition lookup → review → save`

The next version should connect this interface to an LLM/API for robust food and portion extraction.

## 🚀 Run Locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

To create a production build:

```bash
npm run build
```

## 🗂️ Project Structure

```text
src/
├── App.tsx
├── data.ts
├── storage.ts
├── types.ts
├── main.tsx
└── styles.css
```

## 🔮 Roadmap

- [ ] USDA / nutrition database integration
- [ ] Robust natural-language meal parsing
- [ ] AI meal photo analysis
- [ ] Barcode scanning
- [ ] Personalized AI insights
- [ ] User authentication
- [ ] Cloud database
- [ ] Weekly macro analytics
- [ ] Goals and streaks
- [ ] Sleep and activity tracking
- [ ] PWA/mobile experience

## ⚠️ Nutrition Disclaimer

Nutrition values are estimates and can vary by food brand, preparation method and serving size. NutriTrack is a tracking tool and is not a substitute for professional medical or dietary advice.

## 👨‍💻 Author

Amandeep Singh
