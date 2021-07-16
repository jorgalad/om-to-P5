s.quit;
s.boot;

NetAddr.langPort
NetAddr.localAddr
// OSCFunc.trace(bool: true, hideStatusMsg: false)
OSCdef.trace(true, true)
// OSCFunc.trace(true);
// Trace dumps all incoming OSC messages somewhere else, best not use it
OSCFunc.trace(false);
OSCFunc.trace(true, true);

s.options.numOutputBusChannels = 16;


(
s.reboot;
thisProcess.openUDPPort(57120);
n = NetAddr("127.0.0.1", 57120);
)

(
	SynthDef(\bpfsaw, {
		arg atk=0.001, sus=0, rel=1, c1=1, c2=(-1), freq=500, detune=0.2, pan=0,
		cfhzmin=0.1, cfhzmax=0.3, cfmin=500, cfmax=500, rqmin=0.1, rqmax=0.2,
		lsf=900, ldb=0.9, amp=1, out=0;
		var sig, env;
		env = EnvGen.kr(Env([0,1,1,0], [atk,sus,rel], [c1,0,c2]), doneAction:2);
		sig = Saw.ar(freq * {LFNoise1.kr(0.5, detune).midiratio}!2);
		sig = BPF.ar(
			sig,
			{LFNoise1.kr(
				LFNoise1.kr(8).exprange(cfhzmin, cfhzmax)
			).exprange(cfmin, cfmax) }!2,
			{LFNoise1.kr(1).exprange(rqmin, rqmax)}!2
		);
		sig = BLowShelf.ar(sig, lsf, 0.5, ldb);
		sig = Balance2.ar(sig[0], sig[1], pan);
		sig = sig * env * amp;
		Out.ar(4, sig);
	}).add;
)

Synth(\bpfsaw, [\amp, 0.2, \freq, 2, \rqmax, 0.9, \rqmin, 0.8, ]);

(
OSCFunc({|msg, time, addr, recvPort| Synth(\bpfsaw, [
	\cfmin, (msg[1]+36).midicps.postln,
	\amp, 2,
	//\dur, Pexprand(0.1, 0.2, inf),
//	\freq, Pexprand(0.25, 0.3, inf),
	\freq, (msg[1]+48).midicps.postln,
	\detune, 0.1,
	\rqmin, 0.05,
	\rqmax, 0.1,
])}, '/SC/syn1/freq');
)

(
SynthDef(\violin, {
	arg freq=440, gate=1, amp=0.25;
	// var env = EnvGen.kr(Env.asr(0.1, 1, 0.5), gate, doneAction:2);
	var env = EnvGen.kr(Env.perc(0.5, 2.0), gate, doneAction:2);
	var sig = VarSaw.ar(
		freq,
		width:LFNoise2.kr(1).range(0.2, 0.8)*SinOsc.kr(5, Rand(0.0, 1.0)).range(0.7,0.8))*0.25;
	Out.ar(4, sig!2 * env * amp);
}).add;
)

Synth(\violin, [\amp, 0.2, \freq, 440, \gate, 1]);

(
OSCFunc({|msg, time, addr, recvPort| Synth(\violin, [
	\amp, 0.2,
	\gate, 1,
	\freq, (msg[1]+60).midicps.postln,
])}, '/SC/syn2/freq');
)

(
	SynthDef(\synth3, {
		arg note = 60, freq=100, rate=2, cutoff=1000, amp=0.1, gate=1,
		attack = 0.4, decay = 0.9, sustain = 0.8, release = 2.1, mw = 10, out=0;
		var lfo1, lfo2, env, env2, modenv, sig, temp, sum;
		lfo1 = SinOsc.kr(1);
		lfo2 = SinOsc.kr(lfo1, 0, 100, 200);
	// env = Env([0, 1, 0.3, 0.8, 0], [2, 3, 1, 4], -2);
	env = Env.perc(0.8, 1.5);
	    modenv = EnvGen.kr((env),gate);
		sum = 0;
		7.do{
			temp = VarSaw.ar(
				freq* {Rand(0.99, 1.01)} !2,
				0*{Rand(0, 1)} !2,
				{ExpRand(0.005, 0.05)}!2
			);
			sum = sum + temp;
		};
		sum = sum + temp;
	    env2 = EnvGen.kr(Env.adsr(1.0, 0.5, 0.2, 1), gate, doneAction:2);
	    sig = LPF.ar(sum, 20 + mw + 1000) ;
	// env = EnvGen.kr(Env.adsr(attack, decay, sustain, release), gate,doneAction:2); //was gate
    	env = EnvGen.kr(Env.perc(0.01, 2.1), gate,doneAction:2); //was gate
	    Out.ar(4, sig * env * amp * 0.02);
	}).add;
)

(
OSCFunc({|msg, time, addr, recvPort| Synth(\synth3, [
	\amp, 0.2,
	\gate, 1,
	\freq, (msg[1]+48).midicps.postln,
])}, '/SC/syn3/freq');
)




(
~marimba = Pbind(
	\instrument, \bpfsaw,
	\dur, Pexprand(0.1, 1, inf),
	\freq, Pexprand(0.25, 9, inf),
	\detune, 0,
	\rqmin, 0.005,
	\rqmax, 0.008,
	\cfmin, Prand((Scale.major.degrees+64).midicps, inf),
	\cfmax, Pkey(\cfmin),
).play;
)






OSCFunc({|msg, time, addr, recvPort| Synth(\bpfsaw, [\freq, (msg[1]).round].postln)}, '/SC/syn1/freq');
OSCFunc({|msg, time, addr, recvPort| Synth(\syn1, [\freq, (msg[1].as32Bits)].postln)}, '/SC/syn1/freq');




(
	SynthDef(\synth1, {
		arg freq=440,tone = 3, art = 1.0, amp = 1.5, pan = 0, out=0;
		var env, sig, mod;
		env = Env.perc(0, art);
		mod = 1 + (1/IRand(2.0, 2.1));
		sig = PMOsc.ar(freq, mod*freq * 2,
			pmindex: EnvGen.kr(env, timeScale: art, levelScale: tone),
			mul: EnvGen.kr(env, timeScale: art, levelScale: 0.3));
		sig = Pan2.ar(sig, pan);

		sig = sig * EnvGen.kr(env, timeScale: 1.3*art,
			levelScale: Rand(0.1, 0.2), doneAction:2);
		Out.ar(out, sig);
	}).add;
)

(
SynthDef(\synth1, {
	arg freq=440, gate=1, amp=0.25;
	var env = EnvGen.kr(Env.asr(0.1, 1, 0.5), gate, doneAction:2);
	var sig = VarSaw.ar(
		freq,
		width:LFNoise2.kr(1).range(0.2, 0.8)*SinOsc.kr(5, Rand(0.0, 1.0)).range(0.7,0.8))*0.25;
	Out.ar(0, sig!2 * env * amp * 0);
}).add;


	SynthDef(\synth2, {
		arg freq = 440, gate = 1, amp = 0.5, slideTime = 0.1, ffreq = 1500, width = 0.75,
		detune = 1.002, preamp = 4, out=0;
		var    sig,
		env = Env.adsr(0.05, 1, 0.01, 1.5);
		freq = Lag.kr(freq, slideTime);
		sig = Mix(VarSaw.ar([freq, freq * detune], 0, width, preamp)).distort * amp
		* EnvGen.kr(env, gate, doneAction: 2);
		sig = LPF.ar(sig, ffreq);
		Out.ar(out, sig!2 * 0.00000001)
	}).add;

	SynthDef(\synth3, {
		arg note = 60, freq=100, rate=2, cutoff=1000, amp=0.1, gate=1,
		attack = 0.4, decay = 0.9, sustain = 0.8, release = 2.1, mw = 10, out=0;
		var lfo1, lfo2, env, env2, modenv, sig, temp, sum;
		lfo1 = SinOsc.kr(1);
		lfo2 = SinOsc.kr(lfo1, 0, 100, 200);
		env = Env([0, 1, 0.3, 0.8, 0], [2, 3, 1, 4], -2);
	    modenv = EnvGen.kr((env),gate);
		sum = 0;
		7.do{
			temp = VarSaw.ar(
				freq* {Rand(0.99, 1.01)} !2,
				0*{Rand(0, 1)} !2,
				{ExpRand(0.005, 0.05)}!2
			);
			sum = sum + temp;
		};
		sum = sum + temp;
	    env2 = EnvGen.kr(Env.adsr(1.0, 0.5, 0.2, 1), gate, doneAction:2);
	    sig = LPF.ar(sum, 20 + mw + 1000) ;
	    env = EnvGen.kr(Env.adsr(attack, decay, sustain, release), gate,doneAction:2); //was gate
	    Out.ar(out, sig * env * amp * 0.02);
	}).add;

  SynthDef(\synth4, {
		arg in, out, freq=200, amp=0.5;
		var env, fMod, sig1, sig2;
		env = EnvGen.kr(Env.new([0, 1, 1, 0], [0.01, 0.8, 1.0], curve: -4), gate: 1, doneAction:2);
		fMod = Env.new(
			[0.0, 0.9, 0.1, 0.1, 0.0, 0.0, 0, 0], //Levels
			[0.1, 0.7, 2.0, 1.0, 0.25, 1, 1], //Times
			[1, -10, -5, 0, 0, 0, 0] //Curves
				).range(20, 4000);
    	  in = LFSaw.ar(freq,mul: 0.4) + Pulse.ar(freq+0.01, mul: 0.4);
		sig1 = LPF.ar(in: in, freq: EnvGen.kr(fMod)*2, mul: 0.7)!2;
    	sig2 = BBandPass.ar(sig1,  EnvGen.kr(fMod) * 0.2, 2);

		Out.ar(out, sig2!2 * env * amp * 0.00000001 );
	}).add;
)
(
Pbind(
			\instrument, \synth4,
	        \freq, Pseq([0, 12, 8, 12, 5, 8, 12, 14, 15] + 38, inf).midicps,
			).play;
)


(
Pbind(
			\instrument, \synth4,
	        \freq, Pseq([0, 12, 8, 12, 5, 8, 12, 14, 15] + 48, inf).midicps,
			).play;
)





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

(
	SynthDef(\voxSynth, {
		arg amp=1, buf4=0, freq, out=0, gate=1, gDur=0.4, mGrains=12,
		att=0.01, dec=1, sus=1, rel=1, gStart=0;
		var env, sig1, sig2;
		//env = EnvGen.kr(Env.perc(0.01, 2), t_gate, doneAction:2);
		env = EnvGen.kr(Env.adsr(att, dec, sus, rel), gate, doneAction:2);
		//sig1 = PlayBuf.ar(2, buf4, BufRateScale.ir(buf4) * rate, doneAction: 2);
		sig1 = PlayBuf.ar(
			numChannels: 2,
			bufnum: buf4,
			rate: freq/24,
			trigger: 1,
			startPos: gStart, //Cant be changed while synth runs
			loop: 0,
		);
		sig2 = GrainIn.ar(2, gate, gDur, sig1, mGrains);
		Out.ar(out, sig2 * amp * 0.4 * env);
	}).add;
)

// OSCFunc({|msg, time, addr, recvPort| Synth(\syn1, [\freq, msg[1]]).postln}, '/SC/syn1/freq');
OSCFunc({|msg, time, addr, recvPort| Synth(\syn1, [\freq, (msg[1] * 24 + 60).round].postln)}, '/SC/syn1/freq');
OSCFunc({|msg, time, addr, recvPort| Synth(\syn1, [\freq, (msg[1].as32Bits)].postln)}, '/SC/syn1/freq');
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