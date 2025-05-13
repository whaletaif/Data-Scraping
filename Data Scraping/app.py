from flask import Flask, render_template, request, jsonify, send_file, send_from_directory
from maps import maps_scraper
from flask_socketio import SocketIO, emit
import os
from urllib.parse import quote

app = Flask(__name__)
socketio = SocketIO(app)

# API Token
API_TOKEN = "token123"

# Validate API token
def validate_token(request):
    token = request.headers.get("Authorization")
    if token != f"Bearer {API_TOKEN}":
        return jsonify({"success": False, "error": "Unauthorized"}), 401

# Homepage
@app.route('/')
def index():
    return render_template('mainpage.html')

# Maps scraper page
@app.route("/scraper-maps")
def scraper():
    return render_template("scraper-maps.html")

@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/info')
def info():
    return render_template('info.html')

@app.route('/settings')
def setting():
    return render_template('setting.html')

@app.route('/scraper-maps', methods=['POST'])
# Scraper function
def scrape_maps():
    # Get input data
    keyword = request.form['keyword'].strip()
    location = request.form['location'].strip()
    limit = request.form['limit'].strip()
    proxy = request.form.get('proxy', '').strip()

    # Convert limit to integer, or None if blank
    try:
        limit = int(limit)
    except ValueError:
        limit = None

    try:
        # Call scraper
        output_path = maps_scraper(keyword, location, limit, log_callback=log_message, proxy=proxy)
        json_file = os.path.basename(output_path["json"])
        return jsonify({"success": True, "json_file": json_file})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})
    
# Logging function
def log_message(message):
    print(f"Log emitted: {message}")
    socketio.emit('log', {'message': message})

# Result for maps scraper
@app.route('/result-maps')
def result_maps():
    file = request.args.get('file')
    if not file:
        return "File parameter is missing", 400

    # Check if the file exists
    file_path = os.path.join('outputs', file)
    if not os.path.exists(file_path):
        return "File not found", 404

    return render_template('result-maps.html', file=file)

# For downloading files
@app.route('/outputs/<path:filename>')
def serve_output_file(filename):
    return send_from_directory('outputs', filename)

# API endpoint for maps scraper
# curl -X POST http://127.0.0.1:5000/api/scraper-maps ^
# -H "Authorization: Bearer token123" ^
# -H "Content-Type: application/json" ^
# -d "{\"keyword\": \"a\", \"location\": \"b\", \"limit\": \"c\", \"proxy\": \"d\"}" # customise letters
@app.route('/api/scraper-maps', methods=['POST'])
def api_scrape_maps():
    # Validate the token
    auth_response = validate_token(request)
    if auth_response:
        return auth_response

    # Get input data
    data = request.json
    keyword = data.get('keyword', '').strip()
    location = data.get('location', '').strip()
    limit = data.get('limit', '').strip()
    proxy = data.get('proxy', '').strip()

    # Convert limit to integer, or None if blank
    try:
        limit = int(limit) if limit else None
    except ValueError:
        return jsonify({"success": False, "error": "Limit must be a number"}), 400

    try:
        # Call scraper
        output_path = maps_scraper(keyword, location, limit, log_callback=log_message, proxy=proxy)
        filename = os.path.basename(output_path)
        encoded_filename = quote(filename)
        return jsonify({"success": True, "filename": encoded_filename})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Download file from API
# curl -X GET "http://127.0.0.1:5000/api/download?filename=filename.xlsx" ^
# -H "Authorization: Bearer token123" ^
# -o "any_file_name.xlsx"
@app.route('/api/download', methods=['GET'])
def api_download_file():
    # Validate the token
    auth_response = validate_token(request)
    if auth_response:
        return auth_response

    # Get the filename from the query parameters
    filename = request.args.get('filename')
    if not filename:
        return jsonify({"success": False, "error": "Filename is required"}), 400

    # Construct the file path
    file_path = os.path.join('outputs', filename)
    if not os.path.exists(file_path):
        return jsonify({"success": False, "error": "File not found"}), 404

    # Send the file to the client
    return send_file(file_path, as_attachment=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)