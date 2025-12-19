<template>
  <div class="wrap" style="background-color: antiquewhite">
    <h1>Hardline</h1>

    <input v-model="displayName" placeholder="Display name" />
    <input v-model="sipPassword" placeholder="SIP password" />

    <button @click="register">Create number</button>

    <pre v-if="result">{{ result }}</pre>

    <div style="margin-top:16px">
      <input v-model="toCall" placeholder="Number to call (e.g. 99002)" />
      <button @click="call">Call</button>
      <button @click="hangup">Hangup</button>
    </div>
  </div>
</template>

<script lang="ts" src="./script.ts"></script>
