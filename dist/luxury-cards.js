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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: ee, getOwnPropertySymbols: te, getPrototypeOf: ne } = Object, f = globalThis, p = f.trustedTypes, re = p ? p.emptyScript : "", ie = f.reactiveElementPolyfillSupport, m = (e, t) => e, h = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? re : null;
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
}, g = (e, t) => !l(e, t), _ = {
	attribute: !0,
	type: String,
	converter: h,
	reflect: !1,
	useDefault: !1,
	hasChanged: g
};
Symbol.metadata ??= Symbol("metadata"), f.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var v = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = _) {
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
		return this.elementProperties.get(e) ?? _;
	}
	static _$Ei() {
		if (this.hasOwnProperty(m("elementProperties"))) return;
		let e = ne(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(m("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(m("properties"))) {
			let e = this.properties, t = [...ee(e), ...te(e)];
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
			let i = (n.converter?.toAttribute === void 0 ? h : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? h : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? g)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
v.elementStyles = [], v.shadowRootOptions = { mode: "open" }, v[m("elementProperties")] = /* @__PURE__ */ new Map(), v[m("finalized")] = /* @__PURE__ */ new Map(), ie?.({ ReactiveElement: v }), (f.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var y = globalThis, b = (e) => e, x = y.trustedTypes, S = x ? x.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, C = "$lit$", w = `lit$${Math.random().toFixed(9).slice(2)}$`, ae = "?" + w, oe = `<${ae}>`, T = document, E = () => T.createComment(""), D = (e) => e === null || typeof e != "object" && typeof e != "function", O = Array.isArray, se = (e) => O(e) || typeof e?.[Symbol.iterator] == "function", k = "[ 	\n\f\r]", A = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ce = /-->/g, le = />/g, j = RegExp(`>|${k}(?:([^\\s"'>=/]+)(${k}*=${k}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ue = /'/g, de = /"/g, fe = /^(?:script|style|textarea|title)$/i, pe = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), M = pe(1), N = pe(2), P = Symbol.for("lit-noChange"), F = Symbol.for("lit-nothing"), I = /* @__PURE__ */ new WeakMap(), L = T.createTreeWalker(T, 129);
function R(e, t) {
	if (!O(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return S === void 0 ? t : S.createHTML(t);
}
var me = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = A;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === A ? c[1] === "!--" ? o = ce : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = j) : (fe.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = j) : o = le : o === j ? c[0] === ">" ? (o = i ?? A, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? j : c[3] === "\"" ? de : ue) : o === de || o === ue ? o = j : o === ce || o === le ? o = A : (o = j, i = void 0);
		let d = o === j && e[t + 1].startsWith("/>") ? " " : "";
		a += o === A ? n + oe : l >= 0 ? (r.push(s), n.slice(0, l) + C + n.slice(l) + w + d) : n + w + (l === -2 ? t : d);
	}
	return [R(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, z = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = me(t, n);
		if (this.el = e.createElement(l, r), L.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = L.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(C)) {
					let t = u[o++], n = i.getAttribute(e).split(w), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? ge : r[1] === "?" ? _e : r[1] === "@" ? ve : H
					}), i.removeAttribute(e);
				} else e.startsWith(w) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (fe.test(i.tagName)) {
					let e = i.textContent.split(w), t = e.length - 1;
					if (t > 0) {
						i.textContent = x ? x.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], E()), L.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], E());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === ae) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(w, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += w.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = T.createElement("template");
		return n.innerHTML = e, n;
	}
};
function B(e, t, n = e, r) {
	if (t === P) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = D(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = B(e, i._$AS(e, t.values), i, r)), t;
}
var he = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? T).importNode(t, !0);
		L.currentNode = r;
		let i = L.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new V(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new ye(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = L.nextNode(), a++);
		}
		return L.currentNode = T, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, V = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = F, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = B(this, e, t), D(e) ? e === F || e == null || e === "" ? (this._$AH !== F && this._$AR(), this._$AH = F) : e !== this._$AH && e !== P && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? se(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== F && D(this._$AH) ? this._$AA.nextSibling.data = e : this.T(T.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = z.createElement(R(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new he(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = I.get(e.strings);
		return t === void 0 && I.set(e.strings, t = new z(e)), t;
	}
	k(t) {
		O(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(E()), this.O(E()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = b(e).nextSibling;
			b(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, H = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = F, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = F;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = B(this, e, t, 0), a = !D(e) || e !== this._$AH && e !== P, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = B(this, r[n + o], t, o), s === P && (s = this._$AH[o]), a ||= !D(s) || s !== this._$AH[o], s === F ? e = F : e !== F && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === F ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, ge = class extends H {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === F ? void 0 : e;
	}
}, _e = class extends H {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== F);
	}
}, ve = class extends H {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = B(this, e, t, 0) ?? F) === P) return;
		let n = this._$AH, r = e === F && n !== F || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== F && (n === F || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, ye = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		B(this, e);
	}
}, be = y.litHtmlPolyfillSupport;
be?.(z, V), (y.litHtmlVersions ??= []).push("3.3.3");
var xe = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new V(t.insertBefore(E(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, U = globalThis, W = class extends v {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = xe(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return P;
	}
};
W._$litElement$ = !0, W.finalized = !0, U.litElementHydrateSupport?.({ LitElement: W });
var Se = U.litElementPolyfillSupport;
Se?.({ LitElement: W }), (U.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region src/shared/styles.ts
var Ce = o`
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
`, we = o`
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
`, G = class extends W {
	static {
		this.properties = {
			hass: { attribute: !1 },
			_config: { state: !0 }
		};
	}
	static {
		this.styles = [Ce, we];
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
		return M`<div class="card"><p class="warning">${e}</p></div>`;
	}
}, K = (e, t, n) => Math.min(n, Math.max(t, e)), q = (e) => e?.state === "on", J = (e) => !e || e.state === "unavailable" || e.state === "unknown", Y = (e, t) => t ?? e?.attributes.friendly_name ?? e?.entity_id ?? "", X = (e) => {
	let t = e?.attributes.brightness;
	return q(e) && typeof t == "number" ? Math.max(1, Math.round(t / 255 * 100)) : 0;
}, Te = (e) => {
	if (!e || !e.entity_id.startsWith("light.")) return !1;
	let t = e.attributes.supported_color_modes;
	return Array.isArray(t) ? t.some((e) => e !== "onoff") : typeof e.attributes.brightness == "number";
}, Z = (e, t) => e.callService("homeassistant", "toggle", { entity_id: t }), Ee = (e, t, n) => e.callService("homeassistant", n ? "turn_on" : "turn_off", { entity_id: t }), De = (e, t, n) => e.callService("light", "turn_on", {
	entity_id: t,
	brightness_pct: K(Math.round(n), 1, 100)
}), Q = (e, t) => e.dispatchEvent(new CustomEvent("hass-more-info", {
	detail: { entityId: t },
	bubbles: !0,
	composed: !0
})), Oe = (e, t, n, r) => {
	t.setPointerCapture(e.pointerId), n(e);
	let i = (e) => n(e), a = (e) => {
		t.removeEventListener("pointermove", i), t.removeEventListener("pointerup", a), t.removeEventListener("pointercancel", a), r?.(e);
	};
	t.addEventListener("pointermove", i), t.addEventListener("pointerup", a), t.addEventListener("pointercancel", a);
}, ke = class extends W {
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
				return K(Math.round((e.clientX - n.left) / n.width * 100), 1, 100);
			};
			Oe(e, t, (e) => {
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
			t && (e.preventDefault(), this._commit(K(this._shown + t, 1, 100)));
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
		return M`
      <div
        class="track ${this.marks ? "handle" : ""} ${this._drag === null ? "" : "dragging"} ${e ? "active" : ""}"
        @pointerdown=${this._onPointerDown}
      >
        ${this.marks ? M`<div class="marks"><i></i><i></i><i></i><i></i><i></i></div>` : null}
        <div class="fill" style="width:${t}%"></div>
      </div>
    `;
	}
};
customElements.get("lux-slider") || customElements.define("lux-slider", ke);
//#endregion
//#region src/shared/pending-value.ts
var Ae = class {
	constructor(e) {
		this.host = e, this._value = null, this._dragging = !1, e.addController(this);
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
	resolve(e) {
		return this._value !== null && !this._dragging && Math.abs(e - this._value) <= 1 && (this._value = null, clearTimeout(this._timer)), this._value ?? e;
	}
	hostDisconnected() {
		clearTimeout(this._timer);
	}
}, je = class extends G {
	constructor(...e) {
		super(...e), this._brightness = new Ae(this);
	}
	static {
		this.styles = [...G.styles, o`
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
		let n = J(t), r = q(t), i = this._brightness.resolve(X(t)), a = r || this._brightness.active;
		return M`
      <div class="card" style="--glow-o:${a ? (.08 + i / 100 * .32).toFixed(2) : "0"}">
        <div class="card-head">
          <div class="clickable" @click=${() => Q(this, e)}>
            ${this._config.room ? M`<p class="card-sub">${this._config.room}</p>` : null}
            <h2 class="card-title">${Y(t, this._config.name)}</h2>
          </div>
          <button
            class="switch"
            role="switch"
            aria-checked=${r}
            aria-label="Accendi o spegni"
            ?disabled=${n}
            @click=${() => Z(this.hass, e)}
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
			this._brightness.commit(t.detail.value), De(this.hass, e, t.detail.value);
		}}
        ></lux-slider>
      </div>
    `;
	}
}, Me = {
	bulb: N`<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>`,
	chandelier: N`<path d="M12 3v4M7 11a5 4 0 0 1 10 0M5 11h14l-2 4H7zM9 15v2M15 15v2M12 15v4"/>`,
	floor: N`<path d="M8 3h8l2 6H6zM12 9v11M8 21h8"/>`,
	strip: N`<rect x="3" y="10" width="18" height="4" rx="2"/><path d="M7 12h.01M12 12h.01M17 12h.01"/>`,
	ceiling: N`<path d="M4 7h16M8 7l-2 6h12l-2-6M10 16.5l-.5 1.5M14 16.5l.5 1.5M12 17v2"/>`,
	spot: N`<path d="M12 3v3M7 10l5-4 5 4-2 5H9zM9.5 18l-1 2M14.5 18l1 2M12 18v3"/>`,
	table: N`<path d="M7 4h10l2 7H5zM12 11v7M8 20h8"/>`
}, Ne = (e = "bulb") => e.includes(":") ? M`<ha-icon .icon=${e}></ha-icon>` : M`<svg class="icon" viewBox="0 0 24 24">${Me[e] ?? Me.bulb}</svg>`, Pe = class extends G {
	constructor(...e) {
		super(...e), this._brightness = new Ae(this);
	}
	static {
		this.styles = [...G.styles, o`
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
		let n = J(t), r = q(t), i = Te(t) && this._config.brightness !== !1, a = this._brightness.resolve(X(t)), o = r || this._brightness.active, s = n ? "Non disponibile" : o ? i ? `Accesa · ${a}%` : "Accesa" : "Spenta", c = () => !n && Z(this.hass, e);
		return M`
      <div class="card ${o ? "on" : ""}">
        <div class="row">
          <button class="ico" aria-label="Accendi o spegni" @click=${c}>${Ne(this._config.icon)}</button>
          <div class="text" @click=${() => Q(this, e)}>
            ${this._config.room ? M`<p class="card-sub">${this._config.room}</p>` : null}
            <h2 class="card-title">${Y(t, this._config.name)}</h2>
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
        ${i ? M`<lux-slider
              label="Luminosità"
              .value=${a}
              ?off=${!r}
              ?disabled=${n}
              @value-changing=${(e) => this._brightness.drag(e.detail.value)}
              @value-changed=${(t) => {
			this._brightness.commit(t.detail.value), De(this.hass, e, t.detail.value);
		}}
            ></lux-slider>` : null}
      </div>
    `;
	}
}, Fe = 500, Ie = class extends G {
	constructor(...e) {
		super(...e), this._entries = [], this._held = !1;
	}
	static {
		this.styles = [...G.styles, o`
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
			this._held = !0, Q(this, e);
		}, Fe);
	}
	_click(e) {
		clearTimeout(this._holdTimer), this._held || Z(this.hass, e), this._held = !1;
	}
	render() {
		if (!this._config || !this.hass) return null;
		let e = this.hass.states, t = this._entries.map((e) => e.entity), n = t.filter((t) => q(e[t])).length, r = n ? `${n} di ${t.length} accese` : "Tutte spente";
		return M`
      <div class="card">
        <div class="card-head">
          <div>
            ${this._config.title ? M`<p class="card-sub">${this._config.title}</p>` : null}
            <h2 class="card-title">${r}</h2>
          </div>
          ${this._config.master === !1 ? null : M`<button
                class="switch"
                role="switch"
                aria-checked=${n > 0}
                aria-label="Tutte le luci"
                @click=${() => Ee(this.hass, t, n === 0)}
              ></button>`}
        </div>
        <div class="tiles" style="--cols:${this._config.columns ?? 2}">
          ${this._entries.map((t) => {
			let n = e[t.entity], r = J(n), i = q(n), a = r ? "Non disponibile" : i ? Te(n) ? `Accesa · ${X(n)}%` : "Accesa" : "Spenta";
			return M`
              <button
                class="tile ${i ? "on" : ""}"
                ?disabled=${r}
                @pointerdown=${() => this._pointerDown(t.entity)}
                @pointerleave=${() => clearTimeout(this._holdTimer)}
                @click=${() => this._click(t.entity)}
                @contextmenu=${(e) => e.preventDefault()}
              >
                <span class="ico">${Ne(t.icon)}</span>
                <span>
                  <div class="name">${Y(n, t.name)}</div>
                  <div class="state">${a}</div>
                </span>
              </button>
            `;
		})}
        </div>
      </div>
    `;
	}
}, Le = "0.1.0", $ = [
	{
		tag: "luxury-light-group-card",
		cls: Ie,
		name: "Luxury · Gruppo luci",
		description: "Le luci di una stanza in riquadri, con contatore e interruttore generale."
	},
	{
		tag: "luxury-light-card",
		cls: Pe,
		name: "Luxury · Luce",
		description: "Una singola luce: acceso/spento e, se supportata, luminosità."
	},
	{
		tag: "luxury-dimmer-card",
		cls: je,
		name: "Luxury · Dimmer",
		description: "Dimmer grande con slider della luminosità."
	}
];
for (let e of $) customElements.get(e.tag) || customElements.define(e.tag, e.cls);
window.customCards = window.customCards ?? [];
for (let e of $) window.customCards.some((t) => t.type === e.tag) || window.customCards.push({
	type: e.tag,
	name: e.name,
	description: e.description,
	preview: !0
});
if (!document.querySelector("link[data-luxury-cards-font]")) {
	let e = document.createElement("link");
	e.rel = "stylesheet", e.href = "https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600&display=swap", e.dataset.luxuryCardsFont = "", document.head.appendChild(e);
}
console.info(`%c LUXURY CARDS %c v${Le} `, "background:#C8A46A;color:#1A1714;font-weight:600", "color:#C8A46A");
//#endregion
