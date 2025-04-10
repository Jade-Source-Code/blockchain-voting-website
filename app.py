from flask import Flask, request, jsonify
import socket

app = Flask(__name__)

@app.route('/data', methods=['POST'])
def receive_data():
    data = request.get_json()
    print("Received JSON data:", data)
    return jsonify({"status": "success", "received": data}), 200

def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # Connect to an external server just to get the IP (doesn't send anything)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    finally:
        s.close()
    return ip

if __name__ == '__main__':
    ip_address = get_ip()
    port = 5000
    print(f"Flask server running at http://{ip_address}:{port}")
    app.run(host='0.0.0.0', port=port)
