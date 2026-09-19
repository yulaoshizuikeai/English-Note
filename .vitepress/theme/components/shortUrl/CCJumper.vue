<!-- 参考自 https://notes.linho.cc/s?q=adaf352048 -->

<script setup lang="ts">
import { useRouter, withBase } from "vitepress";
import { onMounted } from "vue";
const router = useRouter();
onMounted(() => {
  const id = new URLSearchParams(window.location.search).get("q");
  if (!id || !/^[a-f0-9]{10}$/i.test(id)) return router.go(`/404`);
  fetch(withBase("/shortmap.json"))
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load shortmap");
      return res.json();
    })
    .then((d: unknown) => {
      const target =
        typeof d === "object" && d !== null ? (d as Record<string, string>)[id] : undefined;
      if (typeof target === "string" && target) router.go(`/${encodeURI(target)}`);
      else router.go(`/404`);
    })
    .catch(() => router.go(`/404`));
});
</script>
