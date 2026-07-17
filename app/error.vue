<template>
  <NuxtLayout name="default">
    <main class="min-h-[calc(100dvh-64px-72px)] px-4 flex flex-col justify-center items-center relative overflow-hidden">
      <!-- Background Decorative Element: Subtle Track Lane -->
      <div class="absolute inset-0 z-0 pointer-events-none opacity-10">
        <svg
          class="w-full h-full"
          height="100%"
          preserveaspectratio="none"
          viewbox="0 0 1000 1000"
          width="100%"
        >
          <path
            d="M-100,200 Q500,250 1100,200"
            fill="none"
            stroke="#007AFF"
            stroke-width="40"
          />
          <path
            d="M-100,400 Q500,450 1100,400"
            fill="none"
            stroke="#007AFF"
            stroke-width="40"
          />
          <path
            d="M-100,600 Q500,650 1100,600"
            fill="none"
            stroke="#007AFF"
            stroke-width="40"
          />
          <path
            d="M-100,800 Q500,850 1100,800"
            fill="none"
            stroke="#007AFF"
            stroke-width="40"
          />
        </svg>
      </div>
      <div class="container-max mx-auto px-margin-mobile flex flex-col items-center text-center z-10">
        <!-- 404 Headline -->
        <div class="relative mb-stack-md">
          <h1
            class="font-montserrat font-display-lg text-[12rem] md:text-[20rem] leading-none select-none italic text-(--ui-primary) opacity-10 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none"
          >
            404
          </h1>
          <h1 class="font-montserrat font-display-lg text-[8rem] md:text-[14rem] leading-none italic relative text-(--ui-secondary)">
            404
          </h1>
        </div>
        <!-- Supporting Message -->
        <div class="max-w-2xl mb-stack-lg mb-8">
          <h2 class="font-headline-lg text-headline-lg mb-4 text-(--ui-secondary) text-4xl font-bold">
            Oops! Sembra che tu sia uscito fuori pista.
          </h2>
          <p class="font-body-lg text-body-lg text-on-surface-variant">
            Anche ai migliori capita di sbagliare traiettoria. Non preoccuparti, riprendiamo il ritmo e
            torniamo sul percorso principale.
          </p>
        </div>
        <!-- Call to Action -->
        <div class="flex flex-col sm:flex-row gap-4 items-center">
          <a
            class="bg-(--ui-primary) text-white font-bold text-label-bold px-8 py-4 rounded-lg italic uppercase tracking-wider shadow-md hover:bg-(--mg-btn-hover-primary) transition-all active:scale-95 flex items-center gap-2 group"
            href="/"
          >
            <span
              class="material-symbols-outlined transition-transform group-hover:-translate-x-1 flex items-center justify-center"
              data-icon="arrow_back"
            ><UIcon
              name="i-material-symbols-arrow-back-rounded"
              class="size-5"
            /></span>
            Torna in Home Page
          </a>
        </div>
      </div>
      <!-- Athletic Data Card Style Accent -->
      <div class="hidden lg:block absolute bottom-24 right-12 animate-pulse">
        <div class="bg-white border border-(--mg-btn-text-secondary)/20 rounded-lg p-4 shadow-xl flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-lg bg-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF]"
          >
            <span
              class="material-symbols-outlined flex items-center justify-center"
              data-icon="timer"
            ><UIcon
              name="i-material-symbols-timer-outline"
              class="size-6"
            /></span>
          </div>
          <div>
            <p class="font-label-bold text-[10px] uppercase text-split-gray">
              Errore di Percorso
            </p>
            <p class="font-data-mono text-atletica-blue">
              0:00:00
            </p>
          </div>
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>
