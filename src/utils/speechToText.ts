import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

const speechToText = () => {
  require('dotenv').config();
  // replace with your own subscription key,
  // service region (e.g., "westus"), and
  // the name of the file you want to run
  // through the speech recognizer.
  const subscriptionKey = 'e401042b312c466c832449e906c5e1dc';
  const serviceRegion = 'westus'; // e.g., "westus"

  const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    subscriptionKey,
    serviceRegion
  );

  // setting the recognition language to English.
  speechConfig.speechRecognitionLanguage = 'en-US';

  // create the speech recognizer.
  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  // start the recognizer and wait for a result.
  recognizer.recognizeOnceAsync(
    function(result) {
      console.log(result);

      recognizer.close();
    },
    function(err) {
      console.trace('err - ' + err);

      recognizer.close();
    }
  );
};

export default speechToText;
