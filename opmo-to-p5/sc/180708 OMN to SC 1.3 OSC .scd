s.quit;
s.boot;

(
s.reboot;
thisProcess.openUDPPort(57120);
n = NetAddr("127.0.0.1", 57120);
)
NetAddr.langPort
NetAddr.localAddr

// OSCFunc.trace(bool: true, hideStatusMsg: false)
OSCdef.trace(true, true)
// OSCFunc.trace(true);
// Trace dumps all incoming OSC messages somewhere else, best not use it
OSCFunc.trace(false);
OSCFunc.trace(true, true);

(
	SynthDef(\syn1, {
		arg freq=440, out=0;
		var env, sig;
	env = Env([0, 1, 0.5, 1, 0], [0.01, 0.5, 0.02, 0.5]);
	sig = SinOsc.ar(freq.round.midicps.postln);
		sig = sig * EnvGen.kr(env,  doneAction:2);
		Out.ar(out, sig * 0.03);
	}).add;
)

(
	SynthDef(\syn1, {
		arg freq=440,tone = 3, art = 1.0, amp = 1.5, pan = 0, out=0;
		var env, sig, mod;
		env = Env.perc(0, art);
		mod = 1 + (1/IRand(2.0, 2.1));
	sig = PMOsc.ar(freq.midicps, mod*freq.midicps * 2,
	// sig = PMOsc.ar((freq).midicps, mod*2,
			pmindex: EnvGen.kr(env, timeScale: art, levelScale: tone),
			mul: EnvGen.kr(env, timeScale: art, levelScale: 0.3));
		sig = Pan2.ar(sig, pan);
		sig = sig * EnvGen.kr(env, timeScale: 1.3*art,
			levelScale: Rand(0.1, 0.2), doneAction:2);
		Out.ar(out, sig);
	}).add;
)

(
	SynthDef(\syn2, {
		arg freq = 440, gate = 1, amp = 0.5, slideTime = 0.1, ffreq = 1500, width = 0.75,
		detune = 1.002, preamp = 4, out=0;
		var    sig,
		env = Env.adsr(0.05, 1, 0.01, 1.5);
		freq = Lag.kr(freq, slideTime);
		sig = Mix(VarSaw.ar([freq, freq * detune], 0, width, preamp)).distort * amp
		* EnvGen.kr(env, gate, doneAction: 2);
		sig = LPF.ar(sig, ffreq);
		Out.ar(out, sig!2 * 0.3)
	}).add;
//Synth(\syn1, [\freq, 0.8]);
)

// OSCFunc({|msg, time, addr, recvPort| Synth(\syn1, [\freq, msg[1]]).postln}, '/SC/syn1/freq');
OSCFunc({|msg, time, addr, recvPort| Synth(\syn1, [\freq, (msg[1] * 24 + 60).round].postln)}, '/SC/syn1/freq');
OSCFunc({|msg, time, addr, recvPort| Synth(\syn2, [\freq, (msg[1] * 24 + 60).round].postln)}, '/SC/syn2/freq');



OSCFunc({|msg, time, addr, recvPort| Synth(\syn1, [\freq, (msg[1]) * 128].postln)}, '/SC/syn1/freq');
OSCFunc({|msg, time, addr, recvPort| Synth(\syn2, [\freq, (msg[1]) * 24 + 60].postln)}, '/SC/syn1/freq');
OSCFunc({|msg, time, addr, recvPort| Synth(\syn2, [\freq, msg[1] * 24 + 60 ]).postln}, '/SC/syn2/freq');


/*
OSCdef(\syn, {|msg, time, addr, recvPort| Synth(\syn1, [\freq, msg[1]])}, '/SC/syn1/freq');

OSCdef(\syn, {|msg, time, addr, recvPort| Synth(\syn1, [\freq, msg[1]])}, '/thread1');
OSCdef(\syn, {|msg, time, addr, recvPort| Synth(\syn1, [\cutoff, msg[1]])}, '/SC/syn1/cutoff');


(
OSCdef(\syn,
	{|msg, time, addr, recvPort| Synth(\syn, [\freq, msg[1].midicps])},
	'/Supercollider/Inst/Syn');
)



*/

// stop posting.
thisProcess.removeOSCRecvFunc(f);