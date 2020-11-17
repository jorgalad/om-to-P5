s.quit;
MIDIdef.freeAll;
Server.killAll;

x = ServerOptions.new;
x.memSize = 20000;
x.memSize;

Server.boot;
s.options
(
//MIDI
MIDIClient.init;
MIDIIn.connectAll;

//SYNTH 1  MIDI =================
~notes1 = Array.newClear(128);
MIDIdef.noteOn(\noteOn1, {
	arg vel, nn, chan, src;
	~notes1[nn] = Synth.new(
		\synth1,
		[
			\amp, vel.linlin(1,127, 0.1, 1.5),
			\gate, 1,
			\freq, nn.midicps,
		]
	);
}, chan: 0).permanent_(true);

MIDIdef.noteOff(\noteOff1, {
	arg vel, nn;
	[vel, nn].postln;
	~notes1[nn].set(\gate, 0);
	~notes1[nn] = nil;
}, chan: 0).permanent_(true);

//SYNTH 2 =================
~notes2 = Array.newClear(128);
MIDIdef.noteOn(\noteOn2, {
	arg vel, nn, chan, src;
	~notes2[nn] = Synth.new(
		\synth2,
		[
			\amp, vel.linlin(1,127, 0.1, 1.5),
			\gate, 1,
			\freq, nn.midicps,
		]
	);
}, chan: 1).permanent_(true);

MIDIdef.noteOff(\noteOff2, {
	arg vel, nn;
	[vel, nn].postln;
	~notes2[nn].set(\gate, 0);
	~notes2[nn] = nil;
}, chan: 1).permanent_(true);

//SYNTH 3 =================
~notes3 = Array.newClear(128);
MIDIdef.noteOn(\noteOn3, {
	arg vel, nn, chan, src;
	~notes3[nn] = Synth.new(
		\synth3,
		[
			\amp, vel.linlin(1,127, 0.1, 1.5),
			\gate, 1,
			\freq, nn.midicps,
		]
	);
}, chan: 2).permanent_(true);

MIDIdef.noteOff(\noteOff3, {
	arg vel, nn;
	[vel, nn].postln;
	~notes3[nn].set(\gate, 0);
	~notes3[nn] = nil;
}, chan: 2).permanent_(true);

//SYNTH 4 =================
~notes4 = Array.newClear(128);
MIDIdef.noteOn(\noteOn4, {
	arg vel, nn, chan, src;
	~notes4[nn] = Synth.new(
		\synth4,
		[
			\amp, vel.linlin(1,127, 0.1, 1.5),
			\gate, 1,
			\freq, nn.midicps,
		]
	);
}, chan: 3).permanent_(true);

MIDIdef.noteOff(\noteOff4, {
	arg vel, nn;
	[vel, nn].postln;
	~notes4[nn].set(\gate, 0);
	~notes4[nn] = nil;
}, chan: 3).permanent_(true);
)

//SYNTHS
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

	SynthDef(\synth2, {
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

	SynthDef(\synth3, {
		arg note = 60, freq=100, rate=2, cutoff=1000, amp=0.1, gate=1,
		attack = 0.9, decay = 0.3, sustain = 0.5, release = 0.9, mw = 10, out=0;
		var lfo1, lfo2, env, env2, modenv, sig, temp, sum;
		lfo1 = SinOsc.kr(1);
		lfo2 = SinOsc.kr(lfo1, 0, 100, 200);
		env = Env([0, 1, 0.3, 0.8, 0], [2, 3, 1, 4], -2);
	    modenv = EnvGen.kr((env),gate);
		sum = 0;
		5.do{
			temp = VarSaw.ar(
				freq* {Rand(0.99, 1.01)} !2,
				0*{Rand(0, 1)} !2,
				{ExpRand(0.005, 0.05)}!2
			);
			sum = sum + temp;
		};
		sum = sum + temp;
	    env2 = EnvGen.kr(Env.adsr(1.0, 0.5, 0.2, 1), gate, doneAction:2);
	    sig = LPF.ar(sum, 20 + lfo2 + mw + 1200) ;
	    env = EnvGen.kr(Env.adsr(attack, decay, 0, release), gate,doneAction:2); //was gate
	    Out.ar(out, sig * env * amp * 0.19);
	}).add;

  SynthDef(\synth4, {
		arg out, freq=200, amp=0.5;
		var env, sig;
		env = EnvGen.kr(Env.new([0, 1, 1, 0], [0.5, 2, 1], curve: -4), gate: 1, doneAction:2);
		sig = Klank.ar(`[ (1..13)*[freq +1, freq -1], 1/(1..13), nil ], input: PinkNoise.ar(0.08));
	    sig = GVerb.ar(sig, 10, 5, 0.7, 0.8, 60, 0.6, 0.2, 0.4) + sig;
		sig = HPF.ar(sig, 60);
	// sig - LPF.ar (sig, 2200);
		Out.ar(out, sig!2 * env * amp * 0.1 );
	}).add;
)

