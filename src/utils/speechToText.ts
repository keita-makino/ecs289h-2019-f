import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

const speechToText = () => {
  const subscriptionKey = 'key';
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
  return recognizer;
};

export default speechToText;
