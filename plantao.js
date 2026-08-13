/* plantao.js — lógica do formulário do plantão */
(function () {
  var STAFF_FIELDS = [
    { key: "enfermeiros",      label: "Enfermeira(o)(s)",       icon: "stethoscope",   emoji: "🩺" },
    { key: "tecnicas",         label: "Técnicas de Enfermagem", icon: "users",         emoji: "👥" },
    { key: "medicos",          label: "Médico(a)(s)",           icon: "heart-pulse",   emoji: "👨‍⚕️" },
    { key: "nutricionista",    label: "Nutricionista",          icon: "apple",         emoji: "🍎" },
    { key: "assistenteSocial", label: "Assistente Social",      icon: "hand-heart",    emoji: "🤝" },
    { key: "servicosGerais",   label: "Serviços Gerais",        icon: "brush",         emoji: "🧹" },
    { key: "recepcao",         label: "Recepção",               icon: "bell",          emoji: "🔔" },
    { key: "farmacia",         label: "Farmácia",               icon: "pill",          emoji: "💊" },
    { key: "raioX",            label: "Raio X",                 icon: "scan",          emoji: "📷" },
    { key: "copeira",          label: "Copeira",                icon: "coffee",        emoji: "☕" },
    { key: "maqueiro",         label: "Maqueiro",               icon: "stretcher",     emoji: "🛏️" },
    { key: "portaria",         label: "Portaria",               icon: "door-open",     emoji: "🚪" },
    { key: "motorista",        label: "Motorista",              icon: "car",           emoji: "🚗" },
    { key: "ambulancia",       label: "Ambulância",             icon: "ambulance",     emoji: "🚑" }
  ];

  var PATIENT_FIELDS = [
    { key: "enfPed",     label: "Enfermaria Pediátrica", icon: "baby",          emoji: "👶" },
    { key: "enfFem",     label: "Enfermaria Feminina",   icon: "user-round",    emoji: "👩" },
    { key: "enfMasc",    label: "Enfermaria Masculina",  icon: "user",          emoji: "👨" },
    { key: "isolamento", label: "Isolamento",            icon: "shield-alert",  emoji: "🛡️" },
    { key: "salaRea",    label: "Sala Vermelha (REA)",   icon: "zap",           emoji: "⚡" }
  ];

  var FLOW_FIELDS = [
    { key: "regulacao",  label: "Regulação",  icon: "clipboard-list", emoji: "📋" },
    { key: "observacao", label: "Observação", icon: "eye",            emoji: "👁️" }
  ];

  var TRANSFER_FIELDS = [
    { key: "transferencia", label: "Transferência", icon: "arrow-right-left", emoji: "🔄" },
    { key: "obito",         label: "Óbito",         icon: "cross",            emoji: "✝️" },
    { key: "alta",          label: "Alta",          icon: "home",             emoji: "🏠" },
    { key: "evasao",        label: "Evasão",        icon: "log-out",          emoji: "🏃" }
  ];

  var TURNOS = {
    diurno:  "Plantão Diurno",
    noturno: "Plantão Noturno"
  };

  // Estado
  var staffData    = {};
  var patientData  = {};

  function getTurno() {
    var p = new URLSearchParams(window.location.search);
    var t = (p.get("turno") || "diurno").toLowerCase();
    return TURNOS[t] ? t : "diurno";
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderList(container, field, list) {
    var ol = container.querySelector(".staff-list");
    if (!list.length) {
      if (ol) ol.remove();
      return;
    }
    if (!ol) {
      ol = document.createElement("ol");
      ol.className = "staff-list";
      container.appendChild(ol);
    }
    ol.innerHTML = "";
    list.forEach(function (name, idx) {
      var li = document.createElement("li");
      li.className = "staff-item";
      li.innerHTML =
        '<span class="staff-num">' + (idx + 1) + '</span>' +
        '<span class="staff-name">' + escapeHtml(name) + '</span>' +
        '<button type="button" class="staff-del" aria-label="Remover"><i data-lucide="x"></i></button>';
      li.querySelector(".staff-del").addEventListener("click", function () {
        list.splice(idx, 1);
        renderList(container, field, list);
      });
      ol.appendChild(li);
    });
    if (window.lucide) window.lucide.createIcons();
  }

  function buildStaffField(target, field, store, placeholder) {
    store[field.key] = [];
    var wrapper = document.createElement("div");
    wrapper.className = "field";
    wrapper.innerHTML =
      '<label class="field-label"><i data-lucide="' + field.icon + '"></i> ' + escapeHtml(field.label) + '</label>' +
      '<div class="staff-row">' +
        '<input type="text" class="field-input" placeholder="' + escapeHtml(placeholder) + '" />' +
        '<button type="button" class="btn-add"><i data-lucide="plus"></i> Adicionar</button>' +
      '</div>';
    var input = wrapper.querySelector("input");
    var btn   = wrapper.querySelector(".btn-add");

    function add() {
      var v = input.value.trim();
      if (!v) return;
      store[field.key].push(v);
      input.value = "";
      renderList(wrapper, field, store[field.key]);
      input.focus();
    }

    btn.addEventListener("click", add);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); add(); }
    });

    target.appendChild(wrapper);
  }

  function buildCountField(target, field) {
    var wrapper = document.createElement("div");
    wrapper.className = "field";
    wrapper.innerHTML =
      '<label class="field-label"><i data-lucide="' + field.icon + '"></i> ' + escapeHtml(field.label) + '</label>' +
      '<input type="text" inputmode="numeric" pattern="[0-9]*" class="field-input" placeholder="0" id="count-' + field.key + '" />';
    var input = wrapper.querySelector("input");
    input.addEventListener("input", function () {
      input.value = input.value.replace(/[^0-9]/g, "");
    });
    target.appendChild(wrapper);
  }

  function updateDataHora() {
    var el = document.getElementById("dataHora");
    if (!el) return;
    var now = new Date();
    var d = now.toLocaleDateString("pt-BR");
    var t = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    el.value = d + " · " + t;
  }

  function buildMessage(turnoLabel) {
    var lines = [];
    var unidade = document.getElementById("unidade").value || "UPA DE HUMILDES";
    var dataHora = document.getElementById("dataHora").value;

    lines.push("*🏥 MAPA DO PLANTÃO — " + turnoLabel.toUpperCase() + "*");
    lines.push("🏥 " + unidade);
    lines.push("📅 " + dataHora);
    lines.push("");

    lines.push("*👥 EQUIPE*");
    var hasStaff = false;
    STAFF_FIELDS.forEach(function (f) {
      var list = staffData[f.key] || [];
      if (list.length) {
        hasStaff = true;
        lines.push(f.emoji + " *" + f.label + ":*");
        list.forEach(function (n, i) { lines.push("   " + (i + 1) + ". " + n); });
      }
    });
    if (!hasStaff) lines.push("(nenhum registro)");
    lines.push("");

    lines.push("*🛏️ PACIENTES*");
    var hasPat = false;
    PATIENT_FIELDS.forEach(function (f) {
      var list = patientData[f.key] || [];
      if (list.length) {
        hasPat = true;
        lines.push(f.emoji + " *" + f.label + "* (" + list.length + "):");
        list.forEach(function (n, i) { lines.push("   " + (i + 1) + ". " + n); });
      }
    });
    if (!hasPat) lines.push("(nenhum registro)");
    lines.push("");

    lines.push("*📊 FLUXO*");
    FLOW_FIELDS.forEach(function (f) {
      var v = (document.getElementById("count-" + f.key) || {}).value;
      if (v) lines.push(f.emoji + " " + f.label + ": *" + v + "*");
    });
    lines.push("");

    lines.push("*🔄 TRANSFERÊNCIAS / SAÍDAS*");
    TRANSFER_FIELDS.forEach(function (f) {
      var v = (document.getElementById("count-" + f.key) || {}).value;
      if (v) lines.push(f.emoji + " " + f.label + ": *" + v + "*");
    });

    var obs = (document.getElementById("obsFinal").value || "").trim();
    if (obs) {
      lines.push("");
      lines.push("*📝 OBSERVAÇÃO FINAL*");
      lines.push(obs);
    }

    return lines.join("\n");
  }

  function sendWhatsApp(turnoLabel) {
    var num = (localStorage.getItem("upa_wa_number") || "").replace(/\D/g, "");
    var text = encodeURIComponent(buildMessage(turnoLabel));
    var url = num
      ? "https://wa.me/" + num + "?text=" + text
      : "https://wa.me/?text=" + text;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function initSettings() {
    var modal    = document.getElementById("modal-settings");
    var btnOpen  = document.getElementById("btn-settings");
    var btnClose = document.getElementById("btn-modal-cancel");
    var btnSave  = document.getElementById("btn-modal-save");
    var input    = document.getElementById("wa-number");

    function open()  { input.value = localStorage.getItem("upa_wa_number") || ""; modal.hidden = false; }
    function close() { modal.hidden = true; }

    btnOpen.addEventListener("click", open);
    btnClose.addEventListener("click", close);
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    btnSave.addEventListener("click", function () {
      localStorage.setItem("upa_wa_number", input.value.trim());
      close();
    });
  }

  function autoExpandTextarea() {
    var ta = document.getElementById("obsFinal");
    if (!ta) return;
    ta.addEventListener("input", function () {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var turnoKey   = getTurno();
    var turnoLabel = TURNOS[turnoKey];

    document.getElementById("turno-label").textContent = turnoLabel;
    document.getElementById("page-title").textContent  = turnoLabel + " · UPA de Humildes";

    updateDataHora();
    setInterval(updateDataHora, 30000);

    var equipeC   = document.getElementById("equipe-container");
    var pacienteC = document.getElementById("pacientes-container");
    var fluxoC    = document.getElementById("fluxo-container");
    var transfC   = document.getElementById("transferencias-container");

    STAFF_FIELDS.forEach(function (f) {
      buildStaffField(equipeC, f, staffData, "Digite o nome e toque em Adicionar");
    });
    PATIENT_FIELDS.forEach(function (f) {
      buildStaffField(pacienteC, f, patientData, "Nome do paciente");
    });
    FLOW_FIELDS.forEach(function (f) { buildCountField(fluxoC, f); });
    TRANSFER_FIELDS.forEach(function (f) { buildCountField(transfC, f); });

    if (window.lucide) window.lucide.createIcons();

    initSettings();
    autoExpandTextarea();

    document.getElementById("btn-whatsapp").addEventListener("click", function () {
      sendWhatsApp(turnoLabel);
    });
  });
})();