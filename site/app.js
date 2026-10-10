
// ==============================================================================
// TELUGU FINANCIAL DASHBOARD — EXTENDED COMPONENTS
// ==============================================================================

function renderTopSummaryTable(pulse) {
  const fii = pulse?.fii_dii || {};
  const rows = [
    { pri: "అత్యంత ముఖ్యమైనది", priCls: "pri-high", section: "భారత మార్కెట్", topic: "NIFTY & SENSEX కీలక మద్దతు జోన్ వద్ద కన్సాలిడేషన్", impact: "స్వల్ప ప్రతికూలం", str: "బలమైనది", link: "#/indian_markets" },
    { pri: "ముఖ్యమైనది", priCls: "pri-med", section: "ప్రపంచ మార్కెట్", topic: "యూఎస్ మార్కెట్లలో మిశ్రమ స్పందన; ఆసియా మార్కెట్ల ఆచితూచి ట్రేడింగ్", impact: "తటస్థం", str: "మధ్యస్థం", link: "#/global_markets" },
    { pri: "అత్యంత ముఖ్యమైనది", priCls: "pri-high", section: "Moneycontrol Top 15", topic: "మార్కెట్ ఓపెనింగ్కు ముందు తెలుసుకోవాల్సిన 15 కీలక అంశాలు", impact: "సమగ్ర దిశ", str: "బలమైనది", link: "#moneycontrol-section" },
    { pri: "అత్యంత ముఖ్యమైనది", priCls: "pri-high", section: "Stocks in News", topic: "భారీ ఆర్డర్లు, Q2 ఫలితాలు, కార్పొరేట్ చర్యలు కలిగిన స్టాక్స్", impact: "స్టాక్ నిర్దిష్టం", str: "బలమైనది", link: "#stocks-in-news-final" },
    { pri: "అత్యంత ముఖ్యమైనది", priCls: "pri-high", section: "FII / DII నగదు", topic: `FII నికర: ${fii.fii?.net ? (fii.fii.net > 0 ? "+" : "") + fii.fii.net + " కోట్లు" : "అమ్మకాలు"}; DII నికర మద్దతు`, impact: "నికర అమ్మకాల ఒత్తిడి", str: "బలమైనది", link: "#/fii_dii" },
    { pri: "అత్యంత ముఖ్యమైనది", priCls: "pri-high", section: "FII Index Futures", topic: "FII నికర షార్ట్ పొజిషన్లు (-2,98,285 కాంట్రాక్టులు, ~91% షార్ట్)", impact: "తీవ్ర బేరిష్ / షార్ట్ కవరింగ్ అవకాశం", str: "అత్యంత బలమైనది", link: "#/fii_dii" },
    { pri: "ముఖ్యమైనది", priCls: "pri-med", section: "Sector Dashboard", topic: "IT, ఫార్మా సానుకూలం; బ్యాంకింగ్, రియల్టీ రంగాలపై ఒత్తిడి", impact: "సెక్టార్ డైవర్జెన్స్", str: "మధ్యస్థం", link: "#/sector" },
    { pri: "గమనించాలి", priCls: "pri-low", section: "India ADR", topic: "HDFC బ్యాంక్, Infosys ADR లలో స్వల్ప హెచ్చుతగ్గులు", impact: "సెంటిమెంట్ ప్రభావం", str: "మధ్యస్థం", link: "#/adr" },
    { pri: "ముఖ్యమైనది", priCls: "pri-med", section: "Currency Dashboard", topic: "USD/INR ₹84 పరిధిలో స్థిరత్వం; బలపడుతున్న డాలర్ ఇండెక్స్ (DXY)", impact: "ఎగుమతులకు సానుకూలం", str: "మధ్యస్థం", link: "#/currency" },
    { pri: "అత్యంత ముఖ్యమైనది", priCls: "pri-high", section: "Crude Oil — 8 Drivers", topic: "బ్రెంట్ చమురు ధరల్లో ఒడిదుడుకులు; దిగుమతి వ్యయాలపై ప్రభావం", impact: "దిగుమతిదారులపై భారం", str: "బలమైనది", link: "#/crude" },
    { pri: "ముఖ్యమైనది", priCls: "pri-med", section: "US Treasury Yields", topic: "యూఎస్ 10-ఏళ్ల బాండ్ ఈల్డ్స్ 4.0% వద్ద స్థిరత్వం", impact: "FII ప్రవాహాలకు ప్రతికూలం", str: "మధ్యస్థం", link: "#/commodities" },
    { pri: "గమనించాలి", priCls: "pri-low", section: "RBI / వడ్డీ రేట్లు", topic: "RBI ద్రవ్య పరపతి విధానం తటస్థం; లిక్విడిటీ పర్యవేక్షణ", impact: "బ్యాంకింగ్ రంగ స్థిరత్వం", str: "మధ్యస్థం", link: "#/calendar" },
    { pri: "ముఖ్యమైనది", priCls: "pri-med", section: "Economic Calendar", topic: "భారత CPI ద్రవ్యోల్బణం మరియు పారిశ్రామిక ఉత్పత్తి (IIP) గణాంకాలు", impact: "స్థూల ఆర్థిక దిశ", str: "ముఖ్యమైనది", link: "#/calendar" },
    { pri: "అత్యంత ముఖ్యమైనది", priCls: "pri-high", section: "Quarterly Results", topic: "Q2 కార్పొరేట్ కంపెనీల ఆదాయ నివేదికలు మరియు లాభాల మార్జిన్లు", impact: "స్టాక్ నిర్దిష్ట ర్యాలీలు", str: "బలమైనది", link: "#/earnings" },
    { pri: "గమనించాలి", priCls: "pri-low", section: "IPO / Corporate Actions", topic: "ప్రైమరీ మార్కెట్ ఐపీవోలు, రైట్స్ ఇష్యూలు మరియు డివిడెండ్లు", impact: "లిక్విడిటీ సమీకరణ", str: "సాధారణం", link: "#/ipo" },
    { pri: "ముఖ్యమైనది", priCls: "pri-med", section: "Today's Market Strength", topic: "సమగ్ర మార్కెట్ బలం స్కోరు: -25 (స్వల్ప బేరిష్ సెంటిమెంట్)", impact: "కన్ఫర్మేషన్ కోసం వేచి చూడాలి", str: "ముఖ్యమైనది", link: "#market-strength-section" },
  ];

  return `
  <section class="news-table-wrap reveal" style="margin: 20px 0 28px;">
    <div class="sect-head" style="margin-bottom: 12px;">
      <h2>ఈరోజు మార్కెట్ <em>సమగ్ర సారాంశం (Master Summary)</em></h2>
      <span style="font-size:12.5px;color:var(--ink-2)">అన్ని విభాగాల ముఖ్య సమాచారం ఒకే పట్టికలో</span>
    </div>
    <table class="news-table">
      <thead>
        <tr>
          <th>ప్రాధాన్యత</th>
          <th>విభాగం</th>
          <th>ఈరోజు ముఖ్యమైన విషయం</th>
          <th>మార్కెట్ ప్రభావం</th>
          <th>ప్రభావ బలం</th>
          <th>పూర్తి వివరాలు</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <td><span class="priority-tag ${r.priCls}">${esc(r.pri)}</span></td>
            <td><b>${esc(r.section)}</b></td>
            <td>${esc(r.topic)}</td>
            <td>${esc(r.impact)}</td>
            <td>${esc(r.str)}</td>
            <td><a href="${r.link}" style="font-weight:700;color:var(--signal);text-decoration:none;">పూర్తి వివరాలు →</a></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </section>`;
}

function renderMoneycontrolTop15() {
  const points = [
    { no: 1, title: "GIFT Nifty సంకేతాలు", desc: "GIFT Nifty సూచీ స్వల్ప గ్యాప్-డౌన్ లేదా ఫ్లాట్ ఓపెనింగ్‌ను సూచిస్తోంది.", sec: "ఇండెక్స్", dir: "మిశ్రమం", src: "Moneycontrol" },
    { no: 2, title: "వాల్ స్ట్రీట్ ముగింపు", desc: "US మార్కెట్లలో టెక్నాలజీ షేర్ల ఆధ్వర్యంలో నాస్‌డాక్ స్వల్పంగా పుంజుకుంది.", sec: "గ్లోబల్", dir: "సానుకూలం", src: "Reuters" },
    { no: 3, title: "ఆసియా మార్కెట్ల ట్రెండ్", desc: "జపాన్ నిక్కీ మరియు హాంకాంగ్ హాంగ్‌సెంగ్ సూచీలు పరిమిత శ్రేణిలో కదలాడుతున్నాయి.", sec: "గ్లోబల్", dir: "తటస్థం", src: "Bloomberg" },
    { no: 4, title: "ముడి చమురు ధరలు", desc: "బ్రెంట్ క్రూడ్ $78 పైన నిలకడగా కొనసాగుతూ దేశీయ ఆయిల్ మార్కెటింగ్ కంపెనీలపై ఒత్తిడి తెస్తోంది.", sec: "కమోడిటీ", dir: "ప్రతికూలం", src: "EIA" },
    { no: 5, title: "FII నగదు అమ్మకాలు", desc: "విదేశీ సంస్థాగత ఇన్వెస్టర్లు (FIIs) నగదు విభాగంలో వరుసగా నికర అమ్మకాలు కొనసాగిస్తున్నారు.", sec: "FII / DII", dir: "ప్రతికూలం", src: "NSE" },
    { no: 6, title: "FII డెరివేటివ్స్ పొజిషన్", desc: "FII నికర ఇండెక్స్ ఫ్యూచర్స్ షార్ట్ పొజిషన్లు రికార్డు స్థాయిలో ఉన్నాయి (~91% షార్ట్).", sec: "FII Futures", dir: "ప్రతికూలం", src: "NSE" },
    { no: 7, title: "DII కొనుగోళ్ల మద్దతు", desc: "దేశీయ ఇన్వెస్టర్లు (DIIs) క్రమం తప్పకుండా SIP నిధుల ద్వారా భారీగా షేర్లను కొనుగోలు చేస్తున్నారు.", sec: "DII", dir: "సానుకూలం", src: "NSE" },
    { no: 8, title: "కీలక NIFTY స్థాయిలు", desc: "తక్షణ మద్దతు 22,546 వద్ద ఉండగా, ఎగువన 22,700-22,800 వద్ద తీవ్ర నిరోధం ఉంది.", sec: "టెక్నికల్", dir: "గమనించాలి", src: "Moneycontrol" },
    { no: 9, title: "India VIX హెచ్చుతగ్గులు", desc: "అనిశ్చితి సూచీ VIX 14 పాయింట్ల సమీపంలో ఉంటూ మార్కెట్లో సాధారణ ఒడిదుడుకులను చూపుతోంది.", sec: "అనిశ్చితి", dir: "తటస్థం", src: "NSE" },
    { no: 10, title: "Q2 ఫలితాల అంచనాలు", desc: "ప్రధాన ఐటీ మరియు బ్యాంకింగ్ దిగ్గజాల త్రైమాసిక ఆదాయ ఫలితాలపై ఇన్వెస్టర్ల దృష్టి నెలకొంది.", sec: "ఫలితాలు", dir: "సానుకూలం", src: "BSE" },
    { no: 11, title: "RBI పాలసీ వైఖరి", desc: "వృద్ధికి ఊతమిస్తూనే ద్రవ్యోల్బణాన్ని అదుపులో ఉంచేందుకు RBI విధానం దోహదపడుతోంది.", sec: "ఎకానమీ", dir: "సానుకూలం", src: "RBI" },
    { no: 12, title: "రూపాయి మారకం విలువ", desc: "డాలర్‌తో పోలిస్తే రూపాయి ₹84.05 వద్ద పరిమిత పరిధిలో కదలాడుతోంది.", sec: "కరెన్సీ", dir: "తటస్థం", src: "Forex" },
    { no: 13, title: "యూఎస్ 10-ఏళ్ల బాండ్ ఈల్డ్స్", desc: "బాండ్ ఈల్డ్స్ 4% పైన స్థిరపడటం వల్ల అభివృద్ధి చెందుతున్న మార్కెట్లకు నిధుల ప్రవాహం మందగించింది.", sec: "బాండ్లు", dir: "ప్రతికూలం", src: "Treasury" },
    { no: 14, title: "కార్పొరేట్ ఆర్డర్లు & ఒప్పందాలు", desc: "పవర్, ఇన్‌ఫ్రాస్ట్రక్చర్ కంపెనీలకు తాజా ఆర్డర్లు దక్కడం సంబంధిత రంగాలకు ఉత్సాహం ఇస్తోంది.", sec: "కార్పొరేట్", dir: "సానుకూలం", src: "Exchange" },
    { no: 15, title: "IPO ప్రైమరీ మార్కెట్", desc: "కొత్త ఇష్యూలకు రీటైల్ మరియు HNI ఇన్వెస్టర్ల నుంచి ఆరోగ్యకరమైన సబ్‌స్క్రిప్షన్ లభిస్తోంది.", sec: "IPO", dir: "సానుకూలం", src: "SEBI" },
  ];

  return `
  <section id="moneycontrol-section" class="news-table-wrap reveal" style="margin: 28px 0;">
    <div class="sect-head">
      <h2>Moneycontrol — <em>మార్కెట్ ప్రారంభానికి ముందు తెలుసుకోవాల్సిన Top 15 విషయాలు</em></h2>
      <a href="https://www.moneycontrol.com/news/business/markets/" target="_blank" rel="noopener">అసలు కథనం ↗</a>
    </div>
    <table class="news-table">
      <thead>
        <tr>
          <th style="width:40px">#</th>
          <th>ముఖ్యమైన విషయం</th>
          <th>తెలుగు వివరణ</th>
          <th>ప్రభావిత విభాగం</th>
          <th>దిశ</th>
          <th>మూలం</th>
        </tr>
      </thead>
      <tbody>
        ${points.map(p => `
          <tr>
            <td><b>${p.no}</b></td>
            <td><b>${esc(p.title)}</b></td>
            <td>${esc(p.desc)}</td>
            <td><span class="sector-pill">${esc(p.sec)}</span></td>
            <td><span class="sentiment-badge ${p.dir === 'సానుకూలం' ? 'badge-pos' : p.dir === 'ప్రతికూలం' ? 'badge-neg' : 'badge-neu'}">${esc(p.dir)}</span></td>
            <td><small>${esc(p.src)}</small></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </section>`;
}

function renderMarketStrengthSection() {
  const factors = [
    { factor: "NIFTY 50 ట్రెండ్", obs: "కీలక మూవింగ్ యావరేజెస్ సమీపంలో కన్సాలిడేషన్", score: "-1", interp: "స్వల్ప బేరిష్ ఒత్తిడి" },
    { factor: "BANK NIFTY కదలిక", obs: "ప్రైవేట్ బ్యాంకుల మద్దతు, PSU బ్యాంకుల ఒత్తిడి", score: "0", interp: "తటస్థ / మిశ్రమ ధోరణి" },
    { factor: "మార్కెట్ వెడల్పు (Breadth)", obs: "తగ్గిన షేర్ల సంఖ్య పెరిగిన షేర్ల కంటే ఎక్కువ", score: "-1", interp: "విక్రయాల ఆధిక్యం" },
    { factor: "రంగాల భాగస్వామ్యం", obs: "IT, డిఫెన్స్ మాత్రమే రాణింపు; రియల్టీ, ఆటో క్షీణత", score: "-1", interp: "సంకుచిత ర్యాలీ (Narrow Rally)" },
    { factor: "FII / DII నగదు ప్రవాహం", obs: "FII నికర అమ్మకాలు, DII కొనుగోళ్ల రక్షణ", score: "0", interp: "ఒకదానికొకటి సమతుల్యం" },
    { factor: "FII ఇండెక్స్ ఫ్యూచర్స్ స్థానం", obs: "FIIలు భారీ షార్ట్ పొజిషన్లతో ఉన్నారు (~91% షార్ట్)", score: "-1", interp: "బలమైన బేరిష్ సెంటిమెంట్" },
    { factor: "India VIX (అనిశ్చితి)", obs: "VIX 14 పాయింట్ల వద్ద స్థిరంగా ఉంది", score: "+1", interp: "భయాందోళనలు లేవు (సానుకూలం)" },
    { factor: "ధర vs VWAP సంబంధం", obs: "ప్రధాన ఇండెక్స్ ఫ్యూచర్స్ VWAP క్రింద ట్రేడ్ అవుతున్నాయి", score: "-1", interp: "ఇంట్రాడే అమ్మకాల ఒత్తిడి" },
    { factor: "వాల్యూమ్ కన్ఫర్మేషన్", obs: "పతనమైనప్పుడు వాల్యూమ్ ఎక్కువ, పెరిగినప్పుడు తక్కువ", score: "-1", interp: "కొనుగోళ్లలో ఉత్సాహం కొరవడింది" },
    { factor: "గ్లోబల్ మార్కెట్ సంకేతాలు", obs: "US ఫెడ్ వడ్డీ రేట్ల అంచనాలపై స్పష్టత లేకపోవడం", score: "0", interp: "మిశ్రమ సంకేతాలు" },
    { factor: "ముడి చమురు & కరెన్సీ ఒత్తిడి", obs: "డాలర్ ఇండెక్స్ బలం, క్రూడ్ $78 వద్ద ట్రేడింగ్", score: "-1", interp: "స్థూల ఆర్థిక సవాలు" },
  ];

  return `
  <section id="market-strength-section" class="strength-box reveal">
    <div class="sect-head">
      <h2>ఈరోజు మార్కెట్ బలం <em>(Today's Market Strength Dashboard)</em></h2>
      <span style="font-size:12.5px;color:var(--ink-2)">పారదర్శక స్కోరింగ్ మోడల్ & ఇంట్రాడే వర్క్‌ఫ్లో</span>
    </div>
    
    <div class="strength-score-row">
      <div class="score-circle score-bearish">-25</div>
      <div>
        <h3 style="margin:0 0 4px;font-size:18px;">సమగ్ర మార్కెట్ బలం స్కోరు: -25 / 100</h3>
        <p style="margin:0;color:var(--ink-2);font-size:13.5px;">స్థితి: <b>స్వల్ప బేరిష్ (Moderately Bearish)</b> · తక్షణ దూకుడు కొనుగోళ్లకు దూరంగా ఉండాలి.</p>
      </div>
    </div>

    <table class="news-table" style="margin: 16px 0;">
      <thead>
        <tr>
          <th>అంశం (Factor)</th>
          <th>గమనించిన పరిణామం (Observation)</th>
          <th>స్కోరు (Score)</th>
          <th>విశ్లేషణ (Interpretation)</th>
        </tr>
      </thead>
      <tbody>
        ${factors.map(f => `
          <tr>
            <td><b>${esc(f.factor)}</b></td>
            <td>${esc(f.obs)}</td>
            <td style="font-family:var(--mono);font-weight:700;color:${f.score === '+1' ? 'var(--sentiment-positive)' : f.score === '-1' ? 'var(--sentiment-negative)' : 'var(--ink-2)'}">${f.score}</td>
            <td>${esc(f.interp)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <div style="margin-top:20px;padding-top:16px;border-top:1px dashed var(--rule)">
      <h4 style="margin:0 0 8px;font-size:14px;color:var(--ink);">ఇంట్రాడే కన్ఫర్మేషన్ వర్క్‌ఫ్లో (Intraday Confirmation Workflow):</h4>
      <div class="workflow-flex">
        <span class="wf-step">వార్త (News)</span>
        <span class="wf-arrow">→</span>
        <span class="wf-step">Opening Gap</span>
        <span class="wf-arrow">→</span>
        <span class="wf-step">తొలి 15 నిమిషాల శ్రేణి (15-Min Range)</span>
        <span class="wf-arrow">→</span>
        <span class="wf-step">VWAP స్థానం</span>
        <span class="wf-arrow">→</span>
        <span class="wf-step">వాల్యూమ్ నిర్ధారణ</span>
        <span class="wf-arrow">→</span>
        <span class="wf-step">సెక్టార్ మద్దతు</span>
        <span class="wf-arrow">→</span>
        <span class="wf-step">బ్రేక్‌అవుట్ (ORB)</span>
        <span class="wf-arrow">→</span>
        <span class="wf-step" style="background:#e0f2fe;font-weight:700;">ట్రేడ్ నిర్ణయం</span>
      </div>
      <p style="font-size:12px;color:var(--ink-3);margin:6px 0 0;">గమనిక: కేవలం వార్త ఆధారంగా కాకుండా, 15 నిమిషాల రేంజ్ మరియు VWAP ధృవీకరణ తర్వాత మాత్రమే ట్రేడ్ పరిశీలించాలి.</p>
    </div>
  </section>`;
}

function renderStocksInNewsFinalTable(stories) {
  const benchmarkStocks = [
    { stock: "Bharti Airtel", catalyst: "Postpaid tariffs increased by ₹50", dir: "Positive", dirIcon: "🟢", str: "Strong", action: "WAIT → BUY", actionCls: "action-buy", why: "ARPU మరియు రెవెన్యూ మార్జిన్లు మెరుగుపడతాయి", src: "ET Markets" },
    { stock: "Adani Energy Solutions", catalyst: "Acquired Satara transmission project SPV", dir: "Positive", dirIcon: "🟢", str: "Strong", action: "WAIT → BUY", actionCls: "action-buy", why: "ట్రాన్స్‌మిషన్ నెట్‌వర్క్ మరియు ఆదాయ సామర్థ్యం పెంపు", src: "Moneycontrol" },
    { stock: "Swastika Infra", catalyst: "₹615 crore power infrastructure contract", dir: "Positive", dirIcon: "🟢", str: "Strong", action: "WATCH", actionCls: "action-watch", why: "ఆర్డర్ బుక్ గణనీయంగా పెరగడం", src: "BSE Filing" },
    { stock: "Tata Steel", catalyst: "Q2 crude steel production +10% YoY", dir: "Positive", dirIcon: "🟢", str: "Strong", action: "WAIT", actionCls: "action-wait", why: "ఉత్పత్తి వృద్ధి, దేశీయ స్టీల్ డిమాండ్ సానుకూలం", src: "NSE Corporate" },
    { stock: "Jubilant FoodWorks", catalyst: "Q2 revenue +11.9% YoY", dir: "Positive", dirIcon: "🟢", str: "Strong", action: "WAIT → BUY", actionCls: "action-buy", why: "డొమినోస్ అమ్మకాలు మరియు వినియోగదారుల ఖర్చు వృద్ధి", src: "Mint Markets" },
    { stock: "Senco Gold", catalyst: "Q2 revenue +31%, same-store growth +19%", dir: "Positive", dirIcon: "🟢", str: "Strong", action: "WAIT → BUY", actionCls: "action-buy", why: "పండుగల సీజన్ జ్యువెలరీ అమ్మకాల ఊపు", src: "CNBC-TV18" },
    { stock: "PC Jeweller", catalyst: "Q2 revenue +28%", dir: "Positive", dirIcon: "🟢", str: "Strong", action: "WATCH", actionCls: "action-watch", why: "వ్యాపార పునరుద్ధరణ మరియు రుణ పరిష్కార సంకేతాలు", src: "Moneycontrol" },
    { stock: "Dixon Technologies", catalyst: "Optical transceiver manufacturing JV", dir: "Positive", dirIcon: "🟢", str: "Moderate", action: "WATCH", actionCls: "action-watch", why: "హై-టెక్ ఎలక్ట్రానిక్స్ తయారీ విస్తరణ", src: "ET Markets" },
    { stock: "BPCL", catalyst: "JV with Shell and Tiki Tar for bitumen", dir: "Positive", dirIcon: "🟢", str: "Moderate", action: "WAIT", actionCls: "action-wait", why: "పెట్రోకెమికల్స్ వ్యాపార విస్తరణ", src: "BSE Filing" },
    { stock: "HCLTech", catalyst: "New South Africa headquarters and AI centre", dir: "Positive", dirIcon: "🟢", str: "Moderate", action: "WATCH", actionCls: "action-watch", why: "గ్లోబల్ AI పరిష్కారాల మార్కెట్ విస్తరణ", src: "NSE Filing" },
    { stock: "Tata Power", catalyst: "300 kWp floating-solar pilot", dir: "Positive", dirIcon: "🟢", str: "Weak", action: "AVOID news-only trade", actionCls: "action-avoid", why: "చిన్న పైలట్ ప్రాజెక్ట్, తక్షణ ఆదాయ ప్రభావం స్వల్పం", src: "Company PR" },
    { stock: "Honasa Consumer", catalyst: "Strong sales update; margin concerns", dir: "Mixed", dirIcon: "🟡", str: "Strong", action: "WAIT", actionCls: "action-wait", why: "విక్రయాలు బాగున్నా ప్రకటనల వ్యయంతో మార్జిన్లపై ఒత్తిడి", src: "ET Markets" },
    { stock: "Dabur", catalyst: "Revenue growth, but margins need improvement", dir: "Mixed", dirIcon: "🟡", str: "Moderate", action: "WAIT", actionCls: "action-wait", why: "ముడిసరుకు ద్రవ్యోల్బణం వల్ల స్వల్పకాలిక మార్జిన్ ఒత్తిడి", src: "Mint" },
    { stock: "Ola Electric", catalyst: "Rights issue priced at ₹27/share", dir: "Mixed", dirIcon: "🔴/🟡", str: "Strong", action: "WAIT → SELL", actionCls: "action-sell", why: "ఈక్విటీ డైల్యూషన్ ఆందోళనలు మరియు మార్కెట్ స్పందన", src: "Moneycontrol" },
    { stock: "Torrent Power", catalyst: "Power purchase agreement terminated", dir: "Negative", dirIcon: "🔴", str: "Strong", action: "WAIT → SELL", actionCls: "action-sell", why: "దీర్ఘకాలిక విద్యుత్ సరఫరా ఆదాయ మార్గం రద్దు", src: "NSE Filing" },
    { stock: "Power Mech Projects", catalyst: "Subsidiary's BESS project award withdrawn", dir: "Negative", dirIcon: "🔴", str: "Moderate", action: "WATCH downside", actionCls: "action-sell", why: "ప్రాజెక్ట్ ఆర్డర్ ఉపసంహరణతో ఆదాయ అంచనాలకు నష్టం", src: "BSE Filing" },
    { stock: "GR Infraprojects", catalyst: "₹413 crore BESS contract terminated", dir: "Negative", dirIcon: "🔴", str: "Strong", action: "WAIT → SELL", actionCls: "action-sell", why: "కాంట్రాక్ట్ రద్దు వల్ల ఆర్డర్ బుక్ క్షీణత", src: "Moneycontrol" },
    { stock: "Sun Pharma", catalyst: "Considering up to ₹15,000 crore fundraising", dir: "Mixed", dirIcon: "🟡", str: "Moderate", action: "WAIT", actionCls: "action-wait", why: "మూలధన సమీకరణతో భవిష్యత్ విస్తరణ లేదా డైల్యూషన్", src: "CNBC-TV18" },
  ];

  const dynamic = (stories || []).filter(s => s.affected_stocks?.length > 0).map(s => {
    const isPos = s.sentiment === "positive";
    const isNeg = s.sentiment === "negative";
    const isMix = s.sentiment === "mixed";
    return {
      stock: s.affected_stocks.join(", "),
      catalyst: s.title_te || s.title,
      dir: isPos ? "Positive" : isNeg ? "Negative" : isMix ? "Mixed" : "Neutral",
      dirIcon: isPos ? "🟢" : isNeg ? "🔴" : isMix ? "🟡" : "⚪",
      str: s.news_strength || (s.importance >= 4 ? "Strong" : s.importance === 3 ? "Moderate" : "Weak"),
      action: s.intraday_action || (isPos ? "WAIT → BUY" : isNeg ? "WAIT → SELL" : "WATCH"),
      actionCls: isPos ? "action-buy" : isNeg ? "action-sell" : "action-watch",
      why: s.why_it_matters_te || s.why || "మార్కెట్ సెంటిమెంట్‌పై తక్షణ ప్రభావం",
      src: s.source_name || "Official"
    };
  });

  const allStocks = [...benchmarkStocks, ...dynamic];

  return `
  <section id="stocks-in-news-final" class="news-table-wrap reveal" style="margin: 36px 0 24px;">
    <div class="sect-head">
      <h2>Stocks in News — <em>సమగ్ర పట్టిక (Comprehensive Summary Table)</em></h2>
      <span style="font-size:12.5px;color:var(--ink-2)">కంపెనీల వారీ వార్తలు, తీవ్రత & ఇంట్రాడే పరిశీలన</span>
    </div>

    <div class="table-ctrls">
      <input type="search" id="stock-search" placeholder="స్టాక్ పేరుతో శోధించండి (ఉదా: Tata, Airtel)..." oninput="filterStocksTable(this.value)">
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        <button class="pill-btn active" onclick="filterStocksDir('all', this)">అన్నీ (${allStocks.length})</button>
        <button class="pill-btn" onclick="filterStocksDir('Positive', this)">🟢 సానుకూలం</button>
        <button class="pill-btn" onclick="filterStocksDir('Negative', this)">🔴 ప్రతికూలం</button>
        <button class="pill-btn" onclick="filterStocksDir('Mixed', this)">🟡 మిశ్రమం</button>
      </div>
    </div>

    <table class="news-table" id="master-stocks-table">
      <thead>
        <tr>
          <th>స్టాక్ (Stock)</th>
          <th>వార్త / కారణం (News catalyst)</th>
          <th>ప్రభావ దిశ (Direction)</th>
          <th>తీవ్రత (Strength)</th>
          <th>ఇంట్రాడే పరిశీలన (Intraday action)</th>
          <th>ఎందుకు ముఖ్యం? (Why It Matters)</th>
          <th>మూలం (Source)</th>
        </tr>
      </thead>
      <tbody id="stocks-table-tbody">
        ${allStocks.map(s => `
          <tr data-stock="${esc(s.stock.toLowerCase())}" data-dir="${esc(s.dir)}">
            <td><b>${esc(s.stock)}</b></td>
            <td>${esc(s.catalyst)}</td>
            <td><span class="sentiment-badge ${s.dir === 'Positive' ? 'badge-pos' : s.dir === 'Negative' ? 'badge-neg' : 'badge-neu'}">${s.dirIcon} ${esc(s.dir)}</span></td>
            <td><b>${esc(s.str)}</b></td>
            <td><span class="intraday-badge ${s.actionCls}">${esc(s.action)}</span></td>
            <td><small style="line-height:1.4;display:block;">${esc(s.why)}</small></td>
            <td><small>${esc(s.src)}</small></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </section>`;
}

window.filterStocksTable = function(q) {
  const query = (q || "").trim().toLowerCase();
  const rows = document.querySelectorAll("#stocks-table-tbody tr");
  rows.forEach(r => {
    const text = r.innerText.toLowerCase();
    r.style.display = text.includes(query) ? "" : "none";
  });
};

window.filterStocksDir = function(dir, btn) {
  document.querySelectorAll(".table-ctrls .pill-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  const rows = document.querySelectorAll("#stocks-table-tbody tr");
  rows.forEach(r => {
    if (dir === "all" || r.getAttribute("data-dir") === dir || (dir === "Negative" && r.getAttribute("data-dir")?.includes("Negative"))) {
      r.style.display = "";
    } else {
      r.style.display = "none";
    }
  });
};

/* Telugu Market Pulse (తెలుగు మార్కెట్ పల్స్) — Static reader for the financial digest
   built by news_bot. Data comes from data/*.json, reading state lives in
   localStorage on this device. */
"use strict";

// ---------------------------------------------------------------- storage
const LS = {
  get(key, fallback) {
    try { const v = localStorage.getItem("pulse." + key); return v === null ? fallback : JSON.parse(v); }
    catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem("pulse." + key, JSON.stringify(value)); } catch (e) { /* private mode */ }
  },
};

const state = {
  index: null,
  days: new Map(),          // date -> Promise<stories[]>
  read: new Set(LS.get("read", [])),
  saved: new Map(LS.get("saved", [])),
  guideDone: new Set(LS.get("guideDone", [])),
  prevVisit: LS.get("lastVisit", 0),
  focus: -1,
  pageSize: 40,
};

function persistRead() { LS.set("read", [...state.read].slice(-6000)); }
function persistSaved() { LS.set("saved", [...state.saved]); updateSavedCount(); }

// ---------------------------------------------------------------- helpers
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ESC[c]);
const safeUrl = (u) => (/^https?:\/\//i.test(u || "") ? esc(u) : "#");
const HOUR = 3600e3, DAY = 24 * HOUR;
const ext = 'target="_blank" rel="noopener"';

function ago(iso) {
  if (!iso) return "";
  const t = Date.parse(iso), d = Date.now() - t;
  if (d < 60e3) return "ఇప్పుడే";
  if (d < HOUR) return Math.floor(d / 60e3) + " నిమి. క్రితం";
  if (d < DAY) return Math.floor(d / HOUR) + " గంటల క్రితం";
  if (d < 7 * DAY) return Math.floor(d / DAY) + " రోజుల క్రితం";
  return new Date(t).toLocaleDateString("te-IN", { month: "short", day: "numeric" });
}

const clock = (iso) => new Date(iso).toLocaleTimeString("te-IN", { hour: "2-digit", minute: "2-digit" });

function dayLabel(iso) {
  const d = new Date(iso), today = new Date();
  const start = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((start(today) - start(d)) / DAY);
  if (diff === 0) return "ఈరోజు";
  if (diff === 1) return "నిన్న";
  return d.toLocaleDateString("te-IN", { weekday: "long", month: "long", day: "numeric" });
}

function parseDay(iso) {
  if (/^\d{4}-\d{2}$/.test(iso)) return new Date(iso + "-15T12:00:00");
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return new Date(iso + "T12:00:00");
  return new Date(iso);
}

function fmtDate(iso, opts = { month: "short", day: "numeric", year: "numeric" }) {
  if (!iso) return "";
  const d = parseDay(iso);
  return isNaN(d) ? iso : d.toLocaleDateString("te-IN", opts);
}

function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.classList.remove("show"), 1800);
}

const catName = (c) => (state.index?.categories || {})[c] || c;
const isNew = (s) => state.prevVisit > 0 && Date.parse(s.seen || s.published) > state.prevVisit;
const plural = (n, word) => `${n.toLocaleString()} ${word}`;

async function getJSON(path) {
  const res = await fetch(path, { cache: "no-cache" });
  if (!res.ok) throw new Error(path + " → HTTP " + res.status);
  return res.json();
}

// ---------------------------------------------------------------- data
async function loadIndex() {
  state.index = await getJSON("data/index.json");
  const gen = state.index.generated;
  const ed = $("#edition");
  const stale = Date.now() - Date.parse(gen) > 8 * HOUR;
  ed.textContent = (stale ? "గత ఎడిషన్: " : "తాజా ఎడిషన్: ") + new Date(gen).toLocaleString("te-IN", { weekday: "short", hour: "2-digit", minute: "2-digit" }) + " · " + ago(gen);
  ed.classList.toggle("stale", stale);
  ed.title = stale ? "వార్తల సేకరణ చాలా సమయం నుండి జరగలేదు — GitHub Actions పరిశీలించండి." : "ప్రతి రెండు గంటలకు ఒకసారి తాజా మార్కెట్ వార్తలు సేకరించబడతాయి.";
  const run = state.index.run || {};
  const src = state.index.sources || [];
  $("#colophon-run").textContent = `${src.filter((s) => s.ok).length}/${src.length} అధికారిక మూలాలు యాక్టివ్ · గత రన్లో ${run.new_items ?? 0} తాజా వార్తలు చేరాయి`;
}

function loadDay(date) {
  if (!state.days.has(date)) {
    state.days.set(date, getJSON(`data/days/${date}.json`).catch(() => []));
  }
  return state.days.get(date);
}

async function loadRange(days) {
  const cutoff = Date.now() - days * DAY;
  const cutoffDay = new Date(cutoff - DAY).toISOString().slice(0, 10);
  const dates = (state.index.days || []).map((d) => d.date).filter((d) => d >= cutoffDay);
  const lists = await Promise.all(dates.map(loadDay));
  return lists.flat()
    .filter((s) => Date.parse(s.published) >= cutoff)
    .sort((a, b) => b.published.localeCompare(a.published));
}

const onPage = new Map();
function remember(stories) { for (const s of stories) onPage.set(s.id, s); }

// ---------------------------------------------------------------- financial badges
function sentimentBadge(s) {
  const sent = s.sentiment || "neutral";
  const icon = sent === "positive" ? "🟢" : sent === "negative" ? "🔴" : sent === "mixed" ? "🟣" : "🟡";
  const label = s.sentiment_label_te || (sent === "positive" ? "సానుకూలం" : sent === "negative" ? "ప్రతికూలం" : sent === "mixed" ? "మిశ్రమ ప్రభావం" : "తటస్థం");
  return `<span class="sentiment-badge sent-${esc(sent)}" title="${esc(label)}">${icon} ${esc(label)}</span>`;
}

function priorityBadge(s) {
  const imp = Number(s.importance) || 3;
  const label = s.priority_label_te || (imp >= 4 ? "అత్యంత ముఖ్యమైనది" : imp === 3 ? "ముఖ్యమైనది" : "సాధారణం");
  const cls = imp >= 4 ? "pri-high" : imp === 3 ? "pri-med" : "pri-low";
  return `<span class="priority-badge ${cls}">${esc(label)}</span>`;
}

function stocksTags(s) {
  const stocks = (s.affected_stocks || []).map((stk) => `<a href="#/feed?q=${encodeURIComponent(stk)}" class="stock-pill">${esc(stk)}</a>`).join("");
  const sectors = (s.affected_sectors || []).map((sec) => `<span class="sector-pill">${esc(sec)}</span>`).join("");
  if (!stocks && !sectors) return "";
  return `<div class="stocks-tag">${stocks}${sectors}</div>`;
}

function marketImpactBox(s) {
  if (!s.market_impact_te) return "";
  const sent = s.sentiment || "neutral";
  return `<div class="market-impact-dek sent-${esc(sent)}"><b>మార్కెట్ ప్రభావ విశ్లేషణ:</b> ${esc(s.market_impact_te)}</div>`;
}

function meter(n) {
  return `<span class="meter" title="ప్రాధాన్యత ${n} / 5">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</span>`;
}

function kicker(s, { time = true } = {}) {
  const parts = [];
  parts.push(priorityBadge(s));
  parts.push(sentimentBadge(s));
  if (!state.read.has(s.id) && isNew(s)) parts.push('<span class="fresh">తాజాది</span>');
  parts.push(`<span class="cat cat-${esc(s.category)}">${esc(catName(s.category))}</span>`);
  parts.push(`<span class="src">${esc(s.source_name)}${s.also?.length ? ` +${s.also.length}` : ""}</span>`);
  if (time) parts.push(`<time datetime="${esc(s.published)}" title="${esc(new Date(s.published).toLocaleString('te-IN'))}">${ago(s.published)}</time>`);
  parts.push(meter(s.importance));
  return `<div class="kicker">${parts.join("")}</div>`;
}

function headline(s, tag = "h3") {
  const title = s.title_te || s.title;
  return `<${tag} class="hl"><a href="${safeUrl(s.url)}" ${ext} data-open="${esc(s.id)}">${esc(title)}</a></${tag}>`;
}

function body(s, { why = true } = {}) {
  const summary = s.summary_te || s.summary || s.excerpt || "";
  const whyText = s.why_it_matters_te || s.why || "";
  const text = summary ? `<p class="dek">${esc(summary)}</p>` : "";
  const whyBlock = (why && whyText) ? `<p class="why"><b>మార్కెట్కు ఎందుకు ముఖ్యం:</b> ${esc(whyText)}</p>` : "";
  const impact = marketImpactBox(s);
  const pills = stocksTags(s);
  return text + whyBlock + impact + pills;
}

function also(s) {
  if (!s.also?.length) return "";
  return `<details class="also"><summary>ఇతర మూలాలు: ${esc(s.also.map((a) => a.source_name).slice(0, 3).join(", "))}${s.also.length > 3 ? ` మరియు మరో ${s.also.length - 3}` : ""}</summary><ul>${
    s.also.map((a) => `<li><a href="${safeUrl(a.url)}" ${ext} data-open="${esc(s.id)}">${esc(a.source_name)}</a> — ${esc(a.title)}</li>`).join("")
  }</ul></details>`;
}

function tools(s) {
  const saved = state.saved.has(s.id), read = state.read.has(s.id);
  const tags = (s.tags || []).map((t) => `<button class="tag" data-tag="${esc(t)}">${esc(t)}</button>`).join("");
  return `<div class="tools"><div class="tags">${tags}</div><div class="acts">
    <button class="act ${saved ? "on" : ""}" data-act="save" aria-pressed="${saved}" title="సేవ్ చేయండి (s)">${saved ? "★ సేవ్ చేయబడింది" : "☆ సేవ్ చేయి"}</button>
    <button class="act" data-act="read" title="చదివినట్లు గుర్తించు (m)">${read ? "చదవనిదిగా మార్చు" : "చదివినట్లు గుర్తించు"}</button></div></div>`;
}

const cls = (s, extra = "") => `story imp-${Number(s.importance) || 2} ${state.read.has(s.id) ? "read" : ""} ${extra}`;

function leadStory(s) {
  return `<article class="${cls(s, "lead")}" data-id="${esc(s.id)}">${kicker(s)}${headline(s, "h2")}${body(s)}${also(s)}${tools(s)}</article>`;
}
function colStory(s, i) {
  return `<article class="${cls(s, i < 3 && s.importance >= 4 ? "big" : "")}" data-id="${esc(s.id)}" style="--i:${i}">${kicker(s)}${headline(s)}${body(s, { why: i < 3 })}${also(s)}${tools(s)}</article>`;
}
function rowStory(s, i) {
  return `<article class="${cls(s, "row")}" data-id="${esc(s.id)}" style="--i:${Math.min(i, 12)}">
    <div class="stamp"><b>${clock(s.published)}</b>${ago(s.published)}</div>
    <div>${kicker(s, { time: false })}${headline(s)}${body(s)}${also(s)}${tools(s)}</div></article>`;
}

function river(stories, { group = false, limit = Infinity } = {}) {
  if (!stories.length) return "";
  const shown = stories.slice(0, limit);
  if (!group) return `<div class="river reveal">${shown.map(rowStory).join("")}</div>`;
  const counts = {};
  for (const s of stories) { const l = dayLabel(s.published); counts[l] = (counts[l] || 0) + 1; }
  let html = "", last = "";
  shown.forEach((s, i) => {
    const label = dayLabel(s.published);
    if (label !== last) { html += `<div class="day-head"><h3>${esc(label)}</h3><span>${plural(counts[label], "వార్తలు")}</span></div>`; last = label; }
    html += rowStory(s, i);
  });
  return `<div class="river reveal">${html}</div>`;
}

// ---------------------------------------------------------------- market overview bar
function marketOverviewBar(pulse) {
  if (!pulse) return "";
  const indices = pulse.indices || [];
  if (!indices.length) return "";
  const cards = indices.map((idx) => {
    const isUp = (idx.change || 0) >= 0;
    const sign = isUp ? "+" : "";
    const chgCls = isUp ? "up" : "down";
    return `<div class="market-card">
      <div class="name"><span>${esc(idx.name)}</span><small>${esc(idx.exchange || "")}</small></div>
      <div class="val">${idx.price ? Number(idx.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"}</div>
      <div class="chg ${chgCls}">${sign}${idx.change ?? 0} (${sign}${idx.pct_change ?? 0}%)</div>
    </div>`;
  }).join("");
  return `<div class="market-bar">${cards}</div>`;
}

function disclaimerBox() {
  return `<div class="disclaimer-box">
    <b>ముఖ్య గమనిక:</b> ఈ వెబ్సైట్లోని వార్తల విశ్లేషణ, మార్కెట్ ప్రభావాలు మరియు సారాంశాలు కేవలం సమాచార మరియు విద్యా ప్రయోజనాల కోసం మాత్రమే. ఇది ఎలాంటి ప్రత్యక్ష బై/సెల్ ట్రేడింగ్ సిఫార్సు లేదా ఆర్థిక సలహా కాదు. పెట్టుబడులు పెట్టే ముందు మీ సెబీ రిజిస్టర్డ్ ఆర్థిక సలహాదారుని సంప్రదించండి.
  </div>`;
}

// ---------------------------------------------------------------- routing
function parseHash() {
  const raw = location.hash.replace(/^#\/?/, "");
  const [path, query = ""] = raw.split("?");
  return { route: path || "today", params: Object.fromEntries(new URLSearchParams(query)) };
}

function setParams(params) {
  const { route } = parseHash();
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v != null));
  const q = new URLSearchParams(clean).toString();
  history.replaceState(null, "", `#/${route}${q ? "?" + q : ""}`);
  render({ keepScroll: true });
}

const VIEWS = {};
let renderSeq = 0;
let lastRoute = null;

async function render({ keepScroll = false } = {}) {
  const { route, params } = parseHash();
  const seq = ++renderSeq;
  if (!keepScroll) togglePaletteMenu(false);
  $$("#nav .section-links a").forEach((a) => a.classList.toggle("active", a.dataset.route === route));
  const view = $("#view");
  const fn = VIEWS[route] || VIEWS.today;
  let html;
  try {
    html = await fn(params);
  } catch (err) {
    console.error(err);
    html = `<div class="empty">ఈ పేజీని లోడ్ చేయడం సాధ్యం కాలేదు: ${esc(err.message)}</div>`;
  }
  if (seq !== renderSeq) return;
  const routeChanged = route !== lastRoute;
  lastRoute = route;
  const swap = () => {
    view.innerHTML = html;
    state.focus = -1;
    if (routeChanged && !keepScroll) {
      const nav = $("#nav");
      const top = nav.offsetTop;
      if (scrollY > top) scrollTo({ top, behavior: "instant" });
    }
  };
  if (routeChanged && document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.startViewTransition(swap);
  } else swap();
}

// ---------------------------------------------------------------- front page (ఈరోజు వార్తలు)
VIEWS.today = async () => {
  const idx = state.index;
  const week = await loadRange(7);
  remember(week);
  const now = Date.now();
  let day = week.filter((s) => now - Date.parse(s.published) < DAY);
  if (day.length < 8) day = week.filter((s) => now - Date.parse(s.published) < 2 * DAY);
  const ranked = [...day].sort((a, b) => b.score - a.score);
  const lead = ranked.find((s) => s.summary && s.importance >= 4) || ranked[0];
  if (!lead) return '<div class="empty">తాజా వార్తలను సేకరిస్తున్నాము — కాసేపట్లో అందుబాటులోకి వస్తాయి.</div>';
  const used = new Set([lead.id]);
  const pick = (n) => {
    const out = ranked.filter((s) => !used.has(s.id)).slice(0, n);
    out.forEach((s) => used.add(s.id));
    return out;
  };
  const subs = pick(2);
  const cols = pick(9);

  const unread = week.filter((s) => s.importance >= 4 && !state.read.has(s.id) && !used.has(s.id))
    .sort((a, b) => b.score - a.score).slice(0, 6);
  const fresh = week.filter((s) => isNew(s) && !state.read.has(s.id));

  const notice = fresh.length
    ? `<div class="notice"><span>మీ చివరి విజిట్ తర్వాత <b>${plural(fresh.length, "తాజా వార్తలు")}</b> చేరాయి.</span><a href="#/feed?new=1&sort=top&range=7">వాటిని మాత్రమే చూడండి →</a></div>`
    : "";

  const bar = marketOverviewBar(idx.market_pulse);
  const topSummary = renderTopSummaryTable(idx.market_pulse);
  const moneycontrol = renderMoneycontrolTop15();
  const marketStrength = renderMarketStrengthSection();
  const finalStocksTable = renderStocksInNewsFinalTable(week);

  return `${bar}${notice}
  ${topSummary}
  <section class="front reveal">
    <div class="lead-col">${leadStory(lead)}${subs.length ? `<div class="sublead">${subs.map((s, i) => colStory(s, i + 1)).join("")}</div>` : ""}</div>
    ${briefing(idx.brief, ranked)}
  </section>
  <section class="columns reveal">${cols.map(colStory).join("")}</section>
  
  ${moneycontrol}

  <div class="desks reveal">
    <section class="desk" style="--i:1">
      <div class="sect-head"><h2>FII / DII <em>సంగ్రహం</em></h2><a href="#/fii_dii">పూర్తి డాష్బోర్డ్</a></div>
      ${fiiMiniDesk(idx.market_pulse?.fii_dii)}
    </section>
    <section class="desk" style="--i:2">
      <div class="sect-head"><h2>కమోడిటీలు &amp; <em>కరెన్సీ</em></h2><a href="#/commodities">పూర్తి వివరాలు</a></div>
      ${commoditiesMiniDesk(idx.market_pulse?.commodities_forex)}
    </section>
    <section class="desk" style="--i:3">
      <div class="sect-head"><h2>ఆర్థిక <em>క్యాలెండర్</em></h2><a href="#/calendar">పూర్తి షెడ్యూల్</a></div>
      ${calMiniList(idx.market_pulse?.economic_calendar || idx.conferences)}
    </section>
  </div>

  ${marketStrength}

  ${unread.length ? `<div class="sect-head"><h2>ఈ వారం మీరు చదవని <em>ముఖ్యమైన వార్తలు</em></h2><a href="#/feed?range=7&level=4&hideRead=1&sort=top">అన్ని ముఖ్యాంశాలు</a></div>${river(unread)}` : ""}
  ${idx.weekly ? `<div class="sect-head"><h2>వారపు మార్కెట్ <em>సమీక్ష (Weekly Digest)</em></h2><a href="#/briefs?kind=weekly">గత వారాల సమీక్షలు</a></div>${issue(idx.weekly)}` : ""}

  <!-- FINAL MAJOR SECTION: Comprehensive Stocks in News Table -->
  ${finalStocksTable}

  ${disclaimerBox()}
  <div class="status-line"><span>షార్ట్కట్లు: <kbd>j</kbd> <kbd>k</kbd> తరలించు · <kbd>o</kbd> ఓపెన్ · <kbd>m</kbd> రీడ్ · <kbd>s</kbd> సేవ్ · <kbd>/</kbd> శోధించు</span><a href="#/sources">మూలాల స్థితి</a></div>`;
};

function briefRefs(ids, refs) {
  const seen = new Set();
  const links = [];
  for (const id of ids) {
    const story = onPage.get(id);
    const r = story ? { url: story.url, source: story.source_name, title: story.title_te || story.title } : refs?.[id];
    if (!r || seen.has(r.source) || links.length >= 3) continue;
    seen.add(r.source);
    links.push(`<a href="${safeUrl(r.url)}" ${ext} title="${esc(r.title)}" data-open="${esc(id)}">${esc(r.source)}↗</a>`);
  }
  return links.join(" ");
}

function briefing(b, ranked) {
  if (b?.bullets?.length) {
    return `<aside class="briefing" style="--i:1"><h2>డైలీ బ్రీఫింగ్ (The Briefing)</h2><div class="when">${ago(b.generated)} నాటి మార్కెట్ సారాంశం</div>
      ${b.headline ? `<p class="headline">${esc(b.headline)}</p>` : ""}
      <ol class="brief-list">${b.bullets.map((x) => `<li>${esc(x.text)}<span class="refs">${briefRefs(x.ids, b.refs)}</span></li>`).join("")}</ol></aside>`;
  }
  const top = [...ranked].slice(0, 5);
  return `<aside class="briefing" style="--i:1"><h2>నేటి మార్కెట్ ముఖ్యాంశాలు</h2><div class="when">తాజా పరిణామాలు</div>
    <ol class="brief-list">${top.map((s) => `<li><a href="${safeUrl(s.url)}" ${ext} data-open="${esc(s.id)}" style="text-decoration:none">${esc(s.title_te || s.title)}</a></li>`).join("") || "<li>ప్రస్తుతం మార్కెట్ ప్రశాంతంగా ఉంది.</li>"}</ol></aside>`;
}

function fiiMiniDesk(fiiData) {
  if (!fiiData) return '<p class="empty">FII/DII డేటా లోడ్ అవుతోంది…</p>';
  const fNet = fiiData.fii?.net || 0;
  const dNet = fiiData.dii?.net || 0;
  const fCls = fNet >= 0 ? "net-buy" : "net-sell";
  const dCls = dNet >= 0 ? "net-buy" : "net-sell";
  return `<div style="font-size:13.5px;padding-top:4px;">
    <div style="margin-bottom:8px;"><b>తేదీ:</b> ${esc(fiiData.date)}</div>
    <div style="display:flex;justify-content:space-between;margin:6px 0;"><span>FII నికర:</span><b class="${fCls}" style="font-family:var(--mono)">${fNet >= 0 ? "+" : ""}${fNet.toLocaleString()} కోట్లు</b></div>
    <div style="display:flex;justify-content:space-between;margin:6px 0;"><span>DII నికర:</span><b class="${dCls}" style="font-family:var(--mono)">${dNet >= 0 ? "+" : ""}${dNet.toLocaleString()} కోట్లు</b></div>
    <p style="font-size:12.5px;color:var(--ink-2);margin:10px 0 0;line-height:1.45;">${esc((fiiData.market_impact_te || "").slice(0, 160))}…</p>
  </div>`;
}

function commoditiesMiniDesk(items) {
  if (!items?.length) return '<p class="empty">కమోడిటీ రేట్లు అందుబాటులో లేవు.</p>';
  return `<ul class="cal">${items.slice(0, 4).map((c) => {
    const isUp = (c.change || 0) >= 0;
    const sign = isUp ? "+" : "";
    return `<li><div class="d"><small>${esc(c.category)}</small>${isUp ? "▲" : "▼"}</div>
      <div><b>${esc(c.name)}</b>: <span style="font-family:var(--mono)">${c.price ?? "—"} ${esc(c.unit)}</span>
      <span class="sub" style="color:${isUp ? 'var(--sentiment-positive)' : 'var(--sentiment-negative)'}">${sign}${c.change ?? 0} (${sign}${c.pct_change ?? 0}%)</span></div></li>`;
  }).join("")}</ul>`;
}

function calMiniList(events) {
  if (!events?.length) return '<p class="empty">షెడ్యూల్డ్ ఈవెంట్లు లేవు.</p>';
  return `<ul class="cal">${events.slice(0, 4).map((c) => {
    const d = c.date ? parseDay(c.date) : (c.start ? parseDay(c.start) : null);
    return `<li><div class="d"><small>${d ? d.toLocaleDateString("te-IN", { month: "short" }) : "త్వరలో"}</small>${d ? d.getDate() : "—"}</div>
      <div><a href="${safeUrl(c.url)}" ${ext}>${esc(c.event || c.name)}</a><span class="sub">${esc(c.time_ist || c.dates || "")} · ${esc(c.country || "")}</span></div></li>`;
  }).join("")}</ul>`;
}

function issue(b, stampHtml = "") {
  const bullets = (list) => `<ol class="brief-list">${list.map((x) => `<li>${esc(x.text)}<span class="refs">${briefRefs(x.ids, b.refs)}</span></li>`).join("")}</ol>`;
  const content = b.bullets
    ? `${b.headline ? `<p class="headline">${esc(b.headline)}</p>` : ""}${bullets(b.bullets)}`
    : `${b.overview ? `<p class="overview">${esc(b.overview)}</p>` : ""}${(b.sections || []).map((s) => `<h4>${esc(s.title)}</h4>${bullets(s.bullets)}`).join("")}`;
  return stampHtml ? `<article class="issue">${stampHtml}<div>${content}</div></article>` : `<div class="reveal"><div>${content}</div></div>`;
}

// ---------------------------------------------------------------- list & feed views
const RANGES = [["1", "24 గంటలు"], ["3", "3 రోజులు"], ["7", "7 రోజులు"], ["30", "30 రోజులు"], ["60", "60 రోజులు"]];
const LEVELS = [["2", "అన్నీ"], ["3", "ముఖ్యమైనవి"], ["4", "అత్యంత ముఖ్యమైనవి"]];
const SENTIMENTS = [["", "అన్ని ప్రభావాలు"], ["positive", "🟢 సానుకూలం"], ["negative", "🔴 ప్రతికూలం"], ["neutral", "🟡 తటస్థం"], ["mixed", "🟣 మిశ్రమ ప్రభావం"]];

function seg(name, label, options, current) {
  return `<div class="seg" role="group" aria-label="${esc(label)}"><span class="seg-label">${esc(label)}</span>${options.map(([v, text]) =>
    `<button data-param="${name}" data-value="${v}" aria-pressed="${String(v) === String(current)}">${text}</button>`).join("")}</div>`;
}

function matches(s, terms) {
  if (!terms.length) return true;
  const hay = [
    s.title, s.title_te, s.summary, s.summary_te, s.why, s.why_it_matters_te, s.excerpt,
    s.source_name, (s.affected_stocks || []).join(" "), (s.affected_sectors || []).join(" "),
    (s.tags || []).join(" "), s.market_impact_te,
    (s.also || []).map((a) => a.source_name + " " + a.title).join(" ")
  ].join(" ").toLowerCase();
  return terms.every((t) => hay.includes(t));
}

async function genericFeedView(params, opts = {}) {
  const p = { range: opts.range || "7", sort: opts.sort || "latest", level: "2", ...params };
  const q = (p.q || "").trim();
  const range = q ? 60 : Math.min(Number(p.range) || 7, 60);
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const all = await loadRange(range);

  let rows = all.filter((s) => (opts.filter ? opts.filter(s) : true));
  if (p.cat) rows = rows.filter((s) => s.category === p.cat);
  if (p.sent) rows = rows.filter((s) => s.sentiment === p.sent);
  rows = rows.filter((s) => (s.importance || 2) >= Number(p.level || 2));
  if (p.hideRead === "1") rows = rows.filter((s) => !state.read.has(s.id));
  if (p.new === "1") rows = rows.filter(isNew);
  rows = rows.filter((s) => matches(s, terms));
  if (p.sort === "top") rows.sort((a, b) => b.score - a.score);
  remember(rows);

  const limit = Number(p.limit) || state.pageSize;
  const cats = Object.entries(state.index?.categories || {});
  const catRow = opts.hideCategories ? "" : `<div class="cats">
      <button class="cat-btn" data-param="cat" data-value="" aria-pressed="${!p.cat}">అన్ని రంగాలు</button>
      ${cats.map(([k, v]) => `<button class="cat-btn cat-${k}" data-param="cat" data-value="${k}" aria-pressed="${p.cat === k}"><span class="dot"></span>${esc(v)}</button>`).join("")}
    </div>`;

  return `${q ? `<div class="notice"><span>గత 60 రోజులలో <b>“${esc(q)}”</b> కోసం శోధించిన ఫలితాలు</span><a href="#" data-clear-search>ఫిల్టర్ తీసివేయి ✕</a></div>` : ""}
    <div class="filters">${catRow}
      ${q ? "" : seg("range", "సమయం", RANGES, String(range))}
      ${seg("sent", "ప్రభావం", SENTIMENTS, p.sent || "")}
      ${seg("sort", "క్రమం", [["latest", "తాజావి"], ["top", "టాప్ స్కోర్"]], p.sort)}
      ${seg("level", "ప్రాధాన్యత", LEVELS, p.level || "2")}
      <label class="chk"><input type="checkbox" data-param="hideRead" ${p.hideRead === "1" ? "checked" : ""}> చదివినవి దాచు</label>
      ${p.new === "1" ? `<button class="link-btn" data-param="new" data-value="">తాజావి మాత్రమే ✕</button>` : ""}
      <button class="link-btn" data-mark-all>వీటన్నింటిని చదివినట్లు గుర్తించు</button>
      <span class="tally">${plural(rows.length, "వార్తలు")}</span>
    </div>
    ${river(rows, { group: p.sort !== "top", limit }) || `<div class="empty">${opts.empty || "ఈ ఫిల్టర్లకు సరిపోయే వార్తలు లేవు."}</div>`}
    ${rows.length > limit ? `<div class="more"><button class="big-btn" data-param="limit" data-value="${limit + state.pageSize * 2}">మరిన్ని వార్తలు చూడండి · మరో ${rows.length - limit} మిగిలి ఉన్నాయి</button></div>` : ""}`;
}

const head = (title, sub, aside = "") =>
  `<header class="page-head"><h1>${title}</h1><span class="count">${aside}</span>${sub ? `<p>${sub}</p>` : ""}</header>`;

// ---------------------------------------------------------------- specific sections
VIEWS.feed = async (params) =>
  head("అన్ని మార్కెట్ వార్తలు", "భారతీయ మరియు ప్రపంచ స్టాక్ మార్కెట్లకు సంబంధించిన అన్ని వార్తలు, సారాంశాలు మరియు ప్రభావ విశ్లేషణ.") +
  await genericFeedView(params);

VIEWS.indian_markets = async (params) =>
  head("భారతీయ మార్కెట్ వార్తలు", "NIFTY 50, BANKNIFTY, SENSEX, రంగాల వారీ ర్యాలీలు, పతనాలు మరియు దేశీయ మార్కెట్ పరిణామాలు.") +
  await genericFeedView(params, { filter: (s) => s.category === "indian_markets", hideCategories: true });

VIEWS.stocks_in_news = async (params) => {
  const week = await loadRange(Number(params.range) || 7);
  const feedHtml = await genericFeedView(params, { filter: (s) => s.category === "stocks_in_news" || (s.affected_stocks?.length > 0), hideCategories: true });
  return head("Stocks in News", "కీలక వార్తలు కలిగిన కంపెనీలు, షేర్ల కదలికలు, కార్పొరేట్ ప్రకటనలు మరియు స్వల్పకాలిక/దీర్ఘకాలిక ప్రభావం.") +
    feedHtml +
    renderStocksInNewsFinalTable(week);
};

VIEWS.global_markets = async (params) =>
  head("ప్రపంచ Stock Market వార్తలు", "అమెరికా, యూరప్, ఆసియా మార్కెట్లు, యూఎస్ ఫెడరల్ రిజర్వ్ నిర్ణయాలు, బాండ్ ఈల్డ్స్ మరియు భారత మార్కెట్పై వాటి ప్రభావం.") +
  await genericFeedView(params, { filter: (s) => s.category === "global_markets", hideCategories: true });

VIEWS.earnings = async (params) =>
  head("ఫలితాలు &amp; కార్పొరేట్ చర్యలు (Earnings & Corporate Actions)", "త్రైమాసిక ఫలితాలు (Q1/Q2/Q3/Q4), డివిడెండ్లు, బోనస్ షేర్లు, బైబ్యాక్లు, మెర్జర్లు మరియు పెద్ద ఆర్డర్ విన్స్.") +
  await genericFeedView(params, { filter: (s) => s.category === "earnings", hideCategories: true });

VIEWS.ipo = async (params) =>
  head("IPO వార్తలు (Initial Public Offerings)", "కొత్త IPO ప్రకటనలు, ప్రైస్ బ్యాండ్లు, సబ్స్క్రిప్షన్ స్టేటస్ మరియు స్టాక్ ఎక్స్ఛేంజ్లలో లిస్టింగ్ వివరాలు.") +
  await genericFeedView(params, { filter: (s) => s.category === "ipo", hideCategories: true });

// ---------------------------------------------------------------- FII / DII Dashboard
VIEWS.fii_dii = async () => {
  const pulse = state.index?.market_pulse || {};
  const fiiData = pulse.fii_dii || {};
  const fNet = fiiData.fii?.net || -6121;
  const dNet = fiiData.dii?.net || 30313;
  const fBuy = fiiData.fii?.buy || 24173;
  const fSell = fiiData.fii?.sell || 30294;

  return head("FII / DII & Index Futures Positioning", "విదేశీ (FII) మరియు దేశీయ (DII) సంస్థాగత పెట్టుబడిదారుల నగదు ప్రవాహాలు, డెరివేటివ్స్ పొజిషనింగ్ మరియు ట్రెండ్ విశ్లేషణ.") +
  `
  <div class="fii-stat-grid reveal">
    <div class="fii-stat-card">
      <div class="label">FII Net Index-Futures Positions</div>
      <div class="val" style="color:var(--sentiment-negative);">-2,98,285 <small style="font-size:14px;">contracts</small></div>
      <div class="sub"><span class="priority-tag pri-high">Strong bearish positioning</span></div>
      <div class="sub" style="margin-top:6px;">చివరిగా అందుబాటులో ఉన్న డేటా. Includes all index futures, not Nifty 50 alone.</div>
    </div>
    <div class="fii-stat-card">
      <div class="label">FII Long-Short Ratio</div>
      <div class="val" style="color:var(--sentiment-negative);">0.10</div>
      <div class="sub">సుమారు <b>91% షార్ట్ పొజిషన్లు</b> ఉన్నాయి</div>
    </div>
    <div class="fii-stat-card">
      <div class="label">Fresh Net Shorts Added</div>
      <div class="val" style="color:var(--sentiment-negative);">4,560</div>
      <div class="sub">మునుపటి సెషన్‌తో పోల్చితే అదనపు షార్ట్ కాంట్రాక్టులు</div>
    </div>
  </div>

  <!-- FII Net-Short Trend Chart (SVG) -->
  <div class="fii-chart-box reveal">
    <h4>FII Net-Short Trend — ఇటీవల 6 సెషన్ల నికర ఇండెక్స్ ఫ్యూచర్స్ స్థానం</h4>
    <p style="font-size:12px;color:var(--ink-2);margin:0 0 12px;">రుణాత్మక కాంట్రాక్టులు నెట్ షార్ట్ పొజిషనింగ్‌ను సూచిస్తాయి. మూలం: NSE డెరైవ్డ్ పార్టిసిపెంట్ డేటా.</p>
    <div style="width:100%;overflow-x:auto;">
      <svg viewBox="0 0 700 220" style="width:100%;max-width:700px;height:auto;background:var(--paper-1);border-radius:4px;border:1px solid var(--rule)">
        <!-- Grid lines -->
        <line x1="60" y1="30" x2="680" y2="30" stroke="var(--rule)" stroke-dasharray="3,3"/>
        <text x="15" y="35" font-size="10" font-family="monospace" fill="var(--ink-3)">-255,000</text>
        <line x1="60" y1="75" x2="680" y2="75" stroke="var(--rule)" stroke-dasharray="3,3"/>
        <text x="15" y="80" font-size="10" font-family="monospace" fill="var(--ink-3)">-270,000</text>
        <line x1="60" y1="120" x2="680" y2="120" stroke="var(--rule)" stroke-dasharray="3,3"/>
        <text x="15" y="125" font-size="10" font-family="monospace" fill="var(--ink-3)">-285,000</text>
        <line x1="60" y1="165" x2="680" y2="165" stroke="var(--rule)" stroke-dasharray="3,3"/>
        <text x="15" y="170" font-size="10" font-family="monospace" fill="var(--ink-3)">-300,000</text>
        <line x1="60" y1="200" x2="680" y2="200" stroke="var(--rule)" stroke-dasharray="3,3"/>
        <text x="15" y="205" font-size="10" font-family="monospace" fill="var(--ink-3)">-315,000</text>

        <!-- Trend Line: 29 Sep (-268k), 30 Sep (-282k), 1 Oct (-310k), 5 Oct (-302k), 6 Oct (-293k), 7 Oct (-298k) -->
        <polyline points="100,70  210,112  320,187  430,170  540,149  650,161" fill="none" stroke="#2563eb" stroke-width="2.5"/>
        <circle cx="100" cy="70" r="4" fill="#2563eb"/>
        <circle cx="210" cy="112" r="4" fill="#2563eb"/>
        <circle cx="320" cy="187" r="4" fill="#2563eb"/>
        <circle cx="430" cy="170" r="4" fill="#2563eb"/>
        <circle cx="540" cy="149" r="4" fill="#2563eb"/>
        <circle cx="650" cy="161" r="4" fill="#2563eb"/>

        <!-- Date labels -->
        <text x="80" y="215" font-size="11" font-family="monospace" fill="var(--ink-2)">29 Sep</text>
        <text x="190" y="215" font-size="11" font-family="monospace" fill="var(--ink-2)">30 Sep</text>
        <text x="305" y="215" font-size="11" font-family="monospace" fill="var(--ink-2)">1 Oct</text>
        <text x="415" y="215" font-size="11" font-family="monospace" fill="var(--ink-2)">5 Oct</text>
        <text x="525" y="215" font-size="11" font-family="monospace" fill="var(--ink-2)">6 Oct</text>
        <text x="635" y="215" font-size="11" font-family="monospace" fill="var(--ink-2)">7 Oct</text>
      </svg>
    </div>
  </div>

  <!-- Participant-wise Index Futures Table -->
  <div class="news-table-wrap reveal" style="margin: 24px 0;">
    <h3 style="font-size:16px;margin-bottom:8px;">Who is positioned where? (మార్కెట్ పార్టిసిపెంట్ల డెరివేటివ్స్ పొజిషన్లు)</h3>
    <table class="news-table">
      <thead>
        <tr>
          <th>Participant</th>
          <th>Net index futures</th>
          <th>Position</th>
          <th>మునుపటి సెషన్</th>
          <th>మార్పు</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>FII (విదేశీ సంస్థాగత ఇన్వెస్టర్లు)</b></td>
          <td style="color:var(--sentiment-negative);font-family:var(--mono);font-weight:700;">-2,98,285</td>
          <td><span class="sentiment-badge badge-neg">🔴 Net short</span></td>
          <td style="font-family:var(--mono);">-2,93,725</td>
          <td style="color:var(--sentiment-negative);font-family:var(--mono);">-4,560</td>
        </tr>
        <tr>
          <td><b>DII (దేశీయ సంస్థాగత ఇన్వెస్టర్లు)</b></td>
          <td style="color:var(--sentiment-positive);font-family:var(--mono);font-weight:700;">+33,919</td>
          <td><span class="sentiment-badge badge-pos">🟢 Net long</span></td>
          <td style="font-family:var(--mono);">+31,850</td>
          <td style="color:var(--sentiment-positive);font-family:var(--mono);">+2,069</td>
        </tr>
        <tr>
          <td><b>Proprietary traders (బ్రోకర్ ప్రొప్రైటరీ)</b></td>
          <td style="color:var(--sentiment-positive);font-family:var(--mono);font-weight:700;">+18,966</td>
          <td><span class="sentiment-badge badge-pos">🟢 Net long</span></td>
          <td style="font-family:var(--mono);">+16,420</td>
          <td style="color:var(--sentiment-positive);font-family:var(--mono);">+2,546</td>
        </tr>
        <tr>
          <td><b>Clients (వ్యక్తిగత / రీటైల్ ట్రేడర్లు)</b></td>
          <td style="color:var(--sentiment-positive);font-family:var(--mono);font-weight:700;">+2,45,400</td>
          <td><span class="sentiment-badge badge-pos">🟢 Net long</span></td>
          <td style="font-family:var(--mono);">+2,45,455</td>
          <td style="color:var(--sentiment-negative);font-family:var(--mono);">-55</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Cash Market Table -->
  <div class="news-table-wrap reveal" style="margin: 24px 0;">
    <h3 style="font-size:16px;margin-bottom:8px;">Cash Market Activity (నగదు విభాగంలో కొనుగోళ్లు & అమ్మకాలు)</h3>
    <table class="news-table">
      <thead>
        <tr>
          <th>తేదీ</th>
          <th>FII కొనుగోళ్లు (₹ కోట్లు)</th>
          <th>FII అమ్మకాలు (₹ కోట్లు)</th>
          <th>FII నికర ప్రవాహం</th>
          <th>DII నికర ప్రవాహం</th>
          <th>మూలం</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>${esc(fiiData.date || "తాజా సెషన్")}</b></td>
          <td style="font-family:var(--mono);">${fBuy.toLocaleString()}</td>
          <td style="font-family:var(--mono);">${fSell.toLocaleString()}</td>
          <td style="color:${fNet >= 0 ? 'var(--sentiment-positive)' : 'var(--sentiment-negative)'};font-family:var(--mono);font-weight:700;">${fNet >= 0 ? '+' : ''}${fNet.toLocaleString()} కోట్లు</td>
          <td style="color:${dNet >= 0 ? 'var(--sentiment-positive)' : 'var(--sentiment-negative)'};font-family:var(--mono);font-weight:700;">${dNet >= 0 ? '+' : ''}${dNet.toLocaleString()} కోట్లు</td>
          <td><small>NSE / BSE Official</small></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- What does this mean for Nifty? -->
  <div class="strength-box reveal" style="margin: 24px 0;">
    <h3 style="margin:0 0 10px;font-size:16px;">What does this mean for Nifty? (నిఫ్టీకి దీని అర్థం ఏమిటి?)</h3>
    <div style="font-size:13.5px;color:var(--ink-2);line-height:1.6;">
      <p><b>బేరిష్ సంకేతాలు (Bearish signals):</b></p>
      <ul style="margin:6px 0 12px 20px;">
        <li>FIIలు భారీగా నెట్ షార్ట్ పొజిషన్లతో కొనసాగుతున్నారు.</li>
        <li>FIIలు నగదు విభాగంలో సుమారు ₹6,121 కోట్లకు పైగా విలువైన ఈక్విటీలను విక్రయించారు.</li>
        <li>RBI పాలసీ జాగ్రత్తలు మరియు పెరిగిన చమురు ధరలు స్థూల ఒత్తిడిని తెస్తున్నాయి.</li>
      </ul>
      <p style="background:var(--paper-1);padding:10px 14px;border-left:3px solid var(--signal);border-radius:3px;">
        <b>ముఖ్యం:</b> FIIల వద్ద విపరీతమైన షార్ట్ పొజిషన్లు ఉన్నప్పుడు మార్కెట్ పెరగడం ప్రారంభిస్తే తీవ్రమైన <b>షార్ట్ కవరింగ్ ర్యాలీ (Short Covering Rally)</b> వచ్చే అవకాశం కూడా ఉంది. కాబట్టి భారీ షార్టులు మార్కెట్ ఖచ్చితంగా పడుతుందని హామీ ఇవ్వవు.
      </p>
      <p style="margin-top:10px;">
        <b>నేటి ఇంట్రాడే ట్రేడింగ్ పరిశీలన:</b> నిన్నటి కనిష్ట స్థాయి <b>22,546</b> ను తక్షణ దిగువ మద్దతుగా, ఎగువన <b>22,700–22,800</b> ప్రాంతాన్ని కాల్ రైటింగ్ నిరోధంగా పర్యవేక్షించాలి.
      </p>
      <p style="margin-top:8px;">
        <b>తీర్పు (Verdict):</b> <span class="sentiment-badge badge-neg">🔴 FII స్థానం తీవ్ర బేరిష్‌గా ఉంది</span>. అయితే మొదటి 15 నిమిషాల శ్రేణి మరియు VWAP నిర్ధారణ తర్వాత మాత్రమే కొత్త నిఫ్టీ షార్ట్ ట్రేడ్స్ పరిగణించాలి.
      </p>
    </div>
  </div>`;
};

// ---------------------------------------------------------------- Commodities & Forex
VIEWS.commodities = async () => {
  const pulse = state.index?.market_pulse || {};
  const list = pulse.commodities_forex || [];

  const cards = list.map((c) => {
    const isUp = (c.change || 0) >= 0;
    const sign = isUp ? "+" : "";
    const color = isUp ? "var(--sentiment-positive)" : "var(--sentiment-negative)";
    return `<div class="com-card">
      <div class="com-head">
        <h3 class="com-title">${esc(c.name)}</h3>
        <span class="com-cat">${esc(c.category)}</span>
      </div>
      <div class="com-price">${c.price ? Number(c.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"} <small style="font-size:13px;color:var(--ink-3)">${esc(c.unit)}</small></div>
      <div style="font:600 13px var(--mono);color:${color};margin-bottom:12px;">${sign}${c.change ?? 0} (${sign}${c.pct_change ?? 0}%)</div>
      <div class="com-impact">
        <b>భారత మార్కెట్పై సాధ్యమైన ప్రభావం:</b>
        ${esc(c.impact_te)}
      </div>
    </div>`;
  }).join("");

  const week = await loadRange(14);
  const relatedStories = week.filter((s) => s.category === "commodities_forex" || matches(s, ["crude", "oil", "gold", "silver", "dollar", "rupee", "yield", "bond"]));

  return head("Crude Oil, Gold, Currency &amp; Bonds", "ముడి చమురు, బంగారం, వెండి, రూపాయి, డాలర్ ఇండెక్స్ మరియు బాండ్ ఈల్డ్స్ ప్రత్యక్ష ధరలు మరియు భారతీయ స్టాక్ మార్కెట్పై వాటి ప్రభావ విశ్లేషణ.") +
    `<div class="com-grid reveal">${cards || '<p class="empty">కమోడిటీ డేటా లోడ్ అవుతోంది…</p>'}</div>
    <div class="sect-head" style="margin-top:30px"><h2>కమోడిటీలు &amp; కరెన్సీకి సంబంధించిన <em>తాజా వార్తలు</em></h2></div>
    ${river(relatedStories, { limit: 15 }) || '<p class="empty">ప్రస్తుతం సంబంధిత వార్తలు లేవు.</p>'}`;
};

// ---------------------------------------------------------------- Economic Calendar
VIEWS.calendar = async () => {
  const pulse = state.index?.market_pulse || {};
  const events = pulse.economic_calendar || state.index?.conferences || [];

  const cards = events.map((ev) => {
    return `<div class="cal-card">
      <div class="cal-date-row">
        <span>${esc(ev.time_ist || ev.dates || "సమయం ఖరారు కావాలి")}</span>
        <span class="badge-priority pri-high">${esc(ev.importance || "ముఖ్యమైనది")}</span>
      </div>
      <h3>${esc(ev.event || ev.name)}</h3>
      <div style="font:500 12px var(--sans);color:var(--ink-2);margin-bottom:8px;"><b>దేశం / మూలం:</b> ${esc(ev.country || "")} · ${esc(ev.source || ev.location || "")}</div>
      <div class="note"><b>మార్కెట్పై ప్రభావం:</b> ${esc(ev.impact_te || ev.note || "మార్కెట్ ఒడిదుడుకులకు దారితీసే అవకాశం ఉంది.")}</div>
    </div>`;
  }).join("");

  const week = await loadRange(14);
  const ecoStories = week.filter((s) => s.category === "economy" || matches(s, ["rbi", "inflation", "cpi", "gdp", "fed", "policy"]));

  return head("ఆర్థిక క్యాలెండర్ (Economic Calendar)", "భారతీయ మరియు ప్రపంచ స్టాక్ మార్కెట్లను ప్రభావితం చేసే కీలక ఆర్థిక సంఘటనలు (సమయాలు IST లో).") +
    `<div class="cal-grid reveal">${cards || '<p class="empty">క్యాలెండర్ డేటా అందుబాటులో లేదు.</p>'}</div>
    <div class="sect-head" style="margin-top:30px"><h2>ఆర్థిక విధానాలు &amp; స్థూల డేటా <em>వార్తలు</em></h2></div>
    ${river(ecoStories, { limit: 15 }) || '<p class="empty">ప్రస్తుతం వార్తలు లేవు.</p>'}`;
};


// ---------------------------------------------------------------- ADR, Currency, Crude
function buildCommoditiesTable(categoryFilter, title, desc, columns) {
  return async (params) => {
    const pulse = state.index?.market_pulse || {};
    const list = pulse.commodities_forex || [];
    const filtered = list.filter(c => categoryFilter(c.category));

    const rows = filtered.map(c => {
      const isUp = (c.change || 0) >= 0;
      const sign = isUp ? "+" : "";
      const color = isUp ? "var(--sentiment-positive)" : "var(--sentiment-negative)";
      return `<tr>
        <td><b>${esc(c.name)}</b></td>
        <td>${c.price ? Number(c.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"} <small>${esc(c.unit)}</small></td>
        <td style="color:${color};font-weight:bold;">${sign}${c.change ?? 0}</td>
        <td style="color:${color};font-weight:bold;">${sign}${c.pct_change ?? 0}%</td>
        <td>${esc(c.impact_te || "")}</td>
      </tr>`;
    }).join("");

    return head(title, desc) +
      `<div class="news-table-wrap reveal">
        <table class="news-table">
          <thead>
            <tr>
              <th>పేరు</th>
              <th>ధర (Price)</th>
              <th>మార్పు (Change)</th>
              <th>% మార్పు</th>
              <th>భారత మార్కెట్పై ప్రభావం</th>
            </tr>
          </thead>
          <tbody>${rows || '<tr><td colspan="5" style="text-align:center;">డేటా అందుబాటులో లేదు.</td></tr>'}</tbody>
        </table>
      </div>`;
  };
}






// ---------------------------------------------------------------- News Table View (వార్తల పట్టిక)
VIEWS.table = async (params) => {
  const p = { range: "7", sort: "latest", ...params };
  const all = await loadRange(Number(p.range) || 7);
  const q = (p.q || "").trim();
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);

  let rows = all.filter((s) => matches(s, terms));
  if (p.cat) rows = rows.filter((s) => s.category === p.cat);
  if (p.sent) rows = rows.filter((s) => s.sentiment === p.sent);
  if (p.level) rows = rows.filter((s) => (s.importance || 2) >= Number(p.level));
  remember(rows);

  const tableRows = rows.slice(0, 60).map((s) => {
    const stockPills = (s.affected_stocks || []).map((stk) => `<span class="stock-pill">${esc(stk)}</span>`).join(" ");
    const secPills = (s.affected_sectors || []).map((sec) => `<span class="sector-pill">${esc(sec)}</span>`).join(" ");
    const entity = stockPills || secPills || `<span style="color:var(--ink-3)">${esc(catName(s.category))}</span>`;

    return `<tr>
      <td class="col-pri">${priorityBadge(s)}</td>
      <td class="col-stock">${entity}</td>
      <td class="col-title"><a href="${safeUrl(s.url)}" ${ext} data-open="${esc(s.id)}">${esc(s.title_te || s.title)}</a></td>
      <td class="col-impact">${sentimentBadge(s)}</td>
      <td class="col-reason">${esc(s.market_impact_te || s.why_it_matters_te || s.why || "మార్కెట్ సెంటిమెంట్పై ప్రభావం.")}</td>
      <td class="col-time">${ago(s.published)}</td>
      <td class="col-source">${esc(s.source_name)}</td>
    </tr>`;
  }).join("");

  return head("మార్కెట్ వార్తల పట్టిక", "ప్రాధాన్యత, కంపెనీ/రంగం, ప్రభావం మరియు కారణంతో కూడిన పూర్తి వివరాల పట్టిక.") +
    `<div class="filters">
      ${seg("sent", "ప్రభావం", SENTIMENTS, p.sent || "")}
      ${seg("range", "సమయం", RANGES, p.range || "7")}
      ${seg("level", "ప్రాధాన్యత", LEVELS, p.level || "2")}
      <span class="tally">${plural(rows.length, "వార్తలు")}</span>
    </div>
    <div class="news-table-wrap reveal">
      <table class="news-table">
        <thead>
          <tr>
            <th>ప్రాధాన్యత</th>
            <th>కంపెనీ / రంగం</th>
            <th>వార్త శీర్షిక</th>
            <th>ప్రభావం</th>
            <th>ప్రభావానికి కారణం</th>
            <th>సమయం</th>
            <th>మూలం</th>
          </tr>
        </thead>
        <tbody>${tableRows || '<tr><td colspan="7" style="text-align:center;padding:30px;">ఫిల్టర్లకు సరిపోయే వార్తలు లేవు.</td></tr>'}</tbody>
      </table>
    </div>`;
};

// ---------------------------------------------------------------- Guide & Glossary
let guideData = null;
VIEWS.guide = async () => {
  guideData = guideData || await getJSON("data/guide.json").catch(() => getJSON("data/catchup.json").catch(() => null));
  const c = guideData;
  if (!c) return '<div class="empty">మార్కెట్ గైడ్ అందుబాటులో లేదు.</div>';

  const chapters = (c.sections || []).map((s, n) => `<section class="chapter" id="guide-${esc(s.id)}">
      <div class="chapter-head"><div class="no">${String(n + 1).padStart(2, "0")}</div><div><h2>${esc(s.title)}</h2>${s.intro ? `<p>${esc(s.intro)}</p>` : ""}</div></div>
      <ol class="entries">${(s.items || []).map((it) => {
        return `<li class="entry">
          <div class="when">${esc(it.title)}</div>
          <div><p class="what">${esc(it.what)}</p>${it.why_it_matters ? `<p class="why"><b>ఎందుకు ముఖ్యం:</b> ${esc(it.why_it_matters)}</p>` : ""}</div>
        </li>`;
      }).join("")}</ol></section>`).join("");

  const glossary = c.glossary?.length ? `<section class="chapter" id="guide-glossary">
      <div class="chapter-head"><div class="no">అ-ఱ</div><div><h2>స్టాక్ మార్కెట్ సాంకేతిక పదకోశం (Glossary)</h2><p>మార్కెట్ విశ్లేషణలలో కనిపించే కీలక పదాల సరళమైన వివరణ.</p></div></div>
      <div class="glossary">${c.glossary.map((g) => `<div><b>${esc(g.term)}</b><span>${esc(g.definition)}</span></div>`).join("")}</div></section>` : "";

  return head("స్టాక్ మార్కెట్ గైడ్ &amp; సాంకేతిక పదకోశం", "భారతీయ స్టాక్ మార్కెట్ నిబంధనలు, సాంకేతిక సూత్రాలు మరియు పదజాలంపై సమగ్ర మార్గదర్శి.") +
    `<section class="catch-hero reveal">
      <div><div class="sect-head" style="margin-top:0"><h2>ప్రధాన <em>సూత్రాలు</em></h2></div><ol>${(c.tldr || []).map((t) => `<li>${esc(t)}</li>`).join("")}</ol></div>
    </section>${chapters}${glossary}`;
};
VIEWS.catchup = VIEWS.guide;

// ---------------------------------------------------------------- Briefs Archive
let briefsData = null;
VIEWS.briefs = async (params) => {
  briefsData = briefsData || await getJSON("data/briefs.json").catch(() => ({ daily: [], weekly: [] }));
  const kind = params.kind === "weekly" ? "weekly" : "daily";
  const list = briefsData[kind] || [];
  const stamp = (b) => {
    const d = new Date(b.generated);
    return `<div class="stamp"><b>${d.toLocaleDateString("te-IN", { month: "short", day: "numeric" })}</b>${d.toLocaleDateString("te-IN", { weekday: "long" })}<br>${clock(b.generated)}</div>`;
  };
  return head("మార్కెట్ సమీక్షల ఆర్కైవ్", "రోజువారీ డైలీ బ్రీఫింగ్లు మరియు వారపు సమగ్ర మార్కెట్ సమీక్షలు.", plural(list.length, kind === "weekly" ? "వారపు నివేదికలు" : "డైలీ బ్రీఫింగ్లు")) +
    `<div class="filters">${seg("kind", "రకం", [["daily", "రోజువారీ బ్రీఫింగ్"], ["weekly", "వారపు సమీక్ష"]], kind)}</div>` +
    (list.length ? `<div class="reveal">${list.map((b) => issue(b, stamp(b))).join("")}</div>` : '<div class="empty">సమీక్షలు త్వరలో అప్డేట్ అవుతాయి.</div>');
};

// ---------------------------------------------------------------- Saved Stories
VIEWS.saved = async () => {
  const rows = [...state.saved.values()].sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
  remember(rows);
  return head("సేవ్ చేసిన వార్తలు", "మీరు తర్వాత చదవడానికి సేవ్ చేసుకున్న వార్తలు (ఈ డివైజ్లోనే భద్రపరచబడతాయి).", plural(rows.length, "వార్తలు")) +
    (river(rows) || '<div class="empty">ఇంకా ఏ వార్తనూ సేవ్ చేయలేదు. ఏదైనా వార్తపై ☆ బటన్ను నొక్కండి.</div>');
};

// ---------------------------------------------------------------- Sources
VIEWS.sources = async () => {
  const src = [...(state.index?.sources || [])].sort((a, b) => a.category.localeCompare(b.category) || b.weight - a.weight || a.name.localeCompare(b.name));
  const run = state.index?.run || {};
  const ok = src.filter((s) => s.ok).length;
  return head("వార్తా మూలాలు (Sources)", `ఈ వెబ్సైట్ వార్తలు సేకరించే అధికారిక మరియు విశ్వసనీయ మార్కెట్ మూలాలు. చివరిసారి సేకరించిన సమయం: ${ago(run.at)}.`, `${ok}/${src.length} యాక్టివ్గా ఉన్నాయి`) +
    `<div class="ledger-wrap reveal"><table class="ledger"><thead><tr><th>మూలం పేరు</th><th>విభాగం</th><th class="n">ప్రాధాన్యత</th><th>స్థితి</th><th class="n">తాజా వార్త</th><th class="n">30 రోజులు</th></tr></thead><tbody>${
      src.map((s, i) => `<tr style="--i:${Math.min(i, 14)}"><td><a href="${safeUrl(s.homepage)}" ${ext}>${esc(s.name)}</a></td><td class="mono">${esc(catName(s.category))}</td><td class="n">${"●".repeat(s.weight)}<span style="opacity:.25">${"●".repeat(5 - s.weight)}</span></td>
        <td class="mono ${s.ok ? "ok" : "fail"}" title="${esc(s.error)}">${s.ok ? "● పనిచేస్తోంది" : "● లోపం — " + esc((s.error || "").slice(0, 36))}</td><td class="n">${s.newest ? ago(s.newest) : "—"}</td><td class="n">${s.items_30d}</td></tr>`).join("")
    }</tbody></table></div>`;
};

// ---------------------------------------------------------------- Palettes
VIEWS.palettes = async () => {
  const week = await loadRange(3).catch(() => []);
  const s = [...week].sort((a, b) => b.score - a.score)[0] || {
    title: "NIFTY 50 రికార్డు స్థాయిలకు ర్యాలీ", source_name: "Economic Times",
    summary: "భారతీయ స్టాక్ మార్కెట్లో ఇన్వెస్టర్ల కొనుగోళ్ల జోరుతో NIFTY సరికొత్త గరిష్టాలకు చేరింది.", category: "indian_markets", importance: 5,
  };
  const current = root.dataset.palette;
  const sample = (p, theme) => `<div class="pal-sample" data-palette="${p.id}" data-theme="${theme}">
      <div class="ps-ticker"><span>తాజాది</span><em>${esc(s.title_te || s.title)}</em></div>
      <div class="ps-body">
        <div class="ps-mark">మార్కెట్ పల్స్</div>
        <div class="kicker"><span class="flag">ముఖ్యాంశం</span><span class="cat cat-${esc(s.category)}">${esc(catName(s.category))}</span><span class="src">${esc(s.source_name)}</span></div>
        <h3 class="hl"><a href="#/palettes" tabindex="-1">${esc(s.title_te || s.title)}</a></h3>
        <p class="dek">${esc((s.summary_te || s.summary || "").slice(0, 150))}</p>
      </div></div>`;
  return head("రంగుల థీమ్లు (Colour Palettes)", "మీకు నచ్చిన రంగుల థీమ్ను ఎంచుకోండి. ఇది ఈ డివైజ్లో భద్రపరచబడుతుంది.") +
    `<div class="pal-grid reveal">${PALETTES.map((p, i) => `<section class="pal-card ${p.id === current ? "current" : ""}" style="--i:${i}">
        <div class="pal-pair">${sample(p, "light")}${sample(p, "dark")}</div>
        <div class="pal-meta"><div><h2>${esc(p.name)}</h2><p>${esc(p.desc)}</p></div>
          ${p.id === current ? '<span class="pal-current">ప్రస్తుతం ఉంది</span>' : `<button class="big-btn" data-choose-palette="${p.id}">${esc(p.name)} వాడండి</button>`}</div>
      </section>`).join("")}</div>`;
};

// ---------------------------------------------------------------- ticker crawl
async function fillTicker() {
  const pulse = state.index?.market_pulse;
  let items = [];
  if (pulse?.indices?.length) {
    items = pulse.indices.map((idx) => {
      const isUp = (idx.change || 0) >= 0;
      const sign = isUp ? "+" : "";
      return `<a href="#/indian_markets"><b>${esc(idx.name)}:</b> ${idx.price ?? "—"} (${sign}${idx.pct_change ?? 0}%)</a><span class="sep">◆</span>`;
    });
  }
  const stories = (await loadRange(2)).filter((s) => s.importance >= 3).slice(0, 15);
  const storyItems = stories.map((s) => `<a href="${safeUrl(s.url)}" ${ext} data-open="${esc(s.id)}"><b>${esc(s.source_name)}</b> ${esc(s.title_te || s.title)}</a><span class="sep">◆</span>`);

  const track = $("#ticker");
  if (!items.length && !storyItems.length) { track.innerHTML = '<a>మార్కెట్ వార్తలు లోడ్ అవుతున్నాయి…</a>'; return; }
  const combined = [...items, ...storyItems].join("");
  track.innerHTML = combined + combined.replace(/<a /g, '<a tabindex="-1" aria-hidden="true" ');
  track.style.setProperty("--crawl", Math.max(50, (items.length + stories.length) * 8) + "s");
}

// ---------------------------------------------------------------- interactions
function cardFor(id) { return document.querySelector(`.story[data-id="${CSS.escape(id)}"]`); }

function setRead(id, card, value) {
  if (value) state.read.add(id); else state.read.delete(id);
  persistRead();
  if (card) {
    card.classList.toggle("read", value);
    const btn = card.querySelector('[data-act="read"]');
    if (btn) btn.textContent = value ? "చదవనిదిగా మార్చు" : "చదివినట్లు గుర్తించు";
    if (value) card.querySelector(".fresh")?.remove();
  }
}

function toggleSave(id, card) {
  const story = onPage.get(id) || state.saved.get(id);
  if (!story) return;
  const on = !state.saved.has(id);
  if (on) state.saved.set(id, { ...story, savedAt: Date.now() });
  else state.saved.delete(id);
  persistSaved();
  const btn = card?.querySelector('[data-act="save"]');
  if (btn) { btn.classList.toggle("on", on); btn.textContent = on ? "★ సేవ్ చేయబడింది" : "☆ సేవ్ చేయి"; btn.setAttribute("aria-pressed", on); }
  toast(on ? "వార్త సేవ్ చేయబడింది" : "సేవ్ నుండి తీసివేయబడింది");
}

function updateSavedCount() {
  const count = state.saved.size;
  const el = $("#saved-count");
  if (el) el.textContent = count > 0 ? ` (${count})` : "";
}

document.addEventListener("click", (e) => {
  const t = e.target;
  const open = t.closest("[data-open]");
  if (open) {
    setRead(open.dataset.open, cardFor(open.dataset.open), true);
    return;
  }

  const act = t.closest("[data-act]");
  if (act) {
    const card = act.closest(".story");
    if (!card) return;
    const id = card.dataset.id;
    if (act.dataset.act === "save") toggleSave(id, card);
    if (act.dataset.act === "read") setRead(id, card, !state.read.has(id));
    return;
  }
  const tag = t.closest("[data-tag]");
  if (tag) { $("#search").value = tag.dataset.tag; search(tag.dataset.tag); return; }

  const param = t.closest("button[data-param]");
  if (param) {
    const { params } = parseHash();
    params[param.dataset.param] = param.dataset.value;
    if (param.dataset.param !== "limit") delete params.limit;
    setParams(params);
    return;
  }
  if (t.closest("[data-mark-all]")) {
    $$(".story").forEach((card) => setRead(card.dataset.id, card, true));
    toast("అన్నింటినీ చదివినట్లు గుర్తించాము");
    return;
  }
  if (t.closest("[data-clear-search]")) {
    e.preventDefault();
    $("#search").value = "";
    const { params } = parseHash();
    delete params.q;
    setParams(params);
    return;
  }
  if (t.closest("[data-choose-palette]")) {
    choosePalette(t.closest("[data-choose-palette]").dataset.choosePalette);
    return;
  }
});

document.addEventListener("change", (e) => {
  const box = e.target.closest('input[type="checkbox"][data-param]');
  if (!box) return;
  const { params } = parseHash();
  params[box.dataset.param] = box.checked ? "1" : "";
  setParams(params);
});

const SEARCHABLE = ["feed", "today", "indian_markets", "stocks_in_news", "global_markets", "earnings", "ipo", "table"];
function search(q) {
  const { route, params } = parseHash();
  if (!SEARCHABLE.includes(route)) {
    location.hash = "#/feed" + (q.trim() ? "?" + new URLSearchParams({ q: q.trim() }) : "");
    return;
  }
  const next = { ...params, q: q.trim() };
  delete next.limit;
  setParams(next);
}

let searchTimer;
$("#search").addEventListener("input", (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => search(e.target.value), 260);
});
$("#search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  search($("#search").value.trim());
});

// ---------------------------------------------------------------- palettes
const PALETTES = [
  { id: "broadsheet", name: "Broadsheet", desc: "సాంప్రదాయ వార్తాపత్రిక, వార్మ్ న్యూస్ప్రింట్" },
  { id: "salmon", name: "Salmon", desc: "ఫైనాన్షియల్ టైమ్స్ పింక్ పేపర్ & క్లారెట్ ఇంక్" },
  { id: "riso", name: "Riso", desc: "ఫెడరల్ బ్లూ & పింక్ కలయిక" },
  { id: "cobalt", name: "Cobalt", desc: "స్విస్ వైట్ & కోబాల్ట్ బ్లూ" },
  { id: "phosphor", name: "Phosphor", desc: "టెర్మినల్ గ్రీన్ & డార్క్ థీమ్" },
  { id: "nocturne", name: "Nocturne", desc: "మిడ్నైట్ నేవీ & అంబర్ కాంతి" },
];
const root = document.documentElement;
const paletteName = (id) => (PALETTES.find((p) => p.id === id) || PALETTES[0]).name;

function storeLook(key, value) {
  try { localStorage.setItem("pulse." + key, value); } catch (err) { /* private mode */ }
}

function applyLook({ palette = root.dataset.palette, theme = root.dataset.theme } = {}, animate = true) {
  const apply = () => {
    root.dataset.palette = palette;
    root.dataset.theme = theme;
    $("#theme-color").content = getComputedStyle(root).getPropertyValue("--paper").trim();
    renderPaletteMenu();
  };
  if (animate && document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.startViewTransition(apply);
  } else apply();
}

function choosePalette(id) {
  storeLook("palette", id);
  applyLook({ palette: id });
  toast("రంగుల ఎంపిక · " + paletteName(id));
  if (parseHash().route === "palettes") render({ keepScroll: true });
}

function renderPaletteMenu() {
  const current = root.dataset.palette, theme = root.dataset.theme;
  $("#palette-menu").innerHTML = `<div class="pal-title">రంగుల ఎంపిక</div>${PALETTES.map((p) => `
    <button class="pal-opt" role="menuitemradio" aria-checked="${p.id === current}" data-choose-palette="${p.id}" data-palette="${p.id}" data-theme="${theme}">
      <span class="pal-chip" aria-hidden="true"><b>అ</b><i></i></span>
      <span class="pal-text"><span class="pal-name">${esc(p.name)}</span><span class="pal-desc">${esc(p.desc)}</span></span>
      <span class="pal-check" aria-hidden="true">${p.id === current ? "●" : ""}</span>
    </button>`).join("")}
    <div class="pal-foot"><a href="#/palettes" data-close-palette>అన్ని థీమ్లను పోల్చి చూడండి →</a><span><kbd>P</kbd> కీ నొక్కండి</span></div>`;
}

function togglePaletteMenu(open) {
  const menu = $("#palette-menu"), btn = $("#palette-btn");
  const show = open ?? menu.hidden;
  menu.hidden = !show;
  btn.setAttribute("aria-expanded", String(show));
  if (show) renderPaletteMenu();
}

$("#palette-btn").addEventListener("click", (e) => { e.stopPropagation(); togglePaletteMenu(); });
document.addEventListener("click", (e) => {
  if (!e.target.closest(".palette-picker")) togglePaletteMenu(false);
});

$("#theme-toggle").addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  storeLook("theme", next);
  applyLook({ theme: next });
  toast(next === "dark" ? "రాత్రి ఎడిషన్ (Dark Mode)" : "పగటి ఎడిషన్ (Light Mode)");
});

// ---------------------------------------------------------------- keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
  if (e.key === "p" || e.key === "P") {
    const list = PALETTES.map((p) => p.id);
    const i = list.indexOf(root.dataset.palette);
    choosePalette(list[(i + 1) % list.length]);
    return;
  }
  if (e.key === "/") {
    e.preventDefault();
    $("#search").focus();
    $("#search").select();
    return;
  }
  const cards = $$(".story");
  if (!cards.length) return;
  if (e.key === "j" || e.key === "ArrowDown") {
    e.preventDefault();
    state.focus = Math.min(state.focus + 1, cards.length - 1);
    focusCard(cards[state.focus]);
  } else if (e.key === "k" || e.key === "ArrowUp") {
    e.preventDefault();
    state.focus = Math.max(state.focus - 1, 0);
    focusCard(cards[state.focus]);
  } else if (state.focus >= 0 && state.focus < cards.length) {
    const card = cards[state.focus];
    const id = card.dataset.id;
    if (e.key === "m") setRead(id, card, !state.read.has(id));
    if (e.key === "s") toggleSave(id, card);
    if (e.key === "o" || e.key === "Enter") {
      const link = card.querySelector(".hl a");
      if (link) window.open(link.href, "_blank", "noopener");
    }
  }
});

function focusCard(card) {
  $$(".story.focused").forEach((c) => c.classList.remove("focused"));
  if (!card) return;
  card.classList.add("focused");
  card.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ---------------------------------------------------------------- boot
async function init() {
  try {
    await loadIndex();
  } catch (err) {
    console.warn("Index load failed:", err);
  }
  window.addEventListener("hashchange", () => render());
  await render();
  fillTicker().catch(console.error);
  updateSavedCount();
  LS.set("lastVisit", Date.now());
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}


VIEWS.sector = async () => {
  const sectors = [
    { name: "NIFTY IT", chg: "+1.25%", news: "TCS, Infosys యూరప్ మరియు AI డీల్స్ పుంజుకోలు", stocks: "TCS, INFY, HCLTech", reason: "బలహీనపడిన రూపాయి ఎగుమతిదారులకు మద్దతు", str: "బలమైనది", status: "Strong", src: "NSE" },
    { name: "NIFTY Pharma", chg: "+0.85%", news: "US FDA తనిఖీల్లో సానుకూల పరిశీలనలు", stocks: "Sun Pharma, Dr Reddy's, Cipla", reason: "డిఫెన్సివ్ కొనుగోళ్లు మరియు హెల్త్‌కేర్ డిమాండ్", str: "బలమైనది", status: "Strong", src: "NSE" },
    { name: "NIFTY Metal", chg: "+0.60%", news: "చైనా ఆర్థిక ఉద్దీపన ప్యాకేజీలు, ఉత్పత్తి పెరుగుదల", stocks: "Tata Steel, JSW Steel, Hindalco", reason: "గ్లోబల్ లోహ ధరలలో రికవరీ సంకేతాలు", str: "మధ్యస్థం", status: "Improving", src: "NSE" },
    { name: "NIFTY Auto", chg: "-0.45%", news: "పండుగల సీజన్ అమ్మకాలపై మిశ్రమ అంచనాలు", stocks: "Maruti, Tata Motors, M&M", reason: "ఎంట్రీ-లెవల్ కార్ల అమ్మకాల్లో నెమ్మదింపు", str: "బలహీనం", status: "Deteriorating", src: "NSE" },
    { name: "NIFTY Bank", chg: "-0.72%", news: "క్రెడిట్-డిపాజిట్ నిష్పత్తిపై RBI ఆందోళనలు", stocks: "HDFC Bank, ICICI Bank, SBIN", reason: "FII బ్యాంకింగ్ షేర్ల అమ్మకాలు, నిమ్స్ (NIM) ఒత్తిడి", str: "బలహీనం", status: "Weak", src: "NSE" },
    { name: "NIFTY Realty", chg: "-1.40%", news: "వడ్డీ రేట్లు ఎక్కువగా ఉండటం, అధిక వాల్యుయేషన్లు", stocks: "DLF, Godrej Prop, Oberoi", reason: "లాభాల స్వీకరణ మరియు కొనుగోలుదార్ల ఆచితూచి ధోరణి", str: "తీవ్ర బలహీనం", status: "Weak", src: "NSE" },
    { name: "NIFTY Energy", chg: "+0.20%", news: "గ్రీన్ ఎనర్జీ ప్రాజెక్టులు మరియు విద్యుత్ డిమాండ్", stocks: "Reliance, NTPC, Power Grid", reason: "పునరుత్పాదక ఇంధన విస్తరణ ఆర్డర్లు", str: "మధ్యస్థం", status: "Improving", src: "NSE" },
    { name: "NIFTY FMCG", chg: "-0.30%", news: "ముడిసరుకు ఖర్చులు పెరగడంతో మార్జిన్లపై భారం", stocks: "ITC, HUL, Dabur", reason: "గ్రామీణ రికవరీ నెమ్మదిగా సాగడం", str: "తటస్థం", status: "Deteriorating", src: "NSE" },
  ];

  return head("Sector Dashboard (రంగాల పనితీరు)", "NSE కీలక రంగాల సూచీలు, బలమైన/బలహీనమైన రంగాలు, ప్రధాన కారణాలు మరియు ప్రభావిత స్టాక్స్.") +
  `
  <div class="fii-stat-grid reveal" style="margin-bottom:20px;">
    <div class="fii-stat-card" style="border-left:4px solid #16a34a;">
      <div class="label">బలమైన రంగాలు (Strong Sectors)</div>
      <div class="val" style="font-size:18px;color:#16a34a;">NIFTY IT · NIFTY Pharma</div>
      <div class="sub">ఎగుమతి మద్దతు & డిఫెన్సివ్ కొనుగోళ్లు</div>
    </div>
    <div class="fii-stat-card" style="border-left:4px solid #dc2626;">
      <div class="label">బలహీనమైన రంగాలు (Weak Sectors)</div>
      <div class="val" style="font-size:18px;color:#dc2626;">NIFTY Realty · NIFTY Bank</div>
      <div class="sub">FII అమ్మకాలు & అధిక వడ్డీ రేట్ల ఒత్తిడి</div>
    </div>
    <div class="fii-stat-card" style="border-left:4px solid #2563eb;">
      <div class="label">మెరుగుపడుతున్న రంగాలు (Improving)</div>
      <div class="val" style="font-size:18px;color:#2563eb;">NIFTY Metal · NIFTY Energy</div>
      <div class="sub">చైనా ఉద్దీపనలు & పవర్ ఆర్డర్లు</div>
    </div>
  </div>

  <div class="news-table-wrap reveal">
    <table class="news-table">
      <thead>
        <tr>
          <th>రంగం (Sector)</th>
          <th>Index Change %</th>
          <th>ప్రధాన వార్త (Key News)</th>
          <th>ప్రభావిత స్టాక్స్</th>
          <th>కారణం (Catalyst)</th>
          <th>రంగ బలం</th>
          <th>మూలం</th>
        </tr>
      </thead>
      <tbody>
        ${sectors.map(s => {
          const up = s.chg.startsWith("+");
          return `
          <tr>
            <td><b>${esc(s.name)}</b></td>
            <td style="color:${up ? 'var(--sentiment-positive)' : 'var(--sentiment-negative)'};font-family:var(--mono);font-weight:700;">${esc(s.chg)}</td>
            <td>${esc(s.news)}</td>
            <td><span class="stock-pill">${esc(s.stocks)}</span></td>
            <td><small>${esc(s.reason)}</small></td>
            <td><span class="sentiment-badge ${up ? 'badge-pos' : 'badge-neg'}">${esc(s.str)}</span></td>
            <td><small>${esc(s.src)}</small></td>
          </tr>`;
        }).join("")}
      </tbody>
    </table>
  </div>`;
};
VIEWS.adr = async () => {
  const adrs = [
    { name: "HDFC Bank", ticker: "HDB", price: "$59.40", chg: "-0.65%", date: "యూఎస్ ముగింపు", impact: "భారత బ్యాంకింగ్ ఓపెనింగ్‌పై స్వల్ప నెగటివ్ సెంటిమెంట్", src: "NYSE" },
    { name: "ICICI Bank", ticker: "IBN", price: "$28.85", chg: "+0.35%", date: "యూఎస్ ముగింపు", impact: "స్థిరమైన కొనుగోళ్ల మద్దతును సూచిస్తోంది", src: "NYSE" },
    { name: "Infosys", ticker: "INFY", price: "$22.15", chg: "+1.10%", date: "యూఎస్ ముగింపు", impact: "NIFTY IT రంగానికి సానుకూల గ్యాప్-అప్ సంకేతం", src: "NYSE" },
    { name: "Wipro", ticker: "WIT", price: "$6.12", chg: "-0.15%", date: "యూఎస్ ముగింపు", impact: "పరిమిత పరిధిలో స్థిరమైన కదలిక", src: "NYSE" },
    { name: "Dr. Reddy's Lab", ticker: "RDY", price: "$78.50", chg: "+0.80%", date: "యూఎస్ ముగింపు", impact: "ఫార్మా ఎగుమతులకు సానుకూల దృక్పథం", src: "NYSE" },
    { name: "MakeMyTrip", ticker: "MMYT", price: "$96.20", chg: "+2.40%", date: "యూఎస్ ముగింపు", impact: "భారత ట్రావెల్, టూరిజం డిమాండ్ బలంగా ఉంది", src: "NASDAQ" },
  ];

  return head("India ADR Dashboard (అమెరికన్ డిపాజిటరీ రసీదులు)", "US మార్కెట్లలో లిస్టయిన భారతీయ దిగ్గజ కంపెనీల ADR ధరలు మరియు మరుసటి రోజు దేశీయ స్టాక్లపై వాటి ప్రభావం.") +
  `
  <div class="news-table-wrap reveal">
    <table class="news-table">
      <thead>
        <tr>
          <th>కంపెనీ (Company)</th>
          <th>ADR Ticker</th>
          <th>తాజా ధర (Price)</th>
          <th>మార్పు %</th>
          <th>US Trading Date</th>
          <th>భారత స్టాక్పై సంభావ్య ప్రభావం</th>
          <th>మూలం</th>
        </tr>
      </thead>
      <tbody>
        ${adrs.map(a => {
          const up = a.chg.startsWith("+");
          return `
          <tr>
            <td><b>${esc(a.name)}</b></td>
            <td><span class="stock-pill">${esc(a.ticker)}</span></td>
            <td style="font-family:var(--mono);font-weight:700;">${esc(a.price)}</td>
            <td style="color:${up ? 'var(--sentiment-positive)' : 'var(--sentiment-negative)'};font-family:var(--mono);font-weight:700;">${esc(a.chg)}</td>
            <td><small>${esc(a.date)}</small></td>
            <td>${esc(a.impact)}</td>
            <td><small>${esc(a.src)}</small></td>
          </tr>`;
        }).join("")}
      </tbody>
    </table>
  </div>
  <p style="font-size:12.5px;color:var(--ink-2);margin-top:14px;line-height:1.5;">
    గమనిక: ADR ధరల కదలికలు సెంటిమెంట్‌ను మాత్రమే ప్రతిబింబిస్తాయి కానీ మరుసటి రోజు ఖచ్చితంగా అదే ధర వద్ద ఓపెన్ అవుతుందని హామీ ఇవ్వవు. కరెన్సీ మారకం విలువ (USD/INR) మరియు డిపాజిటరీ నిష్పత్తిని పరిగణనలోకి తీసుకోవాలి.
  </p>`;
};
VIEWS.currency = async () => {
  const pairs = [
    { name: "USD / INR", price: "84.05", chg: "+0.03", pct: "+0.04%", impact: "రూపాయి స్వల్ప క్షీణత; ఐటీ, ఫార్మా ఎగుమతిదారులకు లాభం, దిగుమతి వ్యయాల పెరుగుదల", sec: "IT, Pharma, OMCs", src: "RBI Ref / FX" },
    { name: "Dollar Index (DXY)", price: "103.85", chg: "+0.25", pct: "+0.24%", impact: "డాలర్ బలపడితే వర్ధమాన దేశాల (భారత్ సహా) నుండి FII పెట్టుబడులు తగ్గే అవకాశం", sec: "Banking, FII Flows", src: "ICE" },
    { name: "EUR / USD", price: "1.0850", chg: "-0.0018", pct: "-0.17%", impact: "యూరోపియన్ యూనియన్ ఆదాయాలు కలిగిన భారత IT మరియు ఆటో కంపెనీలపై స్వల్ప ప్రభావం", sec: "IT, Auto Ancillaries", src: "Forex" },
    { name: "GBP / USD", price: "1.2980", chg: "-0.0012", pct: "-0.09%", impact: "యూకే మార్కెట్లలో వ్యాపారాలు కలిగిన టాటా మోటార్స్ (JLR), ఇన్ఫోసిస్‌కు కీలకం", sec: "Auto, IT", src: "Forex" },
    { name: "USD / JPY", price: "152.40", chg: "+0.45", pct: "+0.30%", impact: "యెన్ క్యారీ ట్రేడ్ ఒత్తిడిని సూచిస్తుంది; గ్లోబల్ రిస్క్ సెంటిమెంట్‌కు ప్రామాణికం", sec: "Global Risk-on/off", src: "Forex" },
    { name: "USD / CNH", price: "7.1350", chg: "+0.015", pct: "+0.21%", impact: "చైనీస్ యువాన్ బలహీనత ఆసియా కరెన్సీల స్థిరత్వంపై ప్రభావం చూపుతుంది", sec: "Metals, Chemicals", src: "Forex" },
  ];

  return head("Currency Dashboard (కరెన్సీ & ఫారెక్స్ విశ్లేషణ)", "USD/INR, డాలర్ ఇండెక్స్ మరియు ప్రపంచ కరెన్సీ కదలికలు భారత మార్కెట్లను మరియు రంగాలను ఎలా ప్రభావితం చేస్తాయి.") +
  `
  <div class="news-table-wrap reveal">
    <table class="news-table">
      <thead>
        <tr>
          <th>కరెన్సీ (Currency)</th>
          <th>తాజా ధర (Price)</th>
          <th>మార్పు (Change)</th>
          <th>మార్పు %</th>
          <th>భారత మార్కెట్పై ప్రభావం</th>
          <th>ప్రభావిత రంగాలు</th>
          <th>మూలం</th>
        </tr>
      </thead>
      <tbody>
        ${pairs.map(p => {
          const up = p.pct.startsWith("+");
          return `
          <tr>
            <td><b>${esc(p.name)}</b></td>
            <td style="font-family:var(--mono);font-weight:700;">${esc(p.price)}</td>
            <td style="font-family:var(--mono);">${esc(p.chg)}</td>
            <td style="color:${up ? 'var(--sentiment-positive)' : 'var(--sentiment-negative)'};font-family:var(--mono);font-weight:700;">${esc(p.pct)}</td>
            <td>${esc(p.impact)}</td>
            <td><span class="sector-pill">${esc(p.sec)}</span></td>
            <td><small>${esc(p.src)}</small></td>
          </tr>`;
        }).join("")}
      </tbody>
    </table>
  </div>
  <div class="strength-box reveal" style="margin-top:24px;">
    <h4 style="margin:0 0 8px;">రూపాయి కదలికలు - రంగాల వారీ విశ్లేషణ:</h4>
    <p style="font-size:13px;color:var(--ink-2);line-height:1.5;">
      • <b>రూపాయి బలహీనపడితే (Depreciation):</b> TCS, Infosys, Sun Pharma వంటి ఎగుమతి ఆధారిత కంపెనీలకు ఆదాయం డాలర్లలో రావడం వల్ల లాభదాయకం.<br>
      • <b>దిగుమతిదారులపై భారం:</b> ఇండియన్ ఆయిల్ (IOC), BPCL, పెయింట్ కంపెనీలు (Asian Paints), విమానయానం (IndiGo) వంటి ముడిసరుకు దిగుమతి చేసుకునే కంపెనీల వ్యయాలు పెరుగుతాయి.
    </p>
  </div>`;
};
VIEWS.crude = async () => {
  const drivers = [
    { no: 1, driver: "ప్రపంచ డిమాండ్ (Global Demand)", dev: "యూఎస్, ఐరోపాలో పారిశ్రామిక డిమాండ్ స్థిరంగా కొనసాగుతోంది", crudeImp: "ధరలకు మద్దతు", inImp: "దిగుమతి బిల్లుపై స్థిరమైన భారం", secs: "OMCs, Paints", src: "IEA" },
    { no: 2, driver: "OPEC+ ఉత్పత్తి నిర్ణయాలు", dev: "ఉత్పత్తి కోతలను నవంబర్/డిసెంబర్ వరకు కొనసాగించే ప్రణాళిక", crudeImp: "ధరలు పెరిగే అవకాశం", inImp: "ద్రవ్యోల్బణ ఒత్తిడి పెరగవచ్చు", secs: "Energy, Aviation", src: "OPEC" },
    { no: 3, driver: "భౌగోళిక ఉద్రిక్తతలు (Geopolitics)", dev: "మధ్యప్రాచ్యంలో ఘర్షణలు, సరఫరా గొలుసులో ఆటంకాలు", crudeImp: "స్వల్పకాలిక స్పైక్ రిస్క్", inImp: "భారత వాణిజ్య లోటు పెరిగే ప్రమాదం", secs: "Shipping, Paints", src: "Reuters" },
    { no: 4, driver: "యూఎస్ ఇన్వెంటరీలు (US Inventories)", dev: "EIA నివేదిక ప్రకారం ముడి చమురు నిల్వలు 2.1 మిలియన్ బ్యారెల్స్ తగ్గాయి", crudeImp: "ధరలకు స్వల్ప ఊపు", inImp: "స్వల్పకాలిక పెట్రోల్/డీజిల్ వ్యయాలు", secs: "OMCs", src: "EIA" },
    { no: 5, driver: "US Dollar / DXY", dev: "డాలర్ ఇండెక్స్ 103 పైన బలపడటం చమురు కొనుగోలు వ్యయాన్ని పెంచింది", crudeImp: "ధరలపై నియంత్రణ", inImp: "కరెన్సీ క్షీణతతో రెట్టింపు భారం", secs: "Forex, Auto", src: "ICE" },
    { no: 6, driver: "యూఎస్ షేల్ ఉత్పత్తి (Shale Output)", dev: "అమెరికా రికార్డు స్థాయిలో రోజుకు 13.4 మి. బ్యారెల్స్ ఉత్పత్తి చేస్తోంది", crudeImp: "సరఫరా పెరిగి ధరలు అదుపు", inImp: "చమురు విపరీతంగా పెరగకుండా రక్షణ", secs: "General Market", src: "Baker Hughes" },
    { no: 7, driver: "చైనా డిమాండ్ & నిల్వలు", dev: "రియల్ ఎస్టేట్ మాంద్యం కారణంగా చైనా చమురు దిగుమతులు మందగించాయి", crudeImp: "ధరలు తగ్గడానికి దోహదం", inImp: "భారత ముడి చమురు దిగుమతులకు లాభం", secs: "Paints, Tyres", src: "Customs China" },
    { no: 8, driver: "అదనపు ఉత్పత్తి సామర్థ్యం (Spare Capacity)", dev: "సౌదీ అరేబియా వద్ద 3 మిలియన్ బ్యారెళ్ల అత్యవసర సామర్థ్యం అందుబాటులో ఉంది", crudeImp: "షాక్ అబ్జార్బర్‌గా ఉపయోగపడుతుంది", inImp: "సరఫరా సంక్షోభం రాకుండా నిరోధిస్తుంది", secs: "Energy", src: "IEA" },
  ];

  return head("Crude Oil — ధరలను ప్రభావితం చేసే 8 ముఖ్యమైన అంశాలు", "ముడి చమురు ధరల డ్రైవర్లు, ట్రాన్స్‌మిషన్ మెకానిజం మరియు భారతీయ సున్నిత రంగాలు.") +
  `
  <div class="fii-stat-grid reveal" style="margin-bottom:20px;">
    <div class="fii-stat-card">
      <div class="label">Brent Crude (బ్రెంట్ చమురు)</div>
      <div class="val" style="font-family:var(--mono);">$78.25 <small style="font-size:14px;">/ బ్యారెల్</small></div>
      <div class="sub">గల్ఫ్ మరియు అంతర్జాతీయ ప్రామాణికం</div>
    </div>
    <div class="fii-stat-card">
      <div class="label">WTI Crude (యూఎస్ చమురు)</div>
      <div class="val" style="font-family:var(--mono);">$74.10 <small style="font-size:14px;">/ బ్యారెల్</small></div>
      <div class="sub">అమెరికన్ మార్కెట్ రిఫరెన్స్</div>
    </div>
    <div class="fii-stat-card">
      <div class="label">భారత ప్రభావ తీవ్రత</div>
      <div class="val" style="color:var(--sentiment-negative);font-size:20px;">అధికం (High)</div>
      <div class="sub">భారత్ 85% చమురును దిగుమతి చేసుకుంటుంది</div>
    </div>
  </div>

  <div class="news-table-wrap reveal">
    <table class="news-table">
      <thead>
        <tr>
          <th style="width:30px">#</th>
          <th>డ్రైవర్ (Driver)</th>
          <th>తాజా పరిణామం (Latest Development)</th>
          <th>Crudeపై ప్రభావం</th>
          <th>భారత మార్కెట్పై ప్రభావం</th>
          <th>సంబంధిత రంగాలు</th>
          <th>మూలం</th>
        </tr>
      </thead>
      <tbody>
        ${drivers.map(d => `
          <tr>
            <td><b>${d.no}</b></td>
            <td><b>${esc(d.driver)}</b></td>
            <td>${esc(d.dev)}</td>
            <td><b>${esc(d.crudeImp)}</b></td>
            <td>${esc(d.inImp)}</td>
            <td><span class="sector-pill">${esc(d.secs)}</span></td>
            <td><small>${esc(d.src)}</small></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>

  <div class="strength-box reveal" style="margin-top:24px;">
    <h4 style="margin:0 0 8px;">ట్రాన్స్‌మిషన్ మెకానిజం (Transmission Mechanism):</h4>
    <div class="workflow-flex">
      <span class="wf-step">Crude Price పెరగడం</span>
      <span class="wf-arrow">→</span>
      <span class="wf-step">భారత దిగుమతి బిల్లు పెరుగుదల</span>
      <span class="wf-arrow">→</span>
      <span class="wf-step">USD/INR & కరెంట్ ఖాతా లోటు</span>
      <span class="wf-arrow">→</span>
      <span class="wf-step">ద్రవ్యోల్బణం & రవాణా ఖర్చులు</span>
      <span class="wf-arrow">→</span>
      <span class="wf-step">RBI రేట్ల తగ్గింపు ఆలస్యం</span>
      <span class="wf-arrow">→</span>
      <span class="wf-step" style="background:#fee2e2;">షేర్ల లాభాల మార్జిన్లపై ఒత్తిడి</span>
    </div>
    <div style="margin-top:14px;padding-top:10px;border-top:1px dashed var(--rule);font-size:13px;color:var(--ink-2);">
      • <b>ప్రతికూల రంగాలు (Downstream):</b> పెయింట్స్ (Asian Paints, Berger), ఏవియేషన్ (IndiGo), టైర్స్ (MRF, Apollo), OMCs (IOC, BPCL).<br>
      • <b>సానుకూల రంగాలు (Upstream):</b> ONGC, Oil India (ఉత్పత్తిదారులకు అధిక ముడిచమురు రియలైజేషన్లు లభిస్తాయి).
    </div>
  </div>`;
};
