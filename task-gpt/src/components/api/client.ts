//const url = 'localhost:3000/api/v1/tasks';
//Create default class for requests, they will all return status of request and data
class ResponseTemplate {
    constructor(public status: number, public data: any, public message:string) {}
}
//Create function that will send a request and return a promise of type ResponseTemplate, it's async, the function takes the request as a string for the paramter
export async function sendRequest(request: string): Promise<ResponseTemplate> {
  //Server is not ready so we will use a mock server
  //Create a new promise that will resolve to a ResponseTemplate
  return new Promise((resolve, reject) => {
    //Set a timeout for 1 second
    setTimeout(() => {
      //Return Hello World
      resolve(new ResponseTemplate(0, 'Hello World',''));
    }, 1000);
  });
}