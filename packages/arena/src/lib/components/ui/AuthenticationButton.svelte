<script lang="ts">
import {onMount} from "svelte";

let data: any = null;
let loading = false;
let error: any = null;
let login_check: boolean = false;

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
        let check_obj = await check.json();
        login_check = check_obj.authenticated;
    } catch (err: any){
        error = err.message;
    } 
}

onMount(async () => {
    check_login_information();
})

</script>

<div class="login-button">

    <button onclick = {authenticate} disabled={loading}>
        {loading ? "Loading..." : "Login"}
    </button>

    {#if error}
        <p>Error: {error}</p>
    {/if}

    {#if login_check === true}
        <p>👍</p>
    {/if}
    {#if login_check === false}
        <p>❗</p>
    {/if}
</div>

<style>
.login-button {
    display: flex;
    flex-direction: row;
    top: 10px;
    left: 10px;
    padding: 4px;
}
.login-button > p {
    padding: 4px;
    margin: 4px;
}
</style>
