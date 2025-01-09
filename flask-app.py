from flask import Flask, render_template, request, jsonify, Response, send_from_directory
from openai import OpenAI
import os
import json

app = Flask(__name__)
client = OpenAI(
    api_key=os.getenv('TOGETHER_API_KEY', None),
    base_url='https://api.together.xyz/v1',
)

MODEL_NAME = "Qwen/Qwen2.5-72B-Instruct-Turbo"

with open('system_prompt.txt', 'r') as file:
    SYSTEM_PROMPT = file.read()

conversation_history = [{"role": "system", "content": SYSTEM_PROMPT}]

# print(app.conversation_history)

@app.route('/')
# ‘/’ URL is bound with hello_world() function.
def index():
    return render_template("index.html")

@app.route('/chat')
def chat():
    print("Setting the conversation history to default")
    global conversation_history
    conversation_history = [{"role": "system", "content": SYSTEM_PROMPT}]
    return render_template('chat.html')

@app.route('/video')
def video():
    return render_template('video.html')

@app.route('/gallery')
def gallery():
    return render_template('gallery.html')

# @app.route('/chat_api', methods=['GET'])
# def chat_api():
#     user_message = request.args.get("message")
#     if not user_message:
#         return jsonify({"error": "No message provided"}), 400
    
#     conversation_history = [{"role": "system", "content": "Some system message"}]
#     conversation_history.append({"role": "user", "content": user_message})
    
#     def generate_stream():
#         try:
#             response = client.chat.completions.create(
#                 model=MODEL_NAME,
#                 messages=conversation_history,
#                 stream=True
#             )
#             for chunk in response:
#                 # Make sure we are properly formatting the response
#                 content = chunk.choices[0].delta.content
#                 yield f"data: {content}\n\n"  # Ensure the correct SSE format
#         except Exception as e:
#             print(f"Error during streaming: {e}")
#             # yield f"data: [ERROR] {str(e)}\n\n"

#     return Response(generate_stream(), content_type='text/event-stream')


@app.route('/chat_api', methods=['POST'])
def chat_api():
    ### PRINT CONVERSATION HISTORY
    print("#"*30)
    for conversation in conversation_history:
        if conversation['role'] != 'system':
            print(f"{conversation['role']} : {conversation['content']}")
    print("#"*30)
    user_message = request.json.get("message")
    print(f"##### USER MESSAGE : {user_message}")

    if not user_message:
        return jsonify({"error": "No message provided"}), 400
 
    # Add the user message to the conversation
    conversation_history.append({"role": "user", "content": user_message})
    
    try:
        # Generate the assistant response using OpenAI
        response = client.chat.completions.create(
                        model=MODEL_NAME,
                        messages=conversation_history,
                        stream=False,
                    )
        print(response)
        llm_output = response.choices[0].message.content
        print("### LLM OUTPUT : ")
        print(llm_output)
        try:
            parsed_output = json.loads(llm_output)
            if parsed_output.get("file_name") in [None, "", "[None]", "['None']", '["None"]']:
                assistant_message = parsed_output.get("content", "")
                file_metadata = ""
            else:
                file_name = parsed_output["file_name"]
                file_extension = file_name.split(".")[-1].lower()
                assistant_message = parsed_output.get("content", "")
                file_metadata = {
                        "type": file_extension,  # Example: 'text', 'video', 'audio', 'image'
                        "path": f"static/wishes/{file_name}"
                    }
        except json.JSONDecodeError:
            assistant_message = llm_output
            file_metadata = ""
            
        # print(assistant_message)
        # print(file_metadata)/
        # Add the assistant's response to the conversation
        conversation_history.append({"role": "assistant", "content": llm_output})
        return jsonify({"assistant_message": assistant_message, "file_metadata": file_metadata})
        # return jsonify({"assistant_message" : "SEE YOUR RIGHT" , "file_metadata" : {"type" : "text" , "path" : "static/wishes/wish1.txt"}})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/files/<filename>')
def serve_file(filename):
    try:
        # Assuming files are stored in a folder named "uploads"
        return send_from_directory('uploads', filename)
    except Exception as e:
        return jsonify({"error": f"Error serving file: {str(e)}"}), 500


    
if __name__ == '__main__':

    # run() method of Flask class runs the application 
    # on the local development server.
    app.run(debug=True)
