import {cercaProgettoValidato} from "./requests";


function frequenzeToString(frequenze){
    const freqs = ["giornalieri", "settimanali", "mensili"];
    let stringFreqs = [];
    freqs.forEach((freq,idx) =>{
       if(frequenze[idx] == 1){
           stringFreqs.push(freq);
       }
    });
    return stringFreqs;
}

export async function getReportByDate(mese, anno, progetti){
    return new Promise((resolve, reject) => {
        let inizio = `${anno}-${mese}-1`;
        let lastDay  = new Date(Number(anno), Number(mese) , 0).getDate();
        let fine = `${anno}-${mese}-${lastDay}`;
        let progettiValidati = [];
        let promisesToWait = [];
        progetti.forEach(
            progetto => {
                let frequenzeString = frequenzeToString(progetto.frequenze);
                let nomeProgetto = progetto.progetto;
                let prom = cercaProgettoValidato(nomeProgetto, frequenzeString, inizio, fine, "final")
                        .then(respValidati => {
                            if(respValidati.response_code == 200){
                                progettiValidati.push(JSON.parse(respValidati.result));
                            }
                        });
                promisesToWait.push(prom);
                }
        );
        Promise.allSettled(promisesToWait).then(
            () => resolve(progettiValidati)
        );
    });

}

