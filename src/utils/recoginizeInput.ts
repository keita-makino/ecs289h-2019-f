import getAirport from './getAirport';
import { SpeechRecognizer } from 'microsoft-cognitiveservices-speech-sdk';

const recognizeInput = (recognizer: SpeechRecognizer, action: string) => {
  recognizer.recognizeOnceAsync(_result => {
    const result: string = _result.text.substring(0, _result.text.length - 1);
    const action = result.split(' ')[0] === 'Airport' ? 'GET_AIRPORT' : '';
    switch (action) {
      case 'GET_AIRPORT': {
        const str = result.split(' ')[1];
        const airport = getAirport(str);
        break;
      }
      default:
        break;
    }
  });
};

export default recognizeInput;
