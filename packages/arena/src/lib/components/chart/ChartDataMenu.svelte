<script lang="ts">

let {onClose, onSubmit, values = $bindable()}:
{
    onClose:()=>void,
    onSubmit:(values:{title:string})=>void,
    values:{title:string}
}= $props();

function stop(e: MouseEvent){
    e.stopPropagation();
}
function submit(){
    onSubmit(values);
}

</script>

<div class="overlay" onpointerdown={onClose}>
    <div class="menu" onpointerdown={stop} >
        <label for="title">Title
            <input type="text" bind:value={values.title}/>
        </label>

        <div>
            <button onpointerdown={submit}>Apply</button>
            <button onpointerdown={onClose}>Close</button>
        </div>
    </div>
</div>

<style>

.overlay {
    position: absolute;
    background-color: rgb(from var(--color-bg) r g b / 0.8);
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

.menu {
    background:var(--color-bg);
    padding: 1rem;
    border-radius: 8px;
    display: flex;
    gap: 5px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>
