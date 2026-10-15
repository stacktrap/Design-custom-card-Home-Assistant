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
var oe = globalThis, se = (e) => e, v = oe.trustedTypes, ce = v ? v.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, le = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, ue = "?" + y, de = `<${ue}>`, b = document, x = () => b.createComment(""), S = (e) => e === null || typeof e != "object" && typeof e != "function", C = Array.isArray, fe = (e) => C(e) || typeof e?.[Symbol.iterator] == "function", pe = "[ 	\n\f\r]", w = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, me = /-->/g, he = />/g, T = RegExp(`>|${pe}(?:([^\\s"'>=/]+)(${pe}*=${pe}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ge = /'/g, _e = /"/g, ve = /^(?:script|style|textarea|title)$/i, ye = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), E = ye(1), D = ye(2), O = Symbol.for("lit-noChange"), k = Symbol.for("lit-nothing"), be = /* @__PURE__ */ new WeakMap(), A = b.createTreeWalker(b, 129);
function xe(e, t) {
	if (!C(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return ce === void 0 ? t : ce.createHTML(t);
}
var Se = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = w;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === w ? c[1] === "!--" ? o = me : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = T) : (ve.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = T) : o = he : o === T ? c[0] === ">" ? (o = i ?? w, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? T : c[3] === "\"" ? _e : ge) : o === _e || o === ge ? o = T : o === me || o === he ? o = w : (o = T, i = void 0);
		let d = o === T && e[t + 1].startsWith("/>") ? " " : "";
		a += o === w ? n + de : l >= 0 ? (r.push(s), n.slice(0, l) + le + n.slice(l) + y + d) : n + y + (l === -2 ? t : d);
	}
	return [xe(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Ce = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Se(t, n);
		if (this.el = e.createElement(l, r), A.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = A.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(le)) {
					let t = u[o++], n = i.getAttribute(e).split(y), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Ee : r[1] === "?" ? De : r[1] === "@" ? Oe : M
					}), i.removeAttribute(e);
				} else e.startsWith(y) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (ve.test(i.tagName)) {
					let e = i.textContent.split(y), t = e.length - 1;
					if (t > 0) {
						i.textContent = v ? v.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], x()), A.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], x());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === ue) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(y, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += y.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = b.createElement("template");
		return n.innerHTML = e, n;
	}
};
function j(e, t, n = e, r) {
	if (t === O) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = S(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = j(e, i._$AS(e, t.values), i, r)), t;
}
var we = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? b).importNode(t, !0);
		A.currentNode = r;
		let i = A.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new Te(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new ke(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = A.nextNode(), a++);
		}
		return A.currentNode = b, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, Te = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = k, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = j(this, e, t), S(e) ? e === k || e == null || e === "" ? (this._$AH !== k && this._$AR(), this._$AH = k) : e !== this._$AH && e !== O && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? fe(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== k && S(this._$AH) ? this._$AA.nextSibling.data = e : this.T(b.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Ce.createElement(xe(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new we(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = be.get(e.strings);
		return t === void 0 && be.set(e.strings, t = new Ce(e)), t;
	}
	k(t) {
		C(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(x()), this.O(x()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = se(e).nextSibling;
			se(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, M = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = k, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = k;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = j(this, e, t, 0), a = !S(e) || e !== this._$AH && e !== O, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = j(this, r[n + o], t, o), s === O && (s = this._$AH[o]), a ||= !S(s) || s !== this._$AH[o], s === k ? e = k : e !== k && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === k ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Ee = class extends M {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === k ? void 0 : e;
	}
}, De = class extends M {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== k);
	}
}, Oe = class extends M {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = j(this, e, t, 0) ?? k) === O) return;
		let n = this._$AH, r = e === k && n !== k || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== k && (n === k || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, ke = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		j(this, e);
	}
}, Ae = oe.litHtmlPolyfillSupport;
Ae?.(Ce, Te), (oe.litHtmlVersions ??= []).push("3.3.3");
var je = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new Te(t.insertBefore(x(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, N = globalThis, P = class extends _ {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = je(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return O;
	}
};
P._$litElement$ = !0, P.finalized = !0, N.litElementHydrateSupport?.({ LitElement: P });
var Me = N.litElementPolyfillSupport;
Me?.({ LitElement: P }), (N.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region src/shared/styles.ts
var Ne = o`
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

    --radius: var(--lux-radius, 24px);
    --radius-sm: var(--lux-radius-sm, 14px);
    --ease: cubic-bezier(0.22, 0.8, 0.24, 1);
    --font: var(--lux-font, "Manrope", -apple-system, "Helvetica Neue", sans-serif);

    display: block;
    container-type: inline-size;
    font-family: var(--font);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
  }
`, Pe = o`
  * { box-sizing: border-box; }
  button { font-family: inherit; color: inherit; }

  .card {
    position: relative;
    overflow: hidden;
    border-radius: var(--radius);
    padding: 20px;
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
    margin-bottom: 16px;
  }
  :host([compact]) .card { padding: 14px 16px; }
  :host([compact]) .card-head { margin-bottom: 10px; }
  .card-title { font-size: 14.5px; font-weight: 500; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .card-head > :first-child { min-width: 0; }
  .card-sub {
    font-size: 10.5px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin: 0 0 4px;
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
`, F = class extends P {
	static {
		this.properties = {
			hass: { attribute: !1 },
			_config: { state: !0 }
		};
	}
	static {
		this.styles = [Ne, Pe];
	}
	getCardSize() {
		return 2;
	}
	getGridOptions() {
		return {
			columns: 6,
			min_columns: 3
		};
	}
	willUpdate(e) {
		super.willUpdate(e), this.toggleAttribute("compact", !!this._config?.compact);
	}
	shouldUpdate(e) {
		if (e.has("_config")) return !0;
		let t = e.get("hass");
		return !t || !this.hass || this.watchedEntities().some((e) => t.states[e] !== this.hass.states[e]) || e.size > 1;
	}
	renderWarning(e) {
		return E`<div class="card"><p class="warning">${e}</p></div>`;
	}
}, I = (e, t, n) => Math.min(n, Math.max(t, e)), L = (e, t) => {
	let n = e?.attributes[t];
	return typeof n == "number" && !Number.isNaN(n) ? n : void 0;
}, R = (e) => {
	let t = e ? parseFloat(e.state) : NaN;
	return Number.isNaN(t) ? void 0 : t;
}, z = (e) => e?.state === "on", B = (e) => !e || e.state === "unavailable" || e.state === "unknown", V = (e, t) => t ?? e?.attributes.friendly_name ?? e?.entity_id ?? "", Fe = (e) => {
	let t = e?.attributes.brightness;
	return z(e) && typeof t == "number" ? Math.max(1, Math.round(t / 255 * 100)) : 0;
}, Ie = (e) => {
	if (!e || !e.entity_id.startsWith("light.")) return !1;
	let t = e.attributes.supported_color_modes;
	return Array.isArray(t) ? t.some((e) => e !== "onoff") : typeof e.attributes.brightness == "number";
}, Le = (e, t) => e.callService("homeassistant", "toggle", { entity_id: t }), Re = (e, t, n) => e.callService("homeassistant", n ? "turn_on" : "turn_off", { entity_id: t }), ze = (e, t, n) => e.callService("light", "turn_on", {
	entity_id: t,
	brightness_pct: I(Math.round(n), 1, 100)
}), H = (e, t) => e.dispatchEvent(new CustomEvent("hass-more-info", {
	detail: { entityId: t },
	bubbles: !0,
	composed: !0
})), Be = (e, t, n, r) => {
	t.setPointerCapture(e.pointerId), n(e);
	let i = (e) => n(e), a = (e) => {
		t.removeEventListener("pointermove", i), t.removeEventListener("pointerup", a), t.removeEventListener("pointercancel", a), r?.(e);
	};
	t.addEventListener("pointermove", i), t.addEventListener("pointerup", a), t.addEventListener("pointercancel", a);
}, Ve = {
	entity: "Entità",
	name: "Nome (opzionale)",
	room: "Stanza / sottotitolo (opzionale)",
	icon: "Icona",
	compact: "Versione compatta"
}, He = { select: {
	mode: "dropdown",
	custom_value: !0,
	options: [
		{
			value: "bulb",
			label: "Lampadina"
		},
		{
			value: "chandelier",
			label: "Lampadario"
		},
		{
			value: "ceiling",
			label: "Plafoniera"
		},
		{
			value: "floor",
			label: "Piantana"
		},
		{
			value: "table",
			label: "Lampada da tavolo"
		},
		{
			value: "spot",
			label: "Faretto"
		},
		{
			value: "strip",
			label: "Striscia LED"
		}
	]
} }, Ue, We = () => Ue ??= (async () => {
	customElements.get("ha-form") && customElements.get("ha-entity-picker") || await (await (await window.loadCardHelpers?.())?.createCardElement({
		type: "entities",
		entities: []
	}))?.constructor?.getConfigElement?.();
})(), Ge = class extends P {
	static {
		this.properties = {
			hass: { attribute: !1 },
			_config: { state: !0 },
			_ready: { state: !0 }
		};
	}
	constructor(e) {
		super(), this.spec = e, this._label = (e) => this.spec.labels[e.name] ?? Ve[e.name] ?? e.name, this._ready = !!customElements.get("ha-form");
	}
	static {
		this.styles = o`
    :host { display: block; }
    .loading { color: var(--secondary-text-color); font-size: 14px; padding: 8px 0; }
  `;
	}
	connectedCallback() {
		super.connectedCallback(), this._ready || We().catch(() => void 0).then(() => customElements.whenDefined("ha-form")).then(() => this._ready = !0);
	}
	setConfig(e) {
		this._config = e;
	}
	_changed(e) {
		if (e.stopPropagation(), !this._config) return;
		let t = { ...e.detail.value }, n = this.spec.fromForm ? this.spec.fromForm(t, this._config) : {
			...this._config,
			...t
		};
		n = Object.fromEntries(Object.entries(n).filter(([, e]) => e !== void 0 && e !== "" && e !== null)), this._config = n, this.dispatchEvent(new CustomEvent("config-changed", {
			detail: { config: n },
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		if (!this._config || !this.hass) return null;
		if (!this._ready) return E`<div class="loading">Caricamento editor…</div>`;
		let e = this.spec.toForm ? this.spec.toForm(this._config) : this._config;
		return E`
      <ha-form
        .hass=${this.hass}
        .data=${e}
        .schema=${this.spec.schema}
        .computeLabel=${this._label}
        @value-changed=${this._changed}
      ></ha-form>
    `;
	}
}, U = (e, t) => (customElements.get(e) || customElements.define(e, class extends Ge {
	constructor() {
		super(t);
	}
}), () => document.createElement(e)), W = class {
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
}, Ke = U("luxury-cover-card-editor", {
	schema: [
		{
			name: "entity",
			required: !0,
			selector: { entity: { domain: "cover" } }
		},
		{
			type: "grid",
			name: "",
			schema: [{
				name: "name",
				selector: { text: {} }
			}, {
				name: "room",
				selector: { text: {} }
			}]
		},
		{
			name: "presets",
			selector: { text: {} }
		},
		{
			name: "compact",
			selector: { boolean: {} }
		}
	],
	labels: { presets: "Aperture rapide in % (es. 25, 50, 75)" },
	toForm: (e) => ({
		...e,
		presets: (e.presets ?? [
			25,
			50,
			75
		]).join(", ")
	}),
	fromForm: (e, t) => {
		let n = String(e.presets ?? "").split(/[,;\s]+/).map(Number).filter((e) => Number.isFinite(e) && e >= 0 && e <= 100);
		return {
			...t,
			...e,
			presets: n.length ? n : void 0
		};
	}
}), qe = 4, Je = class extends F {
	constructor(...e) {
		super(...e), this._position = new W(this), this._onWindowDown = (e) => {
			let t = e.currentTarget, n = null;
			t.classList.add("dragging"), Be(e, t, (e) => {
				let r = t.getBoundingClientRect();
				n = I(Math.round(100 - (e.clientY - r.top) / r.height * 100), 0, 100), this._position.drag(n);
			}, () => {
				t.classList.remove("dragging"), n !== null && this._setPosition(n);
			});
		};
	}
	static {
		this.styles = [...F.styles, o`
      .body { display: grid; grid-template-columns: 84px 1fr; gap: 18px; align-items: center; }
      .window {
        position: relative;
        height: 120px;
        border-radius: 12px;
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
      .info .num { font-size: 42px; line-height: 1; }
      .info .unit { font-size: 17px; }
      .state { color: var(--muted); font-size: 12px; margin: 4px 0 12px; }
      .controls { display: flex; gap: 8px; }
      .round-btn {
        width: 38px;
        height: 38px;
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
      .round-btn svg { width: 16px; height: 16px; }
      .chips { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 14px; }
      .chip {
        border: 1px solid var(--line-2);
        background: transparent;
        color: var(--muted);
        font-size: 11.5px;
        padding: 6px 12px;
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
      /* Compact: no window drawing, everything on one row */
      :host([compact]) .body { grid-template-columns: 1fr; }
      :host([compact]) .window { display: none; }
      :host([compact]) .info { display: flex; align-items: center; gap: 12px; }
      :host([compact]) .info .num { font-size: 30px; }
      :host([compact]) .state { display: none; }
      :host([compact]) .controls { margin-left: auto; }
      :host([compact]) .chips { display: none; }
      @container (max-width: 260px) {
        .body { grid-template-columns: 64px 1fr; gap: 12px; }
        .window { height: 100px; }
      }
    `];
	}
	static {
		this.getConfigElement = Ke;
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
		let n = B(t), r = ((L(t, "supported_features") ?? 0) & qe) !== 0, i = L(t, "current_position") ?? (t.state === "closed" ? 0 : 100), a = this._position.resolve(i), o = t.state === "opening" || t.state === "closing", s = this._config.presets ?? [
			25,
			50,
			75
		], c = n ? "Non disponibile" : t.state === "opening" ? "In apertura" : t.state === "closing" ? "In chiusura" : a === 0 ? "Chiusa" : a === 100 ? "Aperta" : "Parzialmente aperta";
		return E`
      <div class="card">
        <div class="card-head">
          <div class="clickable" @click=${() => H(this, e)}>
            ${this._config.room ? E`<p class="card-sub">${this._config.room}</p>` : null}
            <h2 class="card-title">${V(t, this._config.name)}</h2>
          </div>
          ${o ? E`<span class="moving">In movimento</span>` : null}
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
        ${r && s.length ? E`<div class="chips">
              ${s.map((e) => E`<button
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
}, Ye = class extends P {
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
				return I(Math.round((e.clientX - n.left) / n.width * 100), 1, 100);
			};
			Be(e, t, (e) => {
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
			t && (e.preventDefault(), this._commit(I(this._shown + t, 1, 100)));
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
		return E`
      <div
        class="track ${this.marks ? "handle" : ""} ${this._drag === null ? "" : "dragging"} ${e ? "active" : ""}"
        @pointerdown=${this._onPointerDown}
      >
        ${this.marks ? E`<div class="marks"><i></i><i></i><i></i><i></i><i></i></div>` : null}
        <div class="fill" style="width:${t}%"></div>
      </div>
    `;
	}
};
customElements.get("lux-slider") || customElements.define("lux-slider", Ye);
//#endregion
//#region src/cards/dimmer-card.ts
var Xe = U("luxury-dimmer-card-editor", {
	schema: [
		{
			name: "entity",
			required: !0,
			selector: { entity: { domain: "light" } }
		},
		{
			type: "grid",
			name: "",
			schema: [{
				name: "name",
				selector: { text: {} }
			}, {
				name: "room",
				selector: { text: {} }
			}]
		},
		{
			name: "compact",
			selector: { boolean: {} }
		}
	],
	labels: {}
}), Ze = class extends F {
	constructor(...e) {
		super(...e), this._brightness = new W(this);
	}
	static {
		this.styles = [...F.styles, o`
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
      .value { position: relative; display: flex; align-items: baseline; gap: 4px; margin: 2px 0 2px; }
      .value .num { font-size: 48px; line-height: 1; }
      .value .unit { font-size: 18px; }
      .label { position: relative; color: var(--muted); font-size: 12px; margin-bottom: 16px; }
      lux-slider { --slider-height: 48px; --slider-radius: 15px; }
      .inline { display: none; font-size: 13px; color: var(--gold-hi); font-variant-numeric: tabular-nums; margin-left: auto; }
      :host([compact]) .value,
      :host([compact]) .label { display: none; }
      :host([compact]) .inline { display: block; }
      :host([compact]) lux-slider { --slider-height: 38px; --slider-radius: 12px; }
    `];
	}
	static {
		this.getConfigElement = Xe;
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
		let n = B(t), r = z(t), i = this._brightness.resolve(Fe(t)), a = r || this._brightness.active;
		return E`
      <div class="card" style="--glow-o:${a ? (.08 + i / 100 * .32).toFixed(2) : "0"}">
        <div class="card-head">
          <div class="clickable" @click=${() => H(this, e)}>
            ${this._config.room ? E`<p class="card-sub">${this._config.room}</p>` : null}
            <h2 class="card-title">${V(t, this._config.name)}</h2>
          </div>
          <span class="inline">${a ? `${i}%` : "Spenta"}</span>
          <button
            class="switch"
            role="switch"
            aria-checked=${r}
            aria-label="Accendi o spegni"
            ?disabled=${n}
            @click=${() => Le(this.hass, e)}
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
			this._brightness.commit(t.detail.value), ze(this.hass, e, t.detail.value);
		}}
        ></lux-slider>
      </div>
    `;
	}
}, G = (e) => ({ entity: {
	domain: "sensor",
	device_class: e
} }), Qe = U("luxury-energy-card-editor", {
	schema: [
		{
			type: "grid",
			name: "",
			schema: [{
				name: "title",
				selector: { text: {} }
			}, {
				name: "room",
				selector: { text: {} }
			}]
		},
		{
			type: "expandable",
			name: "entities",
			title: "Sensori",
			schema: [
				{
					name: "home",
					selector: G("power")
				},
				{
					name: "solar",
					selector: G("power")
				},
				{
					name: "grid",
					selector: G("power")
				},
				{
					name: "battery",
					selector: G("power")
				},
				{
					name: "battery_soc",
					selector: G("battery")
				},
				{
					name: "consumption_today",
					selector: G("energy")
				},
				{
					name: "production_today",
					selector: G("energy")
				},
				{
					name: "grid_import_today",
					selector: G("energy")
				}
			]
		},
		{
			type: "grid",
			name: "",
			schema: [
				{
					name: "invert_grid",
					selector: { boolean: {} }
				},
				{
					name: "invert_battery",
					selector: { boolean: {} }
				},
				{
					name: "history",
					selector: { boolean: {} }
				},
				{
					name: "compact",
					selector: { boolean: {} }
				}
			]
		}
	],
	labels: {
		title: "Titolo",
		home: "Consumo casa (potenza)",
		solar: "Produzione solare (potenza)",
		grid: "Rete (potenza, + prelievo)",
		battery: "Batteria (potenza, + in carica)",
		battery_soc: "Batteria (%)",
		consumption_today: "Energia consumata oggi",
		production_today: "Energia prodotta oggi",
		grid_import_today: "Energia prelevata oggi",
		invert_grid: "Inverti segno rete",
		invert_battery: "Inverti segno batteria",
		history: "Grafico di oggi"
	},
	toForm: (e) => ({
		...e,
		entities: e.entities ?? {},
		history: e.history ?? !0
	}),
	fromForm: (e, t) => {
		let n = Object.fromEntries(Object.entries(e.entities ?? {}).filter(([, e]) => !!e));
		return {
			...t,
			...e,
			entities: n
		};
	}
}), $e = 6e5, et = 9e5, tt = 864e5, K = (e) => {
	let t = R(e);
	if (t === void 0) return;
	let n = String(e.attributes.unit_of_measurement ?? "W");
	return n === "kW" ? t * 1e3 : n === "MW" ? t * 1e6 : t;
}, q = (e) => {
	let t = R(e);
	if (t === void 0) return;
	let n = String(e.attributes.unit_of_measurement ?? "kWh");
	return n === "Wh" ? t / 1e3 : n === "MWh" ? t * 1e3 : t;
}, nt = (e) => Math.abs(e) < 1e3 ? {
	num: String(Math.round(e)),
	unit: "W"
} : {
	num: (e / 1e3).toFixed(2),
	unit: "kW"
}, J = (e, t = !1) => {
	let { num: n, unit: r } = nt(Math.abs(e));
	return `${t ? e < 0 ? "−" : "+" : ""}${n} ${r}`;
}, rt = () => {
	let e = /* @__PURE__ */ new Date();
	return e.setHours(0, 0, 0, 0), e.getTime();
}, it = {
	solar: D`<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>`,
	home: D`<path d="M4 11l8-7 8 7M6 9.5V20h12V9.5M10 20v-5h4v5"/>`,
	grid: D`<path d="M12 3l-5 18M12 3l5 18M8.5 15h7M9.6 11h4.8M5 7h14M12 3v4"/>`
}, at = class extends F {
	static {
		this.properties = {
			...F.properties,
			_history: { state: !0 }
		};
	}
	constructor() {
		super(), this._history = null;
	}
	static {
		this.styles = [...F.styles, o`
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
      .hero .num { font-size: 42px; line-height: 1; }
      .hero .unit { font-size: 17px; }
      .caption { color: var(--muted); font-size: 12px; margin: 4px 0 8px; }
      .flow { width: 100%; max-width: 340px; margin: 0 auto; display: block; }
      .node { fill: var(--surface); stroke: var(--line-2); stroke-width: 1; cursor: pointer; }
      .node.hot { stroke: var(--gold-edge); }
      .glyph { fill: none; stroke: var(--gold-hi); stroke-width: 1.3; stroke-linecap: round; stroke-linejoin: round; pointer-events: none; }
      .rail { stroke: var(--line); stroke-width: 1.5; }
      .stream { stroke: var(--gold); stroke-width: 1.5; stroke-dasharray: 1.5 7; stroke-linecap: round; animation: flow 1.1s linear infinite; }
      .stream.rev { animation-direction: reverse; }
      @keyframes flow { to { stroke-dashoffset: -17; } }
      .flow text { fill: var(--muted); font-size: 8px; letter-spacing: 0.14em; text-transform: uppercase; font-family: var(--font); }
      .flow text.v { fill: var(--text); font-size: 11.5px; letter-spacing: 0; text-transform: none; }
      .battery { display: flex; align-items: center; gap: 12px; margin: 8px 0 12px; font-size: 12.5px; color: var(--muted); }
      .battery b { color: var(--text); font-weight: 500; }
      .bar { flex: 1; height: 4px; border-radius: 4px; background: var(--surface-hi); overflow: hidden; }
      .bar span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--gold-lo), var(--gold-hi)); transition: width 0.8s var(--ease); }
      .spark { width: 100%; height: 56px; display: block; margin-top: 4px; }
      .axis { display: flex; justify-content: space-between; font-size: 10px; color: var(--faint); margin-top: 6px; letter-spacing: 0.08em; }
      .stats { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; margin-top: 14px; border-top: 1px solid var(--line); padding-top: 12px; }
      .stat + .stat { border-left: 1px solid var(--line); padding-left: 14px; }
      .stat .k { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); }
      .stat .v { font-size: 18px; font-weight: 300; margin-top: 4px; }
      /* Compact: live numbers and flow only */
      :host([compact]) .hero .num { font-size: 32px; }
      :host([compact]) .spark,
      :host([compact]) .axis,
      :host([compact]) .stats { display: none; }
      .stat .v small { font-size: 11px; color: var(--gold); margin-left: 2px; }
    `];
	}
	static {
		this.getConfigElement = Qe;
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
	getGridOptions() {
		return {
			columns: 12,
			min_columns: 6
		};
	}
	watchedEntities() {
		return Object.values(this._config?.entities ?? {}).filter((e) => !!e);
	}
	connectedCallback() {
		super.connectedCallback(), this._historyTimer = window.setInterval(() => this._loadHistory(), $e);
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
		let t = rt();
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
			for (let e = t; e <= Date.now(); e += et) {
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
		return E`
      <svg class="flow" viewBox="0 16 300 100">
        ${i.slice(1).map((t, r) => {
			let s = i[r], c = a[r] + o(s.key), l = a[r + 1] - o(t.key), u = t.key === "home" ? (e ?? 0) > 10 : Math.abs(n ?? 0) > 10, d = t.key === "grid" && (n ?? 0) > 0;
			return D`
            <line class="rail" x1=${c} y1="44" x2=${l} y2="44" />
            ${u ? D`<line class="stream ${d ? "rev" : ""}" x1=${c} y1="44" x2=${l} y2="44" />` : k}
          `;
		})}
        ${i.map((e, t) => D`
            <circle class="node ${e.hot ? "hot" : ""}" cx=${a[t]} cy="44" r=${o(e.key)}
              @click=${() => e.id && H(this, e.id)} />
            <g class="glyph" transform="translate(${a[t] - 12} 32)">${it[e.key]}</g>
            <text x=${a[t]} y="92" text-anchor="middle">${e.label}</text>
            <text x=${a[t]} y="110" text-anchor="middle" class="v">${e.value}</text>
          `)}
      </svg>
    `;
	}
	_renderChart() {
		let e = this._history;
		if (!e || e.length < 2) return k;
		let t = rt(), n = Math.max(...e.map((e) => e.w), 1), r = e.map((e) => [(e.t - t) / tt * 300, 68 - I(e.w, 0, n) / n * 60]), i = r.map((e, t) => `${t ? "L" : "M"}${e[0].toFixed(1)} ${e[1].toFixed(1)}`).join(" "), a = r[r.length - 1][0], o = (Date.now() - t) / tt * 300;
		return E`
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
		let s = R(n(e.battery_soc)), c = q(n(e.consumption_today)), l = q(n(e.production_today)), u = q(n(e.grid_import_today)), d = c !== void 0 && u !== void 0 && c > 0 ? I(Math.round((1 - u / c) * 100), 0, 100) : void 0, f = nt(o), p = a === void 0 ? "Consumo attuale" : `Consumo attuale · ${a < 0 ? "in immissione" : "dalla rete"} ${J(Math.abs(a))}`, m = [
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
		return E`
      <div class="card">
        <div class="card-head">
          <div>
            ${this._config.room ? E`<p class="card-sub">${this._config.room}</p>` : null}
            <h2 class="card-title">${this._config.title ?? "Energia"}</h2>
          </div>
          <span class="live">Live</span>
        </div>
        <div class="hero"><span class="num">${f.num}</span><span class="unit">${f.unit}</span></div>
        <div class="caption">${p}</div>

        ${this._renderFlow(r, o, a)}

        ${s === void 0 ? null : E`<div class="battery">
              <span>Batteria <b>${Math.round(s)}%</b></span>
              <div class="bar"><span style="width:${I(s, 0, 100)}%"></span></div>
              ${i === void 0 ? null : E`<span>${J(i, !0)}</span>`}
            </div>`}

        ${this._config.history === !1 ? k : this._renderChart()}

        ${m.length ? E`<div class="stats">
              ${m.map((e) => E`<div class="stat"><div class="k">${e.k}</div><div class="v">${e.v}<small>${e.u}</small></div></div>`)}
            </div>` : null}
      </div>
    `;
	}
}, ot = {
	bulb: D`<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>`,
	chandelier: D`<path d="M12 3v4M7 11a5 4 0 0 1 10 0M5 11h14l-2 4H7zM9 15v2M15 15v2M12 15v4"/>`,
	floor: D`<path d="M8 3h8l2 6H6zM12 9v11M8 21h8"/>`,
	strip: D`<rect x="3" y="10" width="18" height="4" rx="2"/><path d="M7 12h.01M12 12h.01M17 12h.01"/>`,
	ceiling: D`<path d="M4 7h16M8 7l-2 6h12l-2-6M10 16.5l-.5 1.5M14 16.5l.5 1.5M12 17v2"/>`,
	spot: D`<path d="M12 3v3M7 10l5-4 5 4-2 5H9zM9.5 18l-1 2M14.5 18l1 2M12 18v3"/>`,
	table: D`<path d="M7 4h10l2 7H5zM12 11v7M8 20h8"/>`
}, st = (e = "bulb") => e.includes(":") ? E`<ha-icon .icon=${e}></ha-icon>` : E`<svg class="icon" viewBox="0 0 24 24">${ot[e] ?? ot.bulb}</svg>`, ct = U("luxury-light-card-editor", {
	schema: [
		{
			name: "entity",
			required: !0,
			selector: { entity: { filter: [{ domain: "light" }, { domain: "switch" }] } }
		},
		{
			type: "grid",
			name: "",
			schema: [{
				name: "name",
				selector: { text: {} }
			}, {
				name: "room",
				selector: { text: {} }
			}]
		},
		{
			name: "icon",
			selector: He
		},
		{
			type: "grid",
			name: "",
			schema: [{
				name: "brightness",
				selector: { boolean: {} }
			}, {
				name: "compact",
				selector: { boolean: {} }
			}]
		}
	],
	labels: { brightness: "Slider luminosità (se supportata)" },
	toForm: (e) => ({
		...e,
		brightness: e.brightness ?? !0
	})
}), lt = class extends F {
	constructor(...e) {
		super(...e), this._brightness = new W(this);
	}
	static {
		this.styles = [...F.styles, o`
      .card { padding: 16px 18px; }
      .card.on { border-color: var(--gold-edge); }
      .row { display: flex; align-items: center; gap: 12px; }
      .ico { width: 40px; height: 40px; cursor: pointer; }
      .text { flex: 1; min-width: 0; cursor: pointer; }
      .card-title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .state { font-size: 12px; color: var(--muted); margin-top: 3px; }
      .on .state { color: var(--gold-hi); }
      lux-slider { margin-top: 14px; --slider-height: 30px; --slider-radius: 10px; }
      :host([compact]) .card { padding: 10px 14px; }
      :host([compact]) .ico { width: 34px; height: 34px; }
      :host([compact]) .card-sub { display: none; }
      :host([compact]) lux-slider { margin-top: 10px; --slider-height: 24px; --slider-radius: 8px; }
    `];
	}
	static {
		this.getConfigElement = ct;
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
		let n = B(t), r = z(t), i = Ie(t) && this._config.brightness !== !1, a = this._brightness.resolve(Fe(t)), o = r || this._brightness.active, s = n ? "Non disponibile" : o ? i ? `Accesa · ${a}%` : "Accesa" : "Spenta", c = () => !n && Le(this.hass, e);
		return E`
      <div class="card ${o ? "on" : ""}">
        <div class="row">
          <button class="ico" aria-label="Accendi o spegni" @click=${c}>${st(this._config.icon)}</button>
          <div class="text" @click=${() => H(this, e)}>
            ${this._config.room ? E`<p class="card-sub">${this._config.room}</p>` : null}
            <h2 class="card-title">${V(t, this._config.name)}</h2>
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
        ${i ? E`<lux-slider
              label="Luminosità"
              .value=${a}
              ?off=${!r}
              ?disabled=${n}
              @value-changing=${(e) => this._brightness.drag(e.detail.value)}
              @value-changed=${(t) => {
			this._brightness.commit(t.detail.value), ze(this.hass, e, t.detail.value);
		}}
            ></lux-slider>` : null}
      </div>
    `;
	}
}, ut = U("luxury-light-group-card-editor", {
	schema: [
		{
			name: "title",
			selector: { text: {} }
		},
		{
			name: "entities",
			required: !0,
			selector: { entity: {
				multiple: !0,
				filter: [{ domain: "light" }, { domain: "switch" }]
			} }
		},
		{
			type: "grid",
			name: "",
			schema: [
				{
					name: "columns",
					selector: { number: {
						min: 1,
						max: 4,
						mode: "box"
					} }
				},
				{
					name: "master",
					selector: { boolean: {} }
				},
				{
					name: "compact",
					selector: { boolean: {} }
				}
			]
		}
	],
	labels: {
		title: "Stanza",
		entities: "Luci",
		columns: "Colonne",
		master: "Interruttore generale"
	},
	toForm: (e) => ({
		...e,
		master: e.master ?? !0,
		columns: e.columns ?? 2,
		entities: (e.entities ?? []).map((e) => typeof e == "string" ? e : e.entity)
	}),
	fromForm: (e, t) => {
		let n = t.entities ?? [], r = (e.entities ?? []).map((e) => n.find((t) => typeof t != "string" && t.entity === e) ?? e);
		return {
			...t,
			...e,
			entities: r
		};
	}
}), dt = 500, ft = class extends F {
	constructor(...e) {
		super(...e), this._entries = [], this._held = !1;
	}
	static {
		this.styles = [...F.styles, o`
      .tiles { display: grid; grid-template-columns: repeat(var(--cols, 2), minmax(0, 1fr)); gap: 8px; }
      .tile {
        text-align: left;
        border: 1px solid var(--line);
        background: var(--surface);
        border-radius: var(--radius-sm);
        padding: 12px 14px;
        min-height: 92px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        cursor: pointer;
        touch-action: manipulation;
        transition: background 0.4s var(--ease), border-color 0.4s var(--ease), transform 0.2s var(--ease);
      }
      .tile:active { transform: scale(0.98); }
      .tile:disabled { opacity: 0.45; cursor: default; }
      .name { font-size: 13px; font-weight: 500; margin-top: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .state { font-size: 11.5px; color: var(--muted); margin-top: 2px; }
      .tile .ico { width: 32px; height: 32px; --mdc-icon-size: 18px; }
      .tile .ico svg { width: 18px; height: 18px; }
      /* Compact: one row per light, icon beside the text */
      :host([compact]) .tile { min-height: 0; flex-direction: row; align-items: center; justify-content: flex-start; gap: 10px; padding: 9px 10px; }
      :host([compact]) .tile > span:last-child { min-width: 0; }
      :host([compact]) .name { margin-top: 0; }
      .tile.on {
        background: linear-gradient(160deg, rgba(200, 164, 106, 0.13), rgba(200, 164, 106, 0.03));
        border-color: var(--gold-edge);
      }
      .tile.on .state { color: var(--gold-hi); }
    `];
	}
	static {
		this.getConfigElement = ut;
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
	getGridOptions() {
		return {
			columns: 12,
			min_columns: 6
		};
	}
	getCardSize() {
		return 1 + Math.ceil(this._entries.length / (this._config?.columns ?? 2)) * 2;
	}
	_pointerDown(e) {
		this._held = !1, clearTimeout(this._holdTimer), this._holdTimer = window.setTimeout(() => {
			this._held = !0, H(this, e);
		}, dt);
	}
	_click(e) {
		clearTimeout(this._holdTimer), this._held || Le(this.hass, e), this._held = !1;
	}
	render() {
		if (!this._config || !this.hass) return null;
		let e = this.hass.states, t = this._entries.map((e) => e.entity), n = t.filter((t) => z(e[t])).length, r = n ? `${n} di ${t.length} accese` : "Tutte spente";
		return E`
      <div class="card">
        <div class="card-head">
          <div>
            ${this._config.title ? E`<p class="card-sub">${this._config.title}</p>` : null}
            <h2 class="card-title">${r}</h2>
          </div>
          ${this._config.master === !1 ? null : E`<button
                class="switch"
                role="switch"
                aria-checked=${n > 0}
                aria-label="Tutte le luci"
                @click=${() => Re(this.hass, t, n === 0)}
              ></button>`}
        </div>
        <div class="tiles" style="--cols:${this._config.columns ?? 2}">
          ${this._entries.map((t) => {
			let n = e[t.entity], r = B(n), i = z(n), a = r ? "Non disponibile" : i ? Ie(n) ? `Accesa · ${Fe(n)}%` : "Accesa" : "Spenta";
			return E`
              <button
                class="tile ${i ? "on" : ""}"
                ?disabled=${r}
                @pointerdown=${() => this._pointerDown(t.entity)}
                @pointerleave=${() => clearTimeout(this._holdTimer)}
                @click=${() => this._click(t.entity)}
                @contextmenu=${(e) => e.preventDefault()}
              >
                <span class="ico">${st(t.icon)}</span>
                <span>
                  <div class="name">${V(n, t.name)}</div>
                  <div class="state">${a}</div>
                </span>
              </button>
            `;
		})}
        </div>
      </div>
    `;
	}
}, pt = U("luxury-thermostat-card-editor", {
	schema: [
		{
			name: "entity",
			required: !0,
			selector: { entity: { domain: "climate" } }
		},
		{
			type: "grid",
			name: "",
			schema: [{
				name: "name",
				selector: { text: {} }
			}, {
				name: "room",
				selector: { text: {} }
			}]
		},
		{
			name: "humidity_entity",
			selector: { entity: {
				domain: "sensor",
				device_class: "humidity"
			} }
		},
		{
			type: "grid",
			name: "",
			schema: [
				{
					name: "min",
					selector: { number: {
						min: 5,
						max: 35,
						step: .5,
						mode: "box",
						unit_of_measurement: "°C"
					} }
				},
				{
					name: "max",
					selector: { number: {
						min: 5,
						max: 35,
						step: .5,
						mode: "box",
						unit_of_measurement: "°C"
					} }
				},
				{
					name: "step",
					selector: { number: {
						min: .1,
						max: 1,
						step: .1,
						mode: "box"
					} }
				}
			]
		},
		{
			name: "compact",
			selector: { boolean: {} }
		}
	],
	labels: {
		humidity_entity: "Sensore umidità (opzionale)",
		min: "Minima (opz.)",
		max: "Massima (opz.)",
		step: "Passo (opz.)"
	}
}), Y = 130, X = 100, Z = 135, Q = 270, mt = 60, $ = (e, t) => {
	let n = t * Math.PI / 180;
	return [Y + e * Math.cos(n), Y + e * Math.sin(n)];
}, ht = (e, t) => {
	let [n, r] = $(X, e), [i, a] = $(X, t);
	return `M${n} ${r} A${X} ${X} 0 ${+(t - e > 180)} 1 ${i} ${a}`;
}, gt = class extends F {
	constructor(...e) {
		super(...e), this._target = new W(this, .01), this._onDialDown = (e) => {
			if (B(this._entity)) return;
			let t = e.currentTarget, { min: n, max: r } = this._range, i = (e) => {
				let i = t.getBoundingClientRect(), a = (e.clientX - i.left) / i.width * 260 - Y, o = (e.clientY - i.top) / i.height * 260 - Y, s = (Math.atan2(o, a) * 180 / Math.PI - Z + 720) % 360;
				return s > Q && (s = s > 315 ? 0 : Q), this._round(n + (r - n) * s / Q);
			}, a = null;
			Be(e, t, (e) => {
				a = i(e), this._target.drag(a);
			}, () => {
				a !== null && (this._target.commit(a), this._setTemperature(a));
			});
		};
	}
	static {
		this.styles = [...F.styles, o`
      .card { --acc: var(--gold); --acc-hi: var(--gold-hi); --acc-lo: var(--gold-lo); }
      .card.off { --acc: #4a4640; --acc-hi: #5e5952; --acc-lo: #3a3732; }
      .dial { position: relative; width: 100%; max-width: 230px; margin: -4px auto 0; aspect-ratio: 1; }
      :host([compact]) .dial { max-width: 170px; }
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
      .center .num { font-size: 50px; line-height: 1; margin: 4px 0 6px; }
      :host([compact]) .center .num { font-size: 38px; }
      :host([compact]) .center .meta { font-size: 10.5px; }
      .center .num sup {
        font-size: 0.4em;
        color: var(--acc);
        font-weight: 300;
        vertical-align: top;
        position: relative;
        top: 0.12em;
        margin-left: 2px;
      }
      .center .meta { font-size: 11.5px; color: var(--muted); }
      :host([compact]) .center .label,
      :host([compact]) .hum { display: none; }
      .center .meta b { color: var(--text); font-weight: 400; }
      .steps { position: absolute; left: 0; right: 0; bottom: 2%; display: flex; justify-content: center; gap: 26%; }
      .round-btn {
        width: 38px;
        height: 38px;
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
      .round-btn svg { width: 16px; height: 16px; }
      :host([compact]) .round-btn { width: 32px; height: 32px; }
      .status {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 7px;
        margin-top: 2px;
        font-size: 10.5px;
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
	static {
		this.getConfigElement = pt;
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
			min: this._config.min ?? L(e, "min_temp") ?? 7,
			max: this._config.max ?? L(e, "max_temp") ?? 30,
			step: this._config.step ?? L(e, "target_temp_step") ?? .5
		};
	}
	_round(e) {
		let { min: t, max: n, step: r } = this._range;
		return I(Math.round(e / r) * r, t, n);
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
		let t = B(e), { min: n, max: r } = this._range, i = !t && e.state !== "off", a = this._target.resolve(L(e, "temperature") ?? n), o = L(e, "current_temperature"), s = L(e, "current_humidity") ?? (this._config.humidity_entity ? R(this.hass.states[this._config.humidity_entity]) : void 0), c = e.attributes.hvac_action, l = i && (c ? c === "heating" : o !== void 0 && o < a), u = t ? "Non disponibile" : i ? l ? "Riscaldamento in corso" : "Temperatura raggiunta" : "Spento", d = I((a - n) / (r - n), 0, 1), f = Z + Math.max(Q * d, .01), [p, m] = $(X, f), h = i || this._target.active;
		return E`
      <div class="card ${h ? "" : "off"}">
        <div class="card-head">
          <div class="clickable" @click=${() => H(this, this._config.entity)}>
            ${this._config.room ? E`<p class="card-sub">${this._config.room}</p>` : null}
            <h2 class="card-title">${V(e, this._config.name ?? "Riscaldamento")}</h2>
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
			let n = Z + Q * t / mt, [r, i] = $(116, n), [a, o] = $(t % 10 == 0 ? 124 : 120, n);
			return D`<line class="tick ${h && t / mt <= d ? "on" : ""}" x1=${r} y1=${i} x2=${a} y2=${o} />`;
		})}
            <path d=${ht(Z, 405)} stroke="rgba(255,240,220,.08)" stroke-width="2" fill="none" stroke-linecap="round" />
            <path d=${ht(Z, f)} stroke="url(#grad)" stroke-width="6" fill="none" stroke-linecap="round" filter="url(#glow)" opacity=".55" />
            <path d=${ht(Z, f)} stroke="url(#grad)" stroke-width="3.5" fill="none" stroke-linecap="round" />
            <circle cx=${p} cy=${m} r="16" style="fill:var(--acc)" opacity=".14" />
            <circle cx=${p} cy=${m} r="8" fill="#1A1815" style="stroke:var(--acc-hi)" stroke-width="2" />
          </svg>
          <div class="center">
            <span class="label">Impostata</span>
            <span class="num">${h ? a.toFixed(1) : "—"}<sup>°</sup></span>
            <span class="meta">
              ${o === void 0 ? null : E`Attuale <b>${o.toFixed(1)}°</b>`}
              ${s === void 0 ? null : E`<span class="hum">${o === void 0 ? null : " · "}Umidità <b>${Math.round(s)}%</b></span>`}
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
}, _t = "0.3.0", vt = [
	{
		tag: "luxury-light-group-card",
		cls: ft,
		name: "Luxury · Gruppo luci",
		description: "Le luci di una stanza in riquadri, con contatore e interruttore generale."
	},
	{
		tag: "luxury-light-card",
		cls: lt,
		name: "Luxury · Luce",
		description: "Una singola luce: acceso/spento e, se supportata, luminosità."
	},
	{
		tag: "luxury-dimmer-card",
		cls: Ze,
		name: "Luxury · Dimmer",
		description: "Dimmer grande con slider della luminosità."
	},
	{
		tag: "luxury-thermostat-card",
		cls: gt,
		name: "Luxury · Riscaldamento",
		description: "Termostato solo riscaldamento con quadrante circolare."
	},
	{
		tag: "luxury-cover-card",
		cls: Je,
		name: "Luxury · Tapparella",
		description: "Tapparella con finestra trascinabile, su/stop/giù e aperture rapide."
	},
	{
		tag: "luxury-energy-card",
		cls: at,
		name: "Luxury · Energia",
		description: "Flusso solare, casa e rete, batteria, grafico di oggi e totali."
	}
];
for (let e of vt) customElements.get(e.tag) || customElements.define(e.tag, e.cls);
window.customCards = window.customCards ?? [];
for (let e of vt) window.customCards.some((t) => t.type === e.tag) || window.customCards.push({
	type: e.tag,
	name: e.name,
	description: e.description,
	preview: !0
});
if (!document.querySelector("link[data-luxury-cards-font]")) {
	let e = document.createElement("link");
	e.rel = "stylesheet", e.href = "https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600&display=swap", e.dataset.luxuryCardsFont = "", document.head.appendChild(e);
}
console.info(`%c LUXURY CARDS %c v${_t} `, "background:#C8A46A;color:#1A1714;font-weight:600", "color:#C8A46A");
//#endregion
