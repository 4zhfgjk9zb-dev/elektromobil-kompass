const steps=[...document.querySelectorAll(".step")];
let current=0;
const next=document.getElementById("nextBtn"),prev=document.getElementById("prevBtn"),submit=document.getElementById("submitBtn");
const stepNow=document.getElementById("stepNow"),stepTotal=document.getElementById("stepTotal"),bar=document.getElementById("progressBar");
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
next.addEventListener("click",()=>{if(validStep() && current<steps.length-1){current++;render();steps[current].scrollIntoView({behavior:"smooth",block:"center"});}});
prev.addEventListener("click",()=>{if(current>0){current--;render();}});
document.querySelectorAll("[data-region]").forEach(a=>a.addEventListener("click",()=>{
  const r=a.dataset.region; const sel=document.getElementById("region");
  if(r==="Münster") sel.value="Münster / Münsterland";
  if(r==="Osnabrück") sel.value="Osnabrück / Umgebung";
  if(r==="Bielefeld") sel.value="Bielefeld / OWL";
}));
document.getElementById("leadForm").addEventListener("submit",e=>{
  e.preventDefault();
  if(!validStep()) return;
  const box=document.getElementById("formMessage");
  box.hidden=false;
  box.innerHTML="<strong>Demo-Modus:</strong> Die Website funktioniert, aber die Anfrage wird noch nicht versendet. Im nächsten Schritt verbinden Sie das Formular mit Ihrem Lead-Postfach oder CRM.";
});
render();