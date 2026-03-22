import os
import sys

# Add backend directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Now run the Flask app
if __name__ == '__main__':
    os.chdir(os.path.join(os.path.dirname(__file__), 'backend'))
    from app import app
    app.run(debug=True, host='0.0.0.0', port=5000)
