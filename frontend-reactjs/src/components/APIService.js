export default class APIService {

  static Langchain(question){
      return fetch('http://127.0.0.1:8000/api/langchain/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "question": question,
          })
        }).then(response => response.json());
  }
}

