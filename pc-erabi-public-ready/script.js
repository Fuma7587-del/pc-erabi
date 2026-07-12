const startButton = document.getElementById("startButton");
const diagnosisSection = document.getElementById("diagnosisSection");
const resultSection = document.getElementById("resultSection");
const form = document.getElementById("diagnosisForm");
const questions = [...document.querySelectorAll(".question")];
const nextButton = document.getElementById("nextButton");
const prevButton = document.getElementById("prevButton");
const retryButton = document.getElementById("retryButton");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const errorMessage = document.getElementById("errorMessage");

let currentStep = 1;
const totalSteps = questions.length;

const purposeData = {
  daily: {
    title: "普段使い向けのコスパ重視PC",
    cpu: "Core i3 第8世代以上 / Ryzen 3 3000番台以上",
    memory: "8GB以上",
    storage: "SSD 256GB以上",
    gpu: "内蔵GPUで十分",
    basePrice: "2万〜4万円",
    summary: "ネット、動画視聴、オンライン手続きなどを快適にこなせる構成です。"
  },
  office: {
    title: "仕事・事務作業向けの安定PC",
    cpu: "Core i5 第8世代以上 / Ryzen 5 3000番台以上",
    memory: "8GB以上（余裕を持つなら16GB）",
    storage: "SSD 256GB〜512GB",
    gpu: "内蔵GPUで十分",
    basePrice: "3万〜5万円",
    summary: "Office、ブラウザ、オンライン会議を同時に使いやすい構成です。"
  },
  programming: {
    title: "プログラミング学習・開発向けPC",
    cpu: "Core i5 第8世代以上 / Ryzen 5 4000番台以上",
    memory: "16GB推奨",
    storage: "SSD 512GB推奨",
    gpu: "内蔵GPUで十分",
    basePrice: "4万〜7万円",
    summary: "エディタ、ブラウザ、仮想環境を同時に使いやすい構成です。"
  },
  android: {
    title: "アプリ開発向けPC",
    cpu: "Core i5 第8世代以上 / Ryzen 5 4000番台以上",
    memory: "16GB以上",
    storage: "SSD 512GB以上",
    gpu: "基本は内蔵GPUで可",
    basePrice: "5万〜8万円",
    summary: "開発ツール、エミュレーター、ブラウザを並行利用しやすい構成です。"
  },
  video: {
    title: "動画編集向けの高性能PC",
    cpu: "Core i7 第10世代以上 / Ryzen 7 5000番台以上",
    memory: "16GB以上（4K編集は32GB推奨）",
    storage: "SSD 1TB推奨",
    gpu: "GeForce GTX 1660以上を目安",
    basePrice: "8万〜15万円",
    summary: "フルHD動画編集を中心に、書き出し時間も意識した構成です。"
  },
  gaming: {
    title: "ゲーム向けのGPU搭載PC",
    cpu: "Core i5 第10世代以上 / Ryzen 5 5000番台以上",
    memory: "16GB以上",
    storage: "SSD 1TB推奨",
    gpu: "遊ぶゲームの推奨環境に合う専用GPU",
    basePrice: "8万〜18万円",
    summary: "ゲームではGPU性能が重要です。遊びたいタイトルの推奨動作環境を必ず確認してください。"
  }
};

function updateQuestionView() {
  questions.forEach((question, index) => {
    question.classList.toggle("active", index === currentStep - 1);
  });

  progressFill.style.width = `${(currentStep / totalSteps) * 100}%`;
  progressText.textContent = `質問 ${currentStep} / ${totalSteps}`;
  prevButton.disabled = currentStep === 1;
  nextButton.textContent = currentStep === totalSteps ? "診断結果を見る" : "次へ";
  errorMessage.textContent = "";
}

function getCurrentQuestionName() {
  return questions[currentStep - 1].querySelector("input").name;
}

function isCurrentAnswered() {
  const name = getCurrentQuestionName();
  return Boolean(form.querySelector(`input[name="${name}"]:checked`));
}

function collectAnswers() {
  const data = new FormData(form);
  return Object.fromEntries(data.entries());
}

function adjustPrice(basePrice, budget) {
  const budgetNumber = Number(budget);
  if (budgetNumber <= 20000) {
    return "予算内では状態の良い中古を優先。必要に応じて予算追加も検討";
  }
  if (budgetNumber <= 35000) {
    return "3万〜4万円を中心に検索";
  }
  if (budgetNumber <= 55000) {
    return "4万〜6万円を中心に検索";
  }
  if (budgetNumber >= 80000) {
    return `${basePrice}を目安に、保証や状態を優先`;
  }
  return basePrice;
}

function determineType(type, portable) {
  if (portable === "often") return "軽量ノートパソコン";
  if (type === "desktop") return "デスクトップパソコン";
  if (type === "laptop") return "ノートパソコン";
  if (portable === "never") return "性能重視ならデスクトップ、設置しやすさ重視ならノート";
  return "ノートパソコン";
}

function buildAdvice(answers) {
  const advice = [
    "ストレージがHDDのみの機種は避け、SSD搭載モデルを選ぶ",
    "Windows 11に正式対応しているCPUか確認する",
    "保証期間と返品条件を確認する"
  ];

  if (answers.type === "laptop" || answers.portable !== "never") {
    advice.push("中古ノートはバッテリー状態と充電器の有無を確認する");
  }

  if (answers.used === "condition") {
    advice.push("外観ランクだけでなく、キーボード・液晶・端子の状態も確認する");
  }

  if (answers.used === "new") {
    advice.push("新品を選ぶ場合も、メモリ8GB未満・SSD128GB以下は避ける");
  }

  if (answers.purpose === "gaming" || answers.purpose === "video") {
    advice.push("GPUの型番と電源容量、冷却状態を確認する");
  }

  return advice;
}

function showResult() {
  const answers = collectAnswers();
  const result = purposeData[answers.purpose];

  document.getElementById("resultTitle").textContent = result.title;
  document.getElementById("resultSummary").textContent = result.summary;
  document.getElementById("cpuResult").textContent = result.cpu;
  document.getElementById("memoryResult").textContent = result.memory;
  document.getElementById("storageResult").textContent = result.storage;
  document.getElementById("gpuResult").textContent = result.gpu;
  document.getElementById("priceResult").textContent = adjustPrice(result.basePrice, answers.budget);
  document.getElementById("typeResult").textContent = determineType(answers.type, answers.portable);

  const adviceList = document.getElementById("adviceList");
  adviceList.innerHTML = "";
  buildAdvice(answers).forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    adviceList.appendChild(li);
  });

  diagnosisSection.hidden = true;
  resultSection.hidden = false;
  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

startButton.addEventListener("click", () => {
  diagnosisSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

nextButton.addEventListener("click", () => {
  if (!isCurrentAnswered()) {
    errorMessage.textContent = "選択肢を1つ選んでください。";
    return;
  }

  if (currentStep < totalSteps) {
    currentStep += 1;
    updateQuestionView();
  } else {
    showResult();
  }
});

prevButton.addEventListener("click", () => {
  if (currentStep > 1) {
    currentStep -= 1;
    updateQuestionView();
  }
});

retryButton.addEventListener("click", () => {
  form.reset();
  currentStep = 1;
  resultSection.hidden = true;
  diagnosisSection.hidden = false;
  updateQuestionView();
  diagnosisSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

updateQuestionView();
