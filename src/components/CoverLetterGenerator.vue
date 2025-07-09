<template>
  <div class="w-full px-6 py-4 space-y-6">
    <!-- 3-Spalten-Hauptlayout -->
    <div class="grid gap-4 grid-cols-1 lg:grid-cols-[260px_1fr_1fr]">
      <section class="lg:sticky lg:top-0 lg:w-64">
        <h2 class="text-lg font-semibold mb-2">📄 Dokument-Typ</h2>
        <!-- Dokumenttyp-Komponente (nicht einklappbar) -->
        <DocumentTypeSelector />
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-2">👤 Lebenslauf / Profil</h2>
        <!-- Profil-Komponente mit Tabs -->
        <ProfilTabs />
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-2">🏢 Stellenanzeige</h2>
        <!-- Stellenanzeige-Komponente -->
        <JobAdInput />
      </section>
    </div>

    <!-- Unterer Bereich: Prompt + Generieren + Texteditor -->
    <div class="w-full border-t pt-6 space-y-4">
      <!-- Prompt-Eingabefeld -->
      <PromptEditor />

      <!-- Button rechtsbündig -->
      <div class="flex justify-end">
        <GenerateButton />
      </div>

      <!-- Ergebniseditor -->
      <CoverLetterEditor />
    </div>
  </div>
</template>

<script setup lang="ts">
// Placeholder script block for Vue 3 setup syntax.
// The actual component implementations need to be provided
// elsewhere in the application.
</script>

<style scoped>
/* Keine zusätzlichen Styles notwendig, Layout erfolgt mit TailwindCSS */
</style>
