import { useState, useRef } from "react";

const BR = "#16688C", BRD = "#0f4f6a", BRL = "#e8f4f9";
const ACC = "#00c4a0";
const TX = "#1a2332", TXM = "#4a5568", TXL = "#718096";
const BG = "#f7f9fc", WH = "#ffffff", BD = "#e2e8f0";
const DG = "#e53e3e", WN = "#f6ad55", SC = "#48bb78";
const TAX_RATE = 0.2636;
const SIDEBAR_W = 220;

const PLANOS = [
  {
    id: "free", nome: "Free", preco: "Grátis", precoNum: 0, limite: 3,
    cor: TXM, corBg: "#f7fafc", badge: null,
    features: ["Até 3 produtos por simulação","1 fornecedor cadastrado","Download CSV","Suporte por e-mail"],
  },
  {
    id: "pro", nome: "Pro", preco: "R$ 59,99", precoNum: 59.99, limite: 200,
    cor: BR, corBg: BRL, badge: "Mais popular",
    features: ["Até 200 produtos por simulação","Fornecedores ilimitados","Download CSV e XLSX","Histórico de simulações","Suporte prioritário"],
  },
  {
    id: "enterprise", nome: "Enterprise", preco: "R$ 399,99", precoNum: 399.99, limite: Infinity,
    cor: "#7c3aed", corBg: "#f5f3ff", badge: "Ilimitado",
    features: ["Produtos ilimitados","Fornecedores ilimitados","Download CSV e XLSX","Histórico completo","API de integração","Gerente de conta dedicado","SLA garantido"],
  },
];

const MOCK_FORN = [
  { id: 1, nome: "TechBrasil Ltda", cnpj: "12.345.678/0001-90", setor: "Tecnologia", contato: "comercial@techbrasil.com.br" },
  { id: 2, nome: "Alimentos do Norte S.A.", cnpj: "98.765.432/0001-10", setor: "Alimentação", contato: "fiscal@alimentosnorte.com.br" },
  { id: 3, nome: "Pharma Solutions", cnpj: "55.444.333/0001-22", setor: "Farmacêutico", contato: "compras@pharmasol.com.br" },
];

const MOCK_PRODS = [
  { produto: "Notebook Dell XPS 15", preco: "4500.00", incide: "sim" },
  { produto: "Monitor LG 27''", preco: "1890.00", incide: "sim" },
  { produto: "Teclado Mecânico", preco: "380.00", incide: "sim" },
  { produto: "Suporte Ergonômico", preco: "220.00", incide: "não" },
  { produto: "Licença Office 365", preco: "650.00", incide: "sim" },
  { produto: "Webcam Logitech", preco: "540.00", incide: "sim" },
  { produto: "Headset Sony", preco: "299.00", incide: "não" },
  { produto: "Cabo HDMI 2m", preco: "45.00", incide: "sim" },
];

const G = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body,input,select,button{font-family:'Inter',sans-serif}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeInScale{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.fi{animation:fadeIn .3s ease both}
.fis{animation:fadeInScale .3s ease both}
.spin{animation:spin 1s linear infinite;display:inline-block}
.pulse{animation:pulse 1.6s ease-in-out infinite}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-thumb{background:#cbd5e0;border-radius:3px}
`;

function sI(ex) { return Object.assign({ width:"100%",padding:"10px 14px",border:"1.5px solid "+BD,borderRadius:8,fontSize:14,color:TX,background:WH,outline:"none" }, ex||{}); }
function sP(ex) { return Object.assign({ background:BR,color:"#fff",border:"none",padding:"10px 20px",borderRadius:8,fontWeight:500,fontSize:14,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:8 }, ex||{}); }
function sS(ex) { return Object.assign({ background:WH,color:BR,border:"1.5px solid "+BR,padding:"9px 18px",borderRadius:8,fontWeight:500,fontSize:14,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:8 }, ex||{}); }
function sG(ex) { return Object.assign({ background:"transparent",color:TXM,border:"none",padding:"8px 12px",borderRadius:8,fontSize:14,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6 }, ex||{}); }
function sC(ex) { return Object.assign({ background:WH,borderRadius:12,border:"1px solid "+BD,padding:24 }, ex||{}); }
function sL() { return { display:"block",fontSize:13,fontWeight:500,color:TXM,marginBottom:5 }; }

/* ── Icon ── */
function Icon(props) {
  var n=props.n, s=props.s||18, c=props.c||"currentColor";
  var b={ width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:c };
  var p={ strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.8 };
  if(n==="users") return <svg {...b}><path {...p} d="M17 20v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle {...p} cx="9" cy="7" r="4"/><path {...p} d="M23 20v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;
  if(n==="calc") return <svg {...b}><rect {...p} x="4" y="2" width="16" height="20" rx="2"/><path {...p} d="M8 6h8M8 10h2M12 10h2M8 14h2M12 14h2M8 18h2M12 18h2"/></svg>;
  if(n==="file") return <svg {...b}><path {...p} d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline {...p} points="14 2 14 8 20 8"/></svg>;
  if(n==="dl")   return <svg {...b}><path {...p} d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>;
  if(n==="up")   return <svg {...b}><path {...p} d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>;
  if(n==="crown") return <svg {...b}><path {...p} d="M2 17l2-8 5 4 3-8 3 8 5-4 2 8H2z"/></svg>;
  if(n==="zap")  return <svg {...b}><path {...p} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
  if(n==="lock") return <svg {...b}><rect {...p} x="3" y="11" width="18" height="11" rx="2"/><path {...p} d="M7 11V7a5 5 0 0110 0v4"/></svg>;
  var paths = {
    home:"M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z",
    plus:"M12 5v14M5 12h14",
    edit:"M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    trash:"M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6",
    chk:"M5 13l4 4L19 7",
    x:"M18 6L6 18M6 6l12 12",
    arr:"M5 12h14M12 5l7 7-7 7",
    spark:"M13 10V3L4 14h7v7l9-11h-7z",
    logout:"M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
    shield:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    chart:"M18 20V10M12 20V4M6 20v-6",
    tag:"M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01",
    star:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  };
  return <svg {...b}><path {...p} d={paths[n]||""}/></svg>;
}

/* ── Logo ── */
function Logo(props) {
  var white=props.white, lg=props.lg;
  var cl=white?"#fff":BR, sz=lg?42:34;
  return (
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <svg width={sz} height={sz} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill={white?"rgba(255,255,255,0.18)":BRL}/>
        <rect x="6" y="8"  width="28" height="3" rx="1.5" fill={cl} opacity="0.9"/>
        <rect x="6" y="14" width="22" height="3" rx="1.5" fill={cl} opacity="0.7"/>
        <rect x="6" y="20" width="17" height="3" rx="1.5" fill={cl} opacity="0.55"/>
        <rect x="6" y="26" width="24" height="3" rx="1.5" fill={cl} opacity="0.7"/>
        <rect x="6" y="32" width="28" height="3" rx="1.5" fill={cl} opacity="0.9"/>
        <rect x="26" y="16" width="8" height="14" rx="2" fill={cl}/>
        <circle cx="30" cy="14" r="5" fill={cl}/>
        <text x="30" y="18" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="Inter,sans-serif">M</text>
      </svg>
      <div>
        <div style={{fontSize:lg?22:17,fontWeight:700,color:white?"#fff":BR,letterSpacing:"-0.3px",lineHeight:1}}>Mutuus</div>
        <div style={{fontSize:lg?11:9,color:white?"rgba(255,255,255,0.7)":TXL,letterSpacing:"0.6px",textTransform:"uppercase",fontWeight:500,marginTop:2}}>
          {lg?"Contabilidade e Gestão Tributária":"Gestão Tributária"}
        </div>
      </div>
    </div>
  );
}

/* ── Badge ── */
function Badge(props) {
  var map={info:{bg:BRL,color:BRD},success:{bg:"#e6faf0",color:"#276749"},warn:{bg:"#fffbeb",color:"#975a16"},danger:{bg:"#fff5f5",color:DG},purple:{bg:"#f5f3ff",color:"#6d28d9"}};
  var st=map[props.type||"info"];
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:500,background:st.bg,color:st.color}}>{props.children}</span>;
}

/* ── Toast ── */
function Toast(props) {
  var t=props.t;
  if(!t) return null;
  var ic={success:"✓",error:"✕",info:"ℹ"};
  var co={success:SC,error:DG,info:BR};
  return (
    <div style={{position:"fixed",bottom:24,right:24,background:TX,color:"#fff",padding:"14px 20px",borderRadius:10,fontSize:14,zIndex:9999,display:"flex",alignItems:"center",gap:10,boxShadow:"0 8px 24px rgba(0,0,0,.22)",maxWidth:340}}>
      <span style={{color:co[t.type]||SC,fontWeight:700,fontSize:16}}>{ic[t.type]||"✓"}</span>{t.msg}
    </div>
  );
}

/* ── Modal base ── */
function Modal(props) {
  if(!props.open) return null;
  return (
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:5000,padding:"20px"}}
      onClick={function(e){ if(e.target===e.currentTarget && props.onClose) props.onClose(); }}>
      <div className="fis" style={Object.assign({background:WH,borderRadius:16,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 30px 80px rgba(0,0,0,0.25)"},props.style||{})}>
        {props.children}
      </div>
    </div>
  );
}

/* ── Modal de Planos ── */
function ModalPlanos(props) {
  var open=props.open, onClose=props.onClose, planoAtual=props.planoAtual, onSelect=props.onSelect;
  var [anual,setAnual]=useState(false);
  var [loading,setLoading]=useState(null);

  function escolher(plano) {
    if(plano.id===planoAtual.id) return;
    setLoading(plano.id);
    setTimeout(function(){
      setLoading(null);
      onSelect(plano);
      onClose();
    },1300);
  }

  return (
    <Modal open={open} onClose={onClose} style={{width:"min(900px,96vw)",padding:0}}>
      {/* Header do modal */}
      <div style={{background:"linear-gradient(135deg,"+BR+","+BRD+")",padding:"28px 32px",borderRadius:"16px 16px 0 0",position:"relative"}}>
        <button onClick={onClose} style={{position:"absolute",top:16,right:16,background:"rgba(255,255,255,0.15)",border:"none",borderRadius:8,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <Icon n="x" s={16} c="#fff"/>
        </button>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:6}}>Escolha o melhor plano para você</div>
          <p style={{color:"rgba(255,255,255,0.75)",fontSize:14,marginBottom:20}}>
            Sem contrato · Cancele quando quiser · Ativação imediata
          </p>
          {/* Toggle mensal/anual */}
          <div style={{display:"inline-flex",alignItems:"center",gap:12,background:"rgba(255,255,255,0.15)",padding:"8px 18px",borderRadius:50}}>
            <span style={{fontSize:13,color:!anual?"#fff":"rgba(255,255,255,0.55)",fontWeight:!anual?600:400}}>Mensal</span>
            <div onClick={function(){setAnual(!anual);}} style={{width:42,height:22,borderRadius:11,background:anual?"#7ee8d0":"rgba(255,255,255,0.3)",cursor:"pointer",position:"relative",transition:"background .3s"}}>
              <div style={{position:"absolute",top:2,left:anual?22:2,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left .3s",boxShadow:"0 1px 4px rgba(0,0,0,.2)"}}/>
            </div>
            <span style={{fontSize:13,color:anual?"#fff":"rgba(255,255,255,0.55)",fontWeight:anual?600:400}}>
              Anual <span style={{background:"#7ee8d0",color:BRD,fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:10,marginLeft:4}}>-20%</span>
            </span>
          </div>
        </div>
      </div>

      {/* Cards de planos */}
      <div style={{padding:"28px 24px",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
        {PLANOS.map(function(plano,i){
          var atual=plano.id===planoAtual.id;
          var destaque=plano.id==="pro";
          var precoFinal=anual&&plano.precoNum>0?(plano.precoNum*0.8).toFixed(2).replace(".",","):null;
          return (
            <div key={plano.id} className="fi" style={{
              background:destaque?"linear-gradient(160deg,"+BR+","+BRD+")":WH,
              borderRadius:14,
              border:atual?"2px solid "+SC:destaque?"none":"1px solid "+BD,
              padding:"24px 20px",
              position:"relative",
              boxShadow:destaque?"0 12px 40px rgba(22,104,140,.3)":"0 2px 12px rgba(0,0,0,.05)",
              display:"flex",
              flexDirection:"column",
              animationDelay:(i*0.07)+"s",
            }}>
              {/* Badge topo */}
              {atual&&(
                <div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:SC,color:"#fff",fontSize:11,fontWeight:700,padding:"4px 14px",borderRadius:20,whiteSpace:"nowrap"}}>✓ Plano atual</div>
              )}
              {!atual&&plano.badge&&(
                <div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:destaque?"#7ee8d0":plano.cor,color:destaque?BRD:"#fff",fontSize:11,fontWeight:700,padding:"4px 14px",borderRadius:20,whiteSpace:"nowrap"}}>{plano.badge}</div>
              )}

              {/* Ícone */}
              <div style={{width:44,height:44,borderRadius:12,background:destaque?"rgba(255,255,255,0.2)":plano.corBg,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>
                <Icon n={plano.id==="free"?"zap":plano.id==="pro"?"star":"crown"} s={20} c={destaque?"#fff":plano.cor}/>
              </div>

              <div style={{fontSize:12,fontWeight:600,color:destaque?"rgba(255,255,255,0.65)":TXL,textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:4}}>{plano.nome}</div>

              {/* Preço */}
              <div style={{marginBottom:4}}>
                {anual&&plano.precoNum>0?(
                  <div>
                    <span style={{fontSize:13,color:destaque?"rgba(255,255,255,0.45)":TXL,textDecoration:"line-through",marginRight:6}}>R$ {plano.preco.replace("R$ ","")}</span>
                    <div style={{fontSize:30,fontWeight:700,color:destaque?"#fff":TX,lineHeight:1.1}}>R$ {precoFinal}<span style={{fontSize:13,fontWeight:400,color:destaque?"rgba(255,255,255,0.65)":TXL}}>/mês</span></div>
                  </div>
                ):(
                  <div style={{fontSize:30,fontWeight:700,color:destaque?"#fff":TX,lineHeight:1.1}}>
                    {plano.preco}{plano.precoNum>0&&<span style={{fontSize:13,fontWeight:400,color:destaque?"rgba(255,255,255,0.65)":TXL}}>/mês</span>}
                  </div>
                )}
              </div>
              <div style={{fontSize:12,color:destaque?"rgba(255,255,255,0.6)":TXL,marginBottom:18}}>
                {plano.limite===Infinity?"Ilimitado":"Até "+plano.limite+" produto"+(plano.limite>1?"s":"")}
              </div>

              {/* Features */}
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20,flex:1}}>
                {plano.features.map(function(f,j){
                  return (
                    <div key={j} style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:18,height:18,borderRadius:"50%",background:destaque?"rgba(126,232,208,0.2)":plano.corBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <Icon n="chk" s={10} c={destaque?"#7ee8d0":plano.cor}/>
                      </div>
                      <span style={{fontSize:12,color:destaque?"rgba(255,255,255,0.82)":TXM}}>{f}</span>
                    </div>
                  );
                })}
              </div>

              {/* Botão */}
              <button
                onClick={function(){escolher(plano);}}
                disabled={atual||loading===plano.id}
                style={{
                  width:"100%",padding:"11px",borderRadius:10,border:"none",
                  fontWeight:600,fontSize:14,
                  cursor:atual?"default":"pointer",
                  background:atual?"rgba(72,187,120,0.15)":destaque?"#fff":plano.id==="enterprise"?"linear-gradient(135deg,#7c3aed,#5b21b6)":plano.corBg,
                  color:atual?SC:destaque?BR:plano.id==="enterprise"?"#fff":plano.cor,
                  display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                  transition:"opacity .2s",
                  opacity:loading&&loading!==plano.id?0.5:1,
                }}>
                {loading===plano.id
                  ?<><span className="spin" style={{width:14,height:14,border:"2px solid rgba(0,0,0,.12)",borderTopColor:destaque?BR:plano.cor,borderRadius:"50%"}}/> Ativando...</>
                  :atual?"Plano ativo":(plano.id==="free"?"Usar grátis":"Assinar agora")}
              </button>
            </div>
          );
        })}
      </div>

      {/* Rodapé */}
      <div style={{borderTop:"1px solid "+BD,padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"center",gap:28,flexWrap:"wrap"}}>
        {["🔒 Pagamento seguro","✓ Cancele a qualquer momento","⚡ Ativação imediata"].map(function(t,i){
          return <span key={i} style={{color:TXL,fontSize:12}}>{t}</span>;
        })}
      </div>
    </Modal>
  );
}

/* ── Login ── */
function LoginPage(props) {
  var [tab,setTab]=useState("login");
  var [email,setEmail]=useState("");
  var [senha,setSenha]=useState("");
  var [nome,setNome]=useState("");
  var [empresa,setEmpresa]=useState("");
  var [loading,setLoading]=useState(false);
  var [err,setErr]=useState("");

  function handle() {
    if(!email||!senha){setErr("Preencha todos os campos.");return;}
    setErr(""); setLoading(true);
    setTimeout(function(){
      props.onLogin({nome:nome||email.split("@")[0],email:email,empresa:empresa||"Minha Empresa"});
      setLoading(false);
    },1200);
  }

  return (
    <div style={{minHeight:"100vh",display:"grid",gridTemplateColumns:"1fr 1fr",fontFamily:"Inter,sans-serif"}}>
      <style>{G}</style>
      <div style={{background:"linear-gradient(140deg,"+BR+" 0%,"+BRD+" 65%,#0a3a52 100%)",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"40px 48px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-80,right:-80,width:280,height:280,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
        <Logo white lg/>
        <div className="fi">
          <div style={{fontSize:30,fontWeight:700,color:"#fff",lineHeight:1.25,marginBottom:16}}>
            Transforme a <span style={{color:"#7ee8d0"}}>tributação</span><br/>em vantagem competitiva
          </div>
          <p style={{color:"rgba(255,255,255,0.75)",fontSize:15,lineHeight:1.7,marginBottom:28}}>
            Com a Reforma Tributária 2027 (IBS + CBS), os preços precisam ser recalculados. Nossa plataforma faz isso automaticamente.
          </p>
          {["Calcule o impacto da nova tributação em segundos","Gere planilhas atualizadas automaticamente","Analise fornecedores e produtos com IA"].map(function(t,i){
            return (
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(126,232,208,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Icon n="chk" s={12} c="#7ee8d0"/>
                </div>
                <span style={{color:"rgba(255,255,255,0.85)",fontSize:14}}>{t}</span>
              </div>
            );
          })}
        </div>
        <div style={{display:"flex",gap:28}}>
          {[{v:"150+",l:"Empresas"},{v:"98%",l:"Precisão"},{v:"2h",l:"Economia/mês"}].map(function(s,i){
            return <div key={i}><div style={{fontSize:22,fontWeight:700,color:"#fff"}}>{s.v}</div><div style={{fontSize:12,color:"rgba(255,255,255,0.6)"}}>{s.l}</div></div>;
          })}
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:40,background:BG}}>
        <div className="fi" style={{width:"100%",maxWidth:400}}>
          <h2 style={{fontSize:24,fontWeight:700,color:TX,marginBottom:6}}>{tab==="login"?"Bem-vindo de volta":"Crie sua conta"}</h2>
          <p style={{color:TXL,fontSize:14,marginBottom:24}}>{tab==="login"?"Entre para acessar o portal":"Comece grátis por 14 dias"}</p>
          <div style={{display:"flex",background:"#f0f4f8",borderRadius:10,padding:4,marginBottom:24}}>
            {["login","cadastro"].map(function(t){
              return <button key={t} onClick={function(){setTab(t);}} style={{flex:1,padding:"9px",borderRadius:8,border:"none",fontWeight:500,fontSize:14,background:tab===t?WH:"transparent",color:tab===t?BR:TXM,cursor:"pointer"}}>{t==="login"?"Entrar":"Cadastrar"}</button>;
            })}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {tab==="cadastro"&&<div><label style={sL()}>Nome completo</label><input style={sI()} placeholder="João Silva" value={nome} onChange={function(e){setNome(e.target.value);}}/></div>}
            {tab==="cadastro"&&<div><label style={sL()}>Empresa</label><input style={sI()} placeholder="Minha Empresa Ltda" value={empresa} onChange={function(e){setEmpresa(e.target.value);}}/></div>}
            <div><label style={sL()}>E-mail</label><input style={sI()} type="email" placeholder="voce@empresa.com.br" value={email} onChange={function(e){setEmail(e.target.value);}}/></div>
            <div><label style={sL()}>Senha</label><input style={sI()} type="password" placeholder="Sua senha" value={senha} onChange={function(e){setSenha(e.target.value);}}/></div>
            {err&&<div style={{background:"#fff5f5",border:"1px solid #fed7d7",borderRadius:8,padding:"10px 14px",color:DG,fontSize:13}}>{err}</div>}
            <button style={sP({width:"100%",justifyContent:"center",padding:"13px",fontSize:15})} onClick={handle} disabled={loading}>
              {loading?<><span className="spin" style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%"}}/> Autenticando...</>:(tab==="login"?"Entrar no Portal":"Criar conta gratuita")}
            </button>
          </div>
          <div style={{marginTop:20,textAlign:"center",fontSize:12,color:TXL,background:"#f0f4f8",borderRadius:8,padding:10}}>
            💡 Demo: use qualquer e-mail e senha para entrar
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Shell ── */
function Shell(props) {
  var page=props.page, setPage=props.setPage, user=props.user, onLogout=props.onLogout, plano=props.plano, onOpenPlanos=props.onOpenPlanos;
  var initials=(user.nome||"U").split(" ").map(function(w){return w[0];}).slice(0,2).join("").toUpperCase();
  var planoInfo=PLANOS.find(function(p){return p.id===plano.id;})||PLANOS[0];
  var nav=[
    {id:"dashboard",icon:"home",label:"Dashboard"},
    {id:"fornecedores",icon:"users",label:"Fornecedores"},
    {id:"calculadora",icon:"calc",label:"Calculadora"},
  ];
  return (
    <div style={{display:"flex",height:"100vh",overflow:"hidden",fontFamily:"Inter,sans-serif"}}>
      <style>{G}</style>
      <div style={{width:SIDEBAR_W,minWidth:SIDEBAR_W,background:WH,borderRight:"1px solid "+BD,display:"flex",flexDirection:"column",padding:"20px 12px",height:"100vh",overflowY:"auto"}}>
        <div style={{padding:"4px 6px 20px"}}><Logo/></div>
        {/* Badge plano */}
        <div onClick={onOpenPlanos} style={{background:planoInfo.corBg,borderRadius:8,padding:"9px 12px",marginBottom:16,display:"flex",alignItems:"center",gap:8,cursor:"pointer",border:"1px solid transparent",transition:"border-color .2s"}}
          onMouseEnter={function(e){e.currentTarget.style.borderColor=planoInfo.cor;}} onMouseLeave={function(e){e.currentTarget.style.borderColor="transparent";}}>
          <Icon n={plano.id==="free"?"zap":plano.id==="pro"?"star":"crown"} s={14} c={planoInfo.cor}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,fontWeight:600,color:planoInfo.cor}}>Plano {plano.nome}</div>
            <div style={{fontSize:11,color:TXL}}>{plano.limite===Infinity?"Ilimitado":"Até "+plano.limite+" produtos"}</div>
          </div>
          <Icon n="arr" s={12} c={planoInfo.cor}/>
        </div>
        <div style={{fontSize:11,fontWeight:600,color:TXL,textTransform:"uppercase",letterSpacing:".8px",padding:"0 8px",marginBottom:8}}>Menu</div>
        {nav.map(function(n){
          var active=page===n.id;
          return (
            <div key={n.id} onClick={function(){setPage(n.id);}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,cursor:"pointer",fontSize:14,fontWeight:500,color:active?BR:TXM,background:active?BRL:"transparent",marginBottom:2,transition:"all .15s"}}>
              <Icon n={n.icon} s={17} c={active?BR:TXL}/>
              {n.label}
              {n.id==="calculadora"&&<span style={{marginLeft:"auto",background:BRL,color:BR,fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:4}}>IA</span>}
            </div>
          );
        })}
        <div style={{marginTop:"auto"}}>
          <div style={{height:1,background:BD,margin:"16px 0"}}/>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px"}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:BRL,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,color:BR,flexShrink:0}}>{initials}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,color:TX,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.nome}</div>
              <div style={{fontSize:11,color:TXL,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.empresa}</div>
            </div>
          </div>
          <button style={sG({color:DG,width:"100%",justifyContent:"flex-start",fontSize:13})} onClick={onLogout}>
            <Icon n="logout" s={15} c={DG}/> Sair
          </button>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",background:BG,position:"relative"}}>
        {props.children}
      </div>
    </div>
  );
}

/* ── Dashboard ── */
function Dashboard(props) {
  var user=props.user, forn=props.forn, setPage=props.setPage, plano=props.plano, onOpenPlanos=props.onOpenPlanos;
  var hora=new Date().getHours();
  var saud=hora<12?"Bom dia":hora<18?"Boa tarde":"Boa noite";
  var nome=(user.nome||"usuário").split(" ")[0];
  var stats=[
    {label:"Fornecedores ativos",value:forn.length,icon:"users",color:BR},
    {label:"Simulações realizadas",value:24,icon:"calc",color:"#7c3aed"},
    {label:"Produtos analisados",value:"1.247",icon:"tag",color:ACC},
    {label:"Economia identificada",value:"R$ 48k",icon:"chart",color:"#e67e22"},
  ];
  return (
    <div style={{padding:32}} className="fi">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
        <div>
          <h1 style={{fontSize:24,fontWeight:700,color:TX,marginBottom:4}}>{saud}, {nome} 👋</h1>
          <p style={{color:TXL,fontSize:14}}>Portal Mutuus — Gestão Tributária Inteligente</p>
        </div>
        <button style={sP()} onClick={function(){setPage("calculadora");}}>
          <Icon n="spark" s={16} c="#fff"/> Nova Simulação
        </button>
      </div>

      {plano.id==="free"&&(
        <div style={{background:"linear-gradient(135deg,#f5f3ff,#ede9fe)",border:"1px solid #c4b5fd",borderRadius:12,padding:"16px 20px",marginBottom:20,display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:36,height:36,background:"#7c3aed",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon n="crown" s={18} c="#fff"/></div>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,fontSize:14,color:"#4c1d95",marginBottom:2}}>Você está no plano Free — limite de 3 produtos</div>
            <div style={{fontSize:13,color:"#6d28d9"}}>Faça upgrade para processar até 200 produtos por simulação.</div>
          </div>
          <button style={sP({background:"#7c3aed",fontSize:13,padding:"8px 16px",flexShrink:0})} onClick={onOpenPlanos}>Ver planos</button>
        </div>
      )}

      <div style={{background:"linear-gradient(135deg,#fff7ed,#fef3c7)",border:"1px solid #fbbf24",borderRadius:12,padding:"16px 20px",marginBottom:24,display:"flex",alignItems:"center",gap:14}}>
        <div style={{width:36,height:36,background:"#f59e0b",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon n="shield" s={18} c="#fff"/></div>
        <div style={{flex:1}}>
          <div style={{fontWeight:600,fontSize:14,color:"#92400e",marginBottom:2}}>Atenção: Reforma Tributária 2027</div>
          <div style={{fontSize:13,color:"#78350f"}}>A implementação do IBS + CBS exige recálculo de preços. Faltam <strong>~18 meses</strong> para vigência.</div>
        </div>
        <button style={sP({background:"#d97706",fontSize:13,padding:"8px 16px",flexShrink:0})} onClick={function(){setPage("calculadora");}}>Simular</button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
        {stats.map(function(s,i){
          return (
            <div key={i} className="fi" style={{background:WH,borderRadius:12,border:"1px solid "+BD,padding:20,borderTop:"3px solid "+s.color,animationDelay:(i*0.08)+"s"}}>
              <div style={{width:36,height:36,borderRadius:10,background:s.color+"18",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12}}><Icon n={s.icon} s={18} c={s.color}/></div>
              <div style={{fontSize:26,fontWeight:700,color:TX,marginBottom:3}}>{s.value}</div>
              <div style={{fontSize:12,color:TXL}}>{s.label}</div>
            </div>
          );
        })}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div style={sC()}>
          <h3 style={{fontSize:15,fontWeight:600,color:TX,marginBottom:16,display:"flex",alignItems:"center",gap:8}}><Icon n="spark" s={16} c={BR}/> Ações rápidas</h3>
          {[
            {l:"Calcular impacto tributário",sub:"Upload de planilha",icon:"calc",action:function(){setPage("calculadora");}},
            {l:"Cadastrar fornecedor",sub:"Novo fornecedor",icon:"plus",action:function(){setPage("fornecedores");}},
            {l:"Gerenciar assinatura",sub:"Plano "+plano.nome,icon:"star",action:onOpenPlanos},
          ].map(function(a,i){
            return (
              <div key={i} onClick={a.action} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:10,border:"1px solid "+BD,cursor:"pointer",marginBottom:8,transition:"border-color .2s"}}
                onMouseEnter={function(e){e.currentTarget.style.borderColor=BR;}} onMouseLeave={function(e){e.currentTarget.style.borderColor=BD;}}>
                <div style={{width:34,height:34,borderRadius:8,background:BRL,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon n={a.icon} s={16} c={BR}/></div>
                <div><div style={{fontSize:14,fontWeight:500,color:TX}}>{a.l}</div><div style={{fontSize:12,color:TXL}}>{a.sub}</div></div>
              </div>
            );
          })}
        </div>
        <div style={sC()}>
          <h3 style={{fontSize:15,fontWeight:600,color:TX,marginBottom:16,display:"flex",alignItems:"center",gap:8}}><Icon n="file" s={16} c={BR}/> Últimas simulações</h3>
          {[{n:"Produtos TechBrasil Q1",d:"Hoje, 14:32",imp:"+18.4%",q:47},{n:"Alimentos Norte — Linha A",d:"Ontem, 09:15",imp:"+22.1%",q:83},{n:"Pharma Solutions Mix",d:"17/03, 16:00",imp:"+12.7%",q:31}].map(function(s,i){
            return (
              <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 12px",borderRadius:8,background:"#fafbfc",border:"1px solid "+BD,marginBottom:8}}>
                <div><div style={{fontSize:13,fontWeight:500,color:TX}}>{s.n}</div><div style={{fontSize:12,color:TXL}}>{s.d} · {s.q} produtos</div></div>
                <Badge type="warn">{s.imp}</Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Fornecedores ── */
function FornPage(props) {
  var forn=props.forn, setForn=props.setForn, showToast=props.showToast, setPage=props.setPage;
  var [modal,setModal]=useState(false);
  var [search,setSearch]=useState("");
  var [fNome,setFNome]=useState(""), [fCnpj,setFCnpj]=useState(""), [fSetor,setFSetor]=useState("Tecnologia"), [fContato,setFContato]=useState(""), [editId,setEditId]=useState(null);
  var setores=["Tecnologia","Alimentação","Farmacêutico","Varejo","Serviços","Indústria","Saúde","Outro"];
  var filtered=forn.filter(function(x){return x.nome.toLowerCase().indexOf(search.toLowerCase())>=0||x.setor.toLowerCase().indexOf(search.toLowerCase())>=0;});
  function openAdd(){setFNome("");setFCnpj("");setFSetor("Tecnologia");setFContato("");setEditId(null);setModal(true);}
  function openEdit(x){setFNome(x.nome);setFCnpj(x.cnpj);setFSetor(x.setor);setFContato(x.contato);setEditId(x.id);setModal(true);}
  function save(){
    if(!fNome||!fCnpj){showToast("Preencha nome e CNPJ.","error");return;}
    if(editId){setForn(forn.map(function(x){return x.id===editId?{id:editId,nome:fNome,cnpj:fCnpj,setor:fSetor,contato:fContato}:x;}));showToast("Atualizado!","success");}
    else{setForn(forn.concat([{id:Date.now(),nome:fNome,cnpj:fCnpj,setor:fSetor,contato:fContato}]));showToast("Cadastrado!","success");}
    setModal(false);
  }
  return (
    <div style={{padding:32}} className="fi">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
        <div><h1 style={{fontSize:24,fontWeight:700,color:TX}}>Fornecedores</h1><p style={{color:TXL,fontSize:14,marginTop:3}}>{forn.length} cadastrados</p></div>
        <button style={sP()} onClick={openAdd}><Icon n="plus" s={16} c="#fff"/> Novo fornecedor</button>
      </div>
      <div style={sC({marginBottom:16,padding:"14px 16px"})}><input style={sI()} placeholder="🔍  Buscar por nome ou setor..." value={search} onChange={function(e){setSearch(e.target.value);}}/></div>
      <div style={{borderRadius:10,border:"1px solid "+BD,overflow:"hidden",background:WH}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
            <thead style={{background:"#f8fafc"}}><tr>{["Fornecedor","CNPJ","Setor","Contato","Status","Ações"].map(function(h){return <th key={h} style={{padding:"11px 16px",textAlign:"left",fontWeight:600,fontSize:12,color:TXL,textTransform:"uppercase",letterSpacing:".5px",borderBottom:"1px solid "+BD}}>{h}</th>;})}</tr></thead>
            <tbody>
              {filtered.length===0&&<tr><td colSpan={6} style={{textAlign:"center",color:TXL,padding:40}}>Nenhum fornecedor encontrado.</td></tr>}
              {filtered.map(function(x){
                return (
                  <tr key={x.id} style={{borderBottom:"1px solid #f0f4f8"}}>
                    <td style={{padding:"13px 16px"}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:34,height:34,borderRadius:8,background:BRL,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,color:BR,flexShrink:0}}>{x.nome[0]}</div><span style={{fontWeight:500}}>{x.nome}</span></div></td>
                    <td style={{padding:"13px 16px",color:TXM,fontFamily:"monospace",fontSize:12}}>{x.cnpj}</td>
                    <td style={{padding:"13px 16px"}}><Badge type="info">{x.setor}</Badge></td>
                    <td style={{padding:"13px 16px",color:TXM,fontSize:13}}>{x.contato}</td>
                    <td style={{padding:"13px 16px"}}><Badge type="success">● Ativo</Badge></td>
                    <td style={{padding:"13px 16px"}}><div style={{display:"flex",gap:4}}>
                      <button style={sG({padding:"6px 9px"})} onClick={function(){openEdit(x);}}><Icon n="edit" s={14}/></button>
                      <button style={sG({padding:"6px 9px",color:DG})} onClick={function(){setForn(forn.filter(function(f){return f.id!==x.id;}));showToast("Removido.","info");}}><Icon n="trash" s={14} c={DG}/></button>
                      <button style={sG({padding:"6px 9px",color:BR})} onClick={function(){setPage("calculadora");}}><Icon n="calc" s={14} c={BR}/></button>
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={modal} onClose={function(){setModal(false);}} style={{width:"min(500px,92vw)",padding:32}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <h2 style={{fontSize:19,fontWeight:700,color:TX}}>{editId?"Editar Fornecedor":"Novo Fornecedor"}</h2>
          <button style={sG({padding:"6px 9px"})} onClick={function(){setModal(false);}}><Icon n="x" s={18}/></button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div><label style={sL()}>Nome / Razão Social</label><input style={sI()} placeholder="Ex: TechBrasil Ltda" value={fNome} onChange={function(e){setFNome(e.target.value);}}/></div>
          <div><label style={sL()}>CNPJ</label><input style={sI()} placeholder="00.000.000/0001-00" value={fCnpj} onChange={function(e){setFCnpj(e.target.value);}}/></div>
          <div><label style={sL()}>E-mail de contato</label><input style={sI()} placeholder="comercial@empresa.com.br" value={fContato} onChange={function(e){setFContato(e.target.value);}}/></div>
          <div><label style={sL()}>Setor</label><select style={sI()} value={fSetor} onChange={function(e){setFSetor(e.target.value);}}>{setores.map(function(s){return <option key={s}>{s}</option>;})}</select></div>
          <div style={{display:"flex",gap:12,marginTop:6}}>
            <button style={sS({flex:1,justifyContent:"center"})} onClick={function(){setModal(false);}}>Cancelar</button>
            <button style={sP({flex:1,justifyContent:"center"})} onClick={save}><Icon n="chk" s={15} c="#fff"/> Salvar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ── Calculadora ── */
function Calc(props) {
  var forn=props.forn, showToast=props.showToast, setPage=props.setPage, plano=props.plano, onOpenPlanos=props.onOpenPlanos;
  var [step,setStep]=useState(1);
  var [selForn,setSelForn]=useState(null);
  var [mode,setMode]=useState("upload");
  var [rawData,setRawData]=useState([]);
  var [result,setResult]=useState(null);
  var [loading,setLoading]=useState(false);
  var [loadMsg,setLoadMsg]=useState("");
  var [prog,setProg]=useState(0);
  var [drag,setDrag]=useState(false);
  var [manRows,setManRows]=useState([{produto:"",preco:"",incide:"sim"}]);
  var [limitModal,setLimitModal]=useState(false);
  var fileRef=useRef();

  function runCalc(data){
    if(data.length>plano.limite){setLimitModal(true);return;}
    setLoading(true);
    var msgs=["Analisando estrutura tributária...","Aplicando alíquotas IBS + CBS (Reforma 2027)...","Calculando impacto nos preços...","Gerando insights..."];
    var i=0;
    function next(){
      if(i<msgs.length){setLoadMsg(msgs[i]);setProg((i+1)*25);i++;setTimeout(next,750);}
      else{
        var res=data.map(function(row){
          var pr=parseFloat(String(row.preco||row["Preço Atual"]||"0").replace(",","."))||0;
          var inc=["sim","yes","s","true","1"].indexOf(String(row.incide||row["Incide Nova Tributação"]||"sim").toLowerCase())>=0;
          return{produto:row.produto||row["Produto"]||"Produto",precoAtual:pr,incide:inc,precoAtualizado:inc?pr*(1+TAX_RATE):pr,variacao:inc?TAX_RATE*100:0};
        });
        setResult(res);setLoading(false);setStep(3);
        showToast("Planilha processada com sucesso!","success");
      }
    }
    next();
  }

  function handleFile(file){
    if(!file)return;
    function doRead(XLSX){
      var reader=new FileReader();
      reader.onload=function(e){
        var wb=XLSX.read(e.target.result,{type:"binary"});
        var ws=wb.Sheets[wb.SheetNames[0]];
        var data=XLSX.utils.sheet_to_json(ws);
        if(data.length===0){showToast("Arquivo vazio.","error");return;}
        setRawData(data);showToast(data.length+" produtos carregados!","success");
      };
      reader.readAsBinaryString(file);
    }
    if(window.XLSX){doRead(window.XLSX);}
    else{var s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";s.onload=function(){doRead(window.XLSX);};document.head.appendChild(s);}
  }

  function doCalc(){
    var data=mode==="manual"?manRows.filter(function(r){return r.produto&&r.preco;}):rawData;
    if(data.length===0){showToast("Adicione produtos primeiro.","error");return;}
    runCalc(data);
  }

  function dlCSV(){
    if(!result)return;
    var rows=[["Produto","Preço Atual","Incide","Preço Atualizado","Variação"]].concat(result.map(function(r){return[r.produto,r.precoAtual.toFixed(2),r.incide?"Sim":"Não",r.precoAtualizado.toFixed(2),r.variacao.toFixed(1)+"%"];}));
    var csv=rows.map(function(r){return r.join(";");}).join("\n");
    var a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"}));a.download="mutuus_tributacao_2027.csv";a.click();
    showToast("CSV exportado!","success");
  }

  function dlXLSX(){
    if(!result)return;
    function write(XLSX){
      var ws=XLSX.utils.json_to_sheet(result.map(function(r){return{"Produto":r.produto,"Preço Atual (R$)":r.precoAtual.toFixed(2),"Incide":r.incide?"Sim":"Não","Preço Atualizado (R$)":r.precoAtualizado.toFixed(2),"Variação (%)":r.variacao.toFixed(1)+"%"};}));
      var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,"Tributação 2027");XLSX.writeFile(wb,"mutuus_tributacao_2027.xlsx");
      showToast("XLSX baixado!","success");
    }
    if(window.XLSX){write(window.XLSX);}else{var s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";s.onload=function(){write(window.XLSX);};document.head.appendChild(s);}
  }

  var ins=result?{alt:result.filter(function(r){return r.incide;}).length,nAlt:result.filter(function(r){return!r.incide;}).length,totA:result.reduce(function(s,r){return s+r.precoAtual;},0),totN:result.reduce(function(s,r){return s+r.precoAtualizado;},0)}:null;
  function dot(n){return{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0,background:step>n?SC:step===n?BR:"#e2e8f0",color:(step>n||step===n)?"#fff":TXL,boxShadow:step===n?"0 0 0 4px rgba(22,104,140,.2)":"none"};}

  return (
    <div style={{padding:32}} className="fi">
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:24,fontWeight:700,color:TX}}>Calculadora Tributária</h1>
        <p style={{color:TXL,fontSize:14,marginTop:3}}>Calcule o impacto do IBS + CBS · Plano {plano.nome}: {plano.limite===Infinity?"ilimitado":"até "+plano.limite+" produtos"}</p>
      </div>
      <div style={{display:"flex",alignItems:"center",marginBottom:28}}>
        {[{n:1,l:"Fornecedor"},{n:2,l:"Produtos"},{n:3,l:"Resultado"}].map(function(s,i,arr){
          return (
            <div key={s.n} style={{display:"flex",alignItems:"center",flex:i<arr.length-1?1:"auto",gap:8}}>
              <div style={dot(s.n)}>{step>s.n?<Icon n="chk" s={12} c="#fff"/>:s.n}</div>
              <span style={{fontSize:13,fontWeight:step===s.n?600:400,color:step===s.n?TX:TXL,whiteSpace:"nowrap"}}>{s.l}</span>
              {i<arr.length-1&&<div style={{flex:1,height:2,background:step>s.n?SC:"#e2e8f0",margin:"0 10px",borderRadius:1}}/>}
            </div>
          );
        })}
      </div>

      {step===1&&(
        <div style={sC({maxWidth:580})} className="fi">
          <h2 style={{fontSize:17,fontWeight:600,color:TX,marginBottom:5}}>Selecionar Fornecedor</h2>
          <p style={{color:TXL,fontSize:14,marginBottom:18}}>Escolha o fornecedor para esta simulação</p>
          {forn.map(function(f){var sel=selForn&&selForn.id===f.id;return(
            <div key={f.id} onClick={function(){setSelForn(f);}} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:10,border:"2px solid "+(sel?BR:BD),cursor:"pointer",marginBottom:10,background:sel?BRL:WH,transition:"all .2s"}}>
              <div style={{width:38,height:38,borderRadius:10,background:sel?BR:BRL,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:sel?WH:BR,fontSize:16,flexShrink:0}}>{f.nome[0]}</div>
              <div><div style={{fontWeight:500,fontSize:14,color:TX}}>{f.nome}</div><div style={{fontSize:12,color:TXL}}>{f.setor} · {f.cnpj}</div></div>
              {sel&&<div style={{marginLeft:"auto"}}><Icon n="chk" s={18} c={BR}/></div>}
            </div>
          );})}
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <button style={sS({padding:"10px 14px"})} onClick={function(){setPage("fornecedores");}}><Icon n="plus" s={14} c={BR}/> Novo</button>
            <button style={sP({flex:1,justifyContent:"center",opacity:selForn?1:0.5})} disabled={!selForn} onClick={function(){setStep(2);}}>Continuar <Icon n="arr" s={15} c="#fff"/></button>
          </div>
        </div>
      )}

      {step===2&&!loading&&(
        <div className="fi" style={{maxWidth:680}}>
          <div style={{display:"flex",gap:4,marginBottom:16}}>
            {[["upload","up","Enviar Planilha"],["manual","edit","Inserção Manual"]].map(function(m){
              return <button key={m[0]} onClick={function(){setMode(m[0]);setRawData([]);}} style={{padding:"8px 16px",borderRadius:8,fontSize:14,fontWeight:500,cursor:"pointer",border:"none",background:mode===m[0]?BRL:"transparent",color:mode===m[0]?BR:TXM,display:"inline-flex",alignItems:"center",gap:6}}><Icon n={m[1]} s={14}/>{m[2]}</button>;
            })}
          </div>
          {mode==="upload"?(
            <div style={sC()}>
              <div style={{border:"2px dashed "+(drag?BR:BD),borderRadius:12,padding:"40px 24px",textAlign:"center",cursor:"pointer",background:drag?BRL:WH}}
                onClick={function(){if(fileRef.current)fileRef.current.click();}}
                onDragOver={function(e){e.preventDefault();setDrag(true);}} onDragLeave={function(){setDrag(false);}}
                onDrop={function(e){e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0]);}}>
                <div style={{width:52,height:52,borderRadius:14,background:BRL,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><Icon n="up" s={24} c={BR}/></div>
                <p style={{fontSize:15,fontWeight:600,color:TX,marginBottom:6}}>Arraste sua planilha ou clique para selecionar</p>
                <p style={{fontSize:13,color:TXL,marginBottom:14}}>CSV, XLSX, XLS · Máximo 10MB</p>
                <div style={{background:"#f0f4f8",borderRadius:8,padding:"8px 14px",display:"inline-block",fontSize:12,color:TXM,fontFamily:"monospace"}}>Produto | Preço Atual | Incide Nova Tributação</div>
                <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" style={{display:"none"}} onChange={function(e){handleFile(e.target.files[0]);}}/>
              </div>
              <div style={{marginTop:14}}>
                {rawData.length>0
                  ?<div style={{background:"#e6faf0",border:"1px solid #9ae6b4",borderRadius:8,padding:"10px 14px",display:"flex",alignItems:"center",gap:8,fontSize:13,color:"#276749"}}><Icon n="chk" s={16} c={SC}/><strong>{rawData.length} produtos</strong> carregados!</div>
                  :<button style={sS({fontSize:13,padding:"9px 14px"})} onClick={function(){setRawData(MOCK_PRODS);showToast("8 produtos de exemplo carregados!","success");}}>📋 Usar dados de exemplo</button>
                }
              </div>
            </div>
          ):(
            <div style={sC()}>
              <h3 style={{fontSize:15,fontWeight:600,color:TX,marginBottom:14}}>Inserir produtos manualmente</h3>
              <div style={{borderRadius:8,border:"1px solid "+BD,overflow:"hidden",marginBottom:12}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
                  <thead style={{background:"#f8fafc"}}><tr>{["Produto","Preço (R$)","Incide",""].map(function(h){return <th key={h} style={{padding:"10px 12px",textAlign:"left",fontWeight:600,fontSize:12,color:TXL,borderBottom:"1px solid "+BD}}>{h}</th>;})}</tr></thead>
                  <tbody>
                    {manRows.map(function(r,i){return(
                      <tr key={i} style={{borderBottom:"1px solid #f0f4f8"}}>
                        <td style={{padding:"8px 10px"}}><input style={sI({padding:"7px 10px"})} placeholder="Nome" value={r.produto} onChange={function(e){var n=manRows.slice();n[i]=Object.assign({},n[i],{produto:e.target.value});setManRows(n);}}/></td>
                        <td style={{padding:"8px 10px"}}><input style={sI({padding:"7px 10px"})} type="number" placeholder="0,00" value={r.preco} onChange={function(e){var n=manRows.slice();n[i]=Object.assign({},n[i],{preco:e.target.value});setManRows(n);}}/></td>
                        <td style={{padding:"8px 10px"}}><select style={sI({padding:"7px 10px"})} value={r.incide} onChange={function(e){var n=manRows.slice();n[i]=Object.assign({},n[i],{incide:e.target.value});setManRows(n);}}><option value="sim">Sim</option><option value="não">Não</option></select></td>
                        <td style={{padding:"8px 10px"}}><button style={sG({padding:"6px 8px",color:DG})} onClick={function(){setManRows(manRows.filter(function(_,j){return j!==i;}));}}><Icon n="trash" s={14} c={DG}/></button></td>
                      </tr>
                    );})}
                  </tbody>
                </table>
              </div>
              <button style={sG()} onClick={function(){setManRows(manRows.concat([{produto:"",preco:"",incide:"sim"}]));}}><Icon n="plus" s={14}/> Adicionar linha</button>
            </div>
          )}
          <div style={{display:"flex",gap:12,marginTop:18}}>
            <button style={sS()} onClick={function(){setStep(1);setRawData([]);}}>← Voltar</button>
            <button style={sP({flex:1,justifyContent:"center"})} onClick={doCalc}><Icon n="spark" s={15} c="#fff"/> Calcular impacto tributário</button>
          </div>
        </div>
      )}

      {loading&&(
        <div style={sC({maxWidth:460,textAlign:"center",padding:48})} className="fi">
          <div style={{width:60,height:60,borderRadius:"50%",background:BRL,margin:"0 auto 18px",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span className="spin" style={{width:30,height:30,border:"3px solid "+BRL,borderTopColor:BR,borderRadius:"50%"}}/>
          </div>
          <h3 style={{fontSize:16,fontWeight:600,color:TX,marginBottom:8}}>Processando dados tributários</h3>
          <p className="pulse" style={{color:TXL,fontSize:14,marginBottom:22,minHeight:20}}>{loadMsg}</p>
          <div style={{height:6,background:"#e2e8f0",borderRadius:3,overflow:"hidden",marginBottom:8}}>
            <div style={{height:"100%",background:"linear-gradient(90deg,"+BR+","+ACC+")",borderRadius:3,transition:"width .5s",width:prog+"%"}}/>
          </div>
          <p style={{fontSize:12,color:TXL}}>{prog}% concluído</p>
        </div>
      )}

      {step===3&&result&&ins&&(
        <div className="fi">
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
            {[{l:"Analisados",v:result.length,ic:"tag",co:BR},{l:"Com aumento",v:ins.alt,ic:"chart",co:DG},{l:"Sem alteração",v:ins.nAlt,ic:"chk",co:SC},{l:"Impacto médio",v:"+"+(TAX_RATE*100).toFixed(1)+"%",ic:"spark",co:"#e67e22"}].map(function(s,i){
              return(<div key={i} className="fi" style={{background:WH,borderRadius:12,border:"1px solid "+BD,padding:18,borderTop:"3px solid "+s.co,animationDelay:(i*0.07)+"s"}}>
                <div style={{width:32,height:32,borderRadius:8,background:s.co+"18",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}><Icon n={s.ic} s={15} c={s.co}/></div>
                <div style={{fontSize:24,fontWeight:700,color:TX,marginBottom:3}}>{s.v}</div>
                <div style={{fontSize:12,color:TXL}}>{s.l}</div>
              </div>);
            })}
          </div>
          <div style={{background:"linear-gradient(135deg,"+BRL+",#e8faf7)",border:"1px solid rgba(22,104,140,.2)",borderRadius:12,padding:"16px 20px",marginBottom:18,display:"flex",gap:14}}>
            <Icon n="spark" s={22} c={BR}/>
            <div><div style={{fontWeight:600,fontSize:14,color:TX,marginBottom:4}}>Análise de Impacto — {selForn?selForn.nome:""}</div>
            <div style={{fontSize:13,color:TXM}}><strong>{ins.alt}</strong> produtos com aumento médio de <strong>+{(TAX_RATE*100).toFixed(1)}%</strong>. Total: R$ {ins.totA.toLocaleString("pt-BR",{minimumFractionDigits:2})} → R$ {ins.totN.toLocaleString("pt-BR",{minimumFractionDigits:2})}.</div></div>
          </div>
          <div style={sC({padding:0,marginBottom:18})}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",borderBottom:"1px solid "+BD}}>
              <h3 style={{fontWeight:600,fontSize:15,color:TX}}>Produtos atualizados</h3>
              <div style={{display:"flex",gap:8}}><Badge type="warn">{ins.alt} alterados</Badge><Badge type="success">{ins.nAlt} sem mudança</Badge></div>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
                <thead style={{background:"#f8fafc"}}><tr>{["Produto","Preço Atual","Tributação","Preço Atualizado","Variação"].map(function(h){return<th key={h} style={{padding:"10px 16px",textAlign:"left",fontWeight:600,fontSize:12,color:TXL,textTransform:"uppercase",letterSpacing:".4px",borderBottom:"1px solid "+BD}}>{h}</th>;})}</tr></thead>
                <tbody>
                  {result.map(function(r,i){return(
                    <tr key={i} style={{borderBottom:"1px solid #f0f4f8",background:r.incide?"#fffbeb":WH}}>
                      <td style={{padding:"12px 16px",fontWeight:500,borderLeft:r.incide?"3px solid "+WN:"3px solid transparent"}}>{r.produto}</td>
                      <td style={{padding:"12px 16px"}}>R$ {r.precoAtual.toLocaleString("pt-BR",{minimumFractionDigits:2})}</td>
                      <td style={{padding:"12px 16px"}}><Badge type={r.incide?"warn":"success"}>{r.incide?"Incide":"Isento"}</Badge></td>
                      <td style={{padding:"12px 16px",fontWeight:600,color:r.incide?DG:SC}}>R$ {r.precoAtualizado.toLocaleString("pt-BR",{minimumFractionDigits:2})}</td>
                      <td style={{padding:"12px 16px"}}>{r.incide?<span style={{color:DG,fontWeight:600}}>+{r.variacao.toFixed(1)}%</span>:<span style={{color:SC}}>—</span>}</td>
                    </tr>
                  );})}
                </tbody>
              </table>
            </div>
          </div>
          <div style={sC({background:"linear-gradient(135deg,"+BRL+",#fff)",border:"1px solid rgba(22,104,140,.2)"})}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14}}>
              <div><h3 style={{fontWeight:600,fontSize:15,color:TX,marginBottom:4}}>✅ Sua planilha está pronta!</h3><p style={{color:TXL,fontSize:13}}>Baixe com os preços atualizados para a Reforma Tributária 2027.</p></div>
              <div style={{display:"flex",gap:10}}>
                <button style={sS({fontSize:13,padding:"9px 14px"})} onClick={dlCSV}><Icon n="dl" s={15} c={BR}/> CSV</button>
                <button style={sP({fontSize:13})} onClick={dlXLSX}><Icon n="dl" s={15} c="#fff"/> XLSX</button>
              </div>
            </div>
          </div>
          <button style={sG({marginTop:14})} onClick={function(){setStep(1);setResult(null);setRawData([]);setSelForn(null);setManRows([{produto:"",preco:"",incide:"sim"}]);}}>← Nova simulação</button>
        </div>
      )}

      {/* Modal limite */}
      <Modal open={limitModal} onClose={function(){setLimitModal(false);}} style={{width:"min(420px,92vw)",padding:36}}>
        <div style={{textAlign:"center"}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:"#f5f3ff",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
            <Icon n="lock" s={28} c="#7c3aed"/>
          </div>
          <h2 style={{fontSize:20,fontWeight:700,color:TX,marginBottom:10}}>Limite do plano atingido</h2>
          <p style={{color:TXM,fontSize:14,lineHeight:1.7,marginBottom:24}}>
            Seu plano <strong>{plano.nome}</strong> permite até <strong>{plano.limite} produto{plano.limite>1?"s":""}</strong> por simulação. Faça upgrade para continuar.
          </p>
          <div style={{display:"flex",gap:12,justifyContent:"center"}}>
            <button style={sS()} onClick={function(){setLimitModal(false);}}>Cancelar</button>
            <button style={sP({background:"#7c3aed"})} onClick={function(){setLimitModal(false);onOpenPlanos();}}>
              <Icon n="crown" s={16} c="#fff"/> Ver planos
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ── App ── */
export default function App() {
  var [user,setUser]=useState(null);
  var [plano,setPlano]=useState(null);
  var [page,setPage]=useState("dashboard");
  var [toast,setToast]=useState(null);
  var [forn,setForn]=useState(MOCK_FORN);
  var [modalPlanos,setModalPlanos]=useState(false);

  function showToast(msg,type){setToast({msg:msg,type:type||"success"});setTimeout(function(){setToast(null);},3500);}

  function handleLogin(u){
    setUser(u);
    setPlano(PLANOS[0]); // começa no free
    setModalPlanos(true); // abre modal de planos imediatamente após login
    setPage("dashboard");
  }

  function handleSelectPlano(p){
    setPlano(p);
    setModalPlanos(false);
    showToast("Plano "+p.nome+" ativado com sucesso!","success");
  }

  if(!user) return <LoginPage onLogin={handleLogin}/>;

  return (
    <div>
      <style>{G}</style>
      <Toast t={toast}/>
      <Shell user={user} page={page} setPage={setPage} plano={plano||PLANOS[0]} onOpenPlanos={function(){setModalPlanos(true);}} onLogout={function(){setUser(null);setPlano(null);}}>
        {page==="dashboard"&&<Dashboard user={user} forn={forn} setPage={setPage} plano={plano||PLANOS[0]} onOpenPlanos={function(){setModalPlanos(true);}}/>}
        {page==="fornecedores"&&<FornPage forn={forn} setForn={setForn} showToast={showToast} setPage={setPage}/>}
        {page==="calculadora"&&<Calc forn={forn} showToast={showToast} setPage={setPage} plano={plano||PLANOS[0]} onOpenPlanos={function(){setModalPlanos(true);}}/>}
      </Shell>
      <ModalPlanos open={modalPlanos} onClose={function(){setModalPlanos(false);}} planoAtual={plano||PLANOS[0]} onSelect={handleSelectPlano}/>
    </div>
  );
}
