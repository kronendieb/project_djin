<script lang="ts">
    let theme: "dark" | "light" = "dark";
    const toggleTheme = () => {
        theme = theme === "dark" ? "light" : "dark"
        document.body.dataset.theme = theme;
    }

</script>

<button on:click={toggleTheme}>
    {theme === "dark" ? "light" : "dark"}
</button>
