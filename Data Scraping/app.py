from flask import Flask, render_template, request, jsonify, send_file
from maps import maps_scraper
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('mainpage.html')

@app.route("/scraper-maps")
def scraper():
    return render_template("scraper-maps.html")

@app.route('/scraper-maps', methods=['POST'])
def scrape_maps():
    keyword = request.form['keyword']
    location = request.form['location']
    limit = request.form['limit']

    # Convert limit to integer, or None if blank
    try:
        limit = int(limit)
    except ValueError:
        limit = None

    try:
        # Call your scraping function
        output_path = maps_scraper(keyword, location, limit, log_callback=log_message)

        # Return JSON response with success and file path
        return jsonify({"success": True, "filename": output_path})
    except Exception as e:
        # Handle errors and return JSON response
        return jsonify({"success": False, "error": str(e)})
    
def log_message(message):
    """Emit log messages to the client."""
    print(f"Log emitted: {message}")
    socketio.emit('log', {'message': message})

if __name__ == '__main__':
    socketio.run(app, debug=True)