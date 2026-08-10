import{r,j as e,L as h}from"./index-vRNfvYmZ.js";const i=`> My name is Richard Dean. My journey into technology began at age 12 when my Father gave me a Raspberry Pi. That small, unassuming board sparked a persistent drive to explore hardware, Linux, and secure systems. Over the years, I've expanded my skills through robotics, modular computing projects, and Linux-first devices.

> In 2025 I founded 1337 Wing. Our mission is to develop modular, Linux-first hardware with maximum durability, tactical usability, and adaptability for security professionals and open-source communities. Each product is built with modularity, repairability, and precision in mind.

> Outside of development, I focus on personal projects, tech experimentation, and enjoying Vietnamese coffee as I map out the next innovation in secure technology.

> Core Focus Areas:
  ▸ Modular, repairable, and upgradeable devices
  ▸ Linux-first, open-source hardware ecosystem
  ▸ Tools designed for real-world security applications
  ▸ Community education and responsible knowledge sharing`;function x(){const[u,a]=r.useState(""),[s,c]=r.useState(!1),o=r.useRef(0),t=r.useRef(null),n=r.useRef(null),p=()=>{n.current&&clearTimeout(n.current),o.current=i.length,a(i),c(!0)};return r.useEffect(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){a(i),c(!0);return}function d(){if(o.current<i.length){const l=i[o.current];a(f=>f+l),o.current++;const m=l===`
`?50:15;n.current=setTimeout(d,m),t.current&&(t.current.scrollTop=t.current.scrollHeight)}else c(!0)}return d(),()=>{n.current&&clearTimeout(n.current)}},[]),e.jsxs("div",{style:{margin:0,fontFamily:"'Courier New', Courier, monospace",background:"#000814",color:"#B9D9EB",display:"flex",justifyContent:"center",alignItems:"flex-start",minHeight:"100vh",padding:"60px 20px"},children:[e.jsx("style",{children:`
        @keyframes glow {
          from { box-shadow: 0 0 10px rgba(0,255,156,0.2); }
          to   { box-shadow: 0 0 25px rgba(0,255,156,0.5); }
        }
        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }
        .bio-back:hover {
          background: #00FF9C !important;
          color: #001429 !important;
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}),e.jsxs("div",{style:{background:"black",color:"#00ff9c",padding:20,fontFamily:"monospace",border:"1px solid #B9D9EB",margin:"40px auto",maxWidth:900,width:"100%",minHeight:100,animation:"glow 2s infinite alternate"},children:[e.jsx("h1",{className:"sr-only",children:"Our Story — Richard Dean, Founder of 1337 Wing"}),!s&&e.jsx("button",{onClick:p,style:{background:"transparent",color:"#00FF9C",border:"1px solid #00FF9C",borderRadius:4,padding:"4px 12px",fontFamily:"monospace",fontSize:"0.8rem",cursor:"pointer",marginBottom:14},children:"Skip animation"}),e.jsxs("div",{ref:t,"aria-live":s?"off":"polite",style:{whiteSpace:"pre-wrap",lineHeight:1.6,fontSize:"1.2rem",overflowY:"auto"},children:[u,!s&&e.jsx("span",{"aria-hidden":"true",style:{display:"inline-block",background:"#00FF9C",width:8,height:"1em",marginLeft:2,verticalAlign:"bottom",animation:"blink 0.8s infinite"}})]}),e.jsx(h,{to:"/",className:"bio-back",style:{color:"#00FF9C",textDecoration:"none",fontWeight:"bold",display:"inline-block",marginTop:40,border:"1px solid #00FF9C",padding:"10px 20px",borderRadius:4,transition:"all 0.3s ease",background:"transparent"},children:"← Back to 1337 Wing"})]})]})}export{x as default};
