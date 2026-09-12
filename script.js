const steps=[...document.querySelectorAll(".step")];
let current=0;
const next=document.getElementById("nextBtn"),prev=document.getElementById("prevBtn"),submit=document.getElementById("submitBtn");
const stepNow=document.getElementById("stepNow"),stepTotal=document.getElementById("stepTotal"),bar=document.getElementById("progressBar");
const form=document.getElementById("leadForm"), box=document.getElementById("formMessage");
stepTotal.textContent=steps.length;

function render(){
  steps.forEach((s,i)=>s.classList.toggle("active",i===current));
  stepNow.textContent=current+1;
  bar.style.width=((current+1)/steps.length*100)+"%";
  prev.style.visibility=current===0?"hidden":"visible";
  next.style.display=current===steps.length-1?"none":"inline-flex";
  submit.style.display=current===steps.length-1?"inline-flex":"none";
}
function validStep(){
  const fields=[...steps[current].querySelectorAll("input,select")];
  for(const f of fields){
    if(!f.checkValidity()){ f.reportValidity(); return false; }
  }
  return true;
}
next.addEventListener("click",()=>{
  if(validStep() && current<steps.length-1){
    current++; render(); steps[current].scrollIntoView({behavior:"smooth",block:"center"});
  }
});
prev.addEventListener("click",()=>{ if(current>0){ current--; render(); } });

document.querySelectorAll("[data-region]").forEach(a=>a.addEventListener("click",()=>{
  const r=a.dataset.region, sel=document.getElementById("region");
  if(r==="Münster") sel.value="Münster / Münsterland";
  if(r==="Osnabrück") sel.value="Osnabrück / Umgebung";
  if(r==="Bielefeld") sel.value="Bielefeld / OWL";
}));

form.addEventListener("submit",async e=>{
  e.preventDefault();
  if(!validStep()) return;
  const consentTime=document.getElementById("einwilligung_zeitpunkt");
  if(consentTime) consentTime.value=new Date().toISOString();
  submit.disabled=true;
  submit.textContent="Wird gesendet …";
  box.hidden=true;
  try{
    const response=await fetch(form.action,{
      method:"POST",
      body:new FormData(form),
      headers:{"Accept":"application/json"}
    });
    if(!response.ok) throw new Error("Formularversand fehlgeschlagen");
    form.reset();
    document.querySelectorAll(".step,.progress,.step-label,.funnel-actions,.service-note").forEach(el=>el.hidden=true);
    box.hidden=false;
    box.innerHTML="<strong>Vielen Dank! Ihre Anfrage ist eingegangen.</strong><br>Wenn Sie der Weitergabe zugestimmt haben, kann Ihre Anfrage an die SANIMED GmbH übermittelt werden. SANIMED darf Sie anschließend zu Ihrer konkreten Elektromobil-Anfrage kontaktieren.";
  }catch(err){
    box.hidden=false;
    box.innerHTML="<strong>Das hat leider nicht funktioniert.</strong> Bitte versuchen Sie es erneut oder schreiben Sie an <a href='mailto:info@elektromobil-kompass.de'>info@elektromobil-kompass.de</a>.";
    submit.disabled=false;
    submit.textContent="Unverbindliche Anfrage senden";
  }
});
render();
