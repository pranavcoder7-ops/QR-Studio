from flask import Flask, render_template, request, jsonify
import qrcode
import base64
from io import BytesIO

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/generate", methods=["POST"])
def generate_qr():

    try:
        data = request.json.get("data", "").strip()
        qr_color = request.json.get("qr_color", "#000000")
        bg_color = request.json.get("bg_color", "#ffffff")
        size = int(request.json.get("size", 10))

        if not data:
            return jsonify({
                "success": False,
                "message": "Please enter something first."
            }), 400

        if size < 5 or size > 20:
            size = 10

        qr = qrcode.QRCode(
            version=None,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=size,
            border=4
        )

        qr.add_data(data)
        qr.make(fit=True)

        image = qr.make_image(
            fill_color=qr_color,
            back_color=bg_color
        )

        buffer = BytesIO()
        image.save(buffer, format="PNG")

        qr_base64 = base64.b64encode(
            buffer.getvalue()
        ).decode("utf-8")

        return jsonify({
            "success": True,
            "qr": f"data:image/png;base64,{qr_base64}"
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": "Unable to generate QR code."
        }), 500


if __name__ == "__main__":
    app.run(debug=True)