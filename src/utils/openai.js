import {OpenAI} from 'openai'

export const askQuestion = async (question) => {
      const openai = new OpenAI({
        apiKey: "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",
        dangerouslyAllowBrowser: true
      });

      try { 
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{"role": "user", "content": question}],
          });

        return chatCompletion.choices[0].message.content;
    
      } catch (err) { 
        if (err.response) { 
          console.log(err.response.status); 
          console.log(err.response.data); 
        } else { 
          console.log(err.message); 
        } 
      } 
}