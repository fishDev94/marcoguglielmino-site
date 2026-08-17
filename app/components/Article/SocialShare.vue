<template>
  <div class="mg-social-share">
    <div class="mg-social-share__socials">
      <p class="mg-social-share__socials-title">
        {{ $t("article.socials.share") }}
      </p>
      <div class="mg-social-share__socials-container">
        <SocialShare
          v-for="(network, i) in networks"
          :key="`network-button+${network}+${i}`"
          :network
          :label="false"
        />
      </div>
    </div>
    <div class="mg-social-share__ai">
      <p class="mg-social-share__ai-title">
        {{ $t("article.socials.ask_ai") }}
      </p>
      <div class="mg-social-share__ai-container">
        <SocialShare
          v-for="(ai, i) in askAIList"
          :key="`network-button+${ai}+${i}`"
          :network="ai"
          :label="false"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const networks = [
  "facebook",
  "reddit",
  "whatsapp",
  "telegram",
  "linkedin",
  "threads",
  "x"
]

const askAIList = [
  "chatgpt",
  "claude",
  "gemini",
  "perplexity"
]
</script>

<style lang="scss" scoped>
    .mg-social-share {
        display: flex;
        flex-direction: column;
        gap: 16px;

        &__socials-container, &__ai-container {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;

            & > .social-share-button {
                color: var(--mg-btn-text-primary);
                padding: .5rem;
            }
        }

        &__socials-title, &__ai-title {
            @include body(3);

            margin-bottom: 8px;
        }
    }
</style>
