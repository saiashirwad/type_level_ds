type buildTuple<L extends number, T extends any[] = []> = T["length"] extends L
	? T
	: buildTuple<L, [...T, unknown]>;

type addTuple<A extends unknown[], B extends unknown[]> = [
	...A,
	...B,
]["length"];

type subTuple<A extends unknown[], B extends unknown[]> = A extends [
	...B,
	...infer Rest,
]
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

type lessThan<N1 extends number, N2 extends number> = buildTuple<N1> extends [
	...buildTuple<N2>,
	...any[],
]
	? false
	: true;

type append<A extends any[], B extends any[]> = [...A, ...B];

type toList<T> = T extends [infer _, infer A]
	? [A]
	: T extends [infer _, infer X, infer Y]
		? append<toList<X>, toList<Y>>
		: never;

type tag<T> = T extends [infer V extends number, any]
	? V
	: T extends [infer V extends number, any, any]
		? V
		: never;

type head<T> = T extends [infer _, infer A]
	? A
	: T extends [infer _, infer X, infer __]
		? head<X>
		: never;

type leaf<A> = [1, A];
type branch<X, Y> = [add<tag<X>, tag<Y>>, X, Y];

type nth<T, N extends number> = T extends leaf<infer A>
	? N extends 0
		? A
		: never
	: T extends branch<infer X, infer Y>
		? lessThan<N, tag<X> & number> extends true
			? nth<X, N>
			: nth<Y, sub<N, tag<X> & number>>
		: never;

type example = branch<
	branch<leaf<"a">, leaf<"b">>,
	branch<leaf<"c">, branch<leaf<"d">, leaf<"e">>>
>;

type nthResult = nth<example, 3>;

type toListResult = toList<example>;

type tagResult = tag<example>;

type headResult = head<example>;
