import requests
import json

def click_me():
    print("taskAgent called")
    agent = "1c25be98-15cb-4597-bee3-12c8ca62685c"

    data = {
        "taskid": "1",
        "command": "process_list",
        "arguments": ["--maxprocesses", "0"]
    }
    
    # Update client URL and path here
    client_url = "http://127.0.0.1:3001"
    path = "/api/admin/task/" + agent
    
    try:
        response = requests.post(client_url + path, json=data)
        result = response.json()
        print('Success', result)
    except requests.exceptions.RequestException as e:
        print('Error:', e)

click_me()
