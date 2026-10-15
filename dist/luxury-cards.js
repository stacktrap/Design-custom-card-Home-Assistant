//#region node_modules/@lit/reactive-element/css-tag.js
var e = globalThis, t = e.ShadowRoot && (e.ShadyCSS === void 0 || e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, n = Symbol(), r = /* @__PURE__ */ new WeakMap(), i = class {
	constructor(e, t, r) {
		if (this._$cssResult$ = !0, r !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, n = this.t;
		if (t && e === void 0) {
			let t = n !== void 0 && n.length === 1;
			t && (e = r.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && r.set(n, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (e, ...t) => new i(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, n), s = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, c = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: p, getPrototypeOf: m } = Object, h = globalThis, ee = h.trustedTypes, te = ee ? ee.emptyScript : "", ne = h.reactiveElementPolyfillSupport, g = (e, t) => e, re = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? te : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, ie = (e, t) => !l(e, t), ae = {
	attribute: !0,
	type: String,
	converter: re,
	reflect: !1,
	useDefault: !1,
	hasChanged: ie
};
Symbol.metadata ??= Symbol("metadata"), h.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var _ = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = ae) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = d(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? ae;
	}
	static _$Ei() {
		if (this.hasOwnProperty(g("elementProperties"))) return;
		let e = m(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(g("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(g("properties"))) {
			let e = this.properties, t = [...f(e), ...p(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(1 / 0).reverse());
			for (let e of n) t.unshift(c(e));
		} else e !== void 0 && t.push(c(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return s(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? re : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? re : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? ie)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
_.elementStyles = [], _.shadowRootOptions = { mode: "open" }, _[g("elementProperties")] = /* @__PURE__ */ new Map(), _[g("finalized")] = /* @__PURE__ */ new Map(), ne?.({ ReactiveElement: _ }), (h.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var v = globalThis, oe = (e) => e, y = v.trustedTypes, se = y ? y.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ce = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, le = "?" + b, ue = `<${le}>`, x = document, S = () => x.createComment(""), C = (e) => e === null || typeof e != "object" && typeof e != "function", w = Array.isArray, de = (e) => w(e) || typeof e?.[Symbol.iterator] == "function", T = "[ 	\n\f\r]", E = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, fe = /-->/g, pe = />/g, D = RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), me = /'/g, he = /"/g, ge = /^(?:script|style|textarea|title)$/i, _e = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), O = _e(1), k = _e(2), A = Symbol.for("lit-noChange"), j = Symbol.for("lit-nothing"), ve = /* @__PURE__ */ new WeakMap(), M = x.createTreeWalker(x, 129);
function ye(e, t) {
	if (!w(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return se === void 0 ? t : se.createHTML(t);
}
var be = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = E;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === E ? c[1] === "!--" ? o = fe : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = D) : (ge.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = D) : o = pe : o === D ? c[0] === ">" ? (o = i ?? E, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? D : c[3] === "\"" ? he : me) : o === he || o === me ? o = D : o === fe || o === pe ? o = E : (o = D, i = void 0);
		let d = o === D && e[t + 1].startsWith("/>") ? " " : "";
		a += o === E ? n + ue : l >= 0 ? (r.push(s), n.slice(0, l) + ce + n.slice(l) + b + d) : n + b + (l === -2 ? t : d);
	}
	return [ye(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, xe = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = be(t, n);
		if (this.el = e.createElement(l, r), M.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = M.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ce)) {
					let t = u[o++], n = i.getAttribute(e).split(b), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? we : r[1] === "?" ? Te : r[1] === "@" ? Ee : P
					}), i.removeAttribute(e);
				} else e.startsWith(b) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (ge.test(i.tagName)) {
					let e = i.textContent.split(b), t = e.length - 1;
					if (t > 0) {
						i.textContent = y ? y.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], S()), M.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], S());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === le) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(b, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += b.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = x.createElement("template");
		return n.innerHTML = e, n;
	}
};
function N(e, t, n = e, r) {
	if (t === A) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = C(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = N(e, i._$AS(e, t.values), i, r)), t;
}
var Se = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? x).importNode(t, !0);
		M.currentNode = r;
		let i = M.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new Ce(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new De(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = M.nextNode(), a++);
		}
		return M.currentNode = x, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, Ce = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = j, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = N(this, e, t), C(e) ? e === j || e == null || e === "" ? (this._$AH !== j && this._$AR(), this._$AH = j) : e !== this._$AH && e !== A && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? de(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== j && C(this._$AH) ? this._$AA.nextSibling.data = e : this.T(x.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = xe.createElement(ye(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Se(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = ve.get(e.strings);
		return t === void 0 && ve.set(e.strings, t = new xe(e)), t;
	}
	k(t) {
		w(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(S()), this.O(S()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = oe(e).nextSibling;
			oe(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, P = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = j, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = j;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = N(this, e, t, 0), a = !C(e) || e !== this._$AH && e !== A, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = N(this, r[n + o], t, o), s === A && (s = this._$AH[o]), a ||= !C(s) || s !== this._$AH[o], s === j ? e = j : e !== j && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === j ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, we = class extends P {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === j ? void 0 : e;
	}
}, Te = class extends P {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== j);
	}
}, Ee = class extends P {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = N(this, e, t, 0) ?? j) === A) return;
		let n = this._$AH, r = e === j && n !== j || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== j && (n === j || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, De = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		N(this, e);
	}
}, Oe = v.litHtmlPolyfillSupport;
Oe?.(xe, Ce), (v.litHtmlVersions ??= []).push("3.3.3");
var ke = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new Ce(t.insertBefore(S(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, F = globalThis, I = class extends _ {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ke(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return A;
	}
};
I._$litElement$ = !0, I.finalized = !0, F.litElementHydrateSupport?.({ LitElement: I });
var Ae = F.litElementPolyfillSupport;
Ae?.({ LitElement: I }), (F.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region src/shared/styles.ts
var je = o`
  :host {
    --card-top: var(--lux-card-top, #171614);
    --card-bottom: var(--lux-card-bottom, #11100f);
    --surface: var(--lux-surface, #1c1b18);
    --surface-hi: var(--lux-surface-hi, #24221f);
    --line: var(--lux-line, rgba(255, 240, 220, 0.07));
    --line-2: var(--lux-line-strong, rgba(255, 240, 220, 0.13));

    --text: var(--lux-text, #eee9e1);
    --muted: var(--lux-muted, #8c857a);
    --faint: var(--lux-faint, #57524b);

    --gold: var(--lux-accent, #c8a46a);
    --gold-hi: var(--lux-accent-hi, #e8d3a6);
    --gold-lo: var(--lux-accent-lo, #8a6c40);
    --gold-tint: var(--lux-accent-tint, rgba(200, 164, 106, 0.09));
    --gold-edge: var(--lux-accent-edge, rgba(200, 164, 106, 0.28));
    --on-gold: var(--lux-on-accent, #1a1714);

    --radius: var(--lux-radius, 28px);
    --radius-sm: var(--lux-radius-sm, 16px);
    --ease: cubic-bezier(0.22, 0.8, 0.24, 1);
    --font: var(--lux-font, "Manrope", -apple-system, "Helvetica Neue", sans-serif);

    display: block;
    font-family: var(--font);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
  }
`, Me = o`
  * { box-sizing: border-box; }
  button { font-family: inherit; color: inherit; }

  .card {
    position: relative;
    overflow: hidden;
    border-radius: var(--radius);
    padding: 24px;
    background: linear-gradient(180deg, var(--card-top), var(--card-bottom));
    border: 1px solid var(--line);
    box-shadow: 0 40px 80px -40px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.035);
    user-select: none;
    -webkit-user-select: none;
    height: 100%;
    transition: border-color 0.4s var(--ease);
  }

  .card-head {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 20px;
  }
  .card-title { font-size: 15px; font-weight: 500; margin: 0; }
  .card-sub {
    font-size: 10.5px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin: 0 0 5px;
  }
  .clickable { cursor: pointer; }

  /* Switch */
  .switch {
    width: 46px;
    height: 26px;
    border-radius: 99px;
    border: 1px solid var(--line-2);
    background: var(--surface);
    position: relative;
    cursor: pointer;
    padding: 0;
    flex: none;
    transition: background 0.4s var(--ease), border-color 0.4s var(--ease);
  }
  .switch::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--faint);
    transition: transform 0.4s var(--ease), background 0.4s var(--ease);
  }
  .switch[aria-checked="true"] {
    background: linear-gradient(135deg, var(--gold-hi), var(--gold));
    border-color: transparent;
  }
  .switch[aria-checked="true"]::after { transform: translateX(20px); background: var(--on-gold); }
  .switch:disabled { opacity: 0.4; cursor: default; }

  /* Round icon badge */
  .ico {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 0;
    padding: 0;
    flex: none;
    display: grid;
    place-items: center;
    color: var(--faint);
    background: rgba(255, 255, 255, 0.03);
    transition: all 0.4s var(--ease);
    --mdc-icon-size: 20px;
  }
  .ico svg { width: 20px; height: 20px; }
  .on .ico {
    color: var(--on-gold);
    background: linear-gradient(135deg, var(--gold-hi), var(--gold));
    box-shadow: 0 0 24px rgba(232, 211, 166, 0.35);
  }

  .icon { fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }

  .num { font-weight: 200; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
  .unit { color: var(--gold); font-weight: 300; }

  .warning { color: var(--muted); font-size: 13px; }
`, L = class extends I {
	static {
		this.properties = {
			hass: { attribute: !1 },
			_config: { state: !0 }
		};
	}
	static {
		this.styles = [je, Me];
	}
	getCardSize() {
		return 2;
	}
	shouldUpdate(e) {
		if (e.has("_config")) return !0;
		let t = e.get("hass");
		return !t || !this.hass || this.watchedEntities().some((e) => t.states[e] !== this.hass.states[e]) || e.size > 1;
	}
	renderWarning(e) {
		return O`<div class="card"><p class="warning">${e}</p></div>`;
	}
}, R = (e, t, n) => Math.min(n, Math.max(t, e)), z = (e, t) => {
	let n = e?.attributes[t];
	return typeof n == "number" && !Number.isNaN(n) ? n : void 0;
}, B = (e) => {
	let t = e ? parseFloat(e.state) : NaN;
	return Number.isNaN(t) ? void 0 : t;
}, V = (e) => e?.state === "on", H = (e) => !e || e.state === "unavailable" || e.state === "unknown", U = (e, t) => t ?? e?.attributes.friendly_name ?? e?.entity_id ?? "", Ne = (e) => {
	let t = e?.attributes.brightness;
	return V(e) && typeof t == "number" ? Math.max(1, Math.round(t / 255 * 100)) : 0;
}, Pe = (e) => {
	if (!e || !e.entity_id.startsWith("light.")) return !1;
	let t = e.attributes.supported_color_modes;
	return Array.isArray(t) ? t.some((e) => e !== "onoff") : typeof e.attributes.brightness == "number";
}, Fe = (e, t) => e.callService("homeassistant", "toggle", { entity_id: t }), Ie = (e, t, n) => e.callService("homeassistant", n ? "turn_on" : "turn_off", { entity_id: t }), Le = (e, t, n) => e.callService("light", "turn_on", {
	entity_id: t,
	brightness_pct: R(Math.round(n), 1, 100)
}), W = (e, t) => e.dispatchEvent(new CustomEvent("hass-more-info", {
	detail: { entityId: t },
	bubbles: !0,
	composed: !0
})), Re = (e, t, n, r) => {
	t.setPointerCapture(e.pointerId), n(e);
	let i = (e) => n(e), a = (e) => {
		t.removeEventListener("pointermove", i), t.removeEventListener("pointerup", a), t.removeEventListener("pointercancel", a), r?.(e);
	};
	t.addEventListener("pointermove", i), t.addEventListener("pointerup", a), t.addEventListener("pointercancel", a);
}, G = class {
	constructor(e, t = 1) {
		this.host = e, this.tolerance = t, this._value = null, this._dragging = !1, e.addController(this);
	}
	get active() {
		return this._value !== null;
	}
	drag(e) {
		this._value = e, this._dragging = !0, this.host.requestUpdate();
	}
	commit(e) {
		this._value = e, this._dragging = !1, clearTimeout(this._timer), this._timer = window.setTimeout(() => {
			this._value = null, this.host.requestUpdate();
		}, 3e3), this.host.requestUpdate();
	}
	clear() {
		this._value = null, this._dragging = !1, clearTimeout(this._timer), this.host.requestUpdate();
	}
	resolve(e) {
		return this._value !== null && !this._dragging && Math.abs(e - this._value) <= this.tolerance && (this._value = null, clearTimeout(this._timer)), this._value ?? e;
	}
	hostDisconnected() {
		clearTimeout(this._timer);
	}
}, ze = 4, Be = class extends L {
	constructor(...e) {
		super(...e), this._position = new G(this), this._onWindowDown = (e) => {
			let t = e.currentTarget, n = null;
			t.classList.add("dragging"), Re(e, t, (e) => {
				let r = t.getBoundingClientRect();
				n = R(Math.round(100 - (e.clientY - r.top) / r.height * 100), 0, 100), this._position.drag(n);
			}, () => {
				t.classList.remove("dragging"), n !== null && this._setPosition(n);
			});
		};
	}
	static {
		this.styles = [...L.styles, o`
      .body { display: grid; grid-template-columns: 112px 1fr; gap: 24px; align-items: center; }
      .window {
        position: relative;
        height: 164px;
        border-radius: 14px;
        border: 1px solid var(--line-2);
        background: linear-gradient(180deg, #2b2620 0%, #1e1b17 60%, #171512 100%);
        overflow: hidden;
        cursor: ns-resize;
        touch-action: none;
      }
      .window.fixed { cursor: default; }
      .window::before {
        content: "";
        position: absolute;
        left: 50%;
        top: 0;
        bottom: 0;
        width: 1px;
        background: var(--line-2);
      }
      .shutter {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        background: repeating-linear-gradient(180deg, #2e2b27 0 9px, #1c1a17 9px 10.5px);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5);
        transition: height 0.3s linear;
      }
      .dragging .shutter { transition: none; }
      .shutter::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--gold-lo), var(--gold-hi), var(--gold-lo));
      }
      .info .num { font-size: 56px; line-height: 1; }
      .info .unit { font-size: 20px; }
      .state { color: var(--muted); font-size: 12.5px; margin: 6px 0 18px; }
      .controls { display: flex; gap: 8px; }
      .round-btn {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 1px solid var(--line-2);
        background: transparent;
        display: grid;
        place-items: center;
        cursor: pointer;
        transition: all 0.3s var(--ease);
      }
      .round-btn:hover { border-color: var(--gold-edge); background: var(--gold-tint); }
      .round-btn:active { transform: scale(0.94); }
      .round-btn:disabled { opacity: 0.4; cursor: default; }
      .round-btn svg { width: 18px; height: 18px; }
      .chips { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 20px; }
      .chip {
        border: 1px solid var(--line-2);
        background: transparent;
        color: var(--muted);
        font-size: 12px;
        padding: 8px 14px;
        border-radius: 99px;
        cursor: pointer;
        transition: all 0.3s var(--ease);
      }
      .chip:hover { color: var(--text); border-color: var(--gold-edge); }
      .chip.active { color: var(--on-gold); background: var(--gold); border-color: transparent; }
      .moving {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        font-size: 11px;
        color: var(--muted);
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }
      .moving::before {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--gold);
        box-shadow: 0 0 10px var(--gold);
        animation: pulse 2s infinite;
      }
      @keyframes pulse { 50% { opacity: 0.35; } }
      @media (max-width: 420px) {
        .body { grid-template-columns: 96px 1fr; gap: 18px; }
      }
    `];
	}
	static getStubConfig() {
		return {
			entity: "cover.example",
			room: "Camera"
		};
	}
	setConfig(e) {
		if (!e.entity?.startsWith("cover.")) throw Error("Specifica un'entità cover.*");
		this._config = e;
	}
	getCardSize() {
		return 4;
	}
	watchedEntities() {
		return this._config ? [this._config.entity] : [];
	}
	_call(e, t = {}) {
		this.hass.callService("cover", e, {
			entity_id: this._config.entity,
			...t
		});
	}
	_setPosition(e) {
		this._position.clear(), this._call("set_cover_position", { position: e });
	}
	render() {
		if (!this._config || !this.hass) return null;
		let e = this._config.entity, t = this.hass.states[e];
		if (!t) return this.renderWarning(`Entità non trovata: ${e}`);
		let n = H(t), r = ((z(t, "supported_features") ?? 0) & ze) !== 0, i = z(t, "current_position") ?? (t.state === "closed" ? 0 : 100), a = this._position.resolve(i), o = t.state === "opening" || t.state === "closing", s = this._config.presets ?? [
			25,
			50,
			75
		], c = n ? "Non disponibile" : t.state === "opening" ? "In apertura" : t.state === "closing" ? "In chiusura" : a === 0 ? "Chiusa" : a === 100 ? "Aperta" : "Parzialmente aperta";
		return O`
      <div class="card">
        <div class="card-head">
          <div class="clickable" @click=${() => W(this, e)}>
            ${this._config.room ? O`<p class="card-sub">${this._config.room}</p>` : null}
            <h2 class="card-title">${U(t, this._config.name)}</h2>
          </div>
          ${o ? O`<span class="moving">In movimento</span>` : null}
        </div>
        <div class="body">
          <div
            class="window ${r && !n ? "" : "fixed"}"
            role="slider"
            aria-label="Posizione"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow=${a}
            @pointerdown=${r && !n ? this._onWindowDown : null}
          >
            <div class="shutter" style="height:${100 - a}%"></div>
          </div>
          <div class="info">
            <div><span class="num">${a}</span><span class="unit">%</span></div>
            <div class="state">${c}</div>
            <div class="controls">
              <button class="round-btn" aria-label="Apri" ?disabled=${n} @click=${() => this._call("open_cover")}>
                <svg class="icon" viewBox="0 0 24 24"><path d="M6 15l6-6 6 6" /></svg>
              </button>
              <button class="round-btn" aria-label="Stop" ?disabled=${n} @click=${() => this._call("stop_cover")}>
                <svg class="icon" viewBox="0 0 24 24"><rect x="8" y="8" width="8" height="8" rx="1.5" /></svg>
              </button>
              <button class="round-btn" aria-label="Chiudi" ?disabled=${n} @click=${() => this._call("close_cover")}>
                <svg class="icon" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
              </button>
            </div>
          </div>
        </div>
        ${r && s.length ? O`<div class="chips">
              ${s.map((e) => O`<button
                  class="chip ${a === e ? "active" : ""}"
                  ?disabled=${n}
                  @click=${() => this._setPosition(e)}
                >
                  Apertura ${e}%
                </button>`)}
            </div>` : null}
      </div>
    `;
	}
}, Ve = class extends I {
	static {
		this.properties = {
			value: { type: Number },
			disabled: {
				type: Boolean,
				reflect: !0
			},
			off: {
				type: Boolean,
				reflect: !0
			},
			marks: { type: Boolean },
			label: { type: String },
			_drag: { state: !0 },
			_hold: { state: !0 }
		};
	}
	constructor() {
		super(), this._onPointerDown = (e) => {
			if (this.disabled) return;
			let t = e.currentTarget, n = (e) => {
				let n = t.getBoundingClientRect();
				return R(Math.round((e.clientX - n.left) / n.width * 100), 1, 100);
			};
			Re(e, t, (e) => {
				this._drag = n(e), this._emit("value-changing", this._drag);
			}, () => {
				let e = this._drag;
				this._drag = null, e !== null && this._commit(e);
			});
		}, this._onKey = (e) => {
			if (this.disabled) return;
			let t = {
				ArrowRight: 5,
				ArrowUp: 5,
				ArrowLeft: -5,
				ArrowDown: -5
			}[e.key];
			t && (e.preventDefault(), this._commit(R(this._shown + t, 1, 100)));
		}, this.value = 0, this.disabled = !1, this.off = !1, this.marks = !1, this.label = "", this._drag = null, this._hold = null;
	}
	static {
		this.styles = o`
    :host {
      display: block;
      outline: none;
    }
    .track {
      position: relative;
      height: var(--slider-height, 58px);
      border-radius: var(--slider-radius, 18px);
      background: var(--surface, #1c1b18);
      border: 1px solid var(--line, rgba(255, 240, 220, 0.07));
      overflow: hidden;
      cursor: ew-resize;
      touch-action: none;
    }
    :host(:focus-visible) .track { border-color: var(--gold-edge, rgba(200, 164, 106, 0.28)); }
    :host([disabled]) .track { cursor: default; }
    .fill {
      position: absolute;
      inset: 0 auto 0 0;
      background: linear-gradient(90deg, var(--gold-lo, #8a6c40), var(--gold-hi, #e8d3a6));
      border-radius: inherit;
      transition: width 0.15s linear, opacity 0.4s;
    }
    .dragging .fill { transition: opacity 0.4s; }
    .active .fill { opacity: 1 !important; }
    :host([off]) .fill,
    :host([disabled]) .fill { opacity: 0.18; }
    .handle .fill::after {
      content: "";
      position: absolute;
      right: 12px;
      top: 50%;
      width: 2px;
      height: 40%;
      transform: translateY(-50%);
      border-radius: 2px;
      background: rgba(26, 23, 20, 0.55);
    }
    .marks {
      position: absolute;
      inset: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 18px;
      pointer-events: none;
    }
    .marks i { width: 1px; height: 8px; background: var(--line-2, rgba(255, 240, 220, 0.13)); }
  `;
	}
	get _shown() {
		return this._drag ?? this._hold ?? this.value;
	}
	willUpdate(e) {
		e.has("value") && this._hold !== null && Math.abs(this.value - this._hold) <= 1 && (this._hold = null);
	}
	connectedCallback() {
		super.connectedCallback(), this.tabIndex = 0, this.setAttribute("role", "slider"), this.addEventListener("keydown", this._onKey);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.removeEventListener("keydown", this._onKey), clearTimeout(this._holdTimer);
	}
	updated() {
		this.setAttribute("aria-valuenow", String(Math.round(this._shown))), this.setAttribute("aria-valuemin", "1"), this.setAttribute("aria-valuemax", "100"), this.label && this.setAttribute("aria-label", this.label);
	}
	_emit(e, t) {
		this.dispatchEvent(new CustomEvent(e, {
			detail: { value: t },
			bubbles: !0,
			composed: !0
		}));
	}
	_commit(e) {
		this._hold = e, clearTimeout(this._holdTimer), this._holdTimer = window.setTimeout(() => this._hold = null, 3e3), this._emit("value-changed", e);
	}
	render() {
		let e = this._drag !== null || this._hold !== null, t = this.disabled || this.off && !e ? 6 : Math.max(this._shown, 6);
		return O`
      <div
        class="track ${this.marks ? "handle" : ""} ${this._drag === null ? "" : "dragging"} ${e ? "active" : ""}"
        @pointerdown=${this._onPointerDown}
      >
        ${this.marks ? O`<div class="marks"><i></i><i></i><i></i><i></i><i></i></div>` : null}
        <div class="fill" style="width:${t}%"></div>
      </div>
    `;
	}
};
customElements.get("lux-slider") || customElements.define("lux-slider", Ve);
//#endregion
//#region src/cards/dimmer-card.ts
var He = class extends L {
	constructor(...e) {
		super(...e), this._brightness = new G(this);
	}
	static {
		this.styles = [...L.styles, o`
      .card::before {
        content: "";
        position: absolute;
        inset: -40% -20% auto;
        height: 90%;
        background: radial-gradient(closest-side, var(--lux-glow, #f1c58a), transparent);
        opacity: var(--glow-o, 0);
        filter: blur(20px);
        pointer-events: none;
        transition: opacity 0.5s var(--ease);
      }
      .value { position: relative; display: flex; align-items: baseline; gap: 4px; margin: 6px 0 2px; }
      .value .num { font-size: 64px; line-height: 1; }
      .value .unit { font-size: 22px; }
      .label { position: relative; color: var(--muted); font-size: 12.5px; margin-bottom: 22px; }
    `];
	}
	static getStubConfig() {
		return {
			entity: "light.example",
			name: "Lampada",
			room: "Soggiorno"
		};
	}
	setConfig(e) {
		if (!e.entity?.startsWith("light.")) throw Error("Specifica un'entità light.*");
		this._config = e;
	}
	getCardSize() {
		return 4;
	}
	watchedEntities() {
		return this._config ? [this._config.entity] : [];
	}
	render() {
		if (!this._config || !this.hass) return null;
		let e = this._config.entity, t = this.hass.states[e];
		if (!t) return this.renderWarning(`Entità non trovata: ${e}`);
		let n = H(t), r = V(t), i = this._brightness.resolve(Ne(t)), a = r || this._brightness.active;
		return O`
      <div class="card" style="--glow-o:${a ? (.08 + i / 100 * .32).toFixed(2) : "0"}">
        <div class="card-head">
          <div class="clickable" @click=${() => W(this, e)}>
            ${this._config.room ? O`<p class="card-sub">${this._config.room}</p>` : null}
            <h2 class="card-title">${U(t, this._config.name)}</h2>
          </div>
          <button
            class="switch"
            role="switch"
            aria-checked=${r}
            aria-label="Accendi o spegni"
            ?disabled=${n}
            @click=${() => Fe(this.hass, e)}
          ></button>
        </div>
        <div class="value"><span class="num">${a ? i : 0}</span><span class="unit">%</span></div>
        <div class="label">${n ? "Non disponibile" : a ? "Luminosità" : "Spenta"}</div>
        <lux-slider
          marks
          label="Luminosità"
          .value=${i}
          ?off=${!r}
          ?disabled=${n}
          @value-changing=${(e) => this._brightness.drag(e.detail.value)}
          @value-changed=${(t) => {
			this._brightness.commit(t.detail.value), Le(this.hass, e, t.detail.value);
		}}
        ></lux-slider>
      </div>
    `;
	}
}, Ue = 6e5, We = 9e5, Ge = 864e5, K = (e) => {
	let t = B(e);
	if (t === void 0) return;
	let n = String(e.attributes.unit_of_measurement ?? "W");
	return n === "kW" ? t * 1e3 : n === "MW" ? t * 1e6 : t;
}, q = (e) => {
	let t = B(e);
	if (t === void 0) return;
	let n = String(e.attributes.unit_of_measurement ?? "kWh");
	return n === "Wh" ? t / 1e3 : n === "MWh" ? t * 1e3 : t;
}, Ke = (e) => Math.abs(e) < 1e3 ? {
	num: String(Math.round(e)),
	unit: "W"
} : {
	num: (e / 1e3).toFixed(2),
	unit: "kW"
}, J = (e, t = !1) => {
	let { num: n, unit: r } = Ke(Math.abs(e));
	return `${t ? e < 0 ? "−" : "+" : ""}${n} ${r}`;
}, qe = () => {
	let e = /* @__PURE__ */ new Date();
	return e.setHours(0, 0, 0, 0), e.getTime();
}, Je = {
	solar: k`<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>`,
	home: k`<path d="M4 11l8-7 8 7M6 9.5V20h12V9.5M10 20v-5h4v5"/>`,
	grid: k`<path d="M12 3l-5 18M12 3l5 18M8.5 15h7M9.6 11h4.8M5 7h14M12 3v4"/>`
}, Ye = class extends L {
	static {
		this.properties = {
			...L.properties,
			_history: { state: !0 }
		};
	}
	constructor() {
		super(), this._history = null;
	}
	static {
		this.styles = [...L.styles, o`
      .live {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        font-size: 11px;
        color: var(--muted);
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }
      .live::before {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--gold);
        box-shadow: 0 0 10px var(--gold);
        animation: pulse 2s infinite;
      }
      @keyframes pulse { 50% { opacity: 0.35; } }
      .hero { display: flex; align-items: baseline; gap: 6px; }
      .hero .num { font-size: 56px; line-height: 1; }
      .hero .unit { font-size: 20px; }
      .caption { color: var(--muted); font-size: 12.5px; margin: 6px 0 14px; }
      .flow { width: 100%; display: block; }
      .node { fill: var(--surface); stroke: var(--line-2); stroke-width: 1; cursor: pointer; }
      .node.hot { stroke: var(--gold-edge); }
      .glyph { fill: none; stroke: var(--gold-hi); stroke-width: 1.3; stroke-linecap: round; stroke-linejoin: round; pointer-events: none; }
      .rail { stroke: var(--line); stroke-width: 1.5; }
      .stream { stroke: var(--gold); stroke-width: 1.5; stroke-dasharray: 1.5 7; stroke-linecap: round; animation: flow 1.1s linear infinite; }
      .stream.rev { animation-direction: reverse; }
      @keyframes flow { to { stroke-dashoffset: -17; } }
      .flow text { fill: var(--muted); font-size: 8px; letter-spacing: 0.14em; text-transform: uppercase; font-family: var(--font); }
      .flow text.v { fill: var(--text); font-size: 11.5px; letter-spacing: 0; text-transform: none; }
      .battery { display: flex; align-items: center; gap: 14px; margin: 14px 0 20px; font-size: 12.5px; color: var(--muted); }
      .battery b { color: var(--text); font-weight: 500; }
      .bar { flex: 1; height: 4px; border-radius: 4px; background: var(--surface-hi); overflow: hidden; }
      .bar span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--gold-lo), var(--gold-hi)); transition: width 0.8s var(--ease); }
      .spark { width: 100%; height: 72px; display: block; margin-top: 6px; }
      .axis { display: flex; justify-content: space-between; font-size: 10px; color: var(--faint); margin-top: 6px; letter-spacing: 0.08em; }
      .stats { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; margin-top: 20px; border-top: 1px solid var(--line); padding-top: 18px; }
      .stat + .stat { border-left: 1px solid var(--line); padding-left: 14px; }
      .stat .k { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); }
      .stat .v { font-size: 20px; font-weight: 300; margin-top: 6px; }
      .stat .v small { font-size: 11px; color: var(--gold); margin-left: 2px; }
    `];
	}
	static getStubConfig() {
		return { entities: {
			home: "sensor.home_power",
			solar: "sensor.solar_power",
			grid: "sensor.grid_power"
		} };
	}
	setConfig(e) {
		if (!e.entities || !e.entities.home && !e.entities.solar && !e.entities.grid) throw Error("Specifica almeno una tra entities.home, entities.solar ed entities.grid");
		this._config = e, this._historyLoadedFor = void 0;
	}
	getCardSize() {
		return 8;
	}
	watchedEntities() {
		return Object.values(this._config?.entities ?? {}).filter((e) => !!e);
	}
	connectedCallback() {
		super.connectedCallback(), this._historyTimer = window.setInterval(() => this._loadHistory(), Ue);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), clearInterval(this._historyTimer);
	}
	updated() {
		let e = this._config?.entities.home;
		this.hass && e && this._historyLoadedFor !== e && (this._historyLoadedFor = e, this._loadHistory());
	}
	async _loadHistory() {
		let e = this._config?.entities.home;
		if (!this.hass || !e || this._config?.history === !1) return;
		let t = qe();
		try {
			let n = await this.hass.callWS({
				type: "history/history_during_period",
				start_time: new Date(t).toISOString(),
				entity_ids: [e],
				minimal_response: !0,
				no_attributes: !0
			}), r = String(this.hass.states[e]?.attributes.unit_of_measurement ?? "W") === "kW" ? 1e3 : 1, i = (n[e] ?? []).map((e) => ({
				t: e.lu * 1e3,
				w: parseFloat(e.s) * r
			})).filter((e) => !Number.isNaN(e.w)), a = [], o = 0, s = i[0]?.w ?? 0;
			for (let e = t; e <= Date.now(); e += We) {
				for (; o < i.length && i[o].t <= e;) s = i[o++].w;
				a.push({
					t: e,
					w: s
				});
			}
			this._history = a;
		} catch (e) {
			console.warn("luxury-energy-card: storico non disponibile", e), this._history = null;
		}
	}
	_renderFlow(e, t, n) {
		let r = this._config.entities, i = [
			...e === void 0 ? [] : [{
				key: "solar",
				label: "Solare",
				value: J(e),
				id: r.solar,
				hot: e > 10
			}],
			{
				key: "home",
				label: "Casa",
				value: J(t),
				id: r.home,
				hot: !0
			},
			...n === void 0 ? [] : [{
				key: "grid",
				label: "Rete",
				value: J(n, !0),
				id: r.grid,
				hot: n > 10
			}]
		], a = i.length === 3 ? [
			40,
			150,
			260
		] : i.length === 2 ? [75, 225] : [150], o = (e) => e === "home" ? 24 : 22;
		return O`
      <svg class="flow" viewBox="0 0 300 120">
        ${i.slice(1).map((t, r) => {
			let s = i[r], c = a[r] + o(s.key), l = a[r + 1] - o(t.key), u = t.key === "home" ? (e ?? 0) > 10 : Math.abs(n ?? 0) > 10, d = t.key === "grid" && (n ?? 0) > 0;
			return k`
            <line class="rail" x1=${c} y1="44" x2=${l} y2="44" />
            ${u ? k`<line class="stream ${d ? "rev" : ""}" x1=${c} y1="44" x2=${l} y2="44" />` : j}
          `;
		})}
        ${i.map((e, t) => k`
            <circle class="node ${e.hot ? "hot" : ""}" cx=${a[t]} cy="44" r=${o(e.key)}
              @click=${() => e.id && W(this, e.id)} />
            <g class="glyph" transform="translate(${a[t] - 12} 32)">${Je[e.key]}</g>
            <text x=${a[t]} y="92" text-anchor="middle">${e.label}</text>
            <text x=${a[t]} y="110" text-anchor="middle" class="v">${e.value}</text>
          `)}
      </svg>
    `;
	}
	_renderChart() {
		let e = this._history;
		if (!e || e.length < 2) return j;
		let t = qe(), n = Math.max(...e.map((e) => e.w), 1), r = e.map((e) => [(e.t - t) / Ge * 300, 68 - R(e.w, 0, n) / n * 60]), i = r.map((e, t) => `${t ? "L" : "M"}${e[0].toFixed(1)} ${e[1].toFixed(1)}`).join(" "), a = r[r.length - 1][0], o = (Date.now() - t) / Ge * 300;
		return O`
      <svg class="spark" viewBox="0 0 300 72" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" style="stop-color:var(--gold)" stop-opacity=".32" />
            <stop offset="1" style="stop-color:var(--gold)" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path d="${i} L${a} 72 L0 72 Z" fill="url(#sparkFill)" />
        <path d=${i} fill="none" style="stroke:var(--gold)" stroke-width="1.4" vector-effect="non-scaling-stroke" />
        <line x1=${o} x2=${o} y1="0" y2="72" stroke="rgba(255,240,220,.15)" stroke-dasharray="2 3" vector-effect="non-scaling-stroke" />
      </svg>
      <div class="axis"><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div>
    `;
	}
	render() {
		if (!this._config || !this.hass) return null;
		let e = this._config.entities, t = this.hass.states, n = (e) => e ? t[e] : void 0, r = K(n(e.solar)), i = K(n(e.battery));
		i !== void 0 && this._config.invert_battery && (i = -i);
		let a = K(n(e.grid));
		a !== void 0 && this._config.invert_grid && (a = -a);
		let o = K(n(e.home)) ?? (r ?? 0) + (a ?? 0) - (i ?? 0);
		a === void 0 && e.home && e.solar && (a = o + (i ?? 0) - r);
		let s = B(n(e.battery_soc)), c = q(n(e.consumption_today)), l = q(n(e.production_today)), u = q(n(e.grid_import_today)), d = c !== void 0 && u !== void 0 && c > 0 ? R(Math.round((1 - u / c) * 100), 0, 100) : void 0, f = Ke(o), p = a === void 0 ? "Consumo attuale" : `Consumo attuale · ${a < 0 ? "in immissione" : "dalla rete"} ${J(Math.abs(a))}`, m = [
			c === void 0 ? null : {
				k: "Consumo",
				v: c.toFixed(1),
				u: "kWh"
			},
			l === void 0 ? null : {
				k: "Prodotta",
				v: l.toFixed(1),
				u: "kWh"
			},
			d === void 0 ? null : {
				k: "Autonomia",
				v: String(d),
				u: "%"
			}
		].filter((e) => e !== null);
		return O`
      <div class="card">
        <div class="card-head">
          <div>
            ${this._config.room ? O`<p class="card-sub">${this._config.room}</p>` : null}
            <h2 class="card-title">${this._config.title ?? "Energia"}</h2>
          </div>
          <span class="live">Live</span>
        </div>
        <div class="hero"><span class="num">${f.num}</span><span class="unit">${f.unit}</span></div>
        <div class="caption">${p}</div>

        ${this._renderFlow(r, o, a)}

        ${s === void 0 ? null : O`<div class="battery">
              <span>Batteria <b>${Math.round(s)}%</b></span>
              <div class="bar"><span style="width:${R(s, 0, 100)}%"></span></div>
              ${i === void 0 ? null : O`<span>${J(i, !0)}</span>`}
            </div>`}

        ${this._config.history === !1 ? j : this._renderChart()}

        ${m.length ? O`<div class="stats">
              ${m.map((e) => O`<div class="stat"><div class="k">${e.k}</div><div class="v">${e.v}<small>${e.u}</small></div></div>`)}
            </div>` : null}
      </div>
    `;
	}
}, Xe = {
	bulb: k`<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>`,
	chandelier: k`<path d="M12 3v4M7 11a5 4 0 0 1 10 0M5 11h14l-2 4H7zM9 15v2M15 15v2M12 15v4"/>`,
	floor: k`<path d="M8 3h8l2 6H6zM12 9v11M8 21h8"/>`,
	strip: k`<rect x="3" y="10" width="18" height="4" rx="2"/><path d="M7 12h.01M12 12h.01M17 12h.01"/>`,
	ceiling: k`<path d="M4 7h16M8 7l-2 6h12l-2-6M10 16.5l-.5 1.5M14 16.5l.5 1.5M12 17v2"/>`,
	spot: k`<path d="M12 3v3M7 10l5-4 5 4-2 5H9zM9.5 18l-1 2M14.5 18l1 2M12 18v3"/>`,
	table: k`<path d="M7 4h10l2 7H5zM12 11v7M8 20h8"/>`
}, Ze = (e = "bulb") => e.includes(":") ? O`<ha-icon .icon=${e}></ha-icon>` : O`<svg class="icon" viewBox="0 0 24 24">${Xe[e] ?? Xe.bulb}</svg>`, Qe = class extends L {
	constructor(...e) {
		super(...e), this._brightness = new G(this);
	}
	static {
		this.styles = [...L.styles, o`
      .card { padding: 20px; }
      .card.on { border-color: var(--gold-edge); }
      .row { display: flex; align-items: center; gap: 14px; }
      .ico { width: 46px; height: 46px; cursor: pointer; }
      .text { flex: 1; min-width: 0; cursor: pointer; }
      .card-title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .state { font-size: 12px; color: var(--muted); margin-top: 3px; }
      .on .state { color: var(--gold-hi); }
      lux-slider { margin-top: 18px; --slider-height: 34px; --slider-radius: 12px; }
    `];
	}
	static getStubConfig() {
		return {
			entity: "light.example",
			room: "Camera"
		};
	}
	setConfig(e) {
		if (!e.entity) throw Error("Specifica un'entità (light.* o switch.*)");
		this._config = e;
	}
	watchedEntities() {
		return this._config ? [this._config.entity] : [];
	}
	getCardSize() {
		return this._config?.brightness === !1 ? 1 : 2;
	}
	render() {
		if (!this._config || !this.hass) return null;
		let e = this._config.entity, t = this.hass.states[e];
		if (!t) return this.renderWarning(`Entità non trovata: ${e}`);
		let n = H(t), r = V(t), i = Pe(t) && this._config.brightness !== !1, a = this._brightness.resolve(Ne(t)), o = r || this._brightness.active, s = n ? "Non disponibile" : o ? i ? `Accesa · ${a}%` : "Accesa" : "Spenta", c = () => !n && Fe(this.hass, e);
		return O`
      <div class="card ${o ? "on" : ""}">
        <div class="row">
          <button class="ico" aria-label="Accendi o spegni" @click=${c}>${Ze(this._config.icon)}</button>
          <div class="text" @click=${() => W(this, e)}>
            ${this._config.room ? O`<p class="card-sub">${this._config.room}</p>` : null}
            <h2 class="card-title">${U(t, this._config.name)}</h2>
            <div class="state">${s}</div>
          </div>
          <button
            class="switch"
            role="switch"
            aria-checked=${r}
            aria-label="Accendi o spegni"
            ?disabled=${n}
            @click=${c}
          ></button>
        </div>
        ${i ? O`<lux-slider
              label="Luminosità"
              .value=${a}
              ?off=${!r}
              ?disabled=${n}
              @value-changing=${(e) => this._brightness.drag(e.detail.value)}
              @value-changed=${(t) => {
			this._brightness.commit(t.detail.value), Le(this.hass, e, t.detail.value);
		}}
            ></lux-slider>` : null}
      </div>
    `;
	}
}, $e = 500, et = class extends L {
	constructor(...e) {
		super(...e), this._entries = [], this._held = !1;
	}
	static {
		this.styles = [...L.styles, o`
      .tiles { display: grid; grid-template-columns: repeat(var(--cols, 2), minmax(0, 1fr)); gap: 10px; }
      .tile {
        text-align: left;
        border: 1px solid var(--line);
        background: var(--surface);
        border-radius: var(--radius-sm);
        padding: 16px;
        min-height: 116px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        cursor: pointer;
        touch-action: manipulation;
        transition: background 0.4s var(--ease), border-color 0.4s var(--ease), transform 0.2s var(--ease);
      }
      .tile:active { transform: scale(0.98); }
      .tile:disabled { opacity: 0.45; cursor: default; }
      .name { font-size: 13.5px; font-weight: 500; margin-top: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .state { font-size: 12px; color: var(--muted); margin-top: 3px; }
      .tile.on {
        background: linear-gradient(160deg, rgba(200, 164, 106, 0.13), rgba(200, 164, 106, 0.03));
        border-color: var(--gold-edge);
      }
      .tile.on .state { color: var(--gold-hi); }
    `];
	}
	static getStubConfig() {
		return {
			title: "Soggiorno",
			entities: ["light.example_1", "light.example_2"]
		};
	}
	setConfig(e) {
		if (!Array.isArray(e.entities) || e.entities.length === 0) throw Error("Specifica almeno un'entità in `entities`");
		this._entries = e.entities.map((e) => typeof e == "string" ? { entity: e } : e), this._config = e;
	}
	watchedEntities() {
		return this._entries.map((e) => e.entity);
	}
	getCardSize() {
		return 1 + Math.ceil(this._entries.length / (this._config?.columns ?? 2)) * 2;
	}
	_pointerDown(e) {
		this._held = !1, clearTimeout(this._holdTimer), this._holdTimer = window.setTimeout(() => {
			this._held = !0, W(this, e);
		}, $e);
	}
	_click(e) {
		clearTimeout(this._holdTimer), this._held || Fe(this.hass, e), this._held = !1;
	}
	render() {
		if (!this._config || !this.hass) return null;
		let e = this.hass.states, t = this._entries.map((e) => e.entity), n = t.filter((t) => V(e[t])).length, r = n ? `${n} di ${t.length} accese` : "Tutte spente";
		return O`
      <div class="card">
        <div class="card-head">
          <div>
            ${this._config.title ? O`<p class="card-sub">${this._config.title}</p>` : null}
            <h2 class="card-title">${r}</h2>
          </div>
          ${this._config.master === !1 ? null : O`<button
                class="switch"
                role="switch"
                aria-checked=${n > 0}
                aria-label="Tutte le luci"
                @click=${() => Ie(this.hass, t, n === 0)}
              ></button>`}
        </div>
        <div class="tiles" style="--cols:${this._config.columns ?? 2}">
          ${this._entries.map((t) => {
			let n = e[t.entity], r = H(n), i = V(n), a = r ? "Non disponibile" : i ? Pe(n) ? `Accesa · ${Ne(n)}%` : "Accesa" : "Spenta";
			return O`
              <button
                class="tile ${i ? "on" : ""}"
                ?disabled=${r}
                @pointerdown=${() => this._pointerDown(t.entity)}
                @pointerleave=${() => clearTimeout(this._holdTimer)}
                @click=${() => this._click(t.entity)}
                @contextmenu=${(e) => e.preventDefault()}
              >
                <span class="ico">${Ze(t.icon)}</span>
                <span>
                  <div class="name">${U(n, t.name)}</div>
                  <div class="state">${a}</div>
                </span>
              </button>
            `;
		})}
        </div>
      </div>
    `;
	}
}, Y = 130, X = 100, Z = 135, Q = 270, tt = 60, $ = (e, t) => {
	let n = t * Math.PI / 180;
	return [Y + e * Math.cos(n), Y + e * Math.sin(n)];
}, nt = (e, t) => {
	let [n, r] = $(X, e), [i, a] = $(X, t);
	return `M${n} ${r} A${X} ${X} 0 ${+(t - e > 180)} 1 ${i} ${a}`;
}, rt = class extends L {
	constructor(...e) {
		super(...e), this._target = new G(this, .01), this._onDialDown = (e) => {
			if (H(this._entity)) return;
			let t = e.currentTarget, { min: n, max: r } = this._range, i = (e) => {
				let i = t.getBoundingClientRect(), a = (e.clientX - i.left) / i.width * 260 - Y, o = (e.clientY - i.top) / i.height * 260 - Y, s = (Math.atan2(o, a) * 180 / Math.PI - Z + 720) % 360;
				return s > Q && (s = s > 315 ? 0 : Q), this._round(n + (r - n) * s / Q);
			}, a = null;
			Re(e, t, (e) => {
				a = i(e), this._target.drag(a);
			}, () => {
				a !== null && (this._target.commit(a), this._setTemperature(a));
			});
		};
	}
	static {
		this.styles = [...L.styles, o`
      .card { --acc: var(--gold); --acc-hi: var(--gold-hi); --acc-lo: var(--gold-lo); }
      .card.off { --acc: #4a4640; --acc-hi: #5e5952; --acc-lo: #3a3732; }
      .dial { position: relative; width: 100%; max-width: 290px; margin: 0 auto; aspect-ratio: 1; }
      .dial svg { width: 100%; height: 100%; display: block; touch-action: none; cursor: grab; }
      .dial svg:active { cursor: grabbing; }
      .tick { stroke: var(--line-2); stroke-width: 1.2; stroke-linecap: round; transition: stroke 0.3s; }
      .tick.on { stroke: var(--acc); }
      .center {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        pointer-events: none;
      }
      .center .label { font-size: 10.5px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted); }
      .center .num { font-size: 68px; line-height: 1; margin: 6px 0 8px; }
      .center .num sup {
        font-size: 26px;
        color: var(--acc);
        font-weight: 300;
        vertical-align: top;
        position: relative;
        top: 8px;
        margin-left: 2px;
      }
      .center .meta { font-size: 12.5px; color: var(--muted); }
      .center .meta b { color: var(--text); font-weight: 400; }
      .steps { position: absolute; left: 0; right: 0; bottom: 4%; display: flex; justify-content: center; gap: 72px; }
      .round-btn {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 1px solid var(--line-2);
        background: transparent;
        display: grid;
        place-items: center;
        cursor: pointer;
        transition: all 0.3s var(--ease);
      }
      .round-btn:hover { border-color: var(--gold-edge); background: var(--gold-tint); }
      .round-btn:active { transform: scale(0.94); }
      .round-btn svg { width: 18px; height: 18px; }
      .status {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 7px;
        margin-top: 6px;
        font-size: 11px;
        color: var(--muted);
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }
      .status::before {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--faint);
      }
      .status.heating::before { background: var(--gold); box-shadow: 0 0 10px var(--gold); animation: pulse 2s infinite; }
      @keyframes pulse { 50% { opacity: 0.35; } }
    `];
	}
	static getStubConfig() {
		return {
			entity: "climate.example",
			room: "Soggiorno"
		};
	}
	setConfig(e) {
		if (!e.entity?.startsWith("climate.")) throw Error("Specifica un'entità climate.*");
		this._config = e;
	}
	getCardSize() {
		return 6;
	}
	watchedEntities() {
		return this._config ? [this._config.entity, this._config.humidity_entity].filter((e) => !!e) : [];
	}
	disconnectedCallback() {
		super.disconnectedCallback(), clearTimeout(this._stepTimer);
	}
	get _entity() {
		return this.hass?.states[this._config.entity];
	}
	get _range() {
		let e = this._entity;
		return {
			min: this._config.min ?? z(e, "min_temp") ?? 7,
			max: this._config.max ?? z(e, "max_temp") ?? 30,
			step: this._config.step ?? z(e, "target_temp_step") ?? .5
		};
	}
	_round(e) {
		let { min: t, max: n, step: r } = this._range;
		return R(Math.round(e / r) * r, t, n);
	}
	_setTemperature(e) {
		let t = this._entity?.state !== "off";
		this.hass.callService("climate", "set_temperature", {
			entity_id: this._config.entity,
			temperature: e,
			...t ? {} : { hvac_mode: "heat" }
		});
	}
	_step(e, t) {
		let n = this._round((this._stepping ?? t) + e * this._range.step);
		this._stepping = n, this._target.drag(n), clearTimeout(this._stepTimer), this._stepTimer = window.setTimeout(() => {
			this._stepping = void 0, this._target.commit(n), this._setTemperature(n);
		}, 700);
	}
	_toggle() {
		let e = this._entity?.state !== "off";
		this.hass.callService("climate", "set_hvac_mode", {
			entity_id: this._config.entity,
			hvac_mode: e ? "off" : "heat"
		});
	}
	render() {
		if (!this._config || !this.hass) return null;
		let e = this._entity;
		if (!e) return this.renderWarning(`Entità non trovata: ${this._config.entity}`);
		let t = H(e), { min: n, max: r } = this._range, i = !t && e.state !== "off", a = this._target.resolve(z(e, "temperature") ?? n), o = z(e, "current_temperature"), s = z(e, "current_humidity") ?? (this._config.humidity_entity ? B(this.hass.states[this._config.humidity_entity]) : void 0), c = e.attributes.hvac_action, l = i && (c ? c === "heating" : o !== void 0 && o < a), u = t ? "Non disponibile" : i ? l ? "Riscaldamento in corso" : "Temperatura raggiunta" : "Spento", d = R((a - n) / (r - n), 0, 1), f = Z + Math.max(Q * d, .01), [p, m] = $(X, f), h = i || this._target.active;
		return O`
      <div class="card ${h ? "" : "off"}">
        <div class="card-head">
          <div class="clickable" @click=${() => W(this, this._config.entity)}>
            ${this._config.room ? O`<p class="card-sub">${this._config.room}</p>` : null}
            <h2 class="card-title">${U(e, this._config.name ?? "Riscaldamento")}</h2>
          </div>
          <button
            class="switch"
            role="switch"
            aria-checked=${i}
            aria-label="Accendi o spegni il riscaldamento"
            ?disabled=${t}
            @click=${this._toggle}
          ></button>
        </div>

        <div class="dial">
          <svg viewBox="0 0 260 260" aria-label="Temperatura impostata" @pointerdown=${this._onDialDown}>
            <defs>
              <linearGradient id="grad" x1="0" x2="1" y1="1" y2="0">
                <stop offset="0" style="stop-color:var(--acc-lo)" />
                <stop offset="1" style="stop-color:var(--acc-hi)" />
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
            </defs>
            ${Array.from({ length: 61 }, (e, t) => {
			let n = Z + Q * t / tt, [r, i] = $(116, n), [a, o] = $(t % 10 == 0 ? 124 : 120, n);
			return k`<line class="tick ${h && t / tt <= d ? "on" : ""}" x1=${r} y1=${i} x2=${a} y2=${o} />`;
		})}
            <path d=${nt(Z, 405)} stroke="rgba(255,240,220,.08)" stroke-width="2" fill="none" stroke-linecap="round" />
            <path d=${nt(Z, f)} stroke="url(#grad)" stroke-width="6" fill="none" stroke-linecap="round" filter="url(#glow)" opacity=".55" />
            <path d=${nt(Z, f)} stroke="url(#grad)" stroke-width="3.5" fill="none" stroke-linecap="round" />
            <circle cx=${p} cy=${m} r="16" style="fill:var(--acc)" opacity=".14" />
            <circle cx=${p} cy=${m} r="8" fill="#1A1815" style="stroke:var(--acc-hi)" stroke-width="2" />
          </svg>
          <div class="center">
            <span class="label">Impostata</span>
            <span class="num">${h ? a.toFixed(1) : "—"}<sup>°</sup></span>
            <span class="meta">
              ${o === void 0 ? null : O`Attuale <b>${o.toFixed(1)}°</b>`}
              ${o !== void 0 && s !== void 0 ? " · " : null}
              ${s === void 0 ? null : O`Umidità <b>${Math.round(s)}%</b>`}
            </span>
          </div>
          <div class="steps">
            <button class="round-btn" aria-label="Diminuisci" ?disabled=${t} @click=${() => this._step(-1, a)}>
              <svg class="icon" viewBox="0 0 24 24"><path d="M6 12h12" /></svg>
            </button>
            <button class="round-btn" aria-label="Aumenta" ?disabled=${t} @click=${() => this._step(1, a)}>
              <svg class="icon" viewBox="0 0 24 24"><path d="M6 12h12M12 6v12" /></svg>
            </button>
          </div>
        </div>
        <div class="status ${l ? "heating" : ""}">${u}</div>
      </div>
    `;
	}
}, it = "0.2.0", at = [
	{
		tag: "luxury-light-group-card",
		cls: et,
		name: "Luxury · Gruppo luci",
		description: "Le luci di una stanza in riquadri, con contatore e interruttore generale."
	},
	{
		tag: "luxury-light-card",
		cls: Qe,
		name: "Luxury · Luce",
		description: "Una singola luce: acceso/spento e, se supportata, luminosità."
	},
	{
		tag: "luxury-dimmer-card",
		cls: He,
		name: "Luxury · Dimmer",
		description: "Dimmer grande con slider della luminosità."
	},
	{
		tag: "luxury-thermostat-card",
		cls: rt,
		name: "Luxury · Riscaldamento",
		description: "Termostato solo riscaldamento con quadrante circolare."
	},
	{
		tag: "luxury-cover-card",
		cls: Be,
		name: "Luxury · Tapparella",
		description: "Tapparella con finestra trascinabile, su/stop/giù e aperture rapide."
	},
	{
		tag: "luxury-energy-card",
		cls: Ye,
		name: "Luxury · Energia",
		description: "Flusso solare, casa e rete, batteria, grafico di oggi e totali."
	}
];
for (let e of at) customElements.get(e.tag) || customElements.define(e.tag, e.cls);
window.customCards = window.customCards ?? [];
for (let e of at) window.customCards.some((t) => t.type === e.tag) || window.customCards.push({
	type: e.tag,
	name: e.name,
	description: e.description,
	preview: !0
});
if (!document.querySelector("link[data-luxury-cards-font]")) {
	let e = document.createElement("link");
	e.rel = "stylesheet", e.href = "https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600&display=swap", e.dataset.luxuryCardsFont = "", document.head.appendChild(e);
}
console.info(`%c LUXURY CARDS %c v${it} `, "background:#C8A46A;color:#1A1714;font-weight:600", "color:#C8A46A");
//#endregion
