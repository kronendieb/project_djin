<script lang="ts">
    import {onMount} from "svelte";

    let data: any = null;
    let loading = false;
    let error: any = null;
    let login_check: any = null

    const authenticate = async () => {
        loading = true;
        error = null;

        try{
            const res = await fetch("/api/auth/login-url");

            if (!res.ok){
                throw new Error("Failed to communicate to service");
            }

            data = await res.json();
            if(data.url){
                window.location.href = data.url
            }

        } catch (err: any){
            error = err.message;
        } finally {
            loading = false;
        }
    }

    const check_login_information = async () =>{
        try{
            const check = await fetch("/api/auth/check-login");
            if(!check.ok){
                throw new Error("Filed to reach the login server.");
            }
            login_check = await check.json();
        } catch (err: any){
            error = err.message;
        } 
    }

    onMount(async () => {
        check_login_information();
    })

</script>

<button onclick = {authenticate} disabled={loading}>
    {loading ? "Loading..." : "Login"}
</button>

{#if error}
    <p>Error: {error}</p>
{/if}

{#if login_check} 
    <p>{JSON.stringify(login_check, null, 2)}</p>
{/if}
