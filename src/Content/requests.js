import {fromDateToWeek} from "./dataFormatter";


const richiestaProgetti = "https://sqd.sensesquare.eu:5002/richiesta_progetti"
const reportDisponibili = "https://sqd.sensesquare.eu:5002/report_disponibili"


let apikey =  '2HHWGTKFP7XQ';




async function getProgettiDisponibili(){
    const data = new FormData();
    data.append("apikey", apikey);
    return await  fetch(richiestaProgetti, {
        method: "POST",
        body: data
    }).then(resp => resp.json());
}
async function cercaProgettoValidato(nome, frequenze, inizio, fine, tipoReport){
    const data = new FormData();
    data.append("apikey", apikey);
    data.append("progetto", nome);
    data.append("inizio", inizio);
    data.append("fine", fine);
    data.append("tipo", tipoReport);
    data.append("frequenze", JSON.stringify(frequenze));
    return await fetch(reportDisponibili, {
        body: data,
        method: "POST"
    }).then(resp => resp.json());
}

export async function downloadPDF(progetto, frequenza, anno, mese, giorno){
    let periodo;
    switch (frequenza){
        case "giornalieri":
            periodo = `${anno}-${mese}-${giorno}`;
            break;
        case "settimanali":
            let date = `${giorno}-${mese}-${anno}`;
            let week = fromDateToWeek(date);
            periodo = `${anno}-${week}`;
            break;
        case "mensili":
            periodo = `${anno}-${mese}`;
            break;
    }
    const formData = new FormData();
    formData.append("progetto", progetto);
    formData.append("frequenza", frequenza);
    formData.append("periodo", periodo);
    formData.append("apikey", apikey);
    return await fetch("https://sqd.sensesquare.eu:5002/richiesta_report",{
        method: "POST",
        body: formData
    }).then(response =>
         response.blob()
    )
        .then(blob => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = progetto+".pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
        });
}
export {getProgettiDisponibili,cercaProgettoValidato}
