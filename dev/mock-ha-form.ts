// Very small stand-in for Home Assistant's <ha-form>, enough to exercise the
// card editors in the dev page: text/number/entity fields, booleans, grids
// (flat) and expandables (nested under their name).
type Field = { name: string; type?: string; title?: string; flatten?: boolean; selector?: Record<string, any>; schema?: Field[] };

class MockHaForm extends HTMLElement {
  private _data: Record<string, any> = {};
  schema: Field[] = [];

  get data() {
    return this._data;
  }
  set data(v: Record<string, any>) {
    this._data = v;
    if (this.isConnected) queueMicrotask(() => this.render());
  }
  computeLabel: (f: Field) => string = (f) => f.name;
  hass: unknown;

  connectedCallback() {
    queueMicrotask(() => this.render());
  }

  private emit(value: Record<string, any>) {
    this.dispatchEvent(new CustomEvent("value-changed", { detail: { value } }));
  }

  private field(f: Field, data: Record<string, any>, set: (v: Record<string, any>) => void): HTMLElement {
    if (f.type === "grid" || (f.type === "expandable" && f.flatten)) {
      const box = document.createElement("div");
      box.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px";
      f.schema!.forEach((s) => box.appendChild(this.field(s, data, set)));
      return box;
    }
    if (f.type === "expandable") {
      const box = document.createElement("fieldset");
      box.innerHTML = `<legend>${f.title}</legend>`;
      const inner = data[f.name] ?? {};
      f.schema!.forEach((s) => box.appendChild(this.field(s, inner, (v) => set({ ...data, [f.name]: v }))));
      return box;
    }
    const label = document.createElement("label");
    label.style.cssText = "display:flex;flex-direction:column;gap:4px;font-size:12px;color:#8C857A";
    label.textContent = this.computeLabel(f);
    const input = document.createElement("input");
    input.name = f.name;
    const sel = f.selector ?? {};
    if (sel.boolean) {
      input.type = "checkbox";
      input.checked = !!data[f.name];
      input.onchange = () => set({ ...data, [f.name]: input.checked });
    } else {
      input.type = sel.number ? "number" : "text";
      const v = data[f.name];
      input.value = Array.isArray(v) ? v.join(",") : (v ?? "");
      input.onchange = () => {
        let value: any = input.value || undefined;
        if (sel.number && value !== undefined) value = Number(value);
        if (sel.entity?.multiple && value !== undefined) value = String(value).split(",").map((s) => s.trim());
        set({ ...data, [f.name]: value });
      };
    }
    input.style.cssText = "background:#1C1B18;color:#EEE9E1;border:1px solid #333;border-radius:8px;padding:6px 8px";
    label.appendChild(input);
    return label;
  }

  render() {
    this.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.style.cssText = "display:grid;gap:10px";
    const set = (v: Record<string, any>) => this.emit(v);
    this.schema.forEach((f) => wrap.appendChild(this.field(f, this.data, set)));
    this.appendChild(wrap);
  }
}

if (!customElements.get("ha-form")) customElements.define("ha-form", MockHaForm);
