let urlOld = "http://localhost:8081/solr/helloworld/select?q=*%3A*&rows=999&start=0";
let urlNew = "http://localhost:8081/solr/helloworld1/select?q=*%3A*&rows=999&start=0";

document.querySelector("button").addEventListener('click', queryAndCompare);

document.querySelectorAll("input[type='text']").forEach((a, i) => {
    if (i === 0) a.addEventListener('change', () => urlOld = a.value)
    if (i === 1) a.addEventListener('change', () => urlNew = a.value)
})

async function queryAndCompare() {
    Promise.all([
        fetch(urlOld).then(responce => responce.json()),
        fetch(urlNew).then(responce => responce.json())
    ]).then(responces => compareJsons(responces[0], responces[1]));
}

function compareJsons(oldJson, newJson) {
    const oldDocs = oldJson.response.docs;
    const newDocs = newJson.response.docs;
    
    document.querySelector("#old").innerHTML = oldDocs.map(od => {
        if (!newDocs.some(nd => solrCompare(nd, od))) return od;
    }).filter(v => v).reduce((acc, v) => acc + `<div>${JSON.stringify(v, '\n', 6)}</div>`, "")

    document.querySelector("#new").innerHTML = newDocs.map(nd => {
        if (!oldDocs.some(od => solrCompare(nd, od))) return nd;
    }).filter(v => v).reduce((acc, v) => acc + `<div>${JSON.stringify(v, '\n', 6)}</div>`, "")
    
}


const solrCompare = (nd, od) => nd.courtName === od.court_name;