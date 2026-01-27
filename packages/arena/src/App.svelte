<script lang="ts">
import AuthButton from "./lib/components/ui/AuthenticationButton.svelte"
import ChartWrapper from "./lib/components/chart/ChartWrapper.svelte"
import SideMenu from "./lib/components/ui/SideMenu.svelte";
import ThemeToggle from "./lib/components/ui/ThemeToggle.svelte";
</script>

<main> 

    <SideMenu>
        <AuthButton />
        <ThemeToggle/>
    </SideMenu>

    <ChartWrapper />

</main> 

<style>
main {
    width: 100vw;
    height: 100vh;
}
</style>
