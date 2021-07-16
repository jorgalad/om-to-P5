//Server Stuff
s.quit;
s.boot;
//OSC Stuff
NetAddr.langPort;
NetAddr.localAddr;
OSCdef.trace(true, true)
OSCFunc.trace(true, true);

(
//Start Here
s.options.numOutputBusChannels = 16;
s.reboot;
thisProcess.openUDPPort(57120);
n = NetAddr("127.0.0.1", 57120);
)

(
//Load the Samples
~sounds = Array.new;
~dir = PathName.new("/Volumes/DISK1/00_Shared/Dropbox/#Coding/JS/WebGL/OM to P5_2/opmo-to-p5/audio/");
~dir.entries.do({arg path; ~sounds = ~sounds.add(Buffer.read(s, path.fullPath));});
)
//Test
~sounds[1].play;

(
// Create Control Bus
~s1c = Bus.control(s); ~s1c.set(18000.0);                //Filter Cutoff

//Create Synth
	SynthDef(\bufSynth_2, {
		arg
		amp = 0.5, freqshift = 0, cutoff = ~s1c, resonance= 1.0, gStart= 0, tremolo = 0,
		grainDur = 0.1, mod=0, touch=0, buf, freq, out=0, gate=1, mGrains=12, att=0.01, dec=0.6, sus=0.9, rel=2;
		var env, sig1, sig2, sig3, trem;
    	env = EnvGen.kr(Env.perc(att, rel), gate, doneAction:2);
		sig1 = PlayBuf.ar(
			numChannels: 2,
			bufnum: buf,
		    rate: freq,
		    trigger: 1,
			startPos: gStart,
			loop: 1,
		);
		sig2 = GrainIn.ar(
			numChannels: 2,
			trigger: Impulse.ar(20),
			dur: touch,
			in: sig1);
	//sig3 = MoogFF.ar(sig2, 20 + cutoff.lag(0.3), gain: resonance);
	Out.ar(4, sig2 * amp * env)
	}).add;
)

Synth.new(\bufSynth_2, [\buf, ~sounds[9].bufnum, \gate, 1, \freq, 50.midiratio,\amp, 1, \touch, 5, \rel, 5]);
~s1c.set(10000);


// ======================== OSC Receivers ========================
(
// Launch Synth on OSC
OSCFunc({|msg, time, addr, recvPort| Synth(\bufSynth_2, [
	//\buf, ~sounds[9], //2 pitched sound
	\buf, ~sounds[(msg[1])/2.abs.postln],
	\cutoff, ~s1c.asMap,
	\gate, 1,
	\att, 0.01,
	\rel, 2,
	\freq, (msg[1]).midiratio/2, //*2
	\amp, 0.3,
	\touch, 0.9
]
)}, '/SC/syn1/freq');

// Control Synth
OSCFunc({|msg, time, addr, recvPort|
	~s1c.set(msg[1].postln);
}, '/SC/syn1/control');
)











// ======================== Tonal Example========================
(
//Busses
~fxBus = Bus.audio(s, 2);
// ~bus.add(\fxBus -> Bus.audio(s, 2));
~s1 = Bus.control(s); ~s1.set(0.1);
~s2 = Bus.control(s); ~s1.set(0.0);
~s3 = Bus.control(s); ~s1.set(1);
~s4 = Bus.control(s); ~s1.set(2);
)

(
~mainGrp = Group.new;
~fxGrp = Group.after(~mainGrp);


SynthDef(\bpfsaw, {
		arg atk=0.001, sus=0, rel=1, c1=1, c2=(-1), freq=500, detune=0.2, pan=0,
		cfhzmin=0.1, cfhzmax=0.3, cfmin=500, cfmax=500, rqmin=0.1, rqmax=0.2,
		lsf=2000, ldb=0.9, amp=1, out;
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
		Out.ar(out, sig);
	}).add;

	SynthDef(\fx1, {
		arg del1=1, del2=2, in, predelay=0.1, revtime=1.8,
		lpf=4500, mix=0.15, amp=1, out=0;
		var dry, wet, temp, sig;
		dry = In.ar(in,2);
		temp = In.ar(in,2);
		wet = 0;
		temp = DelayN.ar(temp, 0,2, predelay);
		5.do{
			//temp = AllpassN.ar(temp, 2, {Rand(1,2)}!2, revtime);
			temp = AllpassN.ar(temp, 2, {Rand(del1,del2)}!2, revtime);
			temp = LPF.ar(temp, lpf);
			wet = wet + temp;
		};
		sig = XFade2.ar(dry, wet, mix*2-1, amp);
		Out.ar(4, sig );
	}).add;

~fxSynth3 = Synth.new(
			\fx1,
			[
				\amp, 0.5,
				\predelay, 0.1,
				\revtime, 6,
				\lpf, 4500,
				\mix, ~s2.asMap,
		        \del1, ~s3.asMap,
				\del2, ~s4.asMap,
				\in, ~fxBus,
			],
			~fxGrp
		);
)


(
OSCFunc({|msg, time, addr, recvPort| Synth(\bpfsaw, [
	\cfmin, (msg[1]+36).midicps.postln,
	\amp, 2,
	\freq, (msg[1]+48).midicps.postln,
	\detune, ~s1.asMap,
	\rqmin, 0.08,
	\rqmax, 0.3,
	\out, ~fxBus,
],~mainGrp
)}, '/SC/melSyn/freq');

// Control Synth
OSCFunc({|msg, time, addr, recvPort|
	~s1.set(msg[1]);
}, '/SC/melSyn/control');

// Control FX
OSCFunc({|msg, time, addr, recvPort|
	~s2.set(msg[1].postln);
}, '/SC/fx/control');
OSCFunc({|msg, time, addr, recvPort|
	~s3.set(msg[1].postln);
}, '/SC/fx/control2');
OSCFunc({|msg, time, addr, recvPort|
	~s4.set(msg[1].postln);
}, '/SC/fx/control3');
)

~s1.set(0.0);        //Detune
~s2.set(0.7);        //Dry/Wet
~s3.set(0.1);     //Min Delay
~s4.set(0.2);    //Max Delay



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


(
OSCFunc({|msg, time, addr, recvPort| Synth(\violin, [
	\amp, 0.2,
	\gate, 1,
	\freq, (msg[1]+60).midicps.postln,
])}, '/SC/melSyn/freq');
)




