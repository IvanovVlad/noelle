let urlOld = "http://192.168.0.35:8983/solr/parsed_cards/select?fl=case_number, side, court_name, process_type&q=(((side:\"Иванов Иван Иванович\") OR (side:\"Иванов ИИ\") OR (side:\"Иванов И.И\") OR (side:\"Иванов И И\"))) AND (region:18)&rows=200";
let urlNew = "http://192.168.32.212:8991/solr/case/select?fl=caseNumber, plaintiff, defendant, side, other, courtName, courtType&q=(((plaintiff:\"Иванов Иван Иванович\") OR (plaintiff:\"Иванов ИИ\") OR (plaintiff:\"Иванов И.И\") OR (plaintiff:\"Иванов И И\")) OR ((defendant:\"Иванов Иван Иванович\") OR (defendant:\"Иванов ИИ\") OR (defendant:\"Иванов И.И\") OR (defendant:\"Иванов И И\")) OR ((side:\"Иванов Иван Иванович\") OR (side:\"Иванов ИИ\") OR (side:\"Иванов И.И\") OR (side:\"Иванов И И\")) OR ((other:\"Иванов Иван Иванович\") OR (other:\"Иванов ИИ\") OR (other:\"Иванов И.И\") OR (other:\"Иванов И И\"))) AND (region:18)&rows=200";

document.querySelector("button").addEventListener('click', queryAndCompare);

document.querySelectorAll("input[type='text']").forEach((a, i) => {
    if (i === 0) a.addEventListener('change', () => urlOld = a.value)
    if (i === 1) a.addEventListener('change', () => urlNew = a.value)
})

async function queryAndCompare() {
    Promise.all([
        fetch(urlOld).then(response => response.json()),
        fetch(urlNew).then(response => response.json())
    ]).then(responses => compareJsons(responses[0], responses[1]));
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

const solrCompare = (nd, od) => {

    if (nd && od) {
        return nd.caseNumber === od.case_number;
    }

    return false;
}