type buildTuple<
	L extends number,
	T extends any[] = [],
> = T["length"] extends L
	? T
	: buildTuple<L, [...T, unknown]>;

type addTuple<A extends unknown[], B extends unknown[]> = [
	...A,
	...B,
]["length"];

type subTuple<
	A extends unknown[],
	B extends unknown[],
> = A extends [...B, ...infer Rest]
	? Rest["length"]
	: never;

type add<A extends number, B extends number> = addTuple<
	buildTuple<A>,
	buildTuple<B>
>;

type sub<A extends number, B extends number> = subTuple<
	buildTuple<A>,
	buildTuple<B>
>;

type lt<
	N1 extends number,
	N2 extends number,
> = buildTuple<N1> extends [...buildTuple<N2>, ...any[]]
	? false
	: true;

type lte<
	N1 extends number,
	N2 extends number,
> = buildTuple<N1> extends [...buildTuple<N2>, ...any[]]
	? N1 extends N2
		? true
		: false
	: true;

type gte<N1 extends number, N2 extends number> = lt<
	N1,
	N2
> extends true
	? false
	: true;

type empty = null;
type node<
	n extends number,
	A,
	h1 extends heap,
	h2 extends heap,
> = [n, A, h1, h2];
type heap = empty | node<any, any, any, any>;

type rank<H> = H extends empty
	? 0
	: H extends [infer r, any, any, any]
		? r & number
		: never;

type makeNode<x, a extends heap, b extends heap> = gte<
	rank<a>,
	rank<b>
> extends true
	? node<add<rank<b>, 1> & number, x, a, b>
	: node<add<rank<a>, 1> & number, x, b, a>;

type merge<a extends heap, b extends heap> = [
	a,
	b,
] extends [infer h, empty]
	? h
	: [a, b] extends [empty, infer h]
		? h
		: [a, b] extends [
					node<
						any,
						infer x extends number,
						infer a1 extends heap,
						infer b1 extends heap
					>,
					node<
						any,
						infer y extends number,
						infer a2 extends heap,
						infer b2 extends heap
					>,
				]
			? lte<x, y> extends true
				? makeNode<x, a1, merge<b1, b> & heap>
				: makeNode<y, a2, merge<b, b2> & heap>
			: never;

type h1 = node<1, 3, empty, empty>;
type h2 = node<1, 1, empty, empty>;
type h3 = merge<h1, h2>;
type h4 = node<1, 4, empty, empty>;
type h5 = merge<h3, h4>;
type h6 = node<1, 2, empty, empty>;
type final = merge<h5, h6>;
