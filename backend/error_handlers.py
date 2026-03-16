from flask import jsonify, request
import traceback

def register_error_handlers(app):
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Not found", "message": str(request.url)}), 404

    @app.errorhandler(500)
    def internal_error(error):
        print(f"Server Error: {str(error)}", flush=True)
        print(traceback.format_exc(), flush=True)
        return jsonify({"error": "Internal server error", "message": "Something went wrong on the server"}), 500

