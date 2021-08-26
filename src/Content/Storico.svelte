<script>
    import {getProgettiDisponibili} from "./requests";
    import {beforeUpdate, createEventDispatcher} from "svelte";
    import {TextField, Button, Divider} from "svelte-materialify";
    import {getFormattedRecords} from "./dataFormatter";
    import Filtro from "./Filtro.svelte";
    import {downloadPDF} from "./requests";
    /**/
    let formattedsRecords = [];
    const dispatch = createEventDispatcher();
    let dataForFilters;
    let prom;
    let _mese = 1;
    let _anno = 2021;
    $: console.log(_anno);
    const rulesDate = [
        (v) => !isNaN(Number.parseInt(v)) || "Inserire valore numerico",
    ];

    function search() {
        dispatch("loading", {isLoading: true, text: "Ricerca report..."});
        getProgettiDisponibili().then(progetti => {
            prom = getFormattedRecords(_mese, _anno, progetti).then((records) => {
                formattedsRecords = records;
                formattedsRecords.forEach(r => r["show"] = {});
                dataForFilters = Object.assign([], formattedsRecords);
                dispatch("loading", {isLoading: false});
            });
        });
    }
    beforeUpdate(() => {
        console.log("dovrei aggiornare=");
    })
    function isRecordShowable(record){

        return Object.values(record.show).every(Boolean);
    }

</script>
<div class="date-input">
    <TextField rules={rulesDate} bind:value={_anno}  style="width: 30vw; margin-right: 1em" type="number" min="2000" >Anno</TextField>
    <TextField rules={rulesDate} bind:value={_mese}  style="width: 30vw; margin-right: 1em" type="number" min="1" max="12" >Mese</TextField>
</div>
<div class="button-navigation">
    <Button class="primary" disabled={!_anno || !_mese} on:click={search}>Ricerca</Button>
</div>
{#if prom}
{#await prom}

    {:then prom}
    <Divider></Divider>
    <p style="text-align: center" class="title-text">Filtri</p>
    <div class="filters">
        <Filtro data={dataForFilters} filtro="nome" on:visibilityChanged={e => formattedsRecords = e.detail.data}></Filtro>
        <Filtro data={dataForFilters} filtro="frequenza" on:visibilityChanged={e => formattedsRecords = e.detail.data}></Filtro>
    </div>
<div class="table-container">
    <table>
        <thead class="title-text">
            <th>Nome progetto</th>
            <th>Frequenza</th>
            <th>Data inizio</th>
            <th>Data fine</th>
        </thead>
        <tbody class="description-text">
        {#each formattedsRecords as record}
            {#if isRecordShowable(record)}
                <tr>
                    <td>{record.nome}</td>
                    <td>{record.frequenza}</td>
                    <td>{record.inizio}</td>
                    <td>{record.fine}</td>
                    <td><a class="clickable" on:click={() => {
                        console.log(record);
                        downloadPDF(record.nome, record.frequenza, record.anno, record.mese, record.giorno);
                    }}>pdf</a></td>
                </tr>
            {/if}
        {/each}
        </tbody>
    </table>
</div>

{/await}
    {/if}
<style>
    .date-input{
        display: flex;
        flex-direction: row;
        padding: 1em;
    }
    .button-navigation{
        display: flex;
        flex-direction: row;
        justify-content: center;
        padding: 1em;
        margin-right: 1em;
    }
    .table-container{
        display: flex;
        flex-direction: row;
        max-height: 40vh;
        justify-content: center;
        overflow-y: scroll;
        margin: 1em;

    }
    table{
        text-align: center;
        border-collapse: collapse;
    }
    tr:nth-child(even){
        background: #a1e5ab;

    }
    .filters{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .clickable{
        cursor: pointer;
    }
</style>
