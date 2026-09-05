import { useEffect, useMemo, useState } from "react";
import {
  Activity, BarChart3, Bell, Camera, Check, ChevronRight, CirclePlus,
  Clock3, Droplets, Eye, Flame, Home, Leaf, Menu, Plus, Search,
  Sparkles, Target, Utensils, X, Zap
} from "lucide-react";
import { foods } from "./data";
import type { Meal, WellnessState } from "./types";
import { emptyState, loadState, saveState } from "./storage";

const TARGETS = { calories: 1700, protein: 111, carbs: 180, fats: 55, water: 2000, eyeBreaks: 8 };

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
function todayMeals(meals: Meal[]) {
  return meals.filter(m => m.createdAt.slice(0, 10) === todayKey());
}

function App() {
  const [state, setState] = useState<WellnessState>(loadState);
  const [page, setPage] = useState<"home" | "nutrition" | "wellness" | "insights">("home");
  const [mealOpen, setMealOpen] = useState(false);
  const [mealMode, setMealMode] = useState<"search" | "smart" | "manual">("search");
  const [eyeRunning, setEyeRunning] = useState(false);

  useEffect(() => saveState(state), [state]);

  const meals = todayMeals(state.meals);
  const calories = meals.reduce((s, m) => s + m.calories, 0);
  const protein = meals.reduce((s, m) => s + m.protein, 0);
  const carbs = meals.reduce((s, m) => s + m.carbs, 0);
  const fats = meals.reduce((s, m) => s + m.fats, 0);
  const water = state.waterLogs.filter(w => w.createdAt.slice(0, 10) === todayKey()).reduce((s, w) => s + w.amount, 0);
  const eyeBreaks = state.eyeBreaks.filter(e => e.completedAt.slice(0, 10) === todayKey()).length;

  function addMeal(meal: Omit<Meal, "id" | "createdAt">) {
    setState(s => ({ ...s, meals: [{ ...meal, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...s.meals] }));
    setMealOpen(false);
  }
  function addWater(amount: number) {
    setState(s => ({ ...s, waterLogs: [{ id: crypto.randomUUID(), amount, createdAt: new Date().toISOString() }, ...s.waterLogs] }));
  }
  function completeEyeBreak() {
    setState(s => ({ ...s, eyeBreaks: [{ id: crypto.randomUUID(), completedAt: new Date().toISOString() }, ...s.eyeBreaks] }));
    setEyeRunning(false);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setPage("home")}>
          <span className="brand-mark"><Leaf size={21}/></span>
          <span>NutriTrack</span>
        </button>
        <nav className="desktop-nav">
          <button className={page === "home" ? "nav-active" : ""} onClick={() => setPage("home")}><Home size={17}/> Home</button>
          <button className={page === "nutrition" ? "nav-active" : ""} onClick={() => setPage("nutrition")}><Utensils size={17}/> Nutrition</button>
          <button className={page === "wellness" ? "nav-active" : ""} onClick={() => setPage("wellness")}><Eye size={17}/> Wellness</button>
          <button className={page === "insights" ? "nav-active" : ""} onClick={() => setPage("insights")}><BarChart3 size={17}/> Insights</button>
        </nav>
        <button className="avatar">AS</button>
      </header>

      <main className="content">
        <section className="hero">
          <div>
            <div className="eyebrow"><span className="live-dot"/> Saturday, September 5, 2026</div>
            <h1>Good evening, Amandeep <span>👋</span></h1>
            <p>Track your nutrition, hydration and digital wellness in one place.</p>
          </div>
          <button className="primary-btn hero-btn" onClick={() => setMealOpen(true)}><Plus size={18}/> Log meal</button>
        </section>

        {page === "home" && <Dashboard calories={calories} protein={protein} carbs={carbs} fats={fats} water={water} eyeBreaks={eyeBreaks} meals={meals} onLog={() => setMealOpen(true)} onWater={addWater} onEye={() => setEyeRunning(true)} eyeRunning={eyeRunning} onCompleteEye={completeEyeBreak}/>}
        {page === "nutrition" && <NutritionPage meals={meals} calories={calories} protein={protein} onLog={() => setMealOpen(true)}/>}
        {page === "wellness" && <WellnessPage water={water} eyeBreaks={eyeBreaks} onWater={addWater} onEye={() => setEyeRunning(true)} eyeRunning={eyeRunning} onCompleteEye={completeEyeBreak}/>}
        {page === "insights" && <InsightsPage state={state}/>}
      </main>

      <button className="mobile-fab" onClick={() => setMealOpen(true)}><Plus/></button>
      <footer className="mobile-nav">
        <button onClick={() => setPage("home")}><Home/>Home</button>
        <button onClick={() => setPage("nutrition")}><Utensils/>Nutrition</button>
        <button className="fab-nav" onClick={() => setMealOpen(true)}><Plus/></button>
        <button onClick={() => setPage("wellness")}><Eye/>Wellness</button>
        <button onClick={() => setPage("insights")}><BarChart3/>Insights</button>
      </footer>

      {mealOpen && <MealModal mode={mealMode} setMode={setMealMode} onClose={() => setMealOpen(false)} onAdd={addMeal}/>}
    </div>
  );
}

function Dashboard(props: any) {
  const { calories, protein, carbs, fats, water, eyeBreaks, meals, onLog, onWater, onEye, eyeRunning, onCompleteEye } = props;
  return <div className="dashboard">
    <section className="grid metrics-grid">
      <div className="card nutrition-card">
        <div className="card-head"><div className="icon-box green"><Flame/></div><div><span className="label">Today's nutrition</span><h2>{calories}<small> / {TARGETS.calories} kcal</small></h2></div></div>
        <Progress value={calories} target={TARGETS.calories} />
        <div className="remaining">{Math.max(0, TARGETS.calories - calories)} kcal remaining</div>
        <div className="macro-row">
          <Macro label="Protein" value={protein} target={TARGETS.protein} cls="blue"/>
          <Macro label="Carbs" value={carbs} target={TARGETS.carbs} cls="green-text"/>
          <Macro label="Fats" value={fats} target={TARGETS.fats} cls="purple"/>
        </div>
      </div>

      <div className="card hydration-card">
        <div className="card-head"><div className="icon-box blue"><Droplets/></div><div><span className="label">Hydration</span><h2>{water}<small> / {TARGETS.water} ml</small></h2></div></div>
        <Progress value={water} target={TARGETS.water} />
        <div className="quick-add">
          {[250,500,750].map(v => <button key={v} onClick={() => onWater(v)}><Plus size={15}/>{v} ml</button>)}
        </div>
      </div>

      <div className="card eye-card">
        <div className="card-head"><div className="icon-box purple"><Eye/></div><div><span className="label">Eye wellness</span><h2>{eyeBreaks}<small> / {TARGETS.eyeBreaks} breaks</small></h2></div></div>
        <div className="eye-rule"><strong>20-20-20 rule</strong><span>Every 20 minutes, look 20 ft away for 20 seconds.</span></div>
        <div className="eye-actions">
          {eyeRunning ? <button className="secondary-btn" onClick={onCompleteEye}><Check size={17}/> Complete break</button> : <button className="primary-btn purple-btn" onClick={onEye}><Clock3 size={17}/> Start eye break</button>}
        </div>
      </div>
    </section>

    <section className="section-heading"><div><span className="eyebrow">Today</span><h2>Recent meals</h2></div><button className="text-btn" onClick={onLog}>+ Add meal</button></section>
    <section className="card meal-list">
      {meals.length === 0 ? <EmptyState onLog={onLog}/> : meals.slice(0,4).map(m => <MealRow key={m.id} meal={m}/>)}
    </section>
  </div>
}

function NutritionPage({ meals, calories, protein, onLog }: any) {
  return <div>
    <section className="section-heading"><div><span className="eyebrow">Nutrition</span><h2>Fuel your day</h2><p>Search foods or describe your meal. NutriTrack handles the math.</p></div><button className="primary-btn" onClick={onLog}><Plus/> Log meal</button></section>
    <section className="grid three">
      <StatCard icon={<Flame/>} title="Calories" value={`${calories}`} unit={`/ ${TARGETS.calories} kcal`} cls="green"/>
      <StatCard icon={<Zap/>} title="Protein" value={`${Math.round(protein)}g`} unit={`/ ${TARGETS.protein}g`} cls="blue"/>
      <StatCard icon={<Target/>} title="Meals logged" value={`${meals.length}`} unit="today" cls="purple"/>
    </section>
    <section className="section-heading compact"><div><h2>Today's meals</h2></div></section>
    <section className="card meal-list">{meals.length ? meals.map((m: Meal) => <MealRow key={m.id} meal={m}/>) : <EmptyState onLog={onLog}/>}</section>
  </div>
}

function WellnessPage({ water, eyeBreaks, onWater, onEye, eyeRunning, onCompleteEye }: any) {
  return <div>
    <section className="section-heading"><div><span className="eyebrow">Digital wellness</span><h2>Take care of your body & screen time</h2></div></section>
    <section className="grid two">
      <div className="card wellness-large">
        <div className="wellness-title"><div className="icon-box blue"><Droplets/></div><div><h3>Hydration</h3><span>Daily goal: {TARGETS.water} ml</span></div></div>
        <div className="ring-wrap"><ProgressRing value={water} target={TARGETS.water}/><div><h2>{water} ml</h2><p>{Math.round(Math.min(100, water/TARGETS.water*100))}% of your goal</p></div></div>
        <div className="quick-add full">{[250,500,750].map(v => <button key={v} onClick={() => onWater(v)}><Plus/>{v} ml</button>)}</div>
      </div>
      <div className="card wellness-large">
        <div className="wellness-title"><div className="icon-box purple"><Eye/></div><div><h3>Eye wellness</h3><span>20-20-20 reminder system</span></div></div>
        <div className="eye-timer">{eyeRunning ? "00:20" : "20:00"}<span>{eyeRunning ? "Look away and relax" : "Until next break"}</span></div>
        <div className="progress-line"><span style={{width:`${Math.min(100, eyeBreaks/TARGETS.eyeBreaks*100)}%`}}/></div>
        <p className="muted">{eyeBreaks} of {TARGETS.eyeBreaks} suggested breaks completed today.</p>
        {eyeRunning ? <button className="primary-btn purple-btn wide" onClick={onCompleteEye}><Check/> Complete 20-second break</button> : <button className="primary-btn purple-btn wide" onClick={onEye}><Clock3/> Start break</button>}
      </div>
    </section>
  </div>
}

function InsightsPage({ state }: {state: WellnessState}) {
  const recent = Array.from({length:7}, (_,i) => {
    const d = new Date(); d.setDate(d.getDate() - (6-i)); const key = d.toISOString().slice(0,10);
    const ms = state.meals.filter(m => m.createdAt.slice(0,10) === key);
    return { day:d.toLocaleDateString("en",{weekday:"short"}), calories:ms.reduce((s,m)=>s+m.calories,0), protein:ms.reduce((s,m)=>s+m.protein,0) };
  });
  const avg = Math.round(recent.reduce((s,d)=>s+d.calories,0)/7);
  return <div>
    <section className="section-heading"><div><span className="eyebrow">Analytics</span><h2>Your week at a glance</h2><p>Simple trends from the data you log in NutriTrack.</p></div></section>
    <section className="grid three">
      <StatCard icon={<Flame/>} title="7-day calorie average" value={`${avg}`} unit="kcal/day" cls="green"/>
      <StatCard icon={<Activity/>} title="Meals logged" value={`${state.meals.length}`} unit="all time" cls="blue"/>
      <StatCard icon={<Eye/>} title="Eye breaks" value={`${state.eyeBreaks.length}`} unit="all time" cls="purple"/>
    </section>
    <section className="card chart-card">
      <div className="chart-header"><div><span className="label">Calories</span><h3>Daily intake</h3></div><span className="trend"><Activity size={15}/> Last 7 days</span></div>
      <div className="bars">{recent.map(d => <div className="bar-col" key={d.day}><span>{d.calories || ""}</span><div className="bar" style={{height:`${Math.max(6,Math.min(100,d.calories/TARGETS.calories*100))}%`}}/><small>{d.day}</small></div>)}</div>
    </section>
    <section className="insight-box"><div className="icon-box green"><Sparkles/></div><div><strong>NutriTrack insight</strong><p>{avg > TARGETS.calories ? "Your current 7-day average is above your daily calorie target. Consider reviewing portion sizes and meal composition." : avg === 0 ? "Start logging meals to unlock personalized weekly insights." : "Your logged calorie average is currently within your target. Keep logging consistently to build a clearer trend."}</p></div></section>
  </div>
}

function MealModal({ mode, setMode, onClose, onAdd }: any) {
  return <div className="modal-backdrop" onMouseDown={e => { if(e.target === e.currentTarget) onClose(); }}>
    <div className="modal">
      <div className="modal-head"><div><span className="eyebrow">Nutrition</span><h2>Log a meal</h2></div><button className="icon-btn" onClick={onClose}><X/></button></div>
      <div className="mode-tabs">
        <button className={mode==="search"?"active":""} onClick={() => setMode("search")}><Search/> Search</button>
        <button className={mode==="smart"?"active":""} onClick={() => setMode("smart")}><Sparkles/> Smart Log</button>
        <button className={mode==="manual"?"active":""} onClick={() => setMode("manual")}><Menu/> Manual</button>
      </div>
      {mode==="search" && <FoodSearch onAdd={onAdd}/>}
      {mode==="smart" && <SmartLog onAdd={onAdd}/>}
      {mode==="manual" && <ManualLog onAdd={onAdd}/>}
    </div>
  </div>
}

function FoodSearch({ onAdd }: any) {
  const [q,setQ] = useState(""); const [selected,setSelected] = useState<any>(null); const [qty,setQty] = useState(1);
  const results = foods.filter(f => `${f.name} ${f.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase())).slice(0,8);
  if(selected) {
    const scale = qty;
    return <div className="modal-body">
      <button className="back-link" onClick={() => setSelected(null)}>← Back to search</button>
      <div className="selected-food"><div className="food-avatar">🥗</div><div><h3>{selected.name}</h3><p>{selected.serving} · nutrition per serving</p></div></div>
      <label>Servings <input type="number" min="0.25" step="0.25" value={qty} onChange={e=>setQty(Number(e.target.value))}/></label>
      <div className="nutrition-preview"><Metric label="Calories" value={`${Math.round(selected.calories*scale)} kcal`}/><Metric label="Protein" value={`${(selected.protein*scale).toFixed(1)}g`}/><Metric label="Carbs" value={`${(selected.carbs*scale).toFixed(1)}g`}/><Metric label="Fats" value={`${(selected.fats*scale).toFixed(1)}g`}/></div>
      <button className="primary-btn wide" onClick={() => onAdd({name:selected.name, category:"Snack", calories:Math.round(selected.calories*scale), protein:selected.protein*scale, carbs:selected.carbs*scale, fats:selected.fats*scale, quantity:`${qty} serving(s)`, source:"search"})}>Add to today's meals</button>
    </div>
  }
  return <div className="modal-body">
    <div className="search-box"><Search/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search foods, e.g. paneer, eggs, rice..."/></div>
    <p className="helper">Choose a food to get automatic calories and macros.</p>
    <div className="food-results">{results.map(f => <button className="food-result" key={f.id} onClick={()=>setSelected(f)}><div><strong>{f.name}</strong><span>{f.serving}</span></div><div className="food-macros"><b>{f.calories} kcal</b><span>P {f.protein}g</span><span>C {f.carbs}g</span><span>F {f.fats}g</span></div><ChevronRight/></button>)}</div>
  </div>
}

function SmartLog({ onAdd }: any) {
  const [text,setText] = useState(""); const [parsed,setParsed] = useState<any[]>([]);
  function analyze() {
    const lower = text.toLowerCase();
    const found:any[] = [];
    foods.forEach(f => {
      if(lower.includes(f.name.toLowerCase()) || f.tags.some(t => lower.includes(t) && ["breakfast","lunch","dinner"].includes(t))) {
        const match = lower.match(new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(?:x|×)?\\s*${f.name.replace(/[.*+?^${}()|[\\]\\\\]/g," ")}`, "i"));
        const qty = match ? Number(match[1]) : 1;
        if(!found.some(x=>x.food.id===f.id)) found.push({food:f,qty});
      }
    });
    setParsed(found.slice(0,6));
  }
  const totals = parsed.reduce((s,x)=>({cal:s.cal+x.food.calories*x.qty,p:s.p+x.food.protein*x.qty,c:s.c+x.food.carbs*x.qty,f:s.f+x.food.fats*x.qty}),{cal:0,p:0,c:0,f:0});
  return <div className="modal-body">
    <div className="smart-hero"><div className="ai-orb"><Sparkles/></div><div><h3>Smart Log</h3><p>Describe what you ate in plain language. We'll turn it into trackable nutrition.</p></div></div>
    <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Example: 2 eggs, 2 brown bread and 250 ml milk" rows={4}/>
    <button className="primary-btn wide" onClick={analyze} disabled={!text.trim()}><Sparkles/> Analyze meal</button>
    {parsed.length>0 && <div className="smart-result">
      <div className="result-head"><div><span className="eyebrow">Estimate</span><h3>We found {parsed.length} items</h3></div><span className="estimate-pill">Review before saving</span></div>
      {parsed.map(x=><div className="parsed-row" key={x.food.id}><span>{x.food.name} × {x.qty}</span><b>{Math.round(x.food.calories*x.qty)} kcal</b></div>)}
      <div className="total-row"><span>Total</span><strong>{Math.round(totals.cal)} kcal</strong></div>
      <div className="macro-row"><Macro label="Protein" value={totals.p} target={TARGETS.protein} cls="blue"/><Macro label="Carbs" value={totals.c} target={TARGETS.carbs} cls="green-text"/><Macro label="Fats" value={totals.f} target={TARGETS.fats} cls="purple"/></div>
      <button className="primary-btn wide" onClick={()=>onAdd({name:parsed.map(x=>`${x.food.name} ×${x.qty}`).join(", "),category:"Snack",calories:Math.round(totals.cal),protein:totals.p,carbs:totals.c,fats:totals.f,source:"smart"})}><Check/> Add estimated meal</button>
      <p className="disclaimer">Nutrition from Smart Log is an estimate. Review portions and ingredients before saving.</p>
    </div>}
  </div>
}

function ManualLog({ onAdd }: any) {
  const [form,setForm] = useState({name:"",calories:"",protein:"",carbs:"",fats:""});
  const valid = form.name && form.calories;
  return <div className="modal-body">
    <p className="helper">Manual entry is always available when you want full control.</p>
    <label>Meal name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Homemade dal rice"/></label>
    <div className="form-grid"><label>Calories<input type="number" value={form.calories} onChange={e=>setForm({...form,calories:e.target.value})}/></label><label>Protein (g)<input type="number" value={form.protein} onChange={e=>setForm({...form,protein:e.target.value})}/></label><label>Carbs (g)<input type="number" value={form.carbs} onChange={e=>setForm({...form,carbs:e.target.value})}/></label><label>Fats (g)<input type="number" value={form.fats} onChange={e=>setForm({...form,fats:e.target.value})}/></label></div>
    <button className="primary-btn wide" disabled={!valid} onClick={()=>onAdd({name:form.name,category:"Snack",calories:Number(form.calories),protein:Number(form.protein||0),carbs:Number(form.carbs||0),fats:Number(form.fats||0),source:"manual"})}><Check/> Save meal</button>
  </div>
}

function Progress({value,target}:{value:number,target:number}) {
  return <div className="progress-line"><span style={{width:`${Math.min(100,value/target*100)}%`}}/></div>
}
function ProgressRing({value,target}:{value:number,target:number}) {
  const p=Math.min(100,value/target*100); return <div className="progress-ring" style={{"--p":`${p}%`} as any}><strong>{Math.round(p)}%</strong></div>
}
function Macro({label,value,target,cls}:{label:string,value:number,target:number,cls:string}) {
  return <div className="macro"><span className={cls}>{label}</span><strong>{Math.round(value)}g</strong><small>/ {target}g</small></div>
}
function Metric({label,value}:{label:string,value:string}) { return <div><span>{label}</span><strong>{value}</strong></div> }
function StatCard({icon,title,value,unit,cls}:{icon:any,title:string,value:string,unit:string,cls:string}) { return <div className="card stat-card"><div className={`icon-box ${cls}`}>{icon}</div><span className="label">{title}</span><h2>{value} <small>{unit}</small></h2></div> }
function MealRow({meal}:{meal:Meal}) {
  return <div className="meal-row"><div className="meal-icon"><Utensils/></div><div className="meal-info"><strong>{meal.name}</strong><span>{new Date(meal.createdAt).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})} · {meal.source==="smart" ? "Smart Log" : meal.source==="search" ? "Food search" : "Manual"}</span></div><div className="meal-macros"><b>{meal.calories} kcal</b><span>P {meal.protein.toFixed(1)}g</span><span>C {meal.carbs.toFixed(1)}g</span><span>F {meal.fats.toFixed(1)}g</span></div></div>
}
function EmptyState({onLog}:{onLog:()=>void}) {
  return <div className="empty"><div className="empty-icon"><Utensils/></div><h3>No meals logged yet</h3><p>Search a food or describe your meal to get started.</p><button className="secondary-btn" onClick={onLog}><CirclePlus/> Log your first meal</button></div>
}

export default App;
