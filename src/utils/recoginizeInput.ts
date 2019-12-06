import getAirport from './getAirport';

const recognizeInput = (recognizer, action: string) => {
  recognizer.recognizeOnceAsync(function(_result) {
    const result: string = _result.text.substring(0, _result.text.length - 1);
    const action = result.split(' ')[0] === 'Airport' ? 'GET_AIRPORT' : '';
    switch (action) {
      case 'GET_AIRPORT': {
        const airport = getAirport(result);
        break;
      }
      default:
        break;
    }
  });
};

export default recognizeInput;
