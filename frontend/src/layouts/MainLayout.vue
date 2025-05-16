<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated :style="{ backgroundColor: '#000000' }">
      <q-toolbar :style="{ color: '#ffffff' }">
        <q-toolbar-title>
          User Manager
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
