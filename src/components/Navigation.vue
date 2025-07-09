<script> 
import { RouterLink } from 'vue-router'
</script>

<template>
            <img class = logo src = "../components/icons/50x50.jpg">
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/login">Login</RouterLink>
</template>

<style>
RouterLink {
    text-align:top;
}

 .logo {
    float: left;
    width: 25%;
 }

</style>