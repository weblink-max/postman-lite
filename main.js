let headerNum=0;

function addHeader(){
  let header_view = document.querySelector("#header_view");
  
  let html = `
  <div class="row mb-3" class="exit">
        <div class="col col-5">
          <input type="text" name="header-key" value="content-type" class="form-control header_key"/>
        </div>
        <div class="col col-5">
          <input type="text" name="header-val" value="application/json" class="form-control header_val"/>
        </div>
        
        <div class="col col-2">
          <button type="button" class="btn btn-danger" onclick="deleteHeader(${headerNum})" ><i class="bi bi-x-lg"></i></button>
        </div>
      </div>
  `;
  
  let dom = document.createElement("div");
  dom.setAttribute("id",`dom${headerNum}`);
  dom.innerHTML=html;
  
  header_view.appendChild(dom)
  headerNum++
}

function deleteHeader(n){
  
  let dom=document.getElementById(`dom${n}`)

  dom.remove()
  
}

function method(){
  let method = document.querySelector("#method").value;
  
  let bodyc = document.querySelector("#bodyc"); 
  
  
  if ("GET" == method || method == "DELETE"){
    bodyc.classList.add("d-none")
  }else{
    bodyc.classList.remove("d-none")
  }
  
  return method;
}

function localhost(){
  let api_endpoint = document.querySelector("#api");
  if(api_endpoint.value=="http://localhost:3000"){
    api_endpoint.value="";
  }else{
    api_endpoint.value = "http://localhost:3000";
  }
}
  
function isValidURL() {
  let api_endpoint = document.querySelector("#api");
    const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;
    if(pattern.test(api_endpoint.value)) {
        
        api_endpoint.classList.add("is-valid")
        api_endpoint.classList.remove("is-invalid")
        return true
    } else {
      api_endpoint.classList.add("is-invalid")
      api_endpoint.classList.remove("is-valid")
        return false;
    }
    
    return pattern.test(api_endpoint.value)
}
function isValidJSON() {
  let body= document.querySelector("#body")
    try {
        JSON.parse(body.value);
        body.classList.add("is-valid")
        body.classList.remove("is-invalid")
        return true
    } catch (e) {
      body.classList.add("is-invalid")
      body.classList.remove("is-valid")
        return false;
    }
    
}

function response(msg,res_time){
  let res_view=document.querySelector("#res_view");
    // Format JSON response properly
  let formattedMsg;
  try {
    formattedMsg = JSON.stringify(JSON.parse(msg), null, 2);
  } catch (e) {
    formattedMsg = msg
  }
  let html =`
  <div class="form-floating text-secondary mt-3">
    <textarea class="form-control" id="res" value="${formattedMsg}" readonly>${formattedMsg}</textarea>
    <label for="res">${res_time ? `Responsed in ${res_time}ms`: "Unsuccessful to fetch"}</label>
  </div>
  `;
  
  let dom = document.createElement("div");
  
  dom.innerHTML=html;
  
  res_view.appendChild(dom)
  
}

function card(msg,type){
  let card_view=document.querySelector("#card_view");
  let html =`
  <div class="alert alert-${type} alert-dismissible fade show mt-3" role="alert">
    <i class="${type == "success" ? "bi-check-circle-fill": "bi bi-exclamation-triangle-fill"}"></i> ${msg}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
  `;
  
  let dom = document.createElement("div");
  
  dom.innerHTML=html;
  
  res_view.appendChild(dom)
  
}

async function request(){
  
  let header_key = document.querySelectorAll(".header_key")
  let header_val = document.querySelectorAll(".header_val")
  let res_view=document.querySelector("#res_view");
  let len =header_key.length;
  
  let header = {};
  let api_endpoint = document.querySelector("#api").value;
  let method = document.querySelector("#method").value;
  let body= document.querySelector("#body").value;
  
  let config = {
    method:method,
  }
  
  
  
  if (!("GET" == method || method == "DELETE")){
    config.body=body;
  }
  if(len != 0){
    for(let i =0; i<len;i++){
      header[header_key[i].value]=header_val[i].value
    }
    config.headers=header;
  }
  
  
  if(isValidURL() && isValidJSON()){
  try{
    res_view.innerHTML=`
  <div class="form-floating text-secondary mt-3">
    <div class="form-control d-flex align-items-center justify-content-center " id="res" readonly>
      <span class="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
      <span role="status">Fetching...</span>
    </div>
    <label for="res">Response Loading...</label>
  </div>`
    let req_start_time= Date.now();
    let res = await fetch(api_endpoint,config);
    let json = await res.json();
    let req_end_time = Date.now();
    let def = req_end_time-req_start_time;
    res_view.innerHTML=""
    card("Request successful!",  "success")
    response (JSON.stringify(json),def)
  }catch(e){
    res_view.innerHTML=""
    card("Request unsuccessful! \n"+e.message,  "danger")
  }
  }
  
}

method()