from openai import OpenAI

class LLMRouter:
    def __init__(self):
        self.API_KEY = os.getenv('TOGETHER_API_KEY', None)
        self.url = 'https://api.together.xyz/v1'
        if not self.API_KEY:
            raise("API Key not given!")
    

    def getLLMResponse(self, modelName, systemPrompt, humanPrompt, temperature=0.2, top_p=0.4):
        client = OpenAI(
        api_key=self.API_KEY,
        base_url=self.url,
        )
        chat_completion = client.chat.completions.create(
        messages=[
            {
            "role": "system",
            "content": systemPrompt,
            },
            {
            "role": "user",
            "content": humanPrompt,
            }
        ],
            max_tokens=800,
            temperature=temperature,
            top_p=top_p,
            timeout=90,
        model=modelName
        )
        return chat_completion.choices[0].message.content