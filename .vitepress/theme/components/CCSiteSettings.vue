<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, shallowRef, useTemplateRef } from "vue";

import type { SiteFontFamily } from "../composables/useSiteSettings";

import { useSiteSettings } from "../composables/useSiteSettings";

defineProps<{
  screenMenu?: boolean;
}>();

const { settings, updateSiteSettings, resetSiteSettings } = useSiteSettings();
const isOpen = shallowRef(false);
const dialogRef = useTemplateRef<HTMLDivElement>("dialog");

const openDialog = async () => {
  isOpen.value = true;
  if (typeof document !== "undefined") document.body.classList.add("cc-settings-modal-open");
  await nextTick();
  dialogRef.value?.focus();
};

const closeDialog = () => {
  isOpen.value = false;
  if (typeof document !== "undefined") document.body.classList.remove("cc-settings-modal-open");
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && isOpen.value) closeDialog();
};

const updateBooleanSetting = (
  key: "showContributors" | "showOutline" | "showComments",
  event: Event,
) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  updateSiteSettings(key, target.checked);
};

const updateFontFamily = (event: Event) => {
  const target = event.target;
  if (!(target instanceof HTMLSelectElement)) return;
  updateSiteSettings("fontFamily", target.value as SiteFontFamily);
};

onMounted(() => {
  if (typeof window !== "undefined") window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  if (typeof document !== "undefined") document.body.classList.remove("cc-settings-modal-open");
  if (typeof window !== "undefined") window.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <button
    class="cc-settings-trigger"
    :class="{ 'cc-settings-trigger--screen': screenMenu }"
    type="button"
    aria-label="打开显示配置"
    title="显示配置"
    @click="openDialog"
  >
    <svg class="cc-settings-trigger__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6 1.65 1.65 0 0 0 10 3.09V3a2 2 0 0 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.14.46.49.82.93 1H21a2 2 0 0 1 0 4h-.09c-.47.18-.82.54-1.51 1Z"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <span v-if="screenMenu" class="cc-settings-trigger__label">配置</span>
  </button>

  <Teleport to="body">
    <div v-if="isOpen" class="cc-settings-modal" @click.self="closeDialog">
      <div
        ref="dialog"
        class="cc-settings-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cc-settings-title"
        tabindex="-1"
      >
        <header class="cc-settings-dialog__header">
          <h2 id="cc-settings-title" class="cc-settings-dialog__title">显示配置</h2>
          <button
            class="cc-settings-dialog__close"
            type="button"
            aria-label="关闭显示配置"
            title="关闭"
            @click="closeDialog"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M18 6 6 18M6 6l12 12"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </header>

        <div class="cc-settings-dialog__body">
          <label class="cc-settings-option">
            <span class="cc-settings-option__text">显示「贡献者名单」</span>
            <span class="cc-switch">
              <input
                class="cc-switch__input"
                type="checkbox"
                :checked="settings.showContributors"
                @change="updateBooleanSetting('showContributors', $event)"
              />
              <span class="cc-switch__track">
                <span class="cc-switch__thumb"></span>
              </span>
            </span>
          </label>

          <label class="cc-settings-option">
            <span class="cc-settings-option__text">显示「右侧大纲」</span>
            <span class="cc-switch">
              <input
                class="cc-switch__input"
                type="checkbox"
                :checked="settings.showOutline"
                @change="updateBooleanSetting('showOutline', $event)"
              />
              <span class="cc-switch__track">
                <span class="cc-switch__thumb"></span>
              </span>
            </span>
          </label>

          <label class="cc-settings-option">
            <span class="cc-settings-option__text">显示「评论区」</span>
            <span class="cc-switch">
              <input
                class="cc-switch__input"
                type="checkbox"
                :checked="settings.showComments"
                @change="updateBooleanSetting('showComments', $event)"
              />
              <span class="cc-switch__track">
                <span class="cc-switch__thumb"></span>
              </span>
            </span>
          </label>

          <label class="cc-settings-select">
            <span class="cc-settings-select__label">字体样式</span>
            <select
              class="cc-settings-select__control"
              :value="settings.fontFamily"
              @change="updateFontFamily"
            >
              <option value="default">默认无衬线</option>
              <option value="serif">优雅衬线体</option>
            </select>
          </label>
        </div>

        <footer class="cc-settings-dialog__footer">
          <button class="cc-settings-reset" type="button" @click="resetSiteSettings">
            恢复默认
          </button>
          <button class="cc-settings-done" type="button" @click="closeDialog">完成</button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.cc-settings-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: var(--vp-nav-height);
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.cc-settings-trigger:hover {
  color: var(--vp-c-brand-1);
}

.cc-settings-trigger--screen {
  justify-content: flex-start;
  width: 100%;
  height: 40px;
  gap: 8px;
  padding: 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-alt);
}

.cc-settings-trigger__icon {
  width: 18px;
  height: 18px;
}

.cc-settings-trigger__label {
  font-size: 14px;
  font-weight: 600;
}

.cc-settings-modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.45);
}

.cc-settings-dialog {
  width: min(420px, 100%);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  box-shadow: var(--vp-shadow-4);
  color: var(--vp-c-text-1);
  outline: none;
}

.cc-settings-dialog__header,
.cc-settings-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
}

.cc-settings-dialog__header {
  border-bottom: 1px solid var(--vp-c-divider);
}

.cc-settings-dialog__footer {
  border-top: 1px solid var(--vp-c-divider);
}

.cc-settings-dialog__title {
  margin: 0;
  font-size: 18px;
  line-height: 1.4;
}

.cc-settings-dialog__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  border-radius: 8px;
  color: var(--vp-c-text-2);
  transition:
    background-color 0.25s,
    color 0.25s;
}

.cc-settings-dialog__close:hover {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}

.cc-settings-dialog__close-icon,
.cc-settings-dialog__close svg {
  width: 18px;
  height: 18px;
}

.cc-settings-dialog__body {
  display: grid;
  gap: 14px;
  padding: 16px;
}

.cc-settings-option,
.cc-settings-select {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 44px;
  cursor: pointer;
}

.cc-settings-option__text,
.cc-settings-select__label {
  color: var(--vp-c-text-1);
  font-size: 14px;
  line-height: 1.5;
}

.cc-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 44px;
  height: 26px;
  cursor: pointer;
  flex-shrink: 0;
}

.cc-switch__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
}

.cc-switch__track {
  position: relative;
  display: block;
  width: 44px;
  height: 24px;
  border-radius: 9999px;
  background-color: var(--vp-c-divider);
  border: 1px solid var(--vp-c-divider);
  transition:
    background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.25s ease;
}

.cc-switch__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.cc-switch__input:checked + .cc-switch__track {
  background-color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.cc-switch__input:checked + .cc-switch__track .cc-switch__thumb {
  transform: translateX(20px);
}

.cc-switch__input:focus-visible + .cc-switch__track {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.cc-settings-select__control {
  min-width: 116px;
  height: 40px;
  padding: 0 28px 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  font-size: 14px;
}

.cc-settings-reset,
.cc-settings-done {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 88px;
  min-height: 44px;
  height: 44px;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
}

.cc-settings-reset {
  color: var(--vp-c-text-2);
  background: var(--vp-c-default-soft);
}

.cc-settings-done {
  color: var(--vp-button-brand-text);
  background: var(--vp-button-brand-bg);
}

.cc-settings-reset:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-default-2);
}

.cc-settings-done:hover {
  background: var(--vp-button-brand-hover-bg);
}

@media (max-width: 640px) {
  .cc-settings-modal {
    align-items: flex-end;
    padding: 12px;
  }
}
</style>
