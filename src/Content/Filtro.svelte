<script>
    import {onMount, beforeUpdate, createEventDispatcher} from  "svelte";
    import {ExpansionPanel, ExpansionPanels} from "svelte-materialify";
    export let filtro="stub";
    export let data;
    const dispatch = createEventDispatcher();
    let filters = [];

    onMount( () => {
        console.log("mount");
        console.log(data);
       let values = new Set();
       data.forEach(
           record => {
              values.add(record[filtro]);
              if(!record.show.hasOwnProperty(filtro)){
                  record.show[filtro] = true;
              }

           }
       );
       filters = Array.from(values);
       console.log(filters);
    });

    function setVisibility(value, visibility){
        data.forEach(record => {
            if(record[filtro] == value){
                record.show[filtro] = visibility;
                console.log(record);
                dispatch("visibilityChanged", {data});
            }
        });
    }
    function isChecked(value){
        let val = false;
        data.forEach(record => {
            if(record[filtro] == value){
                console.log("return " + record.show[filtro]);
                val =  record.show[filtro];
            }
        });
        return val;
    }
</script>

{#if filters.length > 0}
    <div class="filter">
        <ExpansionPanels style="max-width: 30vw">
            <ExpansionPanel style="max-width: 30vw">
                <span slot="header">{filtro}</span>
                <div class="filter-list">
                    {#each filters as filter, idx}

                            <label><input type="checkbox" checked={isChecked(filter)} value={filter}  on:change={(e) => setVisibility(filter, e.target.checked)}/>{filter}</label>
                    {/each}
                </div>
            </ExpansionPanel>
        </ExpansionPanels>
    </div>
{/if}

<style>
    label{
            display: block;
    }
    .filter-list{
        max-height: 20vh;
        overflow-y: scroll;

    }
    .filter{
        max-width: 35%;
        margin-right: 2em;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
</style>

