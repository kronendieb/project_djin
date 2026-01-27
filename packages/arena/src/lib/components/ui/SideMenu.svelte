<script lang="ts">
    export let open = false;
</script>

<div class="menu {open ? 'open' : ''}">
    <div class="content">
        <slot/>
    </div>
    <button class="toggle" on:click={() => open = !open}>
        {open ? '<' : '>'}
    </button>
</div>

<style>
.menu {
    position: fixed;
    left: 0;
    top: 50%;
    transform: translate(-90%, -50%);
    transition: transform 0.3s ease;
    z-index: 1000;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.menu.open {
    transform: translate(0, -50%);
}

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: max-content;
    max-width: 90vw;

    background: var(--color-bg);
    color: var(--color-text);
    padding: 1rem;

    border-radius: 0 10px 10px 0;

}

.toggle {
    height: 1rem;
    width: 1rem;
    padding: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(100%, 0);
    border-radius: 9999px;
}

</style>
