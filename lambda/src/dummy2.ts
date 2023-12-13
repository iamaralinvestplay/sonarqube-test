import { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult 
} from "aws-lambda";
import * as https from 'https';

const ENDPOINT = "https://dummy.com";

function postRequest(body: any) {
  console.info('Calling', ENDPOINT);
  const options = {
    hostname: ENDPOINT,
    path: '/dev/public/v1/test',
    method: 'POST',
    port: 443,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let rawData = '';

      res.on('data', chunk => {
        rawData += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(rawData));
        } catch (err: any) {
          reject(new Error(err));
        }
      });
    });

    req.on('error', err => {
      reject(err);
    });

    req.write(JSON.stringify(body));
    req.end();
  });
}

export const dummyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.info('Entrou');
  const result = await postRequest({});
  console.log('obteve resposta')
  return {
    "statusCode": 201,
    body: JSON.stringify(result)    
  };
}