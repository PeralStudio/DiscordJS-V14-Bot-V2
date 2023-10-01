const p = require("phin");
const { randomUUID } = require("crypto");

async function speak(voice, text) {
    let jobRequest = await p({
        url: "https://api.fakeyou.com/tts/inference",
        method: "POST",
        parse: "json",
        data: {
            uuid_idempotency_token: randomUUID(),
            tts_model_token: voice,
            inference_text: text,
        },
    });
    if (!jobRequest.body.success) {
        return "ERROR: 0";
    }
    return await new Promise((resolve) => {
        let interval = setInterval(async () => {
            let res = await p({
                url:
                    "https://api.fakeyou.com/tts/job/" +
                    jobRequest.body.inference_job_token,
                method: "GET",
                parse: "json",
            });
            if (!res.body.success) {
                clearInterval(interval);
                resolve("ERROR: 1");
            } else if (res.body.state.status === "complete_success") {
                clearInterval(interval);
                resolve(
                    "https://storage.googleapis.com/vocodes-public" +
                        res.body.state.maybe_public_bucket_wav_audio_path
                );
            }
        }, 1000);
    });
}
exports.speak = speak;
