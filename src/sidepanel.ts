'use strict';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { Buffer } from 'buffer';

const tts = new MsEdgeTTS();

let data64: any;

window.onload = async () => {
    const input = document.querySelector('#txt')! as HTMLInputElement;
    const speakButton = document.querySelector('#speak-button')! as HTMLButtonElement;
    const audioElement = document.querySelector('audio')! as HTMLAudioElement;

    // Show voices list
    const fieldset = document.querySelector('fieldset')! as HTMLFieldSetElement;
    const voices = await tts.getVoices();
    // Remove "Loading..."
    fieldset.innerHTML = '';
    voices.forEach(voice => {
        fieldset.innerHTML += `<div><input type="radio" name="voice" id="${voice.ShortName}" value="${voice.ShortName}"/><label for="${voice.ShortName}">${voice.FriendlyName}</label></div>`
    })

    speakButton.onclick = async () => {
        disableAudioElement(audioElement);

        const selectedVoice = fieldset.querySelector('input[type="radio"]:checked') as HTMLInputElement;

        await tts.setMetadata(selectedVoice ? selectedVoice.value : "en-IE-ConnorNeural", OUTPUT_FORMAT.WEBM_24KHZ_16BIT_MONO_OPUS);
        const readable = tts.toStream(input.value || "type something first!");
        data64 = '';
        
        readable.on("data", (data) => {
            data64 = Buffer.concat([Buffer.from(data64), Buffer.from(data)]);
        });

        readable.on("end", () => {
            console.log("STREAM ENDED");

            const blob = new Blob([data64], { type: 'audio/webm' });
            const audioURL = URL.createObjectURL(blob);
            audioElement.src = audioURL;
            audioElement.play();

            enableAudioElement(audioElement);
        });

        readable.on("close", () => {
            console.log("STREAM CLOSED");
        });
    }
}

const disableAudioElement = (elm: HTMLAudioElement) => {
    elm.style.pointerEvents = 'none';
    elm.style.opacity = '0.5';
}

const enableAudioElement = (elm: HTMLAudioElement) => {
    elm.style.pointerEvents = '';
    elm.style.opacity = '1';
}