#!/usr/bin/env node
// 商品說明產生腳本 — 呼叫本機 Ollama，為 src/data/catalog.js 的商品產生更長的
// 中文商品說明，印到 stdout 供人工複查後手動貼回 catalog.js（不會自動改檔）。
//
// 用法:
//   ollama serve                                  # 另開終端機跑本機模型
//   ollama pull qwen3.5:9b-mlx                    # 首次使用需先拉取模型
//   node scripts/generate-descriptions.mjs         # 產生全部商品的建議文案
//   node scripts/generate-descriptions.mjs cat-001 cat-002   # 只跑指定 id
//   OLLAMA_MODEL=llama3 node scripts/generate-descriptions.mjs   # 換用其他已拉取的模型
import { getShelves } from '../src/data/catalog.js'

const OLLAMA_URL = 'http://localhost:11434/api/generate'
const MODEL = process.env.OLLAMA_MODEL ?? 'qwen3.5:9b-mlx'

const ids = process.argv.slice(2)

function allProducts() {
  return getShelves().flatMap((shelf) => shelf.products)
}

async function generate(product) {
  const prompt =
    `你是台北捷運點數商城的文案編輯。請針對商品「${product.name}」，把原本的簡短說明「${product.desc}」` +
    `擴寫成一段更吸引人的正體中文商品說明，約 40-70 字，語氣自然、口語化，不要條列、不要標題、` +
    `不要加引號，只回傳說明文字本身。`
  const res = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, prompt, stream: false }),
  })
  if (!res.ok) {
    throw new Error(`Ollama 回應錯誤 ${res.status} — 確認 \`ollama serve\` 是否啟動、模型是否已 pull`)
  }
  const { response } = await res.json()
  return response.trim()
}

const targets = ids.length > 0 ? allProducts().filter((p) => ids.includes(p.id)) : allProducts()

if (targets.length === 0) {
  console.error('找不到符合的商品 id。')
  process.exit(1)
}

for (const product of targets) {
  const newDesc = await generate(product)
  console.log(`--- ${product.id} ${product.name} ---`)
  console.log(`舊: ${product.desc}`)
  console.log(`新: ${newDesc}`)
  console.log()
}
