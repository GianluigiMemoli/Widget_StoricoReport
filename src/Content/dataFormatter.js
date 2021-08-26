import moment from "moment";
import {getReportByDate} from "./reportsByDate";
export function getFrequenze(data){
    let freqs = [];
    const frequenze = ["giornalieri", "settimanali", "mensili"];
    Object.keys(data).forEach(k => {
        if(frequenze.includes(k)){
            freqs.push(k);
        }
    });
    console.log(freqs);
    return freqs;
}

export function getAnni(data, freq){
    if(freq && freq.length > 0) {
        console.log(Object.keys(data[freq]));
        return Object.keys(data[freq]);
    } else {
        return [];
    }
}
export function _getRangeWeek(anno, settimana){
    let startDay = moment().year(anno).week(settimana);
    let startAsString = startDay.toDate().toLocaleDateString();
    let endDay = startDay.add(6, 'days');
    let endAsString = endDay.toDate().toLocaleDateString();
    return startAsString + "-" + endAsString;
}
export function getMesi(data, freq, anno){
    if(freq && anno && freq.length > 0){
        if(freq == "mensili" || freq == "giornalieri"){
            console.log(Object.keys(data[freq][anno]));
            return Object.keys(data[freq][anno]);
        } else {
            let mesi = new Set();
            Object.keys(data[freq][anno]).forEach(wk => {
               let range = _getRangeWeek(anno, wk);
               mesi.add(range);
            });
            return Array.from(mesi);
        };
    } else return [];
}

export function getGiorni(data, freq, anno, mese){
    if(freq && anno && mese){
        if(freq == "giornalieri"){
            return Object.keys(data[freq][anno][mese]);
        }
        if(freq == "settimanali"){
            return [];
        }
    }
    else return [];
}
export function fromDateToWeek(date){
    let dateObj =  moment(date, "DD/MM/YYYY");
    return dateObj.week();
}

export function formatRecords(data, freq, anno, mese, giorno){
    const possibleSources = ["ssq", "arpa_eea", "copernicus"];

    let records = {};
    let dati = {};
    if(freq == "giornalieri") {
        dati = data[freq][anno][mese][giorno].dati;
    } else if(freq == "mensili"){
        dati = data[freq][anno][mese].dati;
    } else if(freq == "settimanali"){
        let week = fromDateToWeek(`${giorno}/${mese}/${anno}`);
        week = week + "";
        dati = data[freq][anno][week].dati;
    }

    Object.keys(dati).forEach( k => {
       if(possibleSources.includes(k)){
           records[k] = {};
           Object.keys(dati[k]).forEach(luogo => {
               records[k][luogo] = dati[k][luogo].dati_luogo;
           });
       }
    });
    return records;
}


export function getFormattedRecords(mese, anno, progetti){
    let formattedsRecords = [];
    return new Promise((resolve, reject) => {
            getReportByDate(mese, anno, progetti.result).then((validati) => {
                validati.forEach(
                    record => {
                        Object.keys(record).forEach(freq => {
                            console.log(freq);
                            if(freq == "giornalieri"){
                                Object.keys(record[freq]).forEach(
                                    anno => {
                                        Object.keys(record[freq][anno]).forEach(
                                            mese => {
                                                Object.keys(record[freq][anno][mese]).forEach(
                                                    giorno => {
                                                        formattedsRecords.push({
                                                            giorno,
                                                            anno,
                                                            mese,
                                                            nome: record[freq][anno][mese][giorno].dati.titolo,
                                                            frequenza: freq,
                                                            inizio: record[freq][anno][mese][giorno].dati.periodo.start_date,
                                                            fine:  record[freq][anno][mese][giorno].dati.periodo.end_date,
                                                        });
                                                    }
                                                )
                                            }
                                        )
                                    }
                                )
                            } else if(freq == "settimanali"){
                                Object.keys(record[freq]).forEach(
                                    anno => {
                                        Object.keys(record[freq][anno]).forEach(
                                            settimana => {
                                                let date = _getRangeWeek(anno,settimana).split("-")[0];
                                                console.log(date);
                                                let splitted = date.split("/");
                                                console.log(splitted);
                                                let giorno = splitted[0];
                                                console.log(giorno);
                                                let mese = splitted[1];
                                                formattedsRecords.push({
                                                    giorno,
                                                    anno,
                                                    mese,
                                                    nome: record[freq][anno][settimana].dati.titolo,
                                                    frequenza: freq,
                                                    inizio: record[freq][anno][settimana].dati.periodo.start_date,
                                                    fine:  record[freq][anno][settimana].dati.periodo.end_date,
                                                });
                                            }

                                        )
                                    }
                                )
                            }else if(freq == "mensili"){
                                Object.keys(record[freq]).forEach(
                                    anno => {
                                        Object.keys(record[freq][anno]).forEach(
                                            mese => {
                                                formattedsRecords.push({
                                                    anno,
                                                    mese,
                                                    nome: record[freq][anno][mese].dati.titolo,
                                                    frequenza: freq,
                                                    inizio: record[freq][anno][mese].dati.periodo.start_date,
                                                    fine:  record[freq][anno][mese].dati.periodo.end_date,
                                                });
                                            }

                                        )
                                    }
                                )
                            }
                        });
                    }
                );
                resolve(formattedsRecords);
            });
    });

}
