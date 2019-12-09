import getAirport from './getAirport';
import { SpeechRecognizer } from 'microsoft-cognitiveservices-speech-sdk';
import fetchData from './fetchData';

const recognizeInput = async (recognizer: SpeechRecognizer, client: any) => {
  console.log(2);
  recognizer.recognizeOnceAsync(
    async _result => {
      if (_result.text === undefined) return;
      console.log(3);
      const result: string = _result.text.substring(0, _result.text.length - 1);
      console.log(result);
      switch (result.split(' ')[0]) {
        case 'Airport': {
          const param = result.split(' ')[1];
          if (param.length === 3) {
            const airport = getAirport(param);
            if (airport === undefined) return;
            await fetchData({ airport: airport.icao }, client);
          } else {
            await fetchData({ airport: param }, client);
          }
          break;
        }
        case 'Aircraft': {
          const param = result.split(' ')[1];
          await fetchData(
            { aircraft: param.substring(0, param.length - 1) },
            client
          );
          break;
        }
        case 'Airline': {
          const param = result.split(' ')[1];
          await fetchData(
            { airline: param.substring(0, param.length - 1) },
            client
          );
          break;
        }
        default:
          await fetchData({}, client);
          break;
      }
      console.log(4);
    },
    (error: any) => {
      console.log('err - ' + error);
    }
  );
};

export default recognizeInput;
